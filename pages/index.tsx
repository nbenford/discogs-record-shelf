import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';

//MANTINE
import { Paper } from '@mantine/core';
import { IconVinyl } from '@tabler/icons-react';

//COMPONENTS
import { ProfileButton } from '../components/common/Buttons';
import SEO from '../components/seo';
import {
  HeaderTextWhite,
  HeaderTextRed,
  SubheaderText,
  BodyText,
} from '../components/common/Headers';

// import CookieConsent from 'react-cookie-consent';

//STYLES
import styles from '../styles/Home.module.css';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  //if there's a username cookie, we're assuming the user is logged in
  useEffect(() => {
    const usernameCookie = getCookie('username');
    if (usernameCookie) {
      setIsLoggedIn(true);
    }
  }, []);

  const router = useRouter();
  return (
    <>
      <SEO
        pageDescription="View your Discogs vinyl collection visually and track turntable cartridge/stylus usage/hours/wear"
        pageTitle="Discogs Record Shelf"
      />
      <div className={styles.frontPageContainer}>
        <Paper
          className={styles.homePagePaper}
          style={{ backgroundColor: 'transparent' }}
        >
          <div className={styles.recordIcon}>
            <div>
              <IconVinyl color="hsla(351, 74%, 45%, 1)" size="100%" />
            </div>
          </div>
          <div className={styles.frontPageHeaderText}>
            <HeaderTextWhite>Discogs </HeaderTextWhite>
            <HeaderTextRed>Record Shelf</HeaderTextRed>
            <div style={{ marginTop: '10px' }} />
            <SubheaderText>
              Visually browse your collection and track turntable stylus wear.
            </SubheaderText>
            <div style={{ marginTop: '3rem' }} />
            <BodyText>
              Connect your{' '}
              <a
                href="https://discogs.com"
                target="_blank"
                style={{ color: 'lightgray', fontWeight: '600' }}
              >
                Discogs
              </a>{' '}
              account and browse your vinyl collection easily by flipping
              through your records virtually. To track stylus wear, register a
              cartridge and select a record to play.{' '}
              <span style={{ color: '#lightgray', fontWeight: '600' }}>
                Discogs{' '}
              </span>
              <span style={{ color: '#f2293e', fontWeight: '600' }}>
                Record Shelf
              </span>{' '}
              will add the total play time to your stylus&apos;s total time.
            </BodyText>
          </div>
          <div style={{ marginTop: '50px' }} />
          <div className={styles.frontPageHeaderText}>
            {isLoggedIn ? (
              <ProfileButton
                text="Browse Your Collection"
                callback={() => router.push('/albums')}
                isFullWidth={true}
              />
            ) : (
              <ProfileButton
                text="Log In Through Discogs"
                callback={() => router.push('/api/auth/authorize')}
                isFullWidth={true}
              />
            )}
          </div>
          <div style={{ margin: '20px' }} />
        </Paper>
        {/* <CookieConsent>
          This website uses cookies to enhance the user experience. We do not
          save or use personal information.
        </CookieConsent> */}
      </div>
    </>
  );
}
