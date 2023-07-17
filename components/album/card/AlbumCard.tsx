import { useState, memo, useCallback } from 'react';
import ReactCardFlip from 'react-card-flip';

//COMPONENTS
import AlbumCardFront from './AlbumCardFront';
import AlbumCardBack from './AlbumCardBack';

//MANTINE STYLES
import { useStyles } from './albumCardStyles';

//INTERFACES
export interface ImageCardProps {
  image: string;
  title: string;
  fullTitle: string;
  id: number;
  masterId: number;
  artist: string;
  isVisible: boolean;
  isValidating: boolean | undefined;
}

export function CardComponent({
  image,
  title,
  fullTitle,
  artist,
  isValidating,
  id,
  masterId,
  isVisible,
}: ImageCardProps) {
  const { classes } = useStyles();

  //Back image uri
  const [backImage, setBackImage] = useState<string>(image);
  //When true, shows card loader if back image is loading
  const [loadingBackImage, setLoadingBackImage] = useState<boolean>(false);

  //Card flip state
  const [flipped, setFlipped] = useState<boolean>(false);

  //When the card is flipped, get the uri of the second image associated with the album
  //It's often the back cover, but sometimes it's not and sometimes it doesn't exist
  const getBackImage = useCallback(async () => {
    setLoadingBackImage(true);
    await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/albums/backCover?id=${id}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && Object.keys(data).length !== 0) {
          setBackImage(data.backImage);
        } else {
          setBackImage(image);
        }
        setFlipped(!flipped);
        setLoadingBackImage(false);
      });
  }, [flipped, id, image]);

  return (
    <ReactCardFlip
      isFlipped={flipped}
      flipDirection="horizontal"
      flipSpeedFrontToBack={1}
      cardStyles={{
        front: { transformStyle: 'initial' },
        back: { transformStyle: 'initial' },
      }}
    >
      <div>
        <AlbumCardFront
          classes={classes}
          getBackImage={getBackImage}
          isVisible={isVisible}
          isValidating={isValidating}
          image={image}
          title={title}
          artist={artist}
        />
      </div>
      <div>
        <AlbumCardBack
          classes={classes}
          getBackImage={getBackImage}
          isVisible={isVisible}
          loadingBackImage={loadingBackImage}
          title={fullTitle}
          artist={artist}
          setFlipped={setFlipped}
          flipped={flipped}
          backImage={backImage}
          id={id}
          masterId={masterId}
        />
      </div>
    </ReactCardFlip>
  );
}

CardComponent.displayName = 'SwiperSlide';

export const AlbumCard = memo(CardComponent);
