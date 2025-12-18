import { MigrationIcon } from '@navikt/aksel-icons';
import { BodyLong, Box } from '@navikt/ds-react';
import { type ApiResponse, NovariSnackbar, useAlerts } from 'novari-frontend-components';
import { useState } from 'react';
import {
    type ActionFunctionArgs,
    type MetaFunction,
    useFetcher,
    useLoaderData,
    useNavigate,
} from 'react-router';

import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { handleAssetIndexAction } from '~/routes/ressurser._index/actions';
import CreateForm from '~/routes/ressurser._index/CreateForm';
import AssetsTable from '~/routes/ressurser._index/ResourcesTable';
import { IResource } from '~/types/Access';
import { IAsset } from '~/types/Asset';

import { loader } from './loaders';

interface IPageLoaderData {
    assets: IAsset[];
    primaryAsset: IAsset;
}

export const meta: MetaFunction = () => {
    return [{ title: 'Ressurser' }, { name: 'description', content: 'Liste over ressurser' }];
};

export { loader };

export const action = async (args: ActionFunctionArgs) => handleAssetIndexAction(args);

export default function Index() {
    const breadcrumbs = [{ name: 'Ressurser', link: '/ressurser' }];
    const { assets, primaryAsset } = useLoaderData<IPageLoaderData>();
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate();
    // const [searchParams] = useSearchParams();
    // const deleteName = searchParams.get('deleted');
    const fetcher = useFetcher();
    const actionData = fetcher.data as ApiResponse<IResource>;
    const { alertState } = useAlerts<IResource>([], actionData);

    const handleClick = (id: string) => navigate(`/ressurser/${id}`);

    const handleCreate = () => setIsCreating(true);

    const handleCancel = () => setIsCreating(false);

    const handleSave = (formData: FormData) => {
        formData.append('actionType', 'CREATE');
        fetcher.submit(formData, { method: 'post', action: '/ressurser' });
    };

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <NovariSnackbar
                items={alertState}
                position={'top-right'}
                // onCloseItem={handleCloseItem}
            />

            <InternalPageHeader
                title={'Ressurser'}
                icon={MigrationIcon}
                helpText="assets"
                onAddClick={handleCreate}
            />

            {!assets || assets.length === 0 ? (
                <Box padding="8">
                    <BodyLong>Fant ingen ressurser</BodyLong>
                </Box>
            ) : isCreating ? (
                <CreateForm
                    onCancel={handleCancel}
                    primaryAsset={primaryAsset}
                    onCreate={handleSave}
                />
            ) : (
                <AssetsTable assets={assets} onRowClick={handleClick} />
            )}
        </>
    );
}
