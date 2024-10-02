export interface IAccess {
    domain: string;
    packageName: string;
    status: string;
}

export interface IField {
    name: string;
    shouldContain: string[]; // Assuming shouldContain is an array of strings
    isHidden: boolean;
}

export interface IAccessComponent {
    name: string;
    fields: IField[];
    readingOption: 'MULTIPLE' | 'SINGLE'; // Based on the value provided
    enabled: boolean;
    isWriteable: boolean;
}
