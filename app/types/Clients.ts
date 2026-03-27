export interface IPartialClient {
    name: string;
    shortDescription: string;
    note: string;
    modelVersion?: string;
}

export interface IClient extends IPartialClient {
    dn: string;
    assetId: string[];
    asset: string;
    clientId: string;
    components: string[];
    accessPackages: string[];
    managed: boolean;
    modelVersion?: string;
}
