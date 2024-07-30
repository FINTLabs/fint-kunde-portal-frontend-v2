import { IClient } from '~/types/Clients';

export interface IPartialAsset {
    assetId: string;
    name: string;
    description: string;
}

export interface IAsset extends IPartialAsset {
    dn: string;
    organisation: string;
    clients: string[];
    adapters: string[];
    assetId: string;
    primaryAsset: boolean;
}
