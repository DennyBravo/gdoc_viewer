import { gapi } from 'gapi-script';

import { KEY_QUERY } from 'App/App.constants';
import { JsonData } from './FileView.types';

export const numberToChar = (num: number) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const overflowIndex = Math.floor(num / alphabet.length);
    const index = num % alphabet.length;
    return `${overflowIndex ? alphabet[overflowIndex] : ''}${alphabet[index]}`;
}

export const isChecked = (value) => {
    return String(value).toLowerCase() === 'yes';
}

export const getJsonData = async documentId => {
  return fetch(`./data/${documentId}`)
    .then((response) => response.json());
};

export const getData = async documentId => {
    const document = await getDocument(documentId);
    const sheet = document.sheets[0];

    if (!sheet) return null;

    const { properties: { gridProperties: { columnCount, rowCount } } } = sheet;
    const values = await getSheetValues(documentId, columnCount, rowCount);

    return values;
}

export const getDocument = async documentId => {
    const { result } = await gapi.client.sheets.spreadsheets.get({
      spreadsheetId: documentId
    });
    return result;
}

export const getSheetValues = async (documentId: string, columnCount: number, rowCount: number) => {
    const columnChar = numberToChar(columnCount);
    const range = `Sheet1!A2:${columnChar}${rowCount}`;
    const params = {
      spreadsheetId: documentId,
      range
    }
    const { result } = await gapi.client.sheets.spreadsheets.values.get(params);
    return result;
}

export const applyFilters = (filterValues, visibleFiltersKeys) => {
    return item => {
      return [ KEY_QUERY, ...visibleFiltersKeys ].reduce((res, key) => {
        if (!filterValues[key]) return res;

        const value = item[key];
        const filterValue = filterValues[key];
        
        if (Array.isArray(value) || value instanceof Set)
          return res && [ ...value ].includes(filterValue);

        if (key === KEY_QUERY)
          return res && value.indexOf(filterValue) > -1;

        return res && (value === filterValue);
      }, true);
    };
}

export const getOptions = (key, storages) => {
    return [ ...(storages[key] || [])].map(value => ({
      id: value,
      label: value
    }));
}

export const getStorages = fieldsConfig => {
  return Object.entries(fieldsConfig)
    .filter(([key, value]) => value.isFilter)
    .reduce((acc, arr) => {
      acc[arr[0]] = new Set();
      return acc;
    }, {});
};

export const getVisibleFiltersKeys = fieldsConfig => {
  return Object.values(fieldsConfig)
    .filter((config: any) => config.isFilter)
    .sort((config1: any, config2: any) => 
      config1.filterOrdering > config2.filterOrdering ? 1 : -1)
    .map((config: any) => config.key);
};