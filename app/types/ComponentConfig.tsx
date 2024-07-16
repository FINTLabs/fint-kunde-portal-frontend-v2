export interface IClassInfo {
    name: string;
    path: string;
}

export interface IComponentConfig {
    dn: string;
    name: string;
    displayName: string;
    path: string;
    assetPath: string;
    classes: IClassInfo[];
    core: boolean;
    inProduction: boolean;
    inBeta: boolean;
    inPlayWithFint: boolean;
}
