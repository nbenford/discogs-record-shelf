import useSWRInfinite from 'swr/infinite';

//INTERFACE
import { SWRInfinitePropsInterface } from './useGetAlbumData';

interface AlbumListInterface extends SWRInfinitePropsInterface {
  data: any[] | undefined;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const useGetAlbumList = () => {
  //Pagination
  const perPage = 50;

  //Grabs our infinite scroll post data
  const {
    data,
    size,
    setSize,
    isLoading,
    isValidating,
    error,
  }: AlbumListInterface = useSWRInfinite(
    (page) =>
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/albums/catalog?page=${
        page + 1
      }&per_page=${perPage}`,
    fetcher,
    { revalidateFirstPage: true, parallel: false }
  );

  return {
    data,
    isLoading,
    error,
    isValidating,
    size,
    setSize,
    perPage,
  };
};

export default useGetAlbumList;
