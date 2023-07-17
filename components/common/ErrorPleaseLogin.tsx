import { Overlay } from '@mantine/core';
import { ProfileButton } from './Buttons';
import { useRouter } from 'next/router';

const ErrorPleaseLogin = () => {
  const router = useRouter();
  return (
    <Overlay center>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h2>Error. Please log in.</h2>
        <ProfileButton text="Log In" callback={() => router.push('/')} />
      </div>
    </Overlay>
  );
};

export default ErrorPleaseLogin;
