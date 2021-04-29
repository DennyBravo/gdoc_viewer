import { path } from 'ramda';

import { ItemData, Column } from './Table.types';

export function renderCell(data: ItemData, colParams: Column) {
  const { id, dataAccessor, render } = colParams;

  if (render) return render(data);
  if (dataAccessor) return path(dataAccessor.split('.'), data);
  return data[id];
}
