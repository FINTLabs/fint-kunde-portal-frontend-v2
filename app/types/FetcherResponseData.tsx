export interface IFetcherResponseData {
    show: boolean;
    message: string;
    variant: 'error' | 'info' | 'warning' | 'success';
}
//TODO: rename to IFetcherResponseMessage
//TODO: remove show
