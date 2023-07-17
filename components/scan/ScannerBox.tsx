import { useRef, useCallback, Dispatch, SetStateAction, useState } from 'react';

//COMPONENTS
import Scanner from './Scanner';

//INTERFACES
interface ScannerBoxProps {
  setResults: Dispatch<SetStateAction<string[]>>;
  results: string[];
  scanning: boolean;
  setScanning: Dispatch<SetStateAction<boolean>>;
}

//STYLES
import styles from './Barcode.module.css';

const ScannerBox = ({
  setResults,
  results,
  scanning,
  setScanning,
}: ScannerBoxProps) => {
  const scannerRef = useRef<HTMLInputElement | null>(null);

  const [doneScanning, setDoneScanning] = useState(false);

  //when we get a result, turn off the scanner and set barcode results
  const setResultsCallback = useCallback(
    (result: string) => {
      setResults([...results, result]);
      setDoneScanning(true);
      setScanning(false);
    },
    [setResults, results, setScanning]
  );

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          alignItems: 'center',
        }}
      >
        {!doneScanning && (
          <div
            className={styles.barcodeScanner}
            ref={scannerRef}
            style={{
              position: 'relative',
            }}
          >
            <canvas
              id="canvasId"
              className="drawingBuffer"
              style={{
                position: 'absolute',
                top: '0px',
              }}
              width="640"
              height="480"
            >
              {scanning && (
                <Scanner
                  scannerRef={scannerRef}
                  onDetected={(result) => setResultsCallback(result)}
                />
              )}
            </canvas>
          </div>
        )}

        <div style={{ marginTop: '1rem' }} />
      </div>
    </>
  );
};

export default ScannerBox;
