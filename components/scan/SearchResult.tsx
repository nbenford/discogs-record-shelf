import { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';

//MANTINE
import { Group, Text } from '@mantine/core';

//COMPONENTS
import { ProfileButton } from '../common/Buttons';

//FONT
import { poppins } from '../common/fonts';

//INTERFACE
import { AlbumScanDataInterface } from '../../pages/api/scan/barcode';
import { AlbumAddStatus } from './PlayScanContainer';

const SearchResult = ({
  album,
  setAlbum,
  setAddModalOpen,
  setAlbumAddStatus,
}: {
  setAlbum: Dispatch<SetStateAction<AlbumScanDataInterface | null>>;
  setAddModalOpen: Dispatch<SetStateAction<boolean>>;
  album: AlbumScanDataInterface;
  setAlbumAddStatus?: Dispatch<SetStateAction<AlbumAddStatus | null>>;
}) => {
  if (album && album.hasOwnProperty('image')) {
    return (
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '1rem',
            maxWidth: '90dvw',
          }}
        >
          <Text truncate fw={500} size="1.2rem" style={poppins.style}>
            {album?.title}
          </Text>
          <Text
            weight={600}
            size="1.2rem"
            color="blue.5"
            truncate
            style={poppins.style}
          >
            {album?.artist}
          </Text>
          <Text
            weight={700}
            size="1rem"
            color="green.5"
            truncate
            style={poppins.style}
          >
            {album?.year && album?.year !== 0 ? `Issued ${album?.year}` : ''}
          </Text>
          <div
            style={{
              marginTop: '1rem',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Image
              width={350}
              height={350}
              src={`${album?.image}`}
              alt={`Cover of ${album?.title} by ${album?.artist}`}
            />
          </div>
          <div style={{ marginTop: '4rem' }} />
          <Group grow position="apart">
            <ProfileButton
              callback={() => {
                setAddModalOpen(true);
              }}
              text="Add Album"
              isFullWidth={true}
            />
            <ProfileButton
              callback={() => {
                setAlbum(null);
                if (setAlbumAddStatus) {
                  setAlbumAddStatus(null);
                }
              }}
              text="Go Back"
              color="yellow.5"
              isFullWidth={true}
            />
          </Group>
          <div style={{ marginTop: '3rem' }} />
        </div>
      </div>
    );
  }
  return (
    <div>
      <Text color="red.5" fw={700}>
        Album not found. Please try again.
      </Text>
      <div style={{ marginTop: '3rem' }} />

      <ProfileButton
        callback={() => {
          setAlbum(null);
          if (setAlbumAddStatus) {
            setAlbumAddStatus(null);
          }
        }}
        text="Try Again"
        color="yellow.5"
        isFullWidth={true}
      />
    </div>
  );
};

export default SearchResult;
