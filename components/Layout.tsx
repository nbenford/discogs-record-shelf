import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import RedLoader from './common/RedLoader';

const TopNavbar = dynamic(() => import('./navbar/TopNavbar'), {
  loading: () => <RedLoader />,
});

// import TopNavbar from './navbar/TopNavbar';

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TopNavbar
        links={[
          // { link: '/', label: 'Home' },
          { link: '/profile', label: 'Profile' },
          { link: '/cartridges', label: 'Cartridges' },
          { link: '/albums', label: 'Albums' },
          { link: '/plays', label: 'Plays' },
        ]}
      />
      <div
        style={{
          paddingTop: '3.7em',
          marginBottom: '2em',
          backgroundColor: 'hsla(251, 38%, 6%, 1)',
        }}
      >
        {children}
      </div>
    </>
  );
};

export default Layout;
