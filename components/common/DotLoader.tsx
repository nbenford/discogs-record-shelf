import { Loader, Overlay, LoadingOverlay } from '@mantine/core';

const DotLoader = () => {
  return (
    // <Overlay center color={'hsla(251, 38%, 6%, 0.5)'}>
    //   <Loader color="red" variant="dots" />
    // </Overlay>
    <LoadingOverlay
      color={'hsla(251, 38%, 6%, 1)'}
      visible
      keepMounted
      transitionDuration={500}
      loader={<Loader color="red" size="xl" variant="dots" />}
    />
  );
};

export default DotLoader;
