import { useRouter } from 'next/router';

//MANTINE
import { Paper } from '@mantine/core';
import { IconVinyl } from '@tabler/icons-react';

//COMPONENTS
import SEO from '../components/seo';
import {
  HeaderTextWhite,
  HeaderTextRed,
  SubheaderText,
  BodyText,
} from '../components/common/Headers';

//STYLES
import styles from '../styles/Home.module.css';

export default function Home() {
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
              <IconVinyl color=" hsla(351, 74%, 45%, 1)" size="100%" />
            </div>
          </div>
          <div className={styles.frontPageHeaderText}>
            <HeaderTextWhite>Discogs </HeaderTextWhite>
            <HeaderTextRed>Record Shelf</HeaderTextRed>
            <div style={{ marginTop: '10px' }} />
            <SubheaderText>
              We are currently offline. Please check back soon.
            </SubheaderText>
            <div style={{ marginTop: '3rem' }} />
          </div>
          <div style={{ marginTop: '50px' }} />
          <div className={styles.frontPageHeaderText}></div>
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
