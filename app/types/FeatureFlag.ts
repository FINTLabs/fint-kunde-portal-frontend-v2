export interface IFeatureFlag {
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
    'access-controll-new': boolean;
}
export const defaultFeatures: IFeatureFlag = {
    'audit-log-new': false,
    'samtykke-admin-new': false,
    'access-packages-new': false,
    'roles-new': false,
    'roles-init-new': false,
    'access-packages': false,
    'samtykke-admin': false,
    roles: false,
    'audit-log': false,
    'roles-init': false,
    'access-controll-new': false,
};
