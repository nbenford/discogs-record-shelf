var Discogs = require('disconnect').Client;
import { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';
var CryptoJS = require('crypto-js');

interface CollectionInterface {
  pagination: {
    page: number;
    pages: number;
    per_page: number;
    items: number;
  };
  releases: {
    id: number;
    basic_information: { formats: [{ name: string }] };
  }[];
}

//Function grabs our user's data
//It needs the accessData object, which is stored encrypted as a cookie
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    //Get the page and entries per page
    const { page, per_page } = req.query;

    //get cookies
    const usernameCipher = getCookie('usernameCipher', { req, res });
    const accessDatacipherObj = getCookie('accessData', { req, res });

    if (!usernameCipher || !accessDatacipherObj) {
      res.send({ pagination: {}, releases: [] });
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
      res.send({ pagination: {}, releases: [] });
    }

    //Return the user's collection page
    var dis = await new Discogs(accessData);
    const userCollection: CollectionInterface = await dis
      .user()
      .collection()
      .getReleases(username, 0, {
        page: page,
        per_page: per_page,
        sort: 'artist',
        sort_order: 'asc',
      });

    //we only want vinyl albums
    const filteredCollection = userCollection.releases.filter((album) => {
      if (album.basic_information.formats[0].name === 'Vinyl') return album;
    });

    const vinylCollection = {
      pagination: userCollection.pagination,
      releases: filteredCollection,
    };

    if (vinylCollection) {
      res.send(vinylCollection);
    } else {
      res.send({ pagination: {}, releases: [] });
    }
  } catch (err) {
    res.send(err);
  }
}
