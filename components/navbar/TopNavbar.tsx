import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { deleteCookie, hasCookie } from 'cookies-next';
import { useEffect, useState, useCallback } from 'react';

//MANTINE
import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  Button,
  rem,
  Drawer,
  Stack,
  Text,
  Affix,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { poppins } from '../common/fonts';

const useStyles = createStyles((theme) => ({
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'hsla(351, 74%, 45%, 1)',
  },

  links: {
    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },

  buttons: {
    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('xs')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: 'white',
    fontSize: theme.fontSizes.lg,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: '#e33649',
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: '#78020f',
      color: 'white',
    },
  },
}));

interface HeaderSimpleProps {
  links: { link: string; label: string }[];
}

const TopNavbar = ({ links }: HeaderSimpleProps) => {
  const router = useRouter();

  //For hamburger.
  const [opened, { toggle }] = useDisclosure(false);

  //take login/out buttons off top navbar when burger active
  // const isMobile = useMediaQuery('(max-width: 575px)');

  //Get cookies to determine if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  //Logout callback
  const logout = useCallback(async () => {
    deleteCookie('username', { path: '/' });
    deleteCookie('isLoggedIn', { path: '/' });
    deleteCookie('CookieConsent', { path: '/' });
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/logout`);
    router.push('/');
  }, [router]);

  //Callback which checks if the user is logged in by seeing if username has been set
  const getDiscogsCookies = useCallback(() => {
    const hasLoginCookie = hasCookie('isLoggedIn');
    if (!isLoggedIn) {
      if (hasLoginCookie) {
        setIsLoggedIn(true);
      }
      if (!hasLoginCookie) {
        setIsLoggedIn(false);
      }
    }
  }, [isLoggedIn]);

  //Runs username check
  useEffect(() => {
    getDiscogsCookies();
  }, [getDiscogsCookies, logout]);

  const { classes, cx } = useStyles();

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={cx(classes.link, {
        [classes.linkActive]: router.pathname === link.link,
      })}
      onClick={(event) => {
        event.preventDefault();
        router.push(link.link);
      }}
    >
      <Text style={poppins.style}>{link.label}</Text>
    </a>
  ));

  if (isLoggedIn) {
    return (
      <>
        <Drawer
          opened={opened}
          onClose={toggle}
          onClick={toggle}
          transitionProps={{ duration: 250, transition: 'slide-left' }}
          title={
            <Link href="/">
              <Image
                src="/static/images/discogs-rs-logo.png"
                alt="Discogs Logo"
                width={194}
                height={40}
                priority
              />
            </Link>
          }
        >
          <>
            {isLoggedIn && (
              <>
                <Stack spacing={8} mb={'8rem'}>
                  {items}
                </Stack>
                <Button variant="white" color="pink" onClick={() => logout()}>
                  Log Out
                </Button>
              </>
            )}
          </>
        </Drawer>
        <Affix position={{ top: 0, left: 0 }}>
          <Header
            height={60}
            mb={0}
            style={{
              backgroundColor: 'hsla(351, 74%, 45%, 1)',
              width: '100dvw',
            }}
          >
            <Container className={classes.header}>
              <Link href="/">
                <Image
                  src="/static/images/discogs-rs-logo.png"
                  alt="Discogs Logo"
                  width={194}
                  height={40}
                  priority
                />
              </Link>
              {isLoggedIn && (
                <>
                  <Group spacing={5} className={classes.links}>
                    {items}
                  </Group>
                  <div className={classes.buttons}>
                    <Button
                      variant="white"
                      color="pink"
                      onClick={() => logout()}
                    >
                      Log Out
                    </Button>
                  </div>
                </>
              )}
              <Burger
                opened={opened}
                onClick={toggle}
                className={classes.burger}
                size="sm"
              />
            </Container>
          </Header>
        </Affix>
      </>
    );
  }
};

export default TopNavbar;
