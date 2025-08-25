import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';
import { NovariSnackbarItem } from 'novari-frontend-components';

export function useDeletedSearchParamAlert({
    label,
    setAlertState,
}: {
    label: string;
    setAlertState: React.Dispatch<React.SetStateAction<NovariSnackbarItem[]>>;
}) {
    const hasShownAlert = useRef(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const deleteName = searchParams.get('deleted');

    useEffect(() => {
        if (deleteName && !hasShownAlert.current) {
            hasShownAlert.current = true;

            const newItem: NovariSnackbarItem = {
                id: `delete-${deleteName}`,
                message: `${label} «${deleteName}» ble slettet.`,
                variant: 'success',
            };

            setAlertState((prev) => [...prev, newItem]);

            searchParams.delete('deleted');
            setSearchParams(searchParams, { replace: true });
        }
    }, [deleteName]);
}
