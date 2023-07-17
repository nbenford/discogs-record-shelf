import { Loader, LoadingOverlay } from '@mantine/core';

const RedLoader = () => {
  return (
    <LoadingOverlay
      color={'hsla(251, 38%, 6%, 1)'}
      visible
      keepMounted
      transitionDuration={500}
      loader={<Loader color="red" size="xl" variant="bars" />}
    />
  );
};

export default RedLoader;
