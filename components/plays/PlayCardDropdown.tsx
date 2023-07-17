import { memo, useState } from 'react';

//MANTINE
import { Accordion, Text, rem } from '@mantine/core';
import { IconVinyl } from '@tabler/icons-react';

//COMPONENTS
import { PlayCardDropdownContent } from './PlayCardDropdownContent';

import styles from './plays.module.css';
import { poppins } from '../common/fonts';

const PlayDropdown = ({ id, masterId }: { id: number; masterId: number }) => {
  // const [showAlbumInfo, setShowAlbumInfo] = useState<boolean>(false);
  const [accordionValue, setAccordionValue] = useState<string | null>(null);

  return (
    <Accordion
      chevronPosition="right"
      variant="separated"
      multiple={false}
      value={accordionValue}
      onChange={setAccordionValue}
      // onChange={() => setShowAlbumInfo(!showAlbumInfo)}
    >
      <Accordion.Item value={id.toString()} className={styles.playAlbumData}>
        <Accordion.Control icon={<IconVinyl size={rem(20)} color="#F76707" />}>
          <Text fw={600} color="#F76707" style={poppins.style}>
            Album Info
          </Text>
        </Accordion.Control>
        {accordionValue && (
          <PlayCardDropdownContent id={id} masterId={masterId} />
        )}
      </Accordion.Item>
    </Accordion>
  );
};

export const PlayCardDropdown = memo(PlayDropdown);
