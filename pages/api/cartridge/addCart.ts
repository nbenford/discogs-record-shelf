import { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';
var CryptoJS = require('crypto-js');

//MODELS
import { User, Cartridge } from '../../../db/models';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = JSON.parse(req.body);
  const { formData } = body;
  try {
    //get cookies
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

    //If there's no username cookie or the decryption failed, return error
    if (!username) {
      res.status(401).json({ error: 'Error. No such user.' });
    }

    //Check if user exists
    const user = await User.findOne({
      where: { username: username },
    });

    //set the id to be either the current user if if they're already in the db,
    //or get their id after adding them to the db
    const setUserId = async (user: typeof User | null) => {
      if (!user) {
        const newUser = await User.create({ username: username });
        return (newUser as any).id;
      } else if (user) {
        return (user as any).id;
      }
    };

    //create the cart entry
    await Cartridge.create({
      user_id: await setUserId(user as any),
      name: formData.name,
      maxHours: formData.maxHours,
      totalMinutes: formData.totalMinutes,
    });

    //get the user and their respective carts
    const completedUser = await User.findOne({
      where: { username: username },
      attributes: ['username', 'id'],
      include: 'cartridges',
      limit: 100,
    });
    res.status(201).json(completedUser);
  } catch (e: any) {
    res.status(400).json({
      error_code: 'get_users',
      message: e.message,
    });
  }
}
