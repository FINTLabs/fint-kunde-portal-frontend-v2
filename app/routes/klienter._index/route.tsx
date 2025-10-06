import { TokenIcon } from '@navikt/aksel-icons';
import { Search } from '@navikt/ds-react';
import { ApiResponse, NovariSnackbar, useAlerts } from 'novari-frontend-components';
import { useEffect, useState } from 'react';
import {
    type ActionFunctionArgs,
    MetaFunction,
    useFetcher,
    useLoaderData,
    useNavigate,
} from 'react-router';

import Breadcrumbs from '~/components/shared/breadcrumbs';
import { CustomTabs } from '~/components/shared/CustomTabs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { useDeletedSearchParamAlert } from '~/hooks/useDeletedSearchParamAlert';
import { handleClientIndexAction } from '~/routes/klienter._index/actions';
import ClientCreateForm from '~/routes/klienter._index/CreateForm';
import { IClient } from '~/types/Clients';

import { loader } from './loaders';

export const meta: MetaFunction = () => {
    return [{ title: 'Klienter' }, { name: 'description', content: 'klienter' }];
};

export { loader };

export const action = async (args: ActionFunctionArgs) => handleClientIndexAction(args);

interface IPageLoaderData {
    clientData: IClient[];
    orgName: string;
}

export default function Index() {
    const { clientData, orgName } = useLoaderData<IPageLoaderData>();
    const breadcrumbs = [{ name: 'Klienter', link: '/klienter' }];
    const [filteredClients, setFilteredClients] = useState(clientData);
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate();

    const fetcher = useFetcher();
    const actionData = fetcher.data as ApiResponse<IClient>;
    const { alertState, setAlertState } = useAlerts<IClient>([], actionData);

    useDeletedSearchParamAlert({
        label: 'Klient',
        setAlertState,
    });

    useEffect(() => {
        setFilteredClients(clientData);
    }, [clientData]);

    const handleCreate = () => {
        setIsCreating(true);
    };

    const handleSearch = (value: string) => {
        const query = value.toLowerCase();
        setFilteredClients(
            clientData.filter(
                (client) =>
                    client.name.toLowerCase().includes(query) ||
                    client.shortDescription.toLowerCase().includes(query)
            )
        );
    };

    function handleCancelCreate() {
        setIsCreating(false);
    }

    const handleSave = (formData: FormData) => {
        fetcher.submit(formData, { method: 'post', action: '/klienter' });
    };

    const showDetails = (id: string) => {
        navigate(`/klienter/${id}`);
    };

    //TODO: clear search on org change
    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <NovariSnackbar
                items={alertState}
                position={'top-right'}
                // onCloseItem={handleCloseItem}
            />
            {isCreating ? (
                <ClientCreateForm
                    onCancel={handleCancelCreate}
                    onSave={handleSave}
                    orgName={orgName}
                />
            ) : (
                <>
                    <InternalPageHeader
                        title={'Klienter'}
                        icon={TokenIcon}
                        helpText={'klienter'}
                        onAddClick={handleCreate}
                    />

                    <Search
                        label="Søk etter klienter"
                        hideLabel
                        variant="secondary"
                        size="small"
                        onChange={(value: string) => handleSearch(value)}
                        placeholder="Søk etter navn eller beskrivelse"
                        className="pb-6"
                        data-cy="search-input"
                    />

                    {filteredClients && (
                        <CustomTabs
                            items={filteredClients}
                            showDetails={showDetails}
                            getItemName={(item) => item.name}
                            getItemDescription={(item) => item.shortDescription}
                            isManaged={(item) => item.managed}
                        />
                    )}
                </>
            )}
        </>
    );
}
