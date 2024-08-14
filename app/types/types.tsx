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

export interface SessionOrganisation {
    name: string;
    orgNumber: string;
    displayName: string;
}
export interface IUserSession {
    firstName: string;
    lastName: string;
    organizationCount: number;
    selectedOrganization: SessionOrganisation | null;
    organizations: SessionOrganisation[];
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

interface Event {
    corrId: string;
    action: string;
    operation: any; // This could be more specific if you know the type
    status: string;
    time: number;
    orgId: string;
    source: string;
    client: string;
    data: any[]; // Array of unknown type, could be specified further
    problems: any; // Could be more specific
    message: string | null;
    query: any; // Could be more specific
    statusCode: string | null;
    responseStatus: string | null;
}

export interface Log {
    corrId: string;
    source: string;
    orgId: string;
    timestamp: number;
    event: Event;
    clearData: boolean;
}
