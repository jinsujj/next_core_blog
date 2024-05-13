declare module 'react-responsive-masonry' {
  import { ReactNode, ComponentType, ReactElement } from 'react';

  interface ResponsiveMasonryProps {
    columnsCountBreakPoints?: Record<number, number>;
    children?: ReactNode;
  }

  interface MasonryProps {
    columnsCount?: number;
    gutter?: string | number;
    children?: ReactNode;
  }

  export const ResponsiveMasonry: React.FC<ResponsiveMasonryProps>;
  export default function Masonry(props: MasonryProps): ReactElement;
}
