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
      <Title
        order={1}
        className={styles.discogsHeaderText}
        style={poppins.style}
        data-testid="title"
      >
        {children}
      </Title>
    </>
  );
};
export const HeaderTextRed = ({ children }: HeadersInterface): ReactNode => {
  return (
    <>
      <Title
        order={2}
        className={styles.recordShelfText}
        style={poppins.style}
        data-testid="subtitle"
      >
        {children}
      </Title>
    </>
  );
};
export const HeaderTextRedLinebreak = ({
  children,
}: HeadersInterface): ReactNode => {
  return (
    <Title
      order={2}
      className={styles.recordShelfTextLinebreak}
      style={poppins.style}
      data-testid="subtitle"
    >
      {children}
    </Title>
  );
};

export const HeaderTextRedSmall = ({
  children,
}: HeadersInterface): ReactNode => {
  return (
    <Title
      order={2}
      className={styles.recordShelfTextSmall}
      style={poppins.style}
      data-testid="subtitle"
    >
      {children}
    </Title>
  );
};

export const SubheaderText = ({ children }: HeadersInterface): ReactNode => {
  return (
    <>
      <Title
        order={3}
        color="green.5"
        className={styles.subheaderText}
        style={poppins.style}
        data-testid="subtext"
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
