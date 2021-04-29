import { Page } from 'UI/Page/Page';

import * as C from './Test2.constants';

export class Test2 extends Page {
    constructor(props){
        super(props);

        const fieldsConfig = this.getFieldsConfig({
            keysConfig: C.KEYS_CONFIG,
            filters: C.FILTERS,
            excludeFromModal: C.MODAL_FIELDS_EXCEPT,
            searchKeys: C.SEARCH_KEYS
        });
        const columnsConfig = this.getColumns(C.TABLE_CONFIG);

        this.state = {
            fieldsConfig,
            columnsConfig,
            documentId: C.DOCUMENT_ID
        };
    }
}