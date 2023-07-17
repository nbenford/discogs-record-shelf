import dynamic from 'next/dynamic';
import { useMemo } from 'react';

//COMPONENTS
import RedLoader from '../../components/common/RedLoader';
import SEO from '../../components/seo';

//HOOKS
import useGetAlbumList from '../../hooks/useGetAlbumList';

const AlbumCarousel = dynamic(
  () => import('../../components/album/AlbumCarousel'),
  {
    loading: () => <RedLoader />,
  }
);

//INTERFACE
export interface AlbumInterface {
  id: number;
  basic_information: {
    master_id: number;
    title: string;
    cover_image: string;
    master_url: string;
    artists: {
      name: string;
    }[];
  };
}

const Albums = () => {
  const { data, isLoading, error, isValidating, size, setSize, perPage } =
    useGetAlbumList();

  //Destructures the albums and pagination data
  const { releases, pagination } = useMemo(() => {
    if (data) {
      const flatData = [...data.flatMap((page) => page)];
      return {
        releases: [...flatData.map((page) => page.releases)],
        pagination: data[0].pagination,
      };
    }
    return { releases: [] };
  }, [data]);

  //Combines the albums into one array
  const albumCollection: AlbumInterface[] = releases
    ? [].concat(...releases)
    : [];

  if (error) return <h2>failed to load</h2>;
  if (data) {
    return (
      <>
        <SEO
          pageDescription="Browse your Discogs record collection"
          pageTitle="Discogs Albums"
        />
        <AlbumCarousel
          carouselCollection={albumCollection}
          setSize={setSize}
          size={size}
          pagination={pagination}
          isValidating={isValidating || isLoading}
          perPage={perPage}
        />
      </>
    );
  }
};

export default Albums;
