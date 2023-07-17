import { useState, Dispatch, SetStateAction } from 'react';
import dynamic from 'next/dynamic';

//MANTINE
import { Group, Text } from '@mantine/core';

//COMPONENTS
import { ProfileButton } from '../common/Buttons';
// import BarcodeScanner from './BarcodeScanner';
// import TextSearch from './TextSearch';
import DotLoader from '../common/DotLoader';

const BarcodeScanner = dynamic(() => import('./BarcodeScanner'));
// const BarcodeScanner = dynamic(() => import('./BarcodeScanner'), {
//   loading: () => <DotLoader />,
// });

const TextSearch = dynamic(() => import('./TextSearch'));
// const TextSearch = dynamic(() => import('./TextSearch'), {
//   loading: () => <DotLoader />,
// });

export enum AlbumAddStatus {
  TEXT_SEARCH = 'textSearch',
  BARCODE = 'barcode',
}

const PlayScanContainer = ({
  setScanPromptOpen,
}: {
  setScanPromptOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [albumAddStatus, setAlbumAddStatus] = useState<AlbumAddStatus | null>(
    null
  );

  return (
    <div>
      <Text fw={700} size={'1.5rem'}>
        Add Album
      </Text>
      <Text fw={400}>
        Please scan a barcode or search for an album with the catalog number.
      </Text>
      <Text fw={400} color="dimmed" mt={'15px'}>
        Note that some albums may not be in the Discogs database.
      </Text>
      <div style={{ marginTop: '50px' }} />
      {!albumAddStatus && (
        <>
          <Group grow position="apart">
            <ProfileButton
              callback={() => setAlbumAddStatus(AlbumAddStatus.BARCODE)}
              text="Scan Barcode"
              color="blue.5"
            />
            <ProfileButton
              callback={() => setAlbumAddStatus(AlbumAddStatus.TEXT_SEARCH)}
              text="Text Search"
              color="blue.5"
            />
          </Group>

          <div style={{ marginTop: '2rem' }}>
            <ProfileButton
              callback={() => setScanPromptOpen(false)}
              text="Cancel"
              color="yellow.5"
              isFullWidth={true}
            />
          </div>
        </>
      )}

      <div style={{ marginTop: '1rem' }}>
        {albumAddStatus === AlbumAddStatus.TEXT_SEARCH && (
          <TextSearch
            setAlbumAddStatus={setAlbumAddStatus}
            setScanPromptOpen={setScanPromptOpen}
          />
        )}
      </div>
      {albumAddStatus === AlbumAddStatus.BARCODE && (
        <BarcodeScanner
          setAlbumAddStatus={setAlbumAddStatus}
          setScanPromptOpen={setScanPromptOpen}
        />
      )}
    </div>
  );
};

export default PlayScanContainer;
