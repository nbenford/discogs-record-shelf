import { useCallback, useState } from 'react';
import dayjs from 'dayjs';

//COMPONENTS

import CartridgeEditForm from '../../components/cartridge/CartridgeEditForm';
import CartridgeAddForm from '../../components/cartridge/CartridgeAddForm';
import { ProfileButton } from '../common/Buttons';

//MANTINE
import {
  ActionIcon,
  Card,
  Group,
  Grid,
  Text,
  Loader,
  Badge,
} from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';

//STYLES
import styles from './cartridge.module.css';

import { poppins } from '../common/fonts';

//INTERFACES
import { CartridgeInterface } from '../../hooks/useGetCartridgeList';

interface CartridgeDataProps {
  userCartridgeData: {
    username: string;
    id: number;
    cartridges: CartridgeInterface[];
  };
}

const CartridgeTable = ({ userCartridgeData }: CartridgeDataProps) => {
  //edit form selected cartridge id state
  const [selectedCart, setSelectedCart] = useState<CartridgeInterface>({
    id: 1,
    user_id: 1,
    name: '',
    totalMinutes: 0,
    maxHours: 0,
    active: true,
    created_at: 'date',
    updated_at: 'date',
  });
  //is true when API is engaged
  const [isAPILoading, setIsAPILoading] = useState<boolean>(false);

  //cartridge form state
  const [addCartOpen, setAddCartOpen] = useState<boolean>(false);
  const [editCartOpen, setEditCartOpen] = useState<boolean>(false);

  //edit modal callback
  const toggleEditModal = useCallback(
    (cart?: CartridgeInterface) => {
      if (cart) {
        setEditCartOpen(true);
        setSelectedCart(cart);
      }
    },
    [setSelectedCart, setEditCartOpen]
  );

  //color code the percent used
  const percentUsed = useCallback((cartridge: CartridgeInterface) => {
    const stylusUsedPercentage = Math.round(
      (cartridge.totalMinutes / 60 / cartridge.maxHours) * 100
    );

    if (stylusUsedPercentage < 80) {
      return (
        <Badge color="green" size="xl" variant="outline" fullWidth>
          {`${stylusUsedPercentage}%`} Used
        </Badge>
      );
    } else if (stylusUsedPercentage >= 80 && stylusUsedPercentage < 90) {
      return (
        <Badge color="yellow" size="xl" variant="outline" fullWidth>
          {`${stylusUsedPercentage}%`} Used
        </Badge>
      );
    } else {
      return (
        <Badge color="red" size="xl" variant="outline" fullWidth>
          {`${stylusUsedPercentage}%`} Used
        </Badge>
      );
    }
  }, []);

  const rows = userCartridgeData?.cartridges?.map((cartridge) => (
    <Grid.Col key={cartridge.id} xs={12} sm={6} lg={6}>
      <Card className={styles.cartridgeCard}>
        <Card.Section withBorder inheritPadding py="xs">
          <Group position="apart" noWrap>
            <Text
              truncate
              fw={600}
              style={poppins.style}
              size="1.2rem"
              color="blue.5"
            >
              {cartridge.name}
            </Text>
            <ActionIcon
              color="blue.9"
              variant="outline"
              size="sm"
              onClick={() => toggleEditModal(cartridge)}
            >
              <IconEdit />
            </ActionIcon>
          </Group>
        </Card.Section>
        <div style={{ marginTop: '8px' }} />

        <Text
          color="teal"
          weight={600}
          span
          style={poppins.style}
          size="1.2rem"
        >
          {percentUsed(cartridge)}
        </Text>
        <div style={{ marginTop: '8px' }} />
        <Group position="apart">
          <Text size="xs" color="dimmed" fs="italic" style={poppins.style}>
            Added {dayjs(cartridge.created_at).format('MMM DD, YYYY')}
          </Text>
          <Text size="xs" color="dimmed" fs="italic" style={poppins.style}>
            Updated {dayjs(cartridge.updated_at).format('MMM, DD, YYYY')}
          </Text>
        </Group>

        <div style={{ marginTop: '8px' }} />
        <Group position="apart">
          <Text size="sm" color="dimmed" style={poppins.style}>
            Logged:{' '}
            <Text span fw={600} style={poppins.style}>
              {Math.round(cartridge.totalMinutes / 60).toString()} hrs
            </Text>
          </Text>
          <Text size="sm" color="dimmed" style={poppins.style}>
            Max:{' '}
            <Text span fw={600} style={poppins.style}>
              {cartridge.maxHours.toString()} hrs
            </Text>
          </Text>
        </Group>
      </Card>
    </Grid.Col>
  ));

  if (isAPILoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '18px',
          width: '100%',
        }}
      >
        <Loader color="red" variant="dots" />
      </div>
    );
  }

  if (addCartOpen && !editCartOpen) {
    return (
      <CartridgeAddForm
        setAddCartOpen={setAddCartOpen}
        setIsAPILoading={setIsAPILoading}
      />
    );
  }

  if (!addCartOpen && editCartOpen) {
    return (
      <CartridgeEditForm
        setEditCartOpen={setEditCartOpen}
        setIsAPILoading={setIsAPILoading}
        cart={selectedCart}
      />
    );
  }

  if (!addCartOpen && !editCartOpen && !isAPILoading) {
    return (
      <>
        {rows && (
          <Grid w="100%" m={0}>
            {rows}
          </Grid>
        )}
        <div style={{ marginTop: '30px' }} />
        {
          <ProfileButton
            isFullWidth={true}
            text="Add New Cartridge"
            callback={() => setAddCartOpen(!addCartOpen)}
          />
        }
      </>
    );
  }
};

export default CartridgeTable;
