export interface SessionOrganisation {
    name: string;
    orgNumber: string;
    displayName: string;
}
export interface IUserSession {
    firstName: string;
    lastName: string;
    organizationCount: number;
    selectedOrganization: SessionOrganisation | null;
    organizations: SessionOrganisation[];
    persistentOrg: string;
}
