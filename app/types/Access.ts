export type Environment = 'api' | 'beta' | 'alpha' | 'pwf';

export interface IAccess {
    username: string;
    isAdapter: boolean;
    environments: Record<Environment, boolean>;
}

export type ResourceAccess = 'NOACCESS' | 'FULLACCESS' | 'PARTIALACCESS';

export interface IPackageItem {
    packageName: string;
    access: boolean;
    hasResourceAccess: ResourceAccess;
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
    writeable: boolean;
}

export interface IComponentAccess {
    enabled: boolean;
}

// export interface IUpdateResource {
//     enabled: boolean;
//     isWriteable: boolean;
//     readingOption: string;
// }
