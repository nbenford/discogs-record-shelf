import { useState, Dispatch, SetStateAction, useCallback } from 'react';

//MANTINE
import { TextInput, Group, Loader } from '@mantine/core';

//COMPONENTS
import { ProfileButton } from '../common/Buttons';
import SearchResult from './SearchResult';
import { AlbumAddModal } from '../album/addModal/AlbumAddModal';

//INTERFACE
import { AlbumAddStatus } from './PlayScanContainer';
import { AlbumScanDataInterface } from '../../pages/api/scan/barcode';

const TextSearch = ({
  setAlbumAddStatus,
  setScanPromptOpen,
}: {
  setAlbumAddStatus: Dispatch<SetStateAction<AlbumAddStatus | null>>;
  setScanPromptOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [album, setAlbum] = useState<AlbumScanDataInterface | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);

  const getAlbumData = useCallback(async (code: string) => {
    setIsLoading(true);
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/scan/barcode?code=${code}`
      )
        .then((res) => res.json())
        .then((albumData) => setAlbum(albumData))
        .then(() => {
          setIsLoading(false);
        });
    } catch {
      setIsLoading(false);
      console.log('album data fetch error');
    }
  }, []);

  return (
    <>
      {!album && (
        <>
          <div style={{ marginTop: '1rem' }} />
          <TextInput
            aria-label="Album catalog number"
            label="Album catalog number"
            description="Look on spine"
            placeholder="e.g. ST 2576"
            value={searchInput}
            onChange={(event) => setSearchInput(event.currentTarget.value)}
          />
          <div style={{ marginTop: '1rem' }} />
          <Group grow position="apart">
            <ProfileButton
              callback={() => getAlbumData(searchInput)}
              text="Search"
              color="blue.5"
            />
            <ProfileButton
              callback={() => setAlbumAddStatus(null)}
              text="Cancel"
              color="yellow.5"
              isFullWidth={true}
            />
          </Group>
        </>
      )}
      <div style={{ marginTop: '1rem' }} />
      {isLoading && (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '300px',
          }}
        >
          <Loader variant="dots" color="red" />;
        </div>
      )}
      {album && !isLoading && !addModalOpen && (
        <SearchResult
          album={album}
          setAlbum={setAlbum}
          setAddModalOpen={setAddModalOpen}
        />
      )}
      {album && addModalOpen && !isLoading && (
        <AlbumAddModal
          setAddModalOpen={setAddModalOpen}
          addModalOpen={addModalOpen}
          id={album?.id}
          masterId={album?.masterId}
          artist={album?.artist}
          title={album?.title}
          closeCallback={(val) => setScanPromptOpen(val)}
        />
      )}
    </>
  );
};

export default TextSearch;
