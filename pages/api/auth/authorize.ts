var Discogs = require('disconnect').Client;
import { NextApiRequest, NextApiResponse } from 'next';
import { setCookie } from 'cookies-next';
var CryptoJS = require('crypto-js');

export default async function authorize(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    var oAuth = await new Discogs().oauth(); //define our Discogs oAuth

    const cookieOptions = {
      req,
      res,
      maxAge: 60 * 60 * 24 * 90, //90 days
      httpOnly: true,
    };

    //This method sends our Discogs keys to Discogs, where the user can authorize and link
    //their account. The object that contains the keys needs to be persisted so that we can
    //read its contents when redirected back from Discogs.com. We encode the object, since
    //it contains secrets, and set it as a cookie.
    return await oAuth.getRequestToken(
      process.env.CONSUMER_KEY,
      process.env.CONSUMER_SECRET,
      `${process.env.BASE_URL}/api/auth/callback/discogs`,
      async function (err: any, requestData: any) {
        //Encrypt requestData
        const requestDataCipherObj = await CryptoJS.AES.encrypt(
          JSON.stringify(requestData),
          process.env.CRYPT_KEY
        ).toString();

        setCookie('requestData', requestDataCipherObj, cookieOptions); //encrypted object stored as cookie

        res.redirect(requestData.authorizeUrl); //redirect to our callback URI (./callback/discogs)
      }
    );
  } catch (err) {
    res.send(err);
  }
}
