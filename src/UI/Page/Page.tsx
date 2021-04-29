import { FieldConfig } from 'App/App.types';
import React from 'react';

import { FileView } from 'UI/FileView/FileView';

import S from 'App/App.styl';
import { upFirstLetter } from 'App/App.helpers';

export type Props = {
    handleSignoutClick: Function;
    handleError: Function;
};

export type State = {
    modalData: any;
    fieldsConfig: any;
    columnsConfig: any;
    documentId: string;
};

export type Config = {
    keysConfig: object;
    filters: string[];
    excludeFromModal: string[];
    searchKeys: string[];
};

export class Page extends React.Component <Props, State>{
    state = {
        modalData: null,
        fieldsConfig: null,
        columnsConfig: null,
        documentId: ''
    };

    getFieldsConfig(params: Config){
        const { keysConfig, filters, excludeFromModal, searchKeys } = params;
        const result = {};

        Object.keys(keysConfig).forEach((key, index) => {
            const config: FieldConfig = result[key] = { ...keysConfig[key] };

            config.key = key;
            config.index = index;
            config.isFilter = filters.includes(key);
            config.excludeFromModal = excludeFromModal.includes(key);
            config.isSearchable = searchKeys.includes(key);
        });

        return result;
    }

    getColumns(config: object){
        let index: number = 0;

        return [ ...Object.entries(config).map(([key, fieldKeys]) => {
            return {
                id: key,
                title: upFirstLetter(key),
                minWidth: index++ === 0 ? '300px' : undefined,
                render: row => fieldKeys.map((fieldKey, index) => {
                    const classNames: string[] = [];
                    const value = row[fieldKey] instanceof Set 
                        ? [ ...row[fieldKey] ].join(', ') : row[fieldKey];

                    if (fieldKeys.length > 1 && index === 0) classNames.push(S.bold, S.nowrap);
                    if (fieldKeys.length > 1 && index > 0) classNames.push(S.gray);

                    return <div className={classNames.join(' ')}>{value}</div>
                })
            };
        }) ];
    }

    render() {
        const { columnsConfig, fieldsConfig, documentId } = this.state;

        return (
            <FileView
                documentId={documentId}
                columnsConfig={columnsConfig}
                fieldsConfig={fieldsConfig}
                { ...this.props }
            />
        );
    }
}