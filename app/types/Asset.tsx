import { IClient } from '~/types/Clients';

export interface IAsset {
    dn: string;
    name: string;
    description: string;
    organisation: string;
    clients: IClient[]; // If you have a specific type for clients, replace `any` with that type
    adapters: any[]; // If you have a specific type for adapters, replace `any` with that type
    assetId: string;
    primaryAsset: boolean;
}
