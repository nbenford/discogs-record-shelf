import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { getCookie } from 'cookies-next';

//COMPONENTS
import RedLoader from '../../components/common/RedLoader';
import SEO from '../../components/seo';
import {
  HeaderTextWhite,
  HeaderTextRedLinebreak,
  SubheaderText,
} from '../../components/common/Headers';
import { ProfileButton } from '../../components/common/Buttons';
import ErrorPleaseLogin from '../../components/common/ErrorPleaseLogin';
import StyledMessage from '../../components/common/StyledMessage';

//STYLE
import styles from '../../components/common/headers.module.css';

//INTERFACE
import { UserIdentityDataProps } from '../../hooks/useGetUserData';

//HOOKS
import useGetUserData from '../../hooks/useGetUserData';

//MANTINE
import { Title, Text, Paper } from '@mantine/core';

//FONT
import { openSans } from '../../components/common/fonts';

const Home = () => {
  const router = useRouter();

  const username = getCookie('username');

  //Grab our user profile
  const { data, error, isLoading, isValidating }: UserIdentityDataProps =
    useGetUserData();

  if (error && !isLoading)
    return <StyledMessage text="Error: failed to load" />;
  if (isLoading || isValidating) return <RedLoader />;

  if (!data?.userProfile || Object.keys(data).length === 0) {
    return <ErrorPleaseLogin />;
  }

  return (
    <>
      {data?.userProfile && Object.keys(data?.userProfile).length > 0 && (
        <>
          <SEO
            pageDescription="Your Discogs profile"
            pageTitle="Discogs Profile"
          />
          <div className={styles.frontPageContainer}>
            <Paper className={styles.profilePaper}>
              <Text span>
                <HeaderTextWhite>Hello, </HeaderTextWhite>
                <HeaderTextRedLinebreak>
                  {data.userProfile.username}
                </HeaderTextRedLinebreak>
              </Text>
              <div style={{ margin: '30px' }} />
              <div style={{ paddingLeft: '0rem' }}>
                {data.userProfile.avatar_url && (
                  <Image
                    alt={`${data.userProfile.username} profile pic`}
                    src={data.userProfile.avatar_url}
                    width={200}
                    height={200}
                    priority
                    style={{ opacity: '50%' }}
                  />
                )}
                <Title
                  mt={20}
                  style={openSans.style}
                  order={2}
                  color="hsla(226, 58%, 55%, 1)"
                >
                  {data.userProfile.location}
                </Title>
                <Text style={openSans.style} c="hsla(233, 25%, 64%, 1)">
                  Member since{' '}
                  {dayjs(data.userProfile.registered).format('MMM DD, YYYY')}
                </Text>
              </div>

              <div style={{ margin: '30px' }} />

              <SubheaderText>
                You have{' '}
                <Text span size={'2rem'} color="hsla(226, 58%, 55%, 1)">
                  {data.userProfile.num_collection}
                </Text>{' '}
                albums in your collection.
              </SubheaderText>

              {data.mostListened?.title && (
                <>
                  <div style={{ margin: '15px' }} />
                  <SubheaderText>
                    Your most played album is{' '}
                    <Text
                      span
                      size={'2rem'}
                      fs="italic"
                      color="hsla(226, 58%, 55%, 1)"
                    >
                      {data.mostListened?.title}
                    </Text>
                    <Text span size={'2rem'} color="gray.5">
                      {' '}
                      by{' '}
                    </Text>
                    <Text span size={'2rem'} color="orange.6">
                      {data.mostListened?.artist}
                    </Text>
                  </SubheaderText>
                </>
              )}

              <div style={{ margin: '35px' }} />

              <ProfileButton
                text="Browse Your Albums"
                callback={() => router.push('/albums')}
                isFullWidth={true}
              />
            </Paper>
          </div>
        </>
      )}
      {data?.userProfile && Object.keys(data.userProfile).length === 0 && (
        <>
          <SEO
            pageDescription="Your Discogs profile"
            pageTitle="Discogs Profile"
          />
          <div className={styles.frontPageContainer}>
            <Paper className={styles.profilePaper}>
              <Text span>
                <HeaderTextWhite>Hello, </HeaderTextWhite>
                <HeaderTextRedLinebreak>{username}</HeaderTextRedLinebreak>
              </Text>
              {/* <div style={{ margin: '30px' }} /> */}
              <div style={{ paddingLeft: '0rem', marginBottom: '5rem' }}>
                {data.userProfile.avatar_url && (
                  <Image
                    alt={`${data.userProfile.username} profile pic`}
                    src={data.userProfile.avatar_url}
                    width={200}
                    height={200}
                    priority
                    style={{ opacity: '50%' }}
                  />
                )}
                <Title
                  mt={20}
                  style={openSans.style}
                  order={2}
                  color="hsla(226, 58%, 55%, 1)"
                >
                  {data.userProfile.location}
                </Title>
                <Text style={openSans.style} c="hsla(233, 25%, 64%, 1)">
                  Member since{' '}
                  {dayjs(data.userProfile.registered).format('MMM DD, YYYY')}
                </Text>
              </div>
              <SubheaderText>Make yourself at home.</SubheaderText>
              <div style={{ margin: '30px' }} />
            </Paper>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
