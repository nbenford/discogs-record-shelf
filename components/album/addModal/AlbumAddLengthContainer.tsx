import { useState, useCallback, useEffect, useMemo } from 'react';

//MANTINE
import { Loader } from '@mantine/core';

//COMPONENTS
import AlbumAddLengthForm from './AlbumAddLengthForm';

//HOOKS
import { useGetCartridgeList } from '../../../hooks/useGetCartridgeList';

//INTERFACES
import { AlbumDataInterface } from './AlbumAddLengthForm';

import { CartridgeDataInterface } from '../../../hooks/useGetCartridgeList';

interface CartridgeDataProps {
  cartridgeData: CartridgeDataInterface;
  error: boolean | undefined;
  isLoading: boolean | undefined;
  isValidating: boolean | undefined;
}

interface AlbumInterface {
  albumData: AlbumDataInterface;
  submitAlbumTime: (
    cartId: string | null,
    sliderRuntime: number | null
  ) => Promise<void>;
}

const AlbumAddLengthContainer = ({
  albumData,
  submitAlbumTime,
}: AlbumInterface) => {
  //album length state
  const [runtime, setRuntime] = useState<number | ''>(
    albumData.totalTimeInMinutes || ''
  );

  //how much of record was listened to
  const [percentListenedTo, setPercentListenedTo] = useState<number>(100);

  //total runtime after percent slider accounted for
  const [sliderRuntime, setSliderRuntime] = useState<number | null>(
    albumData.totalTimeInMinutes || null
  );

  //if error
  const [hasError, setHasError] = useState<boolean>(false);

  //Grab our user profile and cartridge list
  const { cartridgeData, error, isLoading, isValidating }: CartridgeDataProps =
    useGetCartridgeList();

  //set initial runtime to Discog's runtime if it has one
  useEffect(() => {
    if (albumData.hasAlbumLength && albumData.totalTimeInMinutes) {
      setRuntime(albumData.totalTimeInMinutes);
      setSliderRuntime(albumData.totalTimeInMinutes);
    }
  }, [albumData]);

  //updates the album length, including light error checking
  const updateRuntime = useCallback((time: number) => {
    if (typeof time !== 'number') {
      setHasError(true);
    } else {
      setHasError(false);
      setRuntime(time);
    }
  }, []);

  //calculates the length of time after accounting for the slider
  const calculatedPercentListenedTo = useMemo(() => {
    if (percentListenedTo && runtime && percentListenedTo > 0) {
      const listenedTime = Math.round((runtime * percentListenedTo) / 100);
      setSliderRuntime(listenedTime);

      if (listenedTime !== undefined) {
        return listenedTime;
      }
    }
    return null;
  }, [percentListenedTo, runtime]);

  //sending this off to the form
  const formProps = {
    albumData,
    cartridgeData,
    runtime,
    updateRuntime,
    sliderRuntime,
    percentListenedTo,
    setPercentListenedTo,
    calculatedPercentListenedTo,
    submitAlbumTime,
    hasError,
  };

  if (error) {
    return <div>Error</div>;
  }

  if (isValidating || isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '18px',
          width: '100%',
        }}
      >
        <Loader color="red" variant="dots" />
      </div>
    );
  }

  return (
    <>
      <AlbumAddLengthForm formProps={formProps} />
    </>
  );
};

export default AlbumAddLengthContainer;
