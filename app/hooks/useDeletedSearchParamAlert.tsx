import { type NovariToasterItem } from 'novari-frontend-components';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';
export function useDeletedSearchParamAlert({
    label,
    setAlertState,
}: {
    label: string;
    setAlertState: React.Dispatch<React.SetStateAction<NovariToasterItem[]>>;
}) {
    const hasShownAlert = useRef(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const deleteName = searchParams.get('deleted');

    useEffect(() => {
        if (deleteName && !hasShownAlert.current) {
            hasShownAlert.current = true;

            const newItem: NovariToasterItem = {
                id: `delete-${deleteName}`,
                message: `${label} «${deleteName}» ble slettet.`,
                status: 'success',
            };

            setAlertState((prev) => [...prev, newItem]);

            searchParams.delete('deleted');
            setSearchParams(searchParams, { replace: true });
        }
    }, [deleteName, label, searchParams, setAlertState, setSearchParams]);
}
