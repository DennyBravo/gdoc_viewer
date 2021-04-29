import { ComponentType, ReactChild } from 'react';
import { Size, Props as ButtonProps } from 'mx-ui';

type ComponentProps = {
  className: string;
  size: Size;
  isActive: boolean;
};
export type Item = {
  id: string;
  title?: ReactChild;
  component?: ComponentType<ComponentProps>;
} & ButtonProps;

export type Props = {
  className?: string;
  items: Item[];
  active: string | null; // item id
  size?: Size;
  onChange: (e: React.MouseEvent<HTMLButtonElement>, id: string) => void;
};
