import { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';
var CryptoJS = require('crypto-js');

//MODELS
import { Cartridge, Album } from '../../../db/models';

//Function grabs our user's data
//It needs the accessData object, which is stored encrypted as a cookie
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const body = JSON.parse(req.body);
    const { albumData } = body;

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

    const selectedCartridge = await Cartridge.findByPk(albumData.cartId);
    if (selectedCartridge) {
      await selectedCartridge.update({
        totalMinutes: Math.round(
          (selectedCartridge as any).totalMinutes + albumData.runtime
        ),
      });
    }

    const newAlbumObj = {
      user_id: await (selectedCartridge as any).user_id,
      cartridge_id: await (selectedCartridge as any).id,
      artist: albumData.artist,
      title: albumData.title,
      albumId: albumData.albumId,
      masterId: albumData.masterId || 0,
      minutesPlayed: albumData.runtime,
    };

    const newAlbum = await Album.create(newAlbumObj);

    if (newAlbum) {
      res.send(newAlbum);
    } else {
      res.send({});
    }
  } catch (err) {
    res.send(err);
  }
}
