import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

//INTERFACES
export interface AlbumInfoInterface {
  label: string;
  catalogNo: string;
  rating: number;
  released: string;
  country: string;
  genres: string[];
  styles: string[];
  tracklist: { position: string; title: string; duration: string }[];
}

export interface AlbumInfoPropsInterface {
  data: {
    albumInfo: AlbumInfoInterface;
  };
  error: boolean | undefined;
  isLoading: boolean | undefined;
  isValidating: boolean | undefined;
}

const useGetAlbumInfo = (id: number, masterId: number) => {
  //Grab our user profile
  const { data, error, isLoading, isValidating }: AlbumInfoPropsInterface =
    useSWR(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/albums/albumInfo?id=${id}&masterId=${masterId}`,
      fetcher
    );

  return { data, error, isLoading, isValidating };
};

export default useGetAlbumInfo;
