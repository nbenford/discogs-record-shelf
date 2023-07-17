import { useCallback, useState } from 'react';
import { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { useSWRConfig } from 'swr';
import { unstable_serialize } from 'swr/infinite';

//MANTINE
import { Modal, Loader, Text } from '@mantine/core';
// import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

import { poppins } from '../../common/fonts';

//COMPONENTS
import AlbumAddLengthContainer from './AlbumAddLengthContainer';

//HOOKS
import useGetAlbumLength from '../../../hooks/useGetAlbumLength';

interface CartridgeEditModalInterface {
  setAddModalOpen: Dispatch<SetStateAction<boolean>>;
  addModalOpen: boolean;
  id: number;
  masterId: number;
  artist: string;
  title: string;
  closeCallback?: Dispatch<SetStateAction<any | null>>;
}

const AlbumAddModalComponent = ({
  setAddModalOpen,
  addModalOpen,
  id,
  masterId,
  artist,
  title,
  closeCallback,
}: CartridgeEditModalInterface) => {
  //sending album data
  const [isSendingData, setIsSendingData] = useState<boolean>(false);

  //media query to set fullscreen or not
  // const isMobile = useMediaQuery('(max-width: 50em)');

  //allows us to manually refresh the plays table
  //I'm not sure this should be necessary. Why the data isn't revalidating
  //when the first play entry is added, I'm not sure. Only happens when the
  //first album add is done manually.
  const { mutate } = useSWRConfig();
  const getKey = (pageIndex: number, previousPageData: any) => {
    return `${process.env.NEXT_PUBLIC_BASE_URL}/api/albums/albumData?page=${
      pageIndex + 1
    }&per_page=20`;
  };

  //add success alert
  const notifyWithToastSuccess = useCallback(
    (message: string) => {
      notifications.show({
        id: 'successNotification',
        withCloseButton: true,
        autoClose: 3000,
        title: 'Album Add',
        message: message,
        color: 'green',
        loading: isSendingData,
      });
    },
    [isSendingData]
  );

  //get our album length data
  const { data, error, isLoading } = useGetAlbumLength(id);

  //submits album to be logged in DB
  const submitAlbumTime = useCallback(
    async (cartId: string | null, sliderRuntime: number | null) => {
      if (!cartId || cartId === '' || !sliderRuntime) return;
      setIsSendingData(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/albums/addAlbumTime`,
        {
          method: 'POST',
          body: JSON.stringify({
            albumData: {
              albumId: id,
              masterId: masterId,
              runtime: sliderRuntime,
              cartId: parseInt(cartId),
              artist: artist,
              title: title,
            },
          }),
        }
      );
      const data = await res.json();

      if (data) {
        setIsSendingData(false);
        notifyWithToastSuccess('Success!');
        mutate(unstable_serialize(getKey));
        setAddModalOpen(false);

        if (closeCallback) {
          closeCallback(false);
        }
      }
    },
    [
      id,
      artist,
      title,
      setAddModalOpen,
      masterId,
      notifyWithToastSuccess,
      closeCallback,
      mutate,
    ]
  );

  return (
    <>
      <Modal
        size="lg"
        id={title}
        // fullScreen={isMobile}
        opened={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title={
          <div style={{ paddingLeft: '1.2rem' }}>
            <h2 style={{ color: '#5ea1ee', fontSize: '1.4rem' }}>{title}</h2>
            <h2 style={{ color: '#FF0090', fontSize: '1.2rem' }}>{artist}</h2>
          </div>
        }
        overlayProps={{
          opacity: 0.55,
          blur: 3,
        }}
        closeButtonProps={{
          color: 'red',
          iconSize: 40,
          variant: 'light',
          size: 40,
        }}
        transitionProps={{
          transition: 'fade',
          duration: 300,
          timingFunction: 'linear',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            paddingLeft: '1.2rem',
            paddingRight: '1.2rem',
            paddingBottom: '1.5rem',
          }}
        >
          {isLoading && (
            <div
              style={{
                minWidth: '300px',
                minHeight: '400px',
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Loader variant="bars" color="red" />
            </div>
          )}
          {error && (
            <div
              style={{
                minWidth: '300px',
                minHeight: '400px',
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <h2>Error.</h2>
            </div>
          )}

          {!isLoading && data && (
            <div>
              <Text
                fw={700}
                size={'1.4rem'}
                style={poppins.style}
                color="orange.4"
              >
                About the Album
              </Text>
              <Text>{data?.blurb}</Text>
              <div style={{ marginTop: '1rem' }} />
              <Image
                src="/static/images/openai-white-lockup.png"
                alt="openAI logo"
                width={100}
                height={27}
              />
              <hr style={{ marginTop: '1rem', borderColor: '#b61526' }} />
              <AlbumAddLengthContainer
                submitAlbumTime={submitAlbumTime}
                albumData={data}
              />
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export const AlbumAddModal = AlbumAddModalComponent;
