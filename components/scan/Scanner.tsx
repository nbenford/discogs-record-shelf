import { useCallback, useLayoutEffect, RefObject } from 'react';
import Quagga from '@ericblade/quagga2';
import {
  QuaggaJSReaderConfig,
  QuaggaJSConfigObject,
  QuaggaJSCodeReader,
  QuaggaJSResultObject,
} from '@ericblade/quagga2';

//INTERFACES
interface DecodedCode {
  error: number;
}

interface Result {
  codeResult: {
    decodedCodes: DecodedCode[];
    code: string;
  };
  boxes: [][];
  box: [];
}

interface ScannerProps extends QuaggaJSConfigObject {
  onDetected?: (arg: any) => void;
  scannerRef: RefObject<string | Element | undefined>;
  onScannerReady?: () => void;
  cameraId?: ConstrainDOMString | undefined;
  facingMode?: ConstrainDOMString | undefined;
  constraints?: {
    width: ConstrainULong | undefined;
    height: ConstrainULong | undefined;
  };
  locator?: { patchSize: string; halfSample: boolean };
  numOfWorkers?: number;
  decoders?: (QuaggaJSReaderConfig | QuaggaJSCodeReader)[];
  locate?: boolean;
}

//HELPER FUNCTIONS

function getMedian(arr: number[]): number {
  const newArray = [...arr];
  newArray.sort((a, b) => a - b);
  const half = Math.floor(newArray.length / 2);
  if (newArray.length % 2 === 1) {
    return arr[half];
  }
  return (newArray[half - 1] + newArray[half]) / 2;
}

function getMedianOfCodeErrors(decodedCodes: DecodedCode[]): number {
  const errors = decodedCodes
    .filter((x) => x.error !== undefined)
    .map((x) => x.error);
  const medianOfErrors = getMedian(errors);
  return medianOfErrors;
}

//CONFIG
const defaultConstraints = {
  width: 640,
  height: 480,

  aspectRatio: { ideal: 4 / 3 },
};

const defaultLocatorSettings = {
  patchSize: 'medium',
  halfSample: true,
};

const defaultDecoders: (QuaggaJSReaderConfig | QuaggaJSCodeReader)[] = [
  'upc_reader',
];

const shutdown = async () => {
  await Quagga.stop();
};

const Scanner = ({
  onDetected,
  scannerRef,
  onScannerReady,
  cameraId,
  facingMode,
  constraints = defaultConstraints,
  locator = defaultLocatorSettings,
  numOfWorkers = 0,
  decoders = defaultDecoders,
  locate = true,
}: ScannerProps) => {
  const errorCheck = useCallback(
    (result: Result): number | undefined => {
      if (!onDetected) {
        return;
      }
      const err = getMedianOfCodeErrors(result.codeResult.decodedCodes);
      // if Quagga is at least 75% certain that it read correctly, then accept the code.
      if (err < 0.25) {
        onDetected(result.codeResult.code);
      }
      return;
    },
    [onDetected]
  );

  const handleProcessed = (result: QuaggaJSResultObject): void => {
    const drawingCtx = Quagga.canvas.ctx.overlay;
    const drawingCanvas = Quagga.canvas.dom.overlay;
    drawingCtx.font = '24px Arial';
    drawingCtx.fillStyle = 'green';

    if (result) {
      // console.warn('* quagga onProcessed', result);
      // if (result.boxes) {
      //   drawingCtx.clearRect(
      //     0,
      //     0,
      //     drawingCanvas.getAttribute('width')
      //       ? parseInt(drawingCanvas.getAttribute('width') || '640')
      //       : 640,
      //     drawingCanvas.getAttribute('height')
      //       ? parseInt(drawingCanvas.getAttribute('height') || '480')
      //       : 480
      //   );
      //   result.boxes
      //     .filter((box) => box !== result.box)
      //     .forEach((box) => {
      //       Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
      //         color: 'purple',
      //         lineWidth: 2,
      //       });
      //     });
      // }
      // if (result.box) {
      //   Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
      //     color: 'blue',
      //     lineWidth: 2,
      //   });
      // }
      if (result.codeResult && result.codeResult.code) {
        // const validated = barcodeValidator(result.codeResult.code);
        // const validated = validateBarcode(result.codeResult.code);
        // Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: validated ? 'green' : 'red', lineWidth: 3 });
        drawingCtx.font = '24px Arial';
        // drawingCtx.fillStyle = validated ? 'green' : 'red';
        // drawingCtx.fillText(`${result.codeResult.code} valid: ${validated}`, 10, 50);
        drawingCtx.fillText(result.codeResult.code, 10, 20);
        // if (validated) {
        //     onDetected(result);
        // }
      }
    }
  };

  useLayoutEffect(() => {
    Quagga.init(
      {
        inputStream: {
          type: 'LiveStream',
          constraints: {
            ...constraints,
            ...(cameraId === 'default'
              ? { facingMode: 'environment' }
              : { deviceId: cameraId }),
          },
          target: scannerRef.current ? scannerRef.current : undefined,
        },
        locator,
        numOfWorkers,
        decoder: { readers: decoders },
        locate,
      },
      (err) => {
        Quagga.onProcessed(handleProcessed);

        if (err) {
          return console.log('Error starting Quagga:', err);
        }
        if (scannerRef && scannerRef.current) {
          Quagga.start();
          if (onScannerReady) {
            onScannerReady();
          }
        }
      }
    );
    Quagga.onDetected(errorCheck as any);
    return () => {
      Quagga.offDetected(errorCheck as any);
      Quagga.offProcessed(handleProcessed);
      shutdown();
      // Quagga.stop();
    };
  }, [
    cameraId,
    onDetected,
    onScannerReady,
    scannerRef,
    errorCheck,
    constraints,
    locator,
    decoders,
    locate,
    facingMode,
    numOfWorkers,
  ]);
  return null;
};

export default Scanner;
