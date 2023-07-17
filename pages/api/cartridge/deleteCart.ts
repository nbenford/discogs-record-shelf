import { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';
var CryptoJS = require('crypto-js');

//MODELS
import { Cartridge } from '../../../db/models';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = JSON.parse(req.body);
  const { id } = body;
  try {
    //get cookie
    const usernameCipher = getCookie('usernameCipher', { req, res });

    if (!usernameCipher) {
      res.status(401).json({ error: 'Error. No such user.' });
    }

    //decrypt cookie

    const usernameBytes = await CryptoJS.AES.decrypt(
      usernameCipher,
      process.env.CRYPT_KEY
    );

    const username = await JSON.parse(
      usernameBytes.toString(CryptoJS.enc.Utf8)
    );

    //If there's no username cookie or decryption fails, return error
    if (!username) {
      res.status(401).json({ error: 'Error. No such user.' });
    }

    //grab the cart entry to edit
    const cartridgeToDelete = await Cartridge.findByPk(id);
    if (cartridgeToDelete) {
      await cartridgeToDelete.destroy();
      res.status(200).json({ message: 'cartridge deleted' });
    } else {
      res.status(200).json({ message: 'no cartridge found' });
    }
  } catch (e: any) {
    res.status(400).json({
      error_code: 'edit_cart',
      message: e.message,
    });
  }
}
