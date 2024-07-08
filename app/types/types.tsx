//TODO: Divide this into smaller files
export interface IContact {
    dn: string;
    nin: string;
    firstName: string;
    lastName: string;
    mail: string;
    mobile: string;
    technical?: string[] | null;
    legal?: string[] | null;
    supportId?: string | null;
    roles?: string[] | null;
}

export const defaultContact: IContact = {
    dn: '',
    nin: '',
    firstName: '',
    lastName: '',
    mail: '',
    mobile: '',
    technical: null,
    legal: null,
    supportId: null,
    roles: null,
};

export interface IErrorState {
    [key: string]: string | undefined;
}

export interface IFetcherResponseData {
    show: boolean;
    message: string;
    variant: 'error' | 'info' | 'warning' | 'success';
}

export interface IMeData {
    dn: string;
    nin: string;
    firstName: string;
    lastName: string;
    mail: string;
    mobile: string;
    technical: string[];
    legal: string[];
    supportId: string;
    roles: string[];
}

// export interface IOrganisations {
//     dn: string;
//     name: string;
//     orgNumber: string;
//     displayName: string;
//     components: string[];
//     legalContact: string;
//     techicalContacts: string[];
//     k8sSize: string;
//     customer: boolean;
//     primaryAssetId: string | null;
// }
export interface IUserSession {
    firstName: string;
    lastName: string;
    organizationCount: number;
    selectedOrganization: {
        name: string;
        orgNumber: string;
        displayName: string;
    } | null;
    organizations: {
        name: string;
        orgNumber: string;
        displayName: string;
    }[];
}

export interface FeatureFlags {
    'audit-log-new': boolean;
    'samtykke-admin-new': boolean;
    'access-packages-new': boolean;
    'roles-new': boolean;
    'roles-init-new': boolean;
    'access-packages': boolean;
    'samtykke-admin': boolean;
    roles: boolean;
    'audit-log': boolean;
    'roles-init': boolean;
}

// export interface IComponent {
//     dn: string;
//     name: string;
//     description: string;
//     organisations: string[];
//     clients: string[];
//     adapters: string[];
//     basePath: string;
//     port: number | null;
//     core: boolean;
//     openData: boolean;
//     common: boolean;
//     dockerImage: string | null;
//     componentSizes: any | null; // Replace `any` with a more specific type if available
//     cacheDisabledFor: string[];
//     inProduction: boolean;
//     inBeta: boolean;
//     inPlayWithFint: boolean;
// }

export interface IRole {
    id: string;
    name: string;
    description: string;
    uri: string | null;
}

export interface IPartialAdapter {
    name: string;
    shortDescription: string;
    note: string;
}
export interface IAdapter extends IPartialAdapter {
    dn: string;
    clientId: string;
    components: string[];
    assets: string[];
    assetIds: string[];
    managed: boolean;
}
