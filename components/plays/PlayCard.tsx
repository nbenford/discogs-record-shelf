import { memo, useState } from 'react';

import dayjs from 'dayjs';

//MANTINE
import { Card, Grid, ActionIcon, Group, Text } from '@mantine/core';
import { IconX, IconExternalLink } from '@tabler/icons-react';

//COMPONENTS
import { PlayTableDeleteModal } from './PlayDeleteModal';
import { PlayCardDropdown } from './PlayCardDropdown';

//INTERFACE
import { PlayTableCardInterface } from './PlayTable';

import styles from './plays.module.css';
import { poppins } from '../common/fonts';

const PlayTableCard = ({ album, setIsAPILoading }: PlayTableCardInterface) => {
  //delete modal state
  const [deletePromptOpen, setDeletePromptOpen] = useState<boolean>(false);

  return (
    <>
      <Grid.Col xs={12} lg={12} xl={12}>
        <Card className={styles.playCard}>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart" noWrap>
              <Text truncate fw={500} size="1.2rem" style={poppins.style}>
                {album?.title}
              </Text>
              <ActionIcon
                color="red"
                variant="outline"
                size="xs"
                onClick={() => {
                  setDeletePromptOpen(true);
                }}
              >
                <IconX stroke={4} size="1rem" />
              </ActionIcon>
            </Group>
            <Text
              weight={600}
              size="1.2rem"
              color="blue.5"
              truncate
              style={poppins.style}
            >
              {album?.artist}
            </Text>
          </Card.Section>

          <div style={{ marginTop: '8px' }} />
          <Group position="apart">
            <Text size="sm" color="dimmed" fs="italic" style={poppins.style}>
              {dayjs(album?.created_at).format('MMM DD, YYYY')}
            </Text>
            <Text size="sm" color="dimmed" style={poppins.style}>
              {album?.minutesPlayed} min
            </Text>
          </Group>
          <div style={{ marginTop: '10px' }} />
          <Group position="apart">
            <Text size="sm" color="dimmed" style={poppins.style}>
              Cartridge:{' '}
              <Text
                color="teal"
                weight={700}
                size="md"
                component="span"
                fs={album['albumCartridge.name'] ? '' : 'italic'}
              >
                {album['albumCartridge.name']
                  ? album['albumCartridge.name']
                  : 'Deleted'}
              </Text>
            </Text>

            <Text
              color="green.5"
              fw={600}
              size={'0.9rem'}
              style={poppins.style}
            >
              <a
                href={`https://www.discogs.com/release/${album?.albumId}`}
                target="_blank"
              >
                Discogs <IconExternalLink stroke={3} size="0.9rem" />
              </a>
            </Text>
          </Group>
        </Card>
        <PlayCardDropdown id={album.albumId} masterId={album.masterId} />
      </Grid.Col>
      <PlayTableDeleteModal
        deletePromptOpen={deletePromptOpen}
        setDeletePromptOpen={setDeletePromptOpen}
        setIsAPILoading={setIsAPILoading}
        id={album.id}
      />
    </>
  );
};

export const PlayCard = memo(PlayTableCard);
