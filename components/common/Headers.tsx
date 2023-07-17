import { Title, Text } from '@mantine/core';
import styles from './headers.module.css';
import { poppins } from './fonts';
import { ReactNode } from 'react';

interface HeadersInterface {
  children: string | ReactNode;
}

export const HeaderTextWhite = ({ children }: HeadersInterface): ReactNode => {
  return (
    <>
      <Text span className={styles.discogsHeaderText} style={poppins.style}>
        {children}
      </Text>
    </>
  );
};
export const HeaderTextRed = ({ children }: HeadersInterface): ReactNode => {
  return (
    <>
      <Text className={styles.recordShelfText} style={poppins.style}>
        {children}
      </Text>
    </>
  );
};
export const HeaderTextRedLinebreak = ({
  children,
}: HeadersInterface): ReactNode => {
  return (
    <Text className={styles.recordShelfTextLinebreak} style={poppins.style}>
      {children}
    </Text>
  );
};

export const HeaderTextRedSmall = ({
  children,
}: HeadersInterface): ReactNode => {
  return (
    <Text className={styles.recordShelfTextSmall} style={poppins.style}>
      {children}
    </Text>
  );
};

export const SubheaderText = ({ children }: HeadersInterface): ReactNode => {
  return (
    <>
      <Title
        order={2}
        color="green.5"
        className={styles.subheaderText}
        style={poppins.style}
      >
        {children}
      </Title>
    </>
  );
};
export const BodyText = ({ children }: HeadersInterface): ReactNode => {
  return (
    <>
      <Text
        className={styles.descriptionText}
        color="blue.3"
        style={poppins.style}
      >
        {children}
      </Text>
    </>
  );
};
