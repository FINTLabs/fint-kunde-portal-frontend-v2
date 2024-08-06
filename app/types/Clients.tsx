export interface IPartialClient {
    name: string;
    shortDescription: string;
    note: string;
}

export interface IClient extends IPartialClient {
    dn: string;
    assetId: string;
    asset: string;
    clientId: string;
    components: string[];
    accessPackages: any[]; // Adjust the type if you have more specific details
    managed: boolean;
}
