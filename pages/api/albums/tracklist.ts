var Discogs = require('disconnect').Client;
import { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';
var CryptoJS = require('crypto-js');
import { openai } from '../../../libs/openai';

//Function grabs our user's data
//It needs the accessData object, which is stored encrypted as a cookie
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    //Get the relase id
    const { id } = req.query;

    //Unencrypt accessData cookie object
    const accessDatacipherObj = getCookie('accessData', { req, res });

    if (accessDatacipherObj) {
      const bytes = await CryptoJS.AES.decrypt(
        accessDatacipherObj,
        process.env.CRYPT_KEY
      );

      //Our decoded accessData object
      const accessData = await JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      //connect to Discogs database
      var db = await new Discogs(accessData).database();

      //Return a specific album release's data
      const releaseData = await db.getRelease(id);

      let selectedTracklist;

      //if the release has tracklengths, use that
      //if not, try the master release
      //otherwise, send duration of 0
      if (releaseData.tracklist && releaseData.tracklist[0].duration !== '') {
        selectedTracklist = releaseData.tracklist;
      } else if (releaseData.master_id && releaseData.master_id !== '0') {
        const masterReleaseData = await db.getMaster(releaseData.master_id);
        if (masterReleaseData.tracklist[0].duration !== '') {
          selectedTracklist = masterReleaseData.tracklist;
        }
      } else {
        selectedTracklist = [{ duration: '0:0' }];
      }

      const tracklist = selectedTracklist
        ? selectedTracklist
        : [{ duration: '0:0' }];

      //get time in numbers from time strings
      const albumTime = tracklist.reduce(
        (
          acc: { minutes: number; seconds: number },
          track: { duration: string }
        ) => {
          const time = track.duration.split(':');
          const minutes = parseInt(time[0]);
          const seconds = parseInt(time[1]);
          return {
            minutes: acc.minutes + minutes,
            seconds: acc.seconds + seconds,
          };
        },
        { minutes: 0, seconds: 0 }
      );

      //outputs a formatted time string
      const calculateTimeString = (minutes: number, seconds: number) => {
        const totalTimeString = `${Math.floor(
          minutes + seconds / 60
        )}:${Math.round(seconds % 60)
          .toString()
          .padStart(2, '0')}`;
        return totalTimeString;
      };

      //if this is null, 0, or NaN, we know discogs doesn't have the runtime
      const totalTimeInMinutes = Math.round(
        albumTime.minutes + albumTime.seconds / 60
      );

      //openAI prompt. If there's no Discogs runtime data, we ask openAI to see if it can help.
      const prompt = totalTimeInMinutes
        ? `tell me about vinyl album ${releaseData.title} by ${releaseData.artists_sort}. Max of 350 characters.`
        : `tell me about vinyl album ${releaseData.title} by ${releaseData.artists_sort}. Include estimated runtime. Max of 350 characters.`;

      //only query openAI if we're in production to save tokens
      if (process.env.NODE_ENV === 'production') {
        //get album blurb from openAI
        //if discogs doesn't have the runtime, we query openAI
        const response = await openai.createCompletion({
          prompt,
          model: 'text-davinci-003',
          temperature: 0.2,
          max_tokens: 200,
          n: 1,
          stream: false,
        });
        const firstResponse = response.data.choices[0];

        //production response
        const responseString = firstResponse?.text?.replace(/^\n+/, '');
        res.send({
          hasAlbumLength:
            totalTimeInMinutes && totalTimeInMinutes !== 0 ? true : false, //some albums don't have lengths associated with them
          totalTime: calculateTimeString(albumTime.minutes, albumTime.seconds),
          totalTimeInMinutes:
            totalTimeInMinutes !== 0 ? totalTimeInMinutes : null,
          blurb: responseString,
        });
      } else {
        //development response
        res.send({
          hasAlbumLength:
            totalTimeInMinutes && totalTimeInMinutes !== 0 ? true : false, //some albums don't have lengths associated with them
          totalTime: calculateTimeString(albumTime.minutes, albumTime.seconds),
          totalTimeInMinutes:
            totalTimeInMinutes !== 0 ? totalTimeInMinutes : null,
          blurb:
            "Aphex Twin's Come To Daddy is an experimental electronic album released in 1997. It features a mix of ambient, industrial, and drum and bass sounds, as well as distorted vocals. The album is considered to be one of Aphex Twin's most influential works, and is widely praised for its innovative production and unique sound. It has been released on vinyl, CD, and cassette formats. (dummy response string)",
        });
      }
    } else {
      res.send({
        hasAlbumLength: false,
        totalTime: '0:00',
        totalTimeInMinutes: 0,
        blurb: 'No albums',
      });
    }
  } catch (err) {
    res.send(err);
  }
}
