//MANTINE
import { Card, AspectRatio, Loader } from '@mantine/core';

import { Dispatch, SetStateAction, useState, useCallback } from 'react';

import { AlbumAddModal } from '../addModal/AlbumAddModal';

import { ProfileButton } from '../../common/Buttons';

//INTERFACES
import { ImageCardProps } from './AlbumCard';

interface ImageBackCardProps
  extends Omit<ImageCardProps, 'fullTitle' | 'isValidating' | 'image'> {
  classes: any;
  getBackImage: () => void;
  loadingBackImage: boolean;
  backImage: string;
  flipped: boolean;
  setFlipped: Dispatch<SetStateAction<boolean>>;
}

const AlbumCardBack = ({
  classes,
  title,
  artist,
  isVisible,
  setFlipped,
  flipped,
  backImage,
  loadingBackImage,
  id,
  masterId,
}: ImageBackCardProps) => {
  //album add modal state
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);

  const playRecordCallback = useCallback(
    (e: any) => {
      e.preventDefault();
      setAddModalOpen(!addModalOpen);
    },
    [addModalOpen]
  );
  return (
    <div>
      {addModalOpen && (
        <AlbumAddModal
          setAddModalOpen={setAddModalOpen}
          addModalOpen={addModalOpen}
          id={id}
          masterId={masterId}
          artist={artist}
          title={title}
        />
      )}
      <AspectRatio ratio={1 / 1}>
        <Card
          p="lg"
          shadow="lg"
          className={classes.card}
          radius="md"
          onClick={() => setFlipped(!flipped)}
        >
          {loadingBackImage && (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Loader variant="dots" color="red" />
            </div>
          )}

          <div
            className={classes.image}
            style={{ backgroundImage: `url(${backImage})` }}
          />
          <div className={classes.backOverlay} />

          <div className={classes.backContent}>
            <ProfileButton
              text="Play This Record"
              callback={(e: any) => playRecordCallback(e)}
            />
          </div>
        </Card>
      </AspectRatio>
    </div>
  );
};

export default AlbumCardBack;
