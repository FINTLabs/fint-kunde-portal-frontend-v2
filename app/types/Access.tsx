export interface IAccess {
    username: string;
    isAdapter: boolean;
    allowedEnvironments: string[];
    // packageAccesses: IPackageAccess[];
}

export interface IPackageAccess {
    domain: string;
    packageName: string;
    accessLevel: string;
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
