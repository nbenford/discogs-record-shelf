import { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';
var CryptoJS = require('crypto-js');

//MODELS
import { User, Cartridge } from '../../../db/models';

export default async function userCartridges(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

    const user = await User.findOne({
      where: { username: username },
      attributes: ['username', 'id'],
      include: [
        {
          model: Cartridge,
          as: 'cartridges',
        },
      ],
      order: [['cartridges', 'created_at', 'desc']],
      limit: 100,
    });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(200).json([]);
    }
  } catch (e: any) {
    console.log(e);
    res.status(400).json({
      error_code: 'get_users',
      message: e.message,
    });
  }
}
