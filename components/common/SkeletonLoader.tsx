import { Skeleton } from '@mantine/core';

const SkeletonLoader = ({ num = 8 }: { num?: number }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        height: 'minContent',
        padding: '1.2rem',
      }}
    >
      <Skeleton height={30} radius="sm" mt={6} mb={30} width="  40%" />
      <Skeleton height={25} radius="sm" mt={6} mb={20} width="50%" />
      {[...Array.from(Array(num).keys())].map((el, idx) => (
        <Skeleton
          height={20}
          radius="sm"
          mt={6}
          mb={6}
          width="100%"
          key={idx}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;
