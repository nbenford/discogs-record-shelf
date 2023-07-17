//MANTINE
import { createStyles, getStylesRef, rem } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
  card: {
    position: 'relative',
    // height: rem(500),
    // width: rem(500),
    // maxHeight: '70dvh',
    // maxWidth: '70dvh',
    overflow: 'hidden',
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[6]
        : theme.colors.gray[0],

    [`&:hover .${getStylesRef('image')}`]: {
      transform: 'scale(1.03)',
    },
  },

  image: {
    ...theme.fn.cover(),
    ref: getStylesRef('image'),
    backgroundSize: 'cover',
    transition: 'transform 500ms ease',
  },

  overlay: {
    position: 'absolute',
    top: '20%',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage:
      'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .85) 90%)',
  },

  backOverlay: {
    position: 'absolute',
    top: '0',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage:
      'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .85) 90%)',
  },

  content: {
    height: '100%',
    width: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    zIndex: 1,
  },

  backContent: {
    height: '100%',
    width: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 1,
  },

  title: {
    color: '#a4ffff',
    marginBottom: rem(5),
  },

  bodyText: {
    color: theme.colors.dark[2],
    marginLeft: rem(7),
  },

  artist: {
    color: '#5ea1ee',
  },
  backButton: {
    color: 'white',
    backgroundColor: '#b61526',
    opacity: 0.7,
    '&:hover': {
      backgroundColor: '#b61526',
      opacity: 1,
    },
  },
}));
