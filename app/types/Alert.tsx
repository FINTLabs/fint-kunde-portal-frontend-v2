interface IAlertType {
    id: number;
    message: string;
    header?: string;
    variant: string;
}

interface AlertStackProps {
    alerts: IAlertType[];
}
