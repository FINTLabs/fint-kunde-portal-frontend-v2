export interface IComponent {
    dn: string;
    name: string;
    description: string;
    organisations: string[];
    clients: string[];
    adapters: string[];
    basePath: string;
    port: number | null;
    core: boolean;
    openData: boolean;
    common: boolean;
    dockerImage?: string | null; // Optional resource
    componentSizes?: any | null; // Optional resource
    cacheDisabledFor: string[];
    inProduction: boolean;
    inBeta: boolean;
    inPlayWithFint: boolean;
}
