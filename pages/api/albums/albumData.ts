import { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';
var CryptoJS = require('crypto-js');

import { Album, User, Cartridge } from '../../../db/models';

//Function grabs our user's data
//It needs the accessData object, which is stored encrypted as a cookie
export default async function albumData(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    //Get the page and entries per page

    const { page, per_page } = req.query;

    const startIndex = page || '1';
    const limit = per_page || '20';

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
      res.json({ albumArray: null, albumCount: null });
    }

    const user = await User.findOne({
      where: { username: username },
    });

    if (user) {
      const userId = (user as any).id ? (user as any).id : 0;
      try {
        const albumArray = await Album.findAll({
          where: { user_id: userId },
          raw: true,
          order: [['created_at', 'DESC']],
          include: [
            {
              model: Cartridge,
              attributes: ['name'],
              as: 'albumCartridge',
            },
          ],
          limit: Number(limit),
          offset: (Number(startIndex) - 1) * Number(limit),
          attributes: { exclude: ['updated_at'] },
        });
        const albumCount = await Album.count({
          where: { user_id: userId },
        });
        res.json({ albumArray, albumCount });
      } catch (e: any) {
        res.status(400).json({
          error_code: 'album_data',
          message: e.message,
        });
      }
    } else {
      res.json({ albumArray: [], albumCount: 0 });
    }
  } catch (err) {
    res.send(err);
  }
}
