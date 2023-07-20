var Discogs = require('disconnect').Client;
import { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';
var CryptoJS = require('crypto-js');

//Function grabs our user's data
//It needs the accessData object, which is stored encrypted as a cookie
export default async function albumInfo(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    //Get the relase id
    const { id, masterId } = req.query;

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

      //some releases don't have a master associated with them
      //this is evident when Discogs returns '0' as the master id
      //if so, we'll grab some of the data from the release instead
      let masterReleaseData = null;
      let hasValidMasterId = false;

      if (masterId && masterId !== '0') {
        masterReleaseData = await db.getMaster(masterId);
        hasValidMasterId = true;
      }

      let selectedTracklist = releaseData.tracklist;

      //if the release has tracklengths, use that
      //if not, try the master release
      //otherwise, send the release tracklist sans-durations
      if (releaseData.tracklist && releaseData.tracklist[0].duration !== '') {
        selectedTracklist = releaseData.tracklist;
      } else if (releaseData.master_id && releaseData.master_id !== '0') {
        if (hasValidMasterId) {
          selectedTracklist = masterReleaseData.tracklist;
        }
      }

      const albumInfo = {
        label: releaseData.labels[0].name,
        catalogNo: releaseData.labels[0].catno,
        rating: releaseData.community.rating.average,
        released: releaseData.released,
        country: releaseData.country,
        genres: hasValidMasterId
          ? masterReleaseData.genres
          : releaseData.genres,
        styles: hasValidMasterId
          ? masterReleaseData.styles
          : releaseData.styles,
        tracklist: selectedTracklist,
      };

      res.send({ albumInfo });
    } else {
      res.send({
        albumInfo: {},
      });
    }
  } catch (err: any) {
    res.status(400).json({
      error_code: 'album_info',
      message: err.message,
    });
  }
}
