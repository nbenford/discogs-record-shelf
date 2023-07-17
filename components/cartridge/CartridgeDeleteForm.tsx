import { useState, useCallback, Dispatch, SetStateAction } from 'react';

//MANTINE
import { Alert, Button } from '@mantine/core';
// import { useMediaQuery } from '@mantine/hooks';
import { IconAlertTriangle } from '@tabler/icons-react';

//HOOKS
import { useGetCartridgeList } from '../../hooks/useGetCartridgeList';
import useGetAlbumData from '../../hooks/useGetAlbumData';

//INTERFACES
import { CartridgeInterface } from '../../hooks/useGetCartridgeList';

interface DeleteConfirmInterface {
  confirmDeleteOpened: boolean;
  setConfirmDeleteOpened: Dispatch<SetStateAction<boolean>>;
  deleteCartridge: (e: number) => void;
  id: number;
}

interface CartridgeEditModalInterface {
  opened?: boolean;
  setEditCartOpen: Dispatch<SetStateAction<boolean>>;
  cart: CartridgeInterface;
  setIsAPILoading: Dispatch<SetStateAction<boolean>>;
  confirmDeleteOpened: boolean;
  setConfirmDeleteOpened: Dispatch<SetStateAction<boolean>>;
}

const DeleteCartridgeAlert = ({
  deleteCartridge,
  confirmDeleteOpened,
  setConfirmDeleteOpened,
  id,
}: DeleteConfirmInterface) => (
  <Alert
    title={
      <div
        style={{
          fontSize: '1.5rem',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <IconAlertTriangle
          size={'30px'}
          style={{ marginBottom: '4px', marginRight: '10px' }}
        />
        Warning
      </div>
    }
    color="red"
  >
    Are you sure you want to delete this cartridge?
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '1rem',
        // marginBottom: '2rem',
      }}
    >
      <Button color="red" onClick={() => deleteCartridge(id)}>
        Yes
      </Button>
      <div style={{ marginInline: '20px' }} />
      <Button onClick={() => setConfirmDeleteOpened(!confirmDeleteOpened)}>
        No
      </Button>
    </div>
  </Alert>
);

const CartridgeDeleteForm = ({
  setEditCartOpen,
  cart,
  setIsAPILoading,
  confirmDeleteOpened,
  setConfirmDeleteOpened,
}: CartridgeEditModalInterface) => {
  //media query to set fullscreen or not
  // const isMobile = useMediaQuery('(max-width: 50em)');

  //refresh data on edit
  const { mutate } = useGetCartridgeList();

  const { mutateData } = useGetAlbumData();

  //delete cartridge callback
  const deleteCartridge = useCallback(
    async (id: number) => {
      try {
        setIsAPILoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/cartridge/deleteCart`,
          {
            method: 'POST',
            body: JSON.stringify({
              id: id,
            }),
          }
        );
        const data = await res.json();
        //if we get data back from the API, we know the delete was a success
        setIsAPILoading(false);
        if (data) {
          mutate();
          mutateData();
          setEditCartOpen(false);
        }
      } catch (err) {
        console.log(err);
      }
    },
    [setIsAPILoading, mutate, setEditCartOpen, mutateData]
  );

  return (
    <>
      {confirmDeleteOpened && (
        <DeleteCartridgeAlert
          confirmDeleteOpened={confirmDeleteOpened}
          setConfirmDeleteOpened={setConfirmDeleteOpened}
          deleteCartridge={deleteCartridge}
          id={cart.id}
        />
      )}
      {!confirmDeleteOpened && (
        <div style={{ textAlign: 'center' }}>
          <Button
            size="xs"
            type="submit"
            color="red"
            leftIcon={<IconAlertTriangle />}
            onClick={() => setConfirmDeleteOpened(!confirmDeleteOpened)}
          >
            Delete Cartridge
          </Button>
        </div>
      )}
    </>
  );
};

export default CartridgeDeleteForm;
