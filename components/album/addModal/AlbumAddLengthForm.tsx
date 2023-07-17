import { forwardRef, Dispatch, SetStateAction, useState, useMemo } from 'react';
import dayjs from 'dayjs';

//MANTINE
import {
  RingProgress,
  Slider,
  NumberInput,
  Text,
  Button,
  Select,
  Group,
} from '@mantine/core';
import { IconVinyl } from '@tabler/icons-react';

import { poppins } from '../../common/fonts';

//INTERFACES
import { CartridgeDataInterface } from '../../../hooks/useGetCartridgeList';
export interface AlbumDataInterface {
  hasAlbumLength: boolean;
  totalTime: string;
  totalTimeInMinutes: number;
  blurb: string;
}

interface SelectDataInterface {
  value: string;
  label: string;
  description: string;
}

interface FormPropsInterface {
  albumData: AlbumDataInterface;
  cartridgeData: CartridgeDataInterface;
  runtime: number | '';
  updateRuntime: (time: number) => void;
  sliderRuntime: number | null;
  percentListenedTo: number;
  setPercentListenedTo: Dispatch<SetStateAction<number>>;
  calculatedPercentListenedTo: number | null;
  submitAlbumTime: (
    cartId: string | null,
    sliderRuntime: number | null
  ) => Promise<void>;
  hasError: boolean;
}

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  description: string;
}

//helper Fncs
//cart select component
const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, description, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <div>
          <Text size="md">{label}</Text>
          <Text size="sm" opacity={0.65}>
            {description}
          </Text>
        </div>
      </Group>
    </div>
  )
);

SelectItem.displayName = 'SelectItem';

const AlbumAddLengthForm = ({
  formProps,
}: {
  formProps: FormPropsInterface;
}) => {
  //all the things we're bringing into the form
  const {
    albumData,
    cartridgeData,
    runtime,
    updateRuntime,
    sliderRuntime,
    percentListenedTo,
    setPercentListenedTo,
    calculatedPercentListenedTo,
    submitAlbumTime,
    hasError,
  } = formProps;
  //to autofill the cart list initial val
  const firstCartInList = useMemo(() => {
    if (cartridgeData.cartridges.length > 0) {
      return cartridgeData.cartridges[0].id.toString();
    } else {
      return null;
    }
  }, [cartridgeData.cartridges]);

  //holds the cartridge selected to add time to
  const [selectedCartridge, setSelectedCartridge] = useState<string | null>(
    firstCartInList || null
  );

  //if we get no cartridges returned, don't allow submission
  const [hasCartridges, setHasCartridges] = useState<boolean>(false);

  //grab our list of cartridges
  //if the returned cartridgeList is blank (the user doesn't yet have a cart registered),
  //then it returns a dummy select element.
  const cartridgeSelectData = useMemo((): SelectDataInterface[] => {
    if (cartridgeData.cartridges && cartridgeData.cartridges.length > 0) {
      setHasCartridges(true);
      return cartridgeData.cartridges.map((cartridge) => {
        return {
          value: cartridge.id.toString(),
          label: cartridge.name,
          description: `Registered ${dayjs(cartridge.created_at).format(
            'MM/DD/YYYY'
          )}`,
        };
      });
    } else {
      return [
        {
          value: '1',
          label: 'No cartridges found',
          description: 'Please add a cartridge',
        },
      ];
    }
  }, [cartridgeData.cartridges]);

  return (
    <>
      <div style={{ paddingBottom: '2rem', marginBottom: '2rem' }}>
        <div style={{ marginTop: '1rem' }} />
        <Text fw={700} size={'1.4rem'} style={poppins.style} color="blue.5">
          Cartridge
        </Text>
        <Select
          label="Choose a cartridge"
          placeholder="Pick one"
          itemComponent={SelectItem}
          data={cartridgeSelectData}
          size="md"
          maxDropdownHeight={400}
          selectOnBlur={true}
          nothingFound="Nobody here"
          filter={(value, item) =>
            item?.label?.toLowerCase().includes(value.toLowerCase().trim()) ||
            item?.description
              ?.toLowerCase()
              .includes(value.toLowerCase().trim())
          }
          value={selectedCartridge || firstCartInList}
          onChange={setSelectedCartridge}
          styles={(theme) => ({
            root: {
              maxWidth: '300px',
            },
          })}
        />
        <div style={{ marginTop: '2rem' }} />
        <Text fw={700} size={'1.4rem'} style={poppins.style} color="blue.5">
          Album Length
        </Text>
        {albumData?.hasAlbumLength && (
          <Text mt="1" size="md">
            Discogs album length:{' '}
            <b>{`${albumData.totalTimeInMinutes} minutes`}</b>
          </Text>
        )}
        {!albumData?.hasAlbumLength && (
          <Text mt="1" size="md">
            Unfortunately, Discogs does not have the length for this album.
            Check the synopsis above for a suggested length. Please enter the
            length (in minutes) manually.
          </Text>
        )}{' '}
        <div style={{ marginTop: '20px' }} />
        <NumberInput
          value={runtime}
          onChange={updateRuntime}
          stepHoldDelay={500}
          stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
          placeholder="Record length"
          label="Record length"
          description="Length of record to nearest minute"
          error={hasError ? 'Invalid entry' : ''}
          precision={0}
          radius="md"
          required
          type="number"
          min={5}
          step={1}
          size="md"
          styles={(theme) => ({
            root: {
              maxWidth: '300px',
            },
          })}
        />
        <div style={{ marginTop: '20px' }} />
        {sliderRuntime && runtime && typeof percentListenedTo === 'number' && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}
          >
            <div style={{ flexGrow: 1 }}>
              <Text mt="md" size="sm">
                Percent Listened To:
              </Text>
              <Slider
                value={percentListenedTo}
                onChange={setPercentListenedTo}
                label={(value) => `${value}%`}
                min={0}
                max={100}
                step={10}
                color="red"
                labelTransition="skew-down"
                labelTransitionDuration={150}
                labelTransitionTimingFunction="ease"
              />
            </div>
            <div>
              {/* <div style={{ marginTop: '20px' }} /> */}

              <RingProgress
                sections={[{ value: percentListenedTo, color: 'red' }]}
                label={
                  <Text color="white" weight={700} align="center" size="xl">
                    {percentListenedTo}%
                  </Text>
                }
              />
            </div>
          </div>
        )}
        <>
          <Text mt={1} size="lg">
            Album time to track:{' '}
            <b>
              {calculatedPercentListenedTo
                ? `${calculatedPercentListenedTo} minutes`
                : 'none'}
            </b>
          </Text>
        </>
        <div style={{ marginTop: '3rem' }} />
        <Button
          color="red"
          type="submit"
          fullWidth
          leftIcon={<IconVinyl />}
          radius="lg"
          size="lg"
          disabled={
            calculatedPercentListenedTo &&
            calculatedPercentListenedTo > 0 &&
            hasCartridges &&
            selectedCartridge &&
            !hasError
              ? false
              : true
          }
          onClick={() => submitAlbumTime(selectedCartridge, sliderRuntime)}
        >
          Save This Record
        </Button>
        <div style={{ marginTop: '1.5rem' }} />
      </div>
    </>
  );
};

export default AlbumAddLengthForm;
