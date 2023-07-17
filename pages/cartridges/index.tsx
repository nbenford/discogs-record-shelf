import dynamic from 'next/dynamic';
import { useMemo } from 'react';

//COMPONENTS
import SEO from '../../components/seo';
import DotLoader from '../../components/common/DotLoader';
import {
  HeaderTextWhite,
  HeaderTextRedSmall,
} from '../../components/common/Headers';
import ErrorPleaseLogin from '../../components/common/ErrorPleaseLogin';

import StyledMessage from '../../components/common/StyledMessage';

const CartridgeTable = dynamic(
  () => import('../../components/cartridge/CartridgeTable'),
  {
    loading: () => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '18px',
          width: '100%  ',
        }}
      >
        <Loader color="red" variant="dots" />
      </div>
    ),
  }
);

//INTERFACES

//HOOKS
import { useGetCartridgeList } from '../../hooks/useGetCartridgeList';

//STYLE
import styles from '../../components/common/headers.module.css';

//MANTINE
import { Title, Loader, Paper } from '@mantine/core';

const CartridgeList = () => {
  //STATE

  //Grab our user profile and cartridge list
  const { cartridgeData, error, isLoading, isValidating } =
    useGetCartridgeList();

  //true if data contains more that zero cartridges
  const hasCartridges = useMemo(() => {
    if (cartridgeData && cartridgeData?.cartridges?.length > 0) {
      return true;
    } else {
      return false;
    }
  }, [cartridgeData]);

  //if we're not loading and we have data, return true
  const isReady = useMemo(() => {
    if (cartridgeData && !isLoading && !isValidating) {
      return true;
    }
    return false;
  }, [cartridgeData, isLoading, isValidating]);

  //loading/error returns
  if (error) return <StyledMessage text="Error: failed to load" />;

  //if no error or loading, return page
  return (
    <>
      <SEO pageDescription="Your Discogs profile" pageTitle="Discogs Profile" />
      <div className={styles.frontPageContainer}>
        <Paper className={styles.cartridgePaper}>
          <HeaderTextWhite>Cartridges</HeaderTextWhite>
          <HeaderTextRedSmall>
            Register and Track Stylus/Cartridge Wear
          </HeaderTextRedSmall>

          {!cartridgeData && !isLoading && !isValidating && (
            <ErrorPleaseLogin />
          )}

          {/* Table displays list of cartridges */}
          <div style={{ marginTop: '3rem' }} />

          {isReady && !hasCartridges && (
            <Title align="center" order={4} color="#f2f2f2">
              No cartridges listed
            </Title>
          )}

          <div style={{ marginTop: '2rem' }} />

          <CartridgeTable userCartridgeData={cartridgeData} />

          <div style={{ marginTop: '3rem' }} />

          {(isLoading || isValidating) && <DotLoader />}
        </Paper>
      </div>
    </>
  );
};

export default CartridgeList;
