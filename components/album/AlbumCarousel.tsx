import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { getCookie } from 'cookies-next';

//MANTINE
import { Progress, Loader, LoadingOverlay } from '@mantine/core';

//CSS
import 'swiper/css';
import 'swiper/css/a11y';
import 'swiper/css/keyboard';
import 'swiper/css/mousewheel';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'swiper/css/virtual';

//STYLES
import styles from './carousel.module.css';

//COMPONENTS
const AlbumPagination = dynamic(() => import('./AlbumPagination'));
import RedLoader from '../common/RedLoader';
import { AlbumCard } from './card/AlbumCard';
import ErrorPleaseLogin from '../common/ErrorPleaseLogin';
import { HeaderTextRedSmall, BodyText } from '../common/Headers';

//SWIPER
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  // EffectCoverflow,
  Mousewheel,
  Pagination,
  Keyboard,
  A11y,
  Navigation,
  FreeMode,
  Virtual,
} from 'swiper/modules';

//INTERFACES
import { AlbumInterface } from '../../pages/albums';
import { SWRInfinitePropsInterface } from '../../hooks/useGetAlbumData';

export interface CarouselProps extends SWRInfinitePropsInterface {
  carouselCollection: AlbumInterface[];
  pagination: { page: number; pages: number; items: number };
  perPage: number;
}

//check if logged in
const loggedIn = getCookie('isLoggedIn');

const AlbumCarousel = ({
  carouselCollection,
  setSize,
  size,
  pagination,
  isValidating,
  perPage,
}: CarouselProps) => {
  //pagination index; value * 2 is total albums (we display 2 albums per group)
  const [currentAlbumGroupIndex, setCurrentAlbumGroupIndex] = useState(1);
  const [swiperRef, setSwiperRef] = useState<any | null>(null);

  //Loading screen while waiting for scroll to page
  const [loadingScrollTo, setLoadingScrollTo] = useState<boolean>(false);

  //Triggers call to grab next page of albums so long as we are not on the last page
  const nextPageCallback = useCallback(
    (i: number) => {
      // if (size < pagination.pages) {
      setSize(i + 1);
      // }
    },
    [setSize]
  );

  //fetch all the pages at once
  //required for alphabetical pagination
  useEffect(() => {
    for (let i = 1; i < pagination.pages; i++) {
      nextPageCallback(i);
    }
  }, [pagination.pages, nextPageCallback]);

  const carouselArray = carouselCollection?.map((album, index) => (
    <SwiperSlide
      key={album.id}
      className={styles.swiperSlide}
      virtualIndex={index}
    >
      {({ isActive, isPrev, isNext }) => (
        <div>
          <AlbumCard
            image={album.basic_information.cover_image}
            title={`${album?.basic_information.title.substring(0, 50)}${
              album?.basic_information.title.length >= 50 ? '...' : ''
            }`}
            fullTitle={album?.basic_information.title}
            artist={album?.basic_information.artists[0].name}
            id={album?.id}
            masterId={album?.basic_information.master_id}
            isVisible={isActive || isPrev || isNext}
            isValidating={isValidating}
          />
        </div>
      )}
    </SwiperSlide>
  ));

  if (!loggedIn) {
    return <ErrorPleaseLogin />;
  }

  return (
    <>
      {/* When scrolling to a page, the loader displays while data is downloaded */}
      {carouselCollection[0] !== undefined && (
        <>
          <LoadingOverlay
            visible={loadingScrollTo || !!isValidating}
            overlayBlur={1}
            zIndex={10}
            loader={<RedLoader />}
          />
          {/* Shows progress through the collection */}
          <>
            <Progress
              value={(currentAlbumGroupIndex / pagination.items) * 100}
              aria-label="Collection progress"
              color={'#4c6acfff'}
              size="xl"
              radius={0}
            />
            <AlbumPagination
              carouselCollection={carouselCollection}
              swiperRef={swiperRef}
              setLoadingScrollTo={setLoadingScrollTo}
            />
          </>
          <div className={styles.swiperBody}>
            <Swiper
              onSwiper={(swiper) => setSwiperRef(swiper)}
              onSlideChange={(swiper) => {
                setCurrentAlbumGroupIndex(swiper.activeIndex);
              }}
              // slidesPerView={2}
              virtual={{ enabled: true, addSlidesAfter: 6, addSlidesBefore: 6 }}
              freeMode={{
                enabled: true,
                sticky: true,
                momentumRatio: 0.5,
                // momentumVelocityRatio: 0.5,
              }}
              // effect="coverflow"
              // autoHeight={true}
              direction="horizontal"
              grabCursor={true}
              watchSlidesProgress={true}
              centeredSlides={true}
              mousewheel={{ thresholdDelta: 5 }}
              navigation={true}
              centerInsufficientSlides={true}
              slideToClickedSlide={true}
              coverflowEffect={{
                rotate: 20,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: false,
              }}
              breakpoints={{
                //width in px, >= number
                10: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                // 650: {
                //   slidesPerView: 1,
                //   spaceBetween: 30,
                // },
                850: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                1250: {
                  slidesPerView: 2,
                  spaceBetween: 40,
                },
              }}
              keyboard={true}
              // maxBackfaceHiddenSlides: 3,
              // cssMode={true}
              a11y={{
                prevSlideMessage: 'Previous album group',
                nextSlideMessage: 'Next album group',
              }}
              modules={[
                // EffectCoverflow,
                Mousewheel,
                Pagination,
                Keyboard,
                A11y,
                Navigation,
                FreeMode,
                Virtual,
              ]}
              className={`mySwiper ${styles.swiper}`}
              // onReachEnd={() => nextPageCallback(size)}
            >
              {carouselArray}

              {/* shows loading slide while getting more data */}
              {isValidating && (
                <SwiperSlide
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    width: '100%',
                    padding: '18px',
                    aspectRatio: 1,
                  }}
                >
                  <Loader color="red" size="xl" variant="bars" />
                </SwiperSlide>
              )}
            </Swiper>
          </div>
        </>
      )}
      {carouselCollection[0] === undefined && !isValidating && loggedIn && (
        <div style={{ marginTop: '5rem', paddingLeft: '2rem' }}>
          <HeaderTextRedSmall>
            There are no albums in your collection.
          </HeaderTextRedSmall>
          <div style={{ marginTop: '2rem' }} />
          <BodyText>
            Please add an album on{' '}
            <a
              href="https://discogs.com"
              style={{ textDecoration: 'underline' }}
            >
              Discogs.com
            </a>
          </BodyText>
        </div>
      )}
    </>
  );
};

export default AlbumCarousel;
