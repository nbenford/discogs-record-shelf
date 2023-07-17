import { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';
var Discogs = require('disconnect').Client;
var CryptoJS = require('crypto-js');

//MODELS
import { Album } from '../../../db/models';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = JSON.parse(req.body);
  const { id } = body;
  try {
    //get cookies
    const usernameCipher = getCookie('usernameCipher', { req, res });
    const accessDatacipherObj = getCookie('accessData', { req, res });

    if (!usernameCipher || !accessDatacipherObj) {
      res.send({ userProfile: {}, mostListened: {} });
    }

    //Unencrypt accessData cookie object
    const accessBytes = await CryptoJS.AES.decrypt(
      accessDatacipherObj,
      process.env.CRYPT_KEY
    );

    const accessData = await JSON.parse(
      accessBytes.toString(CryptoJS.enc.Utf8)
    );

    //unencrypt username
    const usernameBytes = await CryptoJS.AES.decrypt(
      accessDatacipherObj,
      process.env.CRYPT_KEY
    );

    const username = await JSON.parse(
      usernameBytes.toString(CryptoJS.enc.Utf8)
    );

    if (!username || !accessData) {
      res.status(401).json({ error: 'Error. No such user.' });
    }
    //grab the cart entry to edit
    const albumToDelete = await Album.findByPk(id);

    await albumToDelete?.destroy();

    res.status(200).json({ message: 'album deleted' });
  } catch (e: any) {
    res.status(400).json({
      error_code: 'delete_album',
      message: e.message,
    });
  }
}
