var Discogs = require('disconnect').Client;
import { NextApiRequest, NextApiResponse } from 'next';
import { getCookie, setCookie } from 'cookies-next';
var CryptoJS = require('crypto-js');

//This function decrypts our requestData cookie and uses that data, along
//with the verifier and oAuth token sent back from Discogs, to grab
//a Discogs access token. The accessData object is encrypted and stored
//as a cookie. The returned verifier and token are stored unencrypted as cookies.
//We then redirect to the user home page (/home)
export default async function discogsCallback(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { oauth_verifier, oauth_token } = req.query;

    const cookieOptionsClient = {
      req,
      res,
      maxAge: 60 * 60 * 24 * 90, //90 days
    };

    const cookieOptionsServer = {
      ...cookieOptionsClient,
      httpOnly: true,
    };

    const requestDatacipherObj = getCookie('requestData', { req, res });
    const bytes = await CryptoJS.AES.decrypt(
      requestDatacipherObj,
      process.env.CRYPT_KEY
    );
    const requestData = await JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    var oAuth = await new Discogs(requestData).oauth();

    await oAuth.getAccessToken(
      oauth_verifier, // Verification code sent back by Discogs
      async function (err: any, accessData: any) {
        // Encrypt accessData
        const accessDataCipherObj = await CryptoJS.AES.encrypt(
          JSON.stringify(accessData),
          process.env.CRYPT_KEY
        ).toString();

        //get and set username (client-side cookie)
        var dis = await new Discogs(accessData);
        const userId = await dis.getIdentity();

        //encrypt the username. We'll use this to prohibit non-authorized users from accessing the API
        const usernameCipherObj = await CryptoJS.AES.encrypt(
          JSON.stringify(userId.username),
          process.env.CRYPT_KEY
        ).toString();

        //set client-side cookies
        setCookie('username', userId.username, cookieOptionsClient);
        setCookie('isLoggedIn', true, cookieOptionsClient);

        //set server-side cookies
        setCookie('accessData', accessDataCipherObj, cookieOptionsServer);
        setCookie('usernameCipher', usernameCipherObj, cookieOptionsServer);
        setCookie('discogsVerifier', oauth_verifier, cookieOptionsServer);
        setCookie('discogsToken', oauth_token, cookieOptionsServer);

        res.redirect('/profile');
      }
    );
  } catch (err) {
    res.send(err);
  }
}
