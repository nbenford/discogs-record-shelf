import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import Head from 'next/head';

//MANTINE
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <meta property="og:type" content="website" />
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="theme-color" content="#C81E37" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#C81E37" />
        <meta name="apple-mobile-web-app-status-bar" content="#C81E37" />
        <meta name="application-name" content="Discogs Record Shelf" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta
          name="apple-mobile-web-app-title"
          content="Discogs Record Shelf"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#C81E37" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:url"
          content="https://discogs-record-shelf-e0e54663a588.herokuapp.com/"
        />
        <meta name="twitter:title" content="Discogs Record Shelf" />
        <meta
          name="twitter:description"
          content="South Dayton Demcoratic Club"
        />
        <meta property="og:site_name" content="Discogs Record Shelf" />
        <meta
          property="og:url"
          content="https://discogs-record-shelf-e0e54663a588.herokuapp.com/"
        />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        withCSSVariables
        theme={{
          /** Put your mantine theme override here */
          colorScheme: 'dark',
          loader: 'bars',
        }}
      >
        <Notifications />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MantineProvider>
    </>
  );
}
