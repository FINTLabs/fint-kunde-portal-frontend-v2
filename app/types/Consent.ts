export interface ITjeneste {
    id: string;
    orgId: string;
    navn: string;
    behandlingIds: string[];
}

export interface IBehandling {
    id: string;
    aktiv: boolean;
    formal: string;
    orgId: string;
    behandlingsgrunnlagIds: string[];
    personopplysningIds: string[];
    tjenesteIds: string[];
}

export interface IPersonopplysning {
    id: string;
    kode: string;
    navn: string;
}

export interface IBehandlingsgrunnlag {
    id: string;
    kode: string;
    navn: string;
}
