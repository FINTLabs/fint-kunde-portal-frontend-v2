export type Environment = 'api' | 'beta' | 'alpha' | 'pwf';

export interface IAccess {
    username: string;
    isAdapter: boolean;
    environments: Record<Environment, boolean>;
}

export interface IPackageItem {
    packageName: string;
    access: boolean;
}

export interface IDomainPackages {
    domain: string;
    packages: IPackageItem[];
}

// export type PackageAccessList = IDomainPackages[];

export interface IResource {
    name: string;
    enabled: boolean;
    writeable: boolean;
    readingOption: 'MULTIPLE' | 'SINGULAR';
}

export interface IField {
    name: string;
    enabled: boolean;
    mustContain: string;
    relation: boolean;
}

export interface IAccessComponent {
    name: string;
    fields: IField[];
    readingOption: 'MULTIPLE' | 'SINGLE';
    enabled: boolean;
    isWriteable: boolean;
}
