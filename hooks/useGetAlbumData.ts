import useSWRInfinite from 'swr/infinite';
import { KeyedMutator } from 'swr';

//INTERFACES
export interface AlbumDataInterface {
  id: number;
  'albumCartridge.name': string;
  user_id: number;
  albumId: number;
  masterId: number;
  minutesPlayed: number;
  title: string;
  artist: string;
  created_at: string;
}

export interface SWRPropsInterface {
  isLoading?: boolean | undefined;
  isValidating?: boolean | undefined;
  error?: any | undefined;
  mutate?: KeyedMutator<any>;
}

export interface SWRInfinitePropsInterface extends SWRPropsInterface {
  size: number;
  setSize: (
    size: number | ((_size: number) => number)
  ) => Promise<any[] | undefined>;
}

export interface AlbumDataSWRProps extends SWRInfinitePropsInterface {
  data: any;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const useGetAlbumData = () => {
  //Pagination
  // const [perPage, setPerPage] = useState<number>(50);
  const perPage = 20;

  //Grabs our album data
  const {
    data,
    size,
    setSize,
    isLoading,
    isValidating,
    error,
    mutate,
  }: AlbumDataSWRProps = useSWRInfinite(
    (page) =>
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/albums/albumData?page=${
        page + 1
      }&per_page=${perPage}`,
    fetcher,
    { revalidateFirstPage: true, parallel: true }
  );

  return {
    data,
    isLoading,
    error,
    isValidating,
    size,
    setSize,
    perPage,
    mutate,
    mutateData: mutate,
  };
};

export default useGetAlbumData;
