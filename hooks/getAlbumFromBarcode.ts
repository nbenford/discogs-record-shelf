import useSWR from 'swr';

//INTERFACE
import { AlbumScanDataInterface } from '../pages/api/scan/barcode';
import { SWRPropsInterface } from './useGetAlbumData';

interface UseGetAlbumScanInterface extends SWRPropsInterface {
  data: AlbumScanDataInterface;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const useGetAlbumFromBarcode = (code: any | null) => {
  //Grabs our album data
  const {
    data,
    isLoading,
    isValidating,
    error,
    mutate,
  }: UseGetAlbumScanInterface = useSWR(
    code
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/scan/barcode?code=${code}`
      : null,
    fetcher
  );

  return {
    data,
    isLoading,
    error,
    isValidating,
    mutate,
  };
};

export default useGetAlbumFromBarcode;
