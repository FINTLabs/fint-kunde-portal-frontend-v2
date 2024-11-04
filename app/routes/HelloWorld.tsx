import { useState } from 'react';
import { Alert, Box, Button } from '@navikt/ds-react';

// Define an interface for the alert
interface AlertType {
    id: number;
    message: string;
    variant: 'info' | 'warning' | 'success' | 'error'; // You can add other variants as needed
}

export default function MyComponent() {
    // UseState with a type for alerts
    const [alerts, setAlerts] = useState<AlertType[]>([]);

    // Function to add an alert
    const addAlert = (
        message: string,
        variant: 'info' | 'warning' | 'success' | 'error' = 'info'
    ) => {
        const alertId = Date.now();

        setAlerts((prev) => {
            const updatedAlerts = [{ id: alertId, message, variant }, ...prev];
            if (updatedAlerts.length > 3) {
                updatedAlerts.pop(); // Remove the oldest alert (which is now the last element)
            }
            return updatedAlerts;
        });

        // Optional: Remove alert after a delay (e.g., 10 seconds)
        setTimeout(() => {
            setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
        }, 10000);
    };

    // Function to remove an alert manually
    const removeAlert = (id: number) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    };

    // Example function that triggers an alert
    const handleAction = () => {
        addAlert('This is an info alert!', 'info');
    };

    return (
        <>
            <Button onClick={handleAction}>Trigger Alert</Button>

            <Box
                style={{
                    position: 'fixed',
                    top: '4rem',
                    right: '1rem',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                }}>
                {alerts.map((alert) => (
                    <Alert
                        key={alert.id}
                        variant={alert.variant}
                        onClose={() => removeAlert(alert.id)}
                        closeButton>
                        {alert.message}
                        {alert.id}
                    </Alert>
                ))}
            </Box>
        </>
    );
}
