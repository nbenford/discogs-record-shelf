import { Open_Sans, Poppins } from 'next/font/google';

// If loading a variable font, you don't need to specify the font weight
export const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-openSans',
  weight: ['400', '700', '800'],
});

export const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700', '800', '900'],
});
