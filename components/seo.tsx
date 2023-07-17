import Head from 'next/head';

interface SEOInterface {
  pageTitle: string;
  pageDescription: string;
}

const SEO = ({ pageTitle, pageDescription }: SEOInterface) => (
  <Head>
    <title>{pageTitle}</title>
    <meta name="description" content={pageDescription} />
    <meta property="og:title" content={pageTitle} key="title" />
    <meta property="og:description" content={pageDescription} />
  </Head>
);

export default SEO;
