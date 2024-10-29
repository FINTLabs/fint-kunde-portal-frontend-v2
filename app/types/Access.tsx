export interface IAccess {
    domain: string;
    packageName: string;
    status: string;
}

export interface IField {
    name: string;
    shouldContain: string[];
    isHidden: boolean;
}

export interface IAccessComponent {
    name: string;
    fields: IField[];
    readingOption: 'MULTIPLE' | 'SINGLE';
    enabled: boolean;
    isWriteable: boolean;
}
