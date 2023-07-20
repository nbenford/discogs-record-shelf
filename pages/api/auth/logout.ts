import { NextApiRequest, NextApiResponse } from 'next';
import { getCookies, setCookie } from 'cookies-next';
import Router from 'next/router';

//Removes cookies
export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const cookieList: Partial<{ [key: string]: string }> = getCookies({
      req,
      res,
    });

    const cookieArray = Object.keys(cookieList);

    const deleteCookies = async () => {
      for (let cookie of cookieArray) {
        setCookie(cookie, null, { req, res, httpOnly: true, maxAge: 0 });
      }
      return;
    };

    await deleteCookies();
    Router.replace('/');

    //Return success
    return res.status(200).json({ message: 'logged out' });
  } catch (err) {
    res.send(err);
  }
}
