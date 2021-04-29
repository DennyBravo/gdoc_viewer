import * as AC from "App/App.constants";

export const DOCUMENT_ID = 'data2.json';

export const KEY_SOLUTION = 'solution';
export const KEY_FUNCTIONALITY = 'functionality';
export const KEY_GROUP = 'group';
export const KEY_NAME = 'name';
export const KEY_ID = 'id';
export const KEY_DESCRIPTION = 'description';
export const KEY_TEMPLATE = 'template';
export const KEY_DEVICE = 'device'

export const DEVICES = 
    [ AC.KEY_APPTYPE_IOS, AC.KEY_APPTYPE_ANDROID, AC.KEY_APPTYPE_OTHER ];
export const FILTERS = [ AC.KEY_QUERY, KEY_DEVICE, KEY_SOLUTION, KEY_FUNCTIONALITY, KEY_GROUP ];
export const MODAL_FIELDS_EXCEPT = [ AC.KEY_QUERY, AC.KEY_QUERY_TEMP, ...DEVICES ];
export const SEARCH_KEYS = [ KEY_NAME ];
export const TABLE_CONFIG = {
    'name': [KEY_NAME, KEY_FUNCTIONALITY, KEY_SOLUTION],
    'description': [KEY_DESCRIPTION],
    'devices': [KEY_DEVICE]
};

export const STORAGES = FILTERS.reduce((acc, key) => {
    acc[key] = new Set();
    return acc;
}, {
    'device': new Set(DEVICES)
});

export const KEYS_CONFIG = {
    [KEY_SOLUTION]: { type: AC.TEXT },
    [KEY_FUNCTIONALITY]: { type: AC.TEXT },
    [KEY_GROUP]: { type: AC.TEXT },
    [KEY_NAME]: { type: AC.TEXT, isMainKey: true }, 
    [KEY_ID]: { type: AC.TEXT },
    [KEY_DESCRIPTION]: { type: AC.TEXT },
    [KEY_TEMPLATE]: { type: AC.TEXT },
    ...DEVICES.reduce((acc, key) => Object.assign(acc, { [key]: { type: AC.TEXT, attachTo: KEY_DEVICE } }), {}),
    [KEY_DEVICE]: { type: AC.ARRAY_TEXT, isAbstract: true }
};