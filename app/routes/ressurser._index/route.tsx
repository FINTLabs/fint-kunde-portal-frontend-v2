import React, { useEffect, useState } from 'react';
import {
    type ActionFunctionArgs,
    type LoaderFunction,
    type MetaFunction,
    redirect,
} from '@remix-run/node';
import { LayersIcon, PlusIcon } from '@navikt/aksel-icons';
import { json, useFetcher, useLoaderData, useNavigate } from '@remix-run/react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import AssetApi from '~/api/AssetApi';
import { IAsset, IPartialAsset } from '~/types/Asset';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { Alert, Button, HStack, VStack } from '@navikt/ds-react';
import { InfoBox } from '~/components/shared/InfoBox';
import CreateForm from '~/routes/ressurser._index/CreateForm';
import AssetsTable from '~/routes/ressurser._index/ResourcesTable';
import { IFetcherResponseData } from '~/types/types';

export const meta: MetaFunction = () => {
    return [
        { title: 'Ressurser' },
        { name: 'description', content: 'Liste over ressurser._index' },
    ];
};

export const loader: LoaderFunction = async ({ request }) => {
    try {
        const orgName = await getSelectedOrganization(request);
        const assets = await AssetApi.getAllAssets(orgName);

        return json(assets);
    } catch (err) {
        console.error('Error fetching data:', err as Error);
        throw new Response('Not Found', { status: 404 });
    }
};

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    const orgName = await getSelectedOrganization(request);
    const newAsset: IPartialAsset = {
        assetId: name,
        name: name,
        description,
    };
    console.info('---------', newAsset);
    const response = await AssetApi.createAsset(newAsset, orgName);

    if (response.status === 201) {
        // const newAdapter = (await response.json()) as IAsset;
        return redirect(`/ressurser/${newAsset.assetId}_fintlabs_no`);
    } else {
        return json({
            errors: {
                apiError: `Unable to create resource: Status: ${response.status}, statusText: ${response.statusText}`,
            },
            status: response.status,
        });
    }
}

export default function Index() {
    const breadcrumbs = [{ name: 'Ressurser', link: '/ressurser' }];
    const assets = useLoaderData<IAsset[]>();
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate();
    const fetcher = useFetcher();
    const actionData = fetcher.data as IFetcherResponseData;
    const [show, setShow] = React.useState(false);
    useEffect(() => {
        setShow(true);
    }, [fetcher.state]);
    const handleClick = (id: string) => {
        navigate(`/ressurser/${id}`);
    };

    const handleCreate = () => {
        setIsCreating(true);
    };

    const handleCancel = () => {
        setIsCreating(false);
    };

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <HStack align={'center'} justify={'space-between'}>
                <VStack>
                    <InternalPageHeader title={'Ressurser'} icon={LayersIcon} helpText="assets" />
                </VStack>
                <VStack>
                    <Button
                        className="float-right"
                        onClick={handleCreate}
                        icon={<PlusIcon aria-hidden />}>
                        Legg til
                    </Button>
                </VStack>
            </HStack>
            {actionData && show && (
                <Alert
                    variant={actionData.variant as 'error' | 'info' | 'warning' | 'success'}
                    closeButton
                    onClose={() => setShow(false)}>
                    {actionData.message || 'Content'}
                </Alert>
            )}
            {!assets && <InfoBox message="Fant ingen ressurser" />}
            {isCreating ? (
                <CreateForm onCancel={handleCancel} />
            ) : (
                assets && <AssetsTable assets={assets} onRowClick={handleClick} />
            )}
        </>
    );
}
