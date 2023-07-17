import {
  useCallback,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';

//MANTINE
import { Loader } from '@mantine/core';

//COMPONENTS
import { ProfileButton } from '../common/Buttons';
import SearchResult from './SearchResult';
import { AlbumAddModal } from '../album/addModal/AlbumAddModal';
import ScannerBox from './ScannerBox';

//STYLES
import styles from './Barcode.module.css';

//INTERFACE
import { AlbumScanDataInterface } from '../../pages/api/scan/barcode';
import { AlbumAddStatus } from './PlayScanContainer';

const BarcodeScanner = ({
  setAlbumAddStatus,
  setScanPromptOpen,
}: {
  setAlbumAddStatus: Dispatch<SetStateAction<AlbumAddStatus | null>>;
  setScanPromptOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  //state
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [album, setAlbum] = useState<AlbumScanDataInterface | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);

  //search for album using barcode or catalog number
  const getAlbumData = useCallback(
    async (code: string) => {
      setIsLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/scan/barcode?code=${code}`
      );
      const albumData = await res.json();
      setAlbum(albumData);
      setIsLoading(false);
    },
    [setAlbum]
  );

  //triggered by receiving results from scanner
  //we grab the first result since Quagga already vetted it
  useEffect(() => {
    if (results[0]) {
      getAlbumData(results[0]);
    }
  }, [getAlbumData, results]);

  if (isLoading) {
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          height: '200px',
        }}
      >
        <Loader variant="dots" color="red" />
      </div>
    );
  }

  return (
    <main>
      <section className={styles.section}>
        <div className={styles.centerSection}>
          {!album && (
            <ScannerBox
              results={results}
              setResults={setResults}
              scanning={scanning}
              setScanning={setScanning}
            />
          )}
          {!album && !isLoading && (
            <>
              <ProfileButton
                text={scanning ? 'Stop Scan' : 'Start Camera'}
                callback={() => setScanning(!scanning)}
                isFullWidth={false}
                compact={true}
                color="blue.5"
                variant="light"
              />

              <div style={{ marginTop: scanning ? '4rem' : '2rem' }} />
              <ProfileButton
                callback={() => {
                  setScanning(!scanning);
                  setAlbumAddStatus(null);
                }}
                text="Cancel"
                isFullWidth={true}
                color="yellow.5"
              />
            </>
          )}
        </div>
      </section>
      {album && !isLoading && !scanning && (
        <>
          <SearchResult
            album={album}
            setAlbum={setAlbum}
            setAddModalOpen={setAddModalOpen}
            setAlbumAddStatus={setAlbumAddStatus}
          />
        </>
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
    </main>
  );
};

export default BarcodeScanner;
