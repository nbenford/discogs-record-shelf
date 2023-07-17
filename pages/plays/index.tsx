import dynamic from 'next/dynamic';
import { useState, useCallback, useMemo } from 'react';

//COMPONENTS
import DotLoader from '../../components/common/DotLoader';
import SEO from '../../components/seo';
import { ProfileButton } from '../../components/common/Buttons';
import {
  HeaderTextWhite,
  HeaderTextRedSmall,
  BodyText,
} from '../../components/common/Headers';
import ErrorPleaseLogin from '../../components/common/ErrorPleaseLogin';

const StyledMessage = dynamic(
  () => import('../../components/common/StyledMessage'),
  {
    loading: () => <DotLoader />,
  }
);

const PlayTable = dynamic(() => import('../../components/plays/PlayTable'), {
  loading: () => <DotLoader />,
});

const PlayScanContainer = dynamic(
  () => import('../../components/scan/PlayScanContainer'),
  {
    loading: () => <DotLoader />,
  }
);

//INTERFACES
import { AlbumDataInterface } from '../../hooks/useGetAlbumData';
import { SWRInfinitePropsInterface } from '../../hooks/useGetAlbumData';

interface AlbumJSONInterface {
  albumArray: AlbumDataInterface[];
  albumCount: number;
}

export interface AlbumDataProps extends SWRInfinitePropsInterface {
  data: AlbumJSONInterface[];
  perPage: number;
}

//HOOKS
import useGetAlbumData from '../../hooks/useGetAlbumData';

//STYLE
import styles from '../../components/common/headers.module.css';

//MANTINE
import { Paper } from '@mantine/core';

const AlbumList = () => {
  //STATE
  //is true when API is engaged
  const [isAPILoading, setIsAPILoading] = useState<boolean>(false);
  const [scanPromptOpen, setScanPromptOpen] = useState<boolean>(false);

  //Grab our user profile and cartridge list
  const {
    data,
    error,
    isLoading,
    isValidating,
    size,
    setSize,
    perPage,
  }: AlbumDataProps = useGetAlbumData();

  //Destructures the albums and count
  const { albums, albumCount } = useMemo(() => {
    if (data) {
      const flatData = [...data.flatMap((page) => page)];
      return {
        albums: [...flatData.map((page) => page.albumArray)],
        albumCount: flatData[0].albumCount,
      };
    }
    return { albums: [], albumCount: 0 };
  }, [data]);

  //Combines the albums into one array
  const albumList = albums ? [].concat(...(albums as any)) : [];

  //if we're at the end of the list, return false
  const hasMore = useMemo(() => {
    if (albumCount) {
      return size * perPage < albumCount ? true : false;
    }
    return false;
  }, [perPage, size, albumCount]);

  //Load more albums callback
  const updatePage = useCallback(() => {
    setSize(size + 1);
  }, [size, setSize]);

  //if we're not loading and we have data, return true
  const isReady = useMemo(() => {
    if (!isLoading && !isAPILoading && !isValidating) {
      return true;
    }
    return false;
  }, [isLoading, isAPILoading, isValidating]);

  //loading/error returns
  if (error) return <StyledMessage text="Error: failed to load" />;

  //if no error or loading, return page
  return (
    <>
      <SEO
        pageDescription="Albums that you have played"
        pageTitle="Album Plays"
      />

      {!isReady && <DotLoader />}

      {isReady && (
        <div className={styles.frontPageContainer}>
          <Paper className={styles.cartridgePaper}>
            <HeaderTextWhite>Plays</HeaderTextWhite>
            <HeaderTextRedSmall>Albums Played</HeaderTextRedSmall>
            {/* API returns albumCount: null if not logged in */}
            {!data[0].albumArray && !albumCount && <ErrorPleaseLogin />}
            {/* if db returns no albums */}
            {albumList.length === 0 && albumCount === 0 && !scanPromptOpen && (
              <>
                <StyledMessage text="No albums logged." />
                <div style={{ marginTop: '1rem' }} />

                <BodyText>
                  Please log an album from the Albums page or manually by
                  clicking the Add Album button.
                </BodyText>
                <div style={{ marginTop: '3rem' }} />
                <ProfileButton
                  text="Add Album"
                  compact={true}
                  callback={() => setScanPromptOpen(!scanPromptOpen)}
                />
              </>
            )}
            <div style={{ marginTop: '3rem' }} />

            {/* Table displays list of albums played */}
            {albums && albumCount > 0 && !scanPromptOpen && (
              <>
                <PlayTable
                  albumData={albumList}
                  albumCount={albumCount}
                  setIsAPILoading={setIsAPILoading}
                  isReady={isReady}
                  setScanPromptOpen={setScanPromptOpen}
                  scanPromptOpen={scanPromptOpen}
                />
                <div style={{ marginTop: '3rem' }} />

                <ProfileButton
                  text="List More"
                  callback={() => updatePage()}
                  disabled={!hasMore}
                  isFullWidth={true}
                />
                <div style={{ marginTop: '3rem' }} />
              </>
            )}

            {scanPromptOpen && (
              <PlayScanContainer setScanPromptOpen={setScanPromptOpen} />
            )}
          </Paper>
        </div>
      )}
    </>
  );
};

export default AlbumList;
