export interface IAlertType {
    id: number;
    message: string;
    header?: string;
    variant: string;
}

export interface IAlertStackProps {
    alerts: IAlertType[];
}
