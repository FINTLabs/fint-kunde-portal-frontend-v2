import React, { useEffect, useState } from 'react';
import { Alert, BodyShort, VStack } from '@navikt/ds-react';

interface AlertType {
    id: number;
    message: string;
    header?: string;
    variant: string;
}

interface AlertStackProps {
    alerts: AlertType[];
}

const AlertManager = ({ alerts }: AlertStackProps) => {
    const [displayAlerts, setDisplayAlerts] = useState<AlertType[]>([]);

    useEffect(() => {
        if (alerts.length) {
            const latestAlert = alerts[alerts.length - 1];
            setDisplayAlerts((prev) => {
                const updatedAlerts = [...prev, latestAlert];
                if (updatedAlerts.length > 3) {
                    updatedAlerts.shift(); // Remove the oldest alert if more than 3
                }
                return updatedAlerts;
            });

            // Auto-remove the alert after 10 seconds
            setTimeout(() => {
                setDisplayAlerts((prev) => prev.filter((alert) => alert.id !== latestAlert.id));
            }, 10000);
        }
    }, [alerts]);

    return (
        <VStack
            gap="4"
            style={{
                position: 'fixed',
                top: '5rem',
                right: '1rem',
                zIndex: 1000,
            }}>
            {displayAlerts.map((alert) => (
                <Alert
                    key={alert.id}
                    variant={alert.variant as 'error' | 'info' | 'warning' | 'success'}
                    closeButton
                    size={'small'}
                    onClose={() =>
                        setDisplayAlerts((prev) => prev.filter((a) => a.id !== alert.id))
                    }>
                    {alert.header && (
                        <BodyShort size={'small'} style={{ fontWeight: 'bold' }}>
                            {alert.header}
                        </BodyShort>
                    )}
                    <BodyShort size={'small'}>{alert.message}</BodyShort>
                </Alert>
            ))}
        </VStack>
    );
};

export default AlertManager;
