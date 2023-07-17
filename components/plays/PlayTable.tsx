import { Dispatch, SetStateAction, ReactNode } from 'react';

//COMPONENTS
import StyledMessage from '../common/StyledMessage';
import { SubheaderText } from '../common/Headers';
import { PlayCard } from './PlayCard';
import { ProfileButton } from '../common/Buttons';

//MANTINE
import { Grid, Group } from '@mantine/core';

//INTERFACES
import { AlbumDataInterface } from '../../hooks/useGetAlbumData';

interface AlbumDataProps {
  albumData: AlbumDataInterface[];
  albumCount: number | null | undefined;
  setIsAPILoading: Dispatch<SetStateAction<boolean>>;
  setScanPromptOpen: Dispatch<SetStateAction<boolean>>;
  isReady: boolean;
  scanPromptOpen: boolean;
}

export interface PlayTableCardInterface {
  album: AlbumDataInterface;
  setIsAPILoading: Dispatch<SetStateAction<boolean>>;
}

const PlayTable = ({
  albumData,
  albumCount,
  setIsAPILoading,
  isReady,
  setScanPromptOpen,
  scanPromptOpen,
}: AlbumDataProps) => {
  //play card rows
  let rows: ReactNode[];

  if (albumData && albumData.length > 0) {
    rows = albumData?.map((album) => {
      return (
        <PlayCard
          key={album.id}
          album={album}
          setIsAPILoading={setIsAPILoading}
        />
      );
    });

    if (rows && albumCount && isReady) {
      return (
        <>
          <>
            <div
              style={{
                width: '100%',
                paddingLeft: '0.6rem',
                paddingRight: '0.6rem',
                marginBottom: '10px',
              }}
            >
              <Group position="apart">
                <ProfileButton
                  text="Add Album"
                  compact={true}
                  callback={() => setScanPromptOpen(!scanPromptOpen)}
                />
                <SubheaderText>
                  ({albumCount} {`${albumCount === 1 ? 'Play' : 'Plays'}`})
                </SubheaderText>
              </Group>
            </div>
            <Grid w="100%" m={0} p={0}>
              {rows}
            </Grid>
          </>
        </>
      );
    }
  } else {
    return (
      <div>
        <StyledMessage text="Error. No data received." />
      </div>
    );
  }
};

export default PlayTable;
