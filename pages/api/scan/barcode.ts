var Discogs = require('disconnect').Client;
import { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';
var CryptoJS = require('crypto-js');

interface EntryInterface {
  pagination: {
    page: number;
    pages: number;
    per_page: number;
    items: number;
  };
  results: {
    id: number;
  }[];
}

export interface AlbumScanDataInterface {
  id: number;
  masterId: number;
  year?: number;
  artist: string;
  title: string;
  image?: string;
}

//Function grabs our user's data
//It needs the accessData object, which is stored encrypted as a cookie
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    //Get the page and entries per page
    const { code } = req.query;

    //get cookies
    const accessDatacipherObj = getCookie('accessData', { req, res });

    if (!accessDatacipherObj) {
      res.status(401).json({ error: 'Error. No such user.' });
    }

    //decrypt cookies
    const accessBytes = await CryptoJS.AES.decrypt(
      accessDatacipherObj,
      process.env.CRYPT_KEY
    );
    const accessData = await JSON.parse(
      accessBytes.toString(CryptoJS.enc.Utf8)
    );

    //Return the obj
    var dis = await new Discogs(accessData).database();
    const entry: EntryInterface = await dis.search({
      barcode: code,
      format: 'Vinyl',
    });

    const albumData = await dis.getRelease(entry.results[0].id);

    const albumDataFormatted: AlbumScanDataInterface = {
      id: albumData.id,
      masterId: albumData.master_id,
      year: albumData.year,
      artist: albumData.artists[0].name,
      title: albumData.title,
      image: albumData.images[0].uri,
    };

    if (albumData) {
      res.send(albumDataFormatted);
    } else {
      res.send(null);
    }
  } catch (err) {
    res.send(err);
  }
}
