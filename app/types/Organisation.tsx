export interface Organisation {
    dn: string;
    name: string;
    orgNumber: string;
    displayName: string;
    components: string[];
    legalContact: string;
    techicalContacts: string[];
    k8sSize: string;
    customer: boolean;
    primaryAssetId: string | null;
}
