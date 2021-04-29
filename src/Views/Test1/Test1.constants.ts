import * as AC from "App/App.constants";

export const DOCUMENT_ID = 'data1.json';

export const KEY_SOLUTION = 'solution';
export const KEY_FUNCTIONALITY = 'functionality';
export const KEY_WINDOW = 'window';
export const KEY_GROUP = 'group';
export const KEY_ID = 'id';
export const KEY_PHRASE = 'phrase';
export const KEY_MEANS = 'means';
export const KEY_MAIN_ATTRIBUTES = 'attribute 1';
export const KEY_ADDITIONAL_ATTRIBUTES = 'attribute 2';
export const KEY_DEPRECATED = 'deprecated';
export const KEY_DEVICE = 'device'

export const DEVICES = 
  [ AC.KEY_APPTYPE_IOS, AC.KEY_APPTYPE_ANDROID, AC.KEY_APPTYPE_OTHER ];
export const FILTERS = [ AC.KEY_QUERY, KEY_SOLUTION, KEY_FUNCTIONALITY, KEY_WINDOW, KEY_GROUP ];
export const MODAL_FIELDS_EXCEPT = [ AC.KEY_QUERY, AC.KEY_QUERY_TEMP, ...DEVICES ];
export const SEARCH_KEYS = [ KEY_PHRASE ];
export const TABLE_CONFIG = {
    'phrase': [KEY_PHRASE, KEY_FUNCTIONALITY, KEY_SOLUTION],
    'group': [KEY_GROUP],
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
    [KEY_WINDOW]: { type: AC.TEXT },
    [KEY_GROUP]: { type: AC.TEXT },
    [KEY_ID]: { type: AC.TEXT },
    [KEY_PHRASE]: { type: AC.TEXT, isMainKey: true },
    [KEY_MEANS]: { type: AC.TEXT },
    [KEY_MAIN_ATTRIBUTES]: { type: AC.TEXT },
    [KEY_ADDITIONAL_ATTRIBUTES]: { type: AC.TEXT },
    [KEY_DEPRECATED]: { type: AC.TEXT },
    ...DEVICES.reduce((acc, key) => Object.assign(acc, { [key]: { type: AC.TEXT, attachTo: KEY_DEVICE } }), {}),
    [KEY_DEVICE]: { type: AC.ARRAY_TEXT, isAbstract: true }
};