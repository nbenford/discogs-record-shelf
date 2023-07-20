var Discogs = require('disconnect').Client;
import { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';
var CryptoJS = require('crypto-js');

// import { User } from '../../../db/models';

//INTERFACE
export interface FavoriteAlbumInterface {
  title: string;
  artist: string;
}

//Function grabs our user's data
//It needs the accessData object, which is stored encrypted as a cookie
export default async function identity(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // function mode(arr: FavoriteAlbumInterface[]) {
  //   return arr
  //     .sort(
  //       (a, b) =>
  //         arr.filter((v) => v.title === a.title).length -
  //         arr.filter((v) => v.title === b.title).length
  //     )
  //     .pop();
  // }
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
      usernameCipher,
      process.env.CRYPT_KEY
    );

    const username = await JSON.parse(
      usernameBytes.toString(CryptoJS.enc.Utf8)
    );

    if (!username || !accessData) {
      res.send({ userProfile: {}, mostListened: {} });
    }

    // const user = await User.findOne({
    //   where: { username: username },
    // });

    var dis = await new Discogs(accessData);
    const userProfile = await dis.user().getProfile(username);

    ////////////
    //MOST LISTENED FUNCTIONALITY WIP
    ////////////

    // const userId = (user as any).id ? (user as any).id : 0;
    try {
      //   const albumArray = await Album.findAll({
      //     where: { user_id: userId },
      //     raw: true,
      //     order: [['created_at', 'DESC']],
      //     include: [
      //       {
      //         model: Cartridge,
      //         attributes: ['name'],
      //         as: 'albumCartridge',
      //       },
      //     ],
      //   });

      let mostListened = null;

      // if (albumArray.length > 0) {
      //   const albumMode = mode(albumArray);
      //   console.log(albumMode, albumArray.indexOf(albumMode));
      //   if (
      //     albumArray.indexOf(albumMode) !==
      //     albumArray.lastIndexOf(albumMode)
      //   ) {
      //     mostListened = albumMode;
      //   }
      // }

      // console.log(mostListened);

      if (userProfile) {
        res.send({ userProfile, mostListened });
      } else {
        res.status(401).json({ error: 'Error. No such user.' });
      }
    } catch (e) {
      console.log(e);
    }
  } catch (err) {
    res.send(err);
  }
}
