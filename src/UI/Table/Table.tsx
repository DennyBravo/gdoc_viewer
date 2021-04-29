import React, { Component, createRef } from 'react';
import cn from 'classnames';
import compare from 'compareq';
import pick from 'lodash.pick';
import { Button, VirtualizedTable } from 'mx-ui';

import S from './Table.styl';
import * as T from './Table.types';
import * as H from './Table.helpers';
import { omit } from 'App/App.helpers';

const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_SORT_DIRECTION = 'asc' as T.SortDirection;

class Table extends Component<T.Props, T.State> {
  headerRow = createRef<HTMLTableRowElement>();

  static defaultProps = {
    pageSize: DEFAULT_PAGE_SIZE,
  };

  state = {
    data: [],
    page: 1,
    loading: false,
    sortBy: null,
    sortDirection: DEFAULT_SORT_DIRECTION,
  };

  componentDidMount() {
    this.reload();
  }

  componentDidUpdate(prevProps) {
    const searchParamsChanged = !compare(
      prevProps.searchParams,
      this.props.searchParams
    );

    if (searchParamsChanged) this.reload();
  }

  async getData(updateState, additionalParams) {
    const { getData, pageSize, searchParams } = this.props;
    const { sortBy, sortDirection, page } = this.state;
    const params = {
      page,
      pageSize,
      sortBy,
      sortDirection,
      ...searchParams,
      ...additionalParams,
    };

    this.setState({
      loading: true,
      ...pick(params, ['page', 'sortBy', 'sortDirection']),
    });
    // @ts-ignore
    const newData = await getData(params);
    const data = updateState(newData);

    this.setState({ loading: false, data });
  }

  loadNext = () => {
    this.getData(data => [...this.state.data, ...data]);
  };

  reload = () => {
    this.getData(data => data, { page: 1 });
  };

  getColumnWidth({ widthRatio = 1, minWidth, fixedWidth }) {
    if (fixedWidth)
      return { width: fixedWidth, minWidth };

    const tableWidth = this.headerRow.current?.offsetWidth;
    const width = tableWidth
      ? (tableWidth / this.props.columns.length) * widthRatio
      : 'auto';

    return { width, minWidth };
  }

  getAlignClass = (align = 'left') => {
    switch (align) {
      case 'right':
        return S.alignRight;
      case 'center':
        return S.alignCenter;
      default:
        return S.alignLeft;
    }
  };

  getSortParams(id) {
    const { sortBy, sortDirection } = this.state;
    const params = {
      sortDirection: 'asc',
      sortBy: id,
    } as T.SortParams;

    if (sortBy === id) {
      if (sortDirection === 'asc') {
        params.sortDirection = 'desc';
      } else {
        params.sortBy = null;
      }
    }

    return params;
  }

  onSortClick(id) {
    const { onSortChange } = this.props;
    const params = this.getSortParams(id);

    this.setState({ ...params, data: [] });
    if (onSortChange) onSortChange(params);
  }

  onScrollEnd = () => {
    const { totalCount, pageSize } = this.props;
    const page = this.state.page + 1;

    if (totalCount && totalCount / pageSize >= page) return;

    this.setState({ page }, this.loadNext);
  };

  renderSortButton(id, title) {
    const { sortBy, sortDirection } = this.state;
    let icon = 'sort';

    if (sortBy === id) {
      if (sortDirection === 'asc') icon += '-up';
      if (sortDirection === 'desc') icon += '-down';
    }

    return (
      <Button
        size="s"
        variant="clear"
        className={S.sortButton}
        onClick={() => this.onSortClick(id)}
      >
        {title}
        <Icon type={icon as IconType} />
      </Button>
    );
  }

  renderHeader = () => {
    const { columns } = this.props;

    const cols = columns.map(
      ({ id, title, isSortable, align, widthRatio, minWidth, fixedWidth }, i) => (
        <th
          key={id}
          className={this.getAlignClass(align)}
          style={this.getColumnWidth({ widthRatio, minWidth, fixedWidth })}
        >
          {isSortable ? (
            this.renderSortButton(id, title)
          ) : (
            <div className={S.cellInner}>{title}</div>
          )}
        </th>
      )
    );

    return (
      <tr className={S.row} ref={this.headerRow}>
        {cols}
      </tr>
    );
  };

  renderFooter = () => {
    const { data } = this.state;
    const { columns, getTotalRow, getAverageRow } = this.props;
    const totalRowData = getTotalRow?.();
    const averageRowData = getAverageRow?.();

    if (!totalRowData && !averageRowData) return null;

    const total =
      data.length &&
      totalRowData &&
      columns.map(colParams => (
        <th key={colParams.id} className={this.getAlignClass(colParams.align)}>
          <div className={S.cellInner}>
            {H.renderCell(totalRowData, colParams)}
          </div>
        </th>
      ));

    const average =
      data.length &&
      averageRowData &&
      columns.map(colParams => (
        <th key={colParams.id} className={this.getAlignClass(colParams.align)}>
          <div className={S.cellInner}>
            {H.renderCell(averageRowData, colParams)}
          </div>
        </th>
      ));

    const footerRows = [];
    if (total) footerRows.push(<tr className={S.row}>{total}</tr>);
    if (average) footerRows.push(<tr className={S.row}>{average}</tr>);

    return footerRows;
  };

  renderRow = row => {
    const { columns, virtualizedParams } = this.props;
    const { itemHeight } = virtualizedParams;
    const rowData = this.state.data[row.key];
    const { onRowClick } = this.props;
    const props = omit(this.props, [ 'onRowClick', 'getData', 'pageSize', 'virtualizedParams' ]);

    if (!rowData) return null;

    return (
      <tr {...props } key={rowData?.id} onClick={() => onRowClick?.(rowData)}>
        {columns.map(colParams => (
          <td className={this.getAlignClass(colParams.align)}>
            <div
              className={S.cellInner}
              style={{ maxHeight: itemHeight, minHeight: itemHeight }}
            >
              {H.renderCell(rowData, colParams)}
            </div>
          </td>
        ))}
      </tr>
    );
  };

  render() {
    const { virtualizedParams, onRowClick, className } = this.props;
    const { data, loading } = this.state;
    const classes = cn(S.table, loading && S.loading, className);
    const props = {
      ...virtualizedParams,
      itemsCount: data.length as number,
    };

    return (
      <VirtualizedTable
        className={classes}
        thead={this.renderHeader()}
        tfoot={this.renderFooter()}
        {...props}
        renderItem={props => this.renderRow({ ...props, onRowClick })}
        onScrollEnd={this.onScrollEnd}
      />
    );
  }
}

export default Table;
