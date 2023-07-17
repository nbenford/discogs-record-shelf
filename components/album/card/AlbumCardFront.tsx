//MANTINE
import { Card, Text, Group, AspectRatio } from '@mantine/core';

//FONTS
import { openSans } from '../../common/fonts';

//INTERFACES
import { ImageCardProps } from './AlbumCard';
interface ImageFrontCardProps
  extends Omit<ImageCardProps, 'fullTitle' | 'id' | 'masterId'> {
  classes: any;
  getBackImage: () => void;
}

const AlbumCardFront = ({
  classes,
  getBackImage,
  isVisible,
  isValidating,
  image,
  title,
  artist,
}: ImageFrontCardProps) => {
  return (
    <AspectRatio ratio={1 / 1}>
      <Card
        p="lg"
        shadow="lg"
        className={classes.card}
        radius="md"
        onClick={() => {
          getBackImage();
        }}
      >
        {/* {isVisible && ( */}
        <>
          <div
            className={classes.image}
            style={{ backgroundImage: `url(${image})` }}
          />

          <div className={classes.overlay} />

          <div className={classes.content}>
            <div>
              <Text
                size="lg"
                className={classes.title}
                weight={500}
                style={openSans.style}
              >
                {title}
              </Text>

              <Group position="apart" spacing="xs">
                <Text
                  size="lg"
                  className={classes.artist}
                  style={openSans.style}
                  weight={700}
                >
                  {artist}
                </Text>
              </Group>
            </div>
          </div>
        </>
        {/* )} */}
      </Card>
    </AspectRatio>
  );
};

export default AlbumCardFront;
