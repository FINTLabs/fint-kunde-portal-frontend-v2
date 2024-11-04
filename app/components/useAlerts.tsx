import { useState, useEffect } from 'react';

function useAlerts(fetcherData: any, fetcherState: string, deleteName?: string | null) {
    const [alerts, setAlerts] = useState<IAlertType[]>([]);

    // Effect to show alert for deleted entity
    useEffect(() => {
        if (deleteName) {
            addAlert({
                variant: 'warning',
                message: `Element '${deleteName}' er slettet`,
                header: 'Slettingsvarsel',
            });
        }
    }, [deleteName]);

    useEffect(() => {
        if (fetcherData && fetcherState === 'idle') {
            addAlert({
                variant: fetcherData.variant || 'success',
                message: fetcherData.message || 'Handlingen fullført.',
                header: fetcherData.header || undefined,
            });
        }
    }, [fetcherData, fetcherState]);

    const addAlert = (alert: Omit<IAlertType, 'id'>) => {
        setAlerts((prev) => [
            ...prev,
            {
                id: Date.now(),
                ...alert,
            },
        ]);
    };

    const removeAlert = (id: number) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    };

    return {
        alerts,
        addAlert,
        removeAlert,
    };
}

export default useAlerts;
