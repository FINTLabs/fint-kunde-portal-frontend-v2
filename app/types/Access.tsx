export interface IAccess {
    dn: string;
    self: string;
    name: string;
    collection: string[];
    read: string[];
    modify: string[];
    clients: string[];
    components: string[];
    description: string;
}
