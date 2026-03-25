import { Inter } from 'next/font/google';
import { Roboto } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '300', '400','500', '700', '900'],
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400','500', '700', '900'],
});

export const Fonts = {
    inter,
    roboto
}