import { ReactNode } from 'react';
import { VirtualizedTypes } from 'mx-ui';

export type ItemData = { [key: string]: any };
export type Data = ItemData[];

export type Column = {
  id: number | string;
  title: ReactNode;
  isSortable?: boolean;
  align?: 'center' | 'right' | 'left';
  minWidth?: number | string;
  fixedWidth?: number | string;
  widthRatio?: number; // default - 1
  render?: (data: ItemData) => ReactNode; // fallback to  `data[dataAccessor]`
  dataAccessor?: string; // path(dataAccessor.split('.'), data); fallback to `data[id]`
};

export type SortBy = Column['id'] | null;
export type SortDirection = 'asc' | 'desc';

export type SortParams = {
  sortBy: SortBy;
  sortDirection: SortDirection;
};

export type VirtualizedParams = Pick<
  VirtualizedTypes.Props,
  'itemHeight' | 'totalCount' | 'overlapCount'
> & { maxHeight: string | number };

export type GetDataParams = {
  page: number;
  pageSize: number;
};

export type Props = {
  columns: Column[];
  pageSize?: number;
  getData: (params: GetDataParams) => Promise<Data>;
  onSortChange?: (params: SortParams) => void;
  searchParams?: any;
  virtualizedParams: VirtualizedParams;
  getTotalRow?: Function;
  getAverageRow?: Function;
  onRowClick?: Function;
  className?: string;
} & Partial<SortParams>;

export type State = {
  data: Data;
  page: number;
  loading: boolean;
} & SortParams;
