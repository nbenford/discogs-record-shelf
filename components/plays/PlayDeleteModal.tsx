import { useCallback, Dispatch, SetStateAction, memo } from 'react';
import { Modal, Group, Text, Button } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

//HOOKS
import useGetAlbumData from '../../hooks/useGetAlbumData';

//INTERFACE
export interface PlayTableDeleteModalInterface {
  deletePromptOpen: boolean;
  setDeletePromptOpen: Dispatch<SetStateAction<boolean>>;
  setIsAPILoading: Dispatch<SetStateAction<boolean>>;
  id: number | null;
}

const PlayDeleteModal = ({
  deletePromptOpen,
  setDeletePromptOpen,
  id,
  setIsAPILoading,
}: PlayTableDeleteModalInterface) => {
  //refresh data on edit
  const { mutate } = useGetAlbumData();

  //delete album callback
  const deleteAlbum = useCallback(
    async (id: number | null) => {
      try {
        setIsAPILoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/albums/deleteAlbum`,
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
        }
      } catch (err) {
        console.log(err);
      }
    },
    [setIsAPILoading, mutate]
  );
  return (
    <Modal
      opened={deletePromptOpen}
      withCloseButton
      onClose={() => setDeletePromptOpen(false)}
      size="lg"
      radius="md"
      title={
        <Text fw={700} size={'1.5rem'}>
          Confirm Delete
        </Text>
      }
    >
      <Text fw={400}>Are you sure you want to delete this entry?</Text>
      <Text fw={400} color="dimmed" mt={'15px'}>
        Time logged to cartridge will remain.
      </Text>
      <div style={{ marginTop: '50px' }} />
      <Group grow>
        <Button
          onClick={() => deleteAlbum(id)}
          type="submit"
          color="red"
          leftIcon={<IconAlertTriangle />}
        >
          Delete
        </Button>
        <Button onClick={() => setDeletePromptOpen(false)}>Cancel</Button>
      </Group>
    </Modal>
  );
};

export const PlayTableDeleteModal = memo(PlayDeleteModal);
