import useSWR from 'swr';

//INTERFACES
import { SWRPropsInterface } from './useGetAlbumData';

export interface CartridgeInterface {
  id: number;
  user_id: number;
  name: string;
  totalMinutes: number;
  maxHours: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartridgeDataInterface {
  username: string;
  id: number;
  cartridges: CartridgeInterface[];
}

interface CartridgeDataProps extends SWRPropsInterface {
  data: CartridgeDataInterface;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useGetCartridgeList = () => {
  //Grab our user profile and cartridge list
  const { data, error, isLoading, mutate, isValidating }: CartridgeDataProps =
    useSWR(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/userCartridges`,
      fetcher
    );
  return {
    cartridgeData: data,
    isLoading,
    error,
    isValidating,
    mutate,
  };
};
