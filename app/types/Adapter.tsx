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
