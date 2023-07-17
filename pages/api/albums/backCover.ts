var Discogs = require('disconnect').Client;
import { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';
var CryptoJS = require('crypto-js');

//Function grabs our user's data
//It needs the accessData object, which is stored encrypted as a cookie
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    //Album id
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

      //Return the first alt image associated with the album
      //It's usually the back cover but sometimes it's not.
      //Not much we can do about discerning whether it's a back cover or not
      var db = await new Discogs(accessData).database();
      const releaseData = await db.getRelease(id);
      const imgUri = releaseData.images[1].uri;

      res.send({ backImage: imgUri });
    } else {
      res.send({ backImage: null });
    }
  } catch (err) {
    res.send(err);
  }
}
