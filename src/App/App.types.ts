export type FieldConfig = {
    key: string;
    index: number;
    type: 'image' | 'text' | 'json' | 'array_text';
    isMainKey: boolean;
    isFilter: boolean;
    isSearchable: boolean;
    excludeFromModal: boolean;
    attachTo?: string;
}