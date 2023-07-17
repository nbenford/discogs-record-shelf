import { ReactNode } from 'react';
const StyledMessage = ({ text }: { text: string }): ReactNode => {
  return (
    <div
      style={{
        height: '100%',
        textAlign: 'center',
        paddingTop: '3rem',
        backgroundColor: 'hsla(251, 38%, 6%, 1)',
      }}
    >
      <h2>{text}</h2>
    </div>
  );
};

export default StyledMessage;
