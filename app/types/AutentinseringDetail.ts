export type AutentiseringDetail = {
    username: string;
    password: string;
    clientId: string;
    openIdSecret: string;
    scope: string;
    idpUri: string;
    assetIds: string[] | string;
};
