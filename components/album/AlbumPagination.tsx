import { useState, useCallback, useEffect, useMemo } from 'react';

import { poppins } from '../common/fonts';

//MANTINE
import { Tabs, TabsValue, Drawer, Button, Text } from '@mantine/core';
import { IconCaretDown } from '@tabler/icons-react';

//INTERFACES
import { AlbumInterface } from '../../pages/albums';

interface PaginationPropsInterface {
  carouselCollection: AlbumInterface[];
  swiperRef: any;
  setLoadingScrollTo: any;
}

interface AlphabetInterface {
  [key: string]: number;
}

const AlbumPagination = ({
  carouselCollection,
  swiperRef,
  setLoadingScrollTo,
}: PaginationPropsInterface) => {
  //index value of the selected letter nav tab. Its value is the activeIndex of the first instance of the letter
  const [tabsValue, setTabsValue] = useState<TabsValue>(null);

  //drawer state
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  //the current index the swiper is viewing, or 1
  const swiperIndex = swiperRef?.activeIndex ? swiperRef?.activeIndex : 1;

  //when the letter nav is clicked, the swiper slides to the selected letter
  const slideToLetter = useCallback(
    async (index: number) => {
      setLoadingScrollTo(true);
      await swiperRef.slideTo(index, 800);
      setLoadingScrollTo(false);
      setDrawerOpen(false);
    },
    [setLoadingScrollTo, swiperRef]
  );

  //outputs an array of arrays as [['letter', firstIndexLetterAppears]]
  const alphaArray: [string, number][] = useMemo(() => {
    const letterIndexMap = carouselCollection.reduce(
      (acc: AlphabetInterface, album: AlbumInterface, index: number) => {
        let firstChar;

        if (
          album.basic_information.artists[0].name.substring(0, 4) === 'The '
        ) {
          firstChar = album.basic_information.artists[0].name
            .substring(4)
            .charAt(0)
            .toLowerCase();
        } else {
          firstChar = album.basic_information.artists[0].name
            .charAt(0)
            .toLowerCase();
        }

        const isLetter = /^[a-z]/i.test(firstChar.charAt(0));

        if (isLetter && !acc.hasOwnProperty(firstChar)) {
          return { ...acc, ...{ [firstChar]: index } };
        } else if (!isLetter && !acc.hasOwnProperty('#')) {
          return { ...acc, ...{ '#': index } };
        } else {
          return acc;
        }
      },
      {}
    );
    if (letterIndexMap && Object.entries(letterIndexMap).length > 2) {
      return Object.entries(letterIndexMap);
    } else {
      return [
        ['#', 0],
        ['a', 0],
        ['b', 0],
      ];
    }
  }, [carouselCollection]);

  //this compares the current active sldie index and alphaArray. It determines which
  //letters' indicies the activeIndex falls on or between and sets the active tab to it
  const getActiveTab = useMemo(() => {
    for (let i = 1; i < alphaArray.length - 1; i++) {
      if (
        swiperIndex >= alphaArray[i - 1][1] &&
        swiperIndex < alphaArray[i][1]
      ) {
        return alphaArray[i - 1][1].toString();
      } else if (
        swiperIndex >= alphaArray[i][1] &&
        swiperIndex < alphaArray[i + 1][1]
      ) {
        return alphaArray[i][1].toString();
      }
    }
    return alphaArray[alphaArray.length - 1][1].toString();
  }, [swiperIndex, alphaArray]);

  //sets the tab value when the active tab changes
  useEffect(() => {
    setTabsValue(getActiveTab);
  }, [getActiveTab]);

  //list of alphabetical tabs
  const tabs = alphaArray?.map(
    (letterIndex: [string, number | null], index) => {
      if (letterIndex) {
        return (
          <Tabs.Tab
            color="indigo.9"
            key={index}
            value={letterIndex[1]?.toString() || '0'}
            onClick={() => {
              slideToLetter(letterIndex[1] ? letterIndex[1] : 1);
            }}
          >
            <Text fw={600} color="red.6" size={'1.4rem'} style={poppins.style}>
              {letterIndex[0]}
            </Text>
          </Tabs.Tab>
        );
      }
    }
  );
  return (
    <div
      style={{
        backgroundColor: 'hsla(251, 38%, 6%, 1)',
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '10px',
      }}
    >
      <Button
        variant="subtle"
        color="blue.6"
        onClick={() => setDrawerOpen(!drawerOpen)}
        rightIcon={<IconCaretDown />}
        size="md"
        compact
      >
        <Text fw={600} color="blue.3" size={'1.2rem'} style={poppins.style}>
          Index
        </Text>
      </Button>
      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        position="top"
        overlayProps={{
          opacity: 0.1,
          blur: 3,
        }}
        transitionProps={{ duration: 300, transition: 'slide-down' }}
        styles={(theme) => ({
          content: {
            backgroundColor: 'hsla(251, 38%, 6%, 1)',
          },
        })}
        size={'minContent'}
        withCloseButton={false}
        padding={10}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingTop: '9px',
            paddingBottom: '9px',
          }}
        >
          <Tabs value={tabsValue} onTabChange={setTabsValue} variant="pills">
            <Tabs.List>{tabs}</Tabs.List>
          </Tabs>
        </div>
      </Drawer>
    </div>
  );
};

export default AlbumPagination;
