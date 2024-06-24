
export interface IContact {
    dn: string;
    nin: string;
    firstName: string;
    lastName: string;
    mail: string;
    mobile: string;
    technical?: string[] | null;
    legal?: string[] | null;
    supportId?: string | null;
    roles?: string[] | null;
}

export const defaultContact: IContact = {
    dn: '',
    nin: '',
    firstName: '',
    lastName: '',
    mail: '',
    mobile: '',
    technical: null,
    legal: null,
    supportId: null,
    roles: null,
};


export interface IErrorState {
    [key: string]: string | undefined;
}

export interface IFetcherResponseData {
    show: boolean;
    message: string;
    variant: "error" | "info" | "warning" | "success";
}

export interface IMeData {
    dn: string;
    nin: string;
    firstName: string;
    lastName: string;
    mail: string;
    mobile: string;
    technical: string[];
    legal: string[];
    supportId: string;
    roles: string[];
}