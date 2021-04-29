import React from 'react';
import { Button, Icon, Select, Input, Spinner } from 'mx-ui';

import Table from '../Table';
import { GetDataParams } from '../Table/Table.types';

import S from './FileView.styl';
import * as H from './FileView.helpers';

import { FieldConfig } from 'App/App.types';
import { KEY_QUERY, KEY_QUERY_TEMP, MAX_TABLE_HEIGHT } from 'App/App.constants';
import { upFirstLetter, copyToClipboard } from 'App/App.helpers';
import { DataModal } from 'UI/Modal/Modal';

type Props = {
    documentId: string;
    columnsConfig: any;
    fieldsConfig: any;
    handleSignoutClick: Function;
    handleError: Function;
};

type State = {
    isCopied: boolean;
    isLoaded: boolean;
    isFiltered: boolean;
    isChangedFilters: boolean;
    isError: boolean;
    storages: any;
    modalData: any;
    data: any[];
    filteredData: any[];
    filterValues: any;
    visibleFiltersKeys: string[];
    mainKey: string;
};

export class FileView extends React.Component<Props, State> {
    queryTimeout: any = null;

    constructor(props) {
        super(props);

        this.state = {
            isCopied: false,
            isLoaded: false,
            isFiltered: true,
            isChangedFilters: false,
            storages: H.getStorages(props.fieldsConfig),
            data: [],
            filteredData: [],
            filterValues: {},
            visibleFiltersKeys: H.getVisibleFiltersKeys(props.fieldsConfig),
            mainKey: Object.keys(props.fieldsConfig)
                .find(key => props.fieldsConfig[key].isMainKey)
        };
    }

    componentDidMount() {
        this.loadAndParseData()
            .catch(error => {
                this.handleError(error?.result?.error);
            });
    }

    async loadAndParseData() {
        const { documentId, fieldsConfig } = this.props;
        const { storages, filterValues, visibleFiltersKeys, mainKey } = this.state;

        // const { values } = await H.getData(documentId);
        const { values } = await H.getJsonData(documentId);

        if (!values.length) return;

        const configMap = Object.values(fieldsConfig)
            .reduce((acc: object, config: any) => {
                acc[config.index] = config;
                return acc;
            }, {});

        const data = values.map(value => {
            const item = {};

            value.forEach((vl: string, ind: number) => {
                const config: FieldConfig = configMap[ind];
                const key = config.key;

                item[key] = vl;

                if (config.attachTo && H.isChecked(vl)) {
                    if (!item[config.attachTo]) item[config.attachTo] = new Set();
                    item[config.attachTo].add(key);
                }

                if (config.isSearchable)
                    item[KEY_QUERY] = `${(item[KEY_QUERY] || '')}#${String(vl).toLowerCase()}`;

                if (key === mainKey && !fieldsConfig.id)
                    item.id = vl;
            });

            this.addToStorages(item);

            return item;
        });

        const filteredData = data.filter(H.applyFilters(filterValues, visibleFiltersKeys));

        this.setState({ data, filteredData, isLoaded: true });

        console.log('data', data, storages);
    }

    addToStorages(data) {
        const { storages } = this.state;

        this.getDynamicFiltersList()
            .forEach((config: any) => {
                const value = data[config.key];

                if (value instanceof Set)
                    value.forEach(vl => storages[config.key]?.add(vl));
                else if (value)
                    storages[config.key]?.add(value);
            });
    }

    showModal(data) {
        console.log('modal', data);
        this.setState({ modalData: data });
    }

    getDynamicFiltersList() {
        const { fieldsConfig } = this.props;
        const { visibleFiltersKeys } = this.state;

        return visibleFiltersKeys.map(key => fieldsConfig[key]);
    }

    getVirtualizedParams = () => {
        const { filteredData } = this.state;

        return {
            itemHeight: 78,
            maxHeight: MAX_TABLE_HEIGHT,
            overlapCount: 10,
            totalCount: filteredData.length,
        };
    };

    setFilterValue(key, value) {
        const { filterValues } = this.state;
        filterValues[key] = value;
        if (key === KEY_QUERY_TEMP && !value)
            filterValues[KEY_QUERY] = value;
        this.applyFilterValues(filterValues);
    }

    applyFilterValues(filterValues) {
        const { data, visibleFiltersKeys } = this.state;
        const filteredData = data.filter(H.applyFilters(filterValues, visibleFiltersKeys));
        const storages = this.applyFiltersToStorages(filteredData);
        const isChangedFilters: boolean = !!Object.values(filterValues).reduce((acc, val) => acc || !!val, false);

        console.log('filteredData', filteredData.length, { ...filterValues });
        console.log('filteredStorages', storages);

        this.setState({ filterValues, filteredData, storages, isFiltered: false, isChangedFilters },
            () => this.setState({ isFiltered: true }));
    }

    setFilterQuery(value) {
        const { filterValues } = this.state;
        filterValues[KEY_QUERY_TEMP] = value;
        this.setState({ filterValues });

        clearTimeout(this.queryTimeout);
        this.queryTimeout = setTimeout(() => {
            this.setFilterValue(KEY_QUERY, filterValues[KEY_QUERY_TEMP].toLowerCase());
        }, 500);
    }

    applyFiltersToStorages(filteredData) {
        const { storages } = this.state;

        Object.values(storages)
            .forEach((set: any) => set.clear());

        filteredData.forEach(data => this.addToStorages(data));

        return storages;
    }

    clearFilters() {
        this.applyFilterValues({});
    }

    getRenderData(params: GetDataParams) {
        const { filteredData } = this.state;
        const start = (params.page - 1) * params.pageSize;
        const part = filteredData.slice(start, start + params.pageSize);

        return Promise.resolve(part);
    };

    getColumnsConfig() {
        const { columnsConfig } = this.props;

        return [...columnsConfig, {
            id: 'icon',
            title: '',
            fixedWidth: '64px',
            render: row => (
                <Button variant="clear" square>
                    <Icon size="m" type="info" />
                </Button>
            )
        }]
    }

    handleCopyClick(value) {
        copyToClipboard(value);
        this.setState({ isCopied: true });
        setTimeout(() => this.setState({ isCopied: false }), 2000);
    }

    handleSignoutClick() {
        const { handleSignoutClick } = this.props;

        this.setState({ error: false });
        handleSignoutClick();
    }

    handleModalClose() {
        this.setState({ modalData: null });
    }

    handleError(error) {
        this.setState({ isLoaded: true, isError: true });
        this.props.handleError(error);
    }

    renderTable() {
        return (
            <div className={S.tableContainer}>
                <Table
                    className={S.table}
                    getData={params => this.getRenderData(params)}
                    columns={this.getColumnsConfig()}
                    virtualizedParams={this.getVirtualizedParams()}
                    onRowClick={row => this.showModal(row)}
                />
            </div>
        );
    }

    renderFilter(key, isTextFilter) {
        const { filterValues, storages } = this.state;
        const value = filterValues[key];

        return (
            <div className={S.filterContainer} key={key}>
                {!isTextFilter && <Select
                    className={S.filter}
                    isSearchable
                    label={upFirstLetter(key)}
                    options={H.getOptions(key, storages)}
                    value={filterValues[key]}
                    onChange={value => this.setFilterValue(key, value)}
                    popupProps={{
                        outlined: true,
                        elevation: 1,
                        clearTargetMargin: false,
                    }}
                />}
                {isTextFilter && <Input
                    className={S.filter}
                    placeholder="Search"
                    value={filterValues[key]}
                    onChange={val => this.setFilterQuery(val)}
                />}
                {!!value && <Button
                    variant="clear"
                    square
                    className={S.filterClear}
                    onClick={() => this.setFilterValue(key, null)}>
                    <Icon size="xs" type="close" variant="primary" />
                </Button>}
            </div>
        );
    }

    renderFilters() {
        const { isChangedFilters } = this.state;

        return <div className={S.filtersPanel}>
            {this.renderFilter(KEY_QUERY_TEMP, true)}
            {this.getDynamicFiltersList().map((config: any) => this.renderFilter(config.key, false))}
            <Button
                className={S.buttonFull}
                onClick={() => this.clearFilters()}
                size="m"
                variant="default"
                disabled={!isChangedFilters}>
                Clear filters
            </Button>
            <Button
                className={S.bottomButton}
                onClick={() => this.handleSignoutClick()}
                size="m"
                variant="default">
                Logout
            </Button>
        </div>;
    }

    render() {
        const { isLoaded, isFiltered, isError, filteredData, modalData, mainKey } = this.state;
        const { fieldsConfig } = this.props;

        if (isError) return null;
        if (!isLoaded) return <Spinner className={S.spinner} size="3xl" />;

        return (
            <>
                <div className={S.contentContainer}>
                    {this.renderFilters()}
                    {isFiltered && this.renderTable()}
                </div>
                {filteredData.length === 0 && (
                    <div className={S.tablePlaceholder}>Nothing found</div>
                )}
                {modalData && (
                    <DataModal
                        mainKey={mainKey}
                        data={modalData}
                        fieldsConfig={fieldsConfig}
                        onClose={() => this.handleModalClose()}
                    />
                )}
            </>
        );
    };
}