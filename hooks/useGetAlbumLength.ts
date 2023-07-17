import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

//INTERFACE
interface IdentityProps {
  data: {
    hasAlbumLength: boolean;
    totalTime: string;
    totalTimeInMinutes: number;
    blurb: string;
  };
  error: boolean | undefined;
  isLoading: boolean | undefined;
}

const useGetAlbumLength = (id: number | null) => {
  //Grab our user profile
  const { data, error, isLoading }: IdentityProps = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/albums/tracklist?id=${id}`,
    fetcher
  );
  return { data, error, isLoading };
};

export default useGetAlbumLength;
