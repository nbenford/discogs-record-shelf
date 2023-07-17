import { Button } from '@mantine/core';
import { ReactNode } from 'react';

interface ButtonInterface {
  text: string;
  onClick: (e: any) => void;
  disabled?: boolean;
  size?: string;
  fullWidth?: boolean;
}

export const GradientButton = ({
  text,
  onClick,
  disabled,
  size = 'lg',
  fullWidth = false,
}: ButtonInterface): ReactNode => {
  return (
    <Button
      variant="gradient"
      gradient={{ from: 'indigo', to: 'red' }}
      radius="md"
      onClick={(e) => onClick(e)}
      disabled={disabled}
      size={size}
      fullWidth={fullWidth}
    >
      {text}
    </Button>
  );
};

export const ProfileButton = ({
  text,
  callback,
  disabled = false,
  isFullWidth = false,
  compact = false,
  type = 'button',
  color = 'green.5',
  variant = 'outline',
}: {
  text: string;
  callback: (e: any) => void;
  isFullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  compact?: boolean;
  color?: string;
  variant?:
    | 'outline'
    | 'white'
    | 'light'
    | 'default'
    | 'filled'
    | 'gradient'
    | 'subtle';
}) => (
  <>
    <Button
      styles={{
        root: {
          '&:disabled': {
            backgroundColor: 'transparent',
          },
        },
      }}
      variant={variant}
      color={color}
      fullWidth={isFullWidth}
      disabled={disabled}
      radius="md"
      size="lg"
      type={type}
      compact={compact}
      onClick={callback}
    >
      {text}
    </Button>
  </>
);
