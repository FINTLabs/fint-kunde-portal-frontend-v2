import { json, type LoaderFunction, type MetaFunction } from '@remix-run/node';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { MigrationIcon } from '@navikt/aksel-icons';
import { Button, HStack, Tabs, VStack } from '@navikt/ds-react';
import { log } from '~/utils/logger';
import AdapterAPI from '~/api/AdapterApi';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { IAdapter } from '~/types/types';
import { ErrorBox } from '~/components/shared/ErrorBox';
import { PlusIcon } from '@navikt/aksel-icons';
import { getSelectedOprganization } from '~/utils/selectedOrganization';
import { AdapterList } from '~/components/shared/AdapterList';

interface IPageLoaderData {
    adapters?: IAdapter[];
}

export const meta: MetaFunction = () => {
    return [{ title: 'Adapter' }, { name: 'description', content: 'Liste over adapter' }];
};

export const loader: LoaderFunction = async ({ request }) => {
    log('Request headers:', request.headers.get('x-nin'));
    const orgName = await getSelectedOprganization(request);
    const adapters = await AdapterAPI.getAdapters(orgName);
    return json({ adapters: adapters, orgName });
};

export default function Index() {
    const breadcrumbs = [{ name: 'Adaptere', link: '/adaptere' }];

    const { adapters } = useLoaderData<IPageLoaderData>();

    const navigate = useNavigate();

    const handleCreate = () => {
        navigate(`/adapter/create`);
    };

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <HStack align={'center'} justify={'space-between'}>
                <VStack>
                    <InternalPageHeader
                        title={'Adaptere'}
                        icon={MigrationIcon}
                        helpText="adaptere"
                    />
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

            {!adapters && <ErrorBox message="Fant ingen adaptere" />}

            {adapters && <AdapterList items={adapters} />}
        </>
    );
}
