export interface IClient {
    dn: string;
    name: string;
    shortDescription: string;
    assetId: string;
    asset: string;
    note: string;
    clientId: string;
    components: string[];
    accessPackages: any[]; // Adjust the type if you have more specific details
    managed: boolean;
}
