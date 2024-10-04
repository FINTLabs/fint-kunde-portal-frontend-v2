import { json, type LoaderFunction, type MetaFunction } from '@remix-run/node';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { MigrationIcon, PlusIcon } from '@navikt/aksel-icons';
import { Button, HStack, VStack } from '@navikt/ds-react';
import AdapterAPI from '~/api/AdapterApi';
import { useLoaderData, useNavigate, useSearchParams } from '@remix-run/react';
import { IAdapter } from '~/types/types';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { CustomTabs } from '~/components/shared/CustomTabs';
import { InfoBox } from '~/components/shared/InfoBox';

interface IPageLoaderData {
    adapters?: IAdapter[];
    error: string;
}

export const meta: MetaFunction = () => {
    return [{ title: 'Adapter' }, { name: 'description', content: 'Liste over adapter' }];
};

export const loader: LoaderFunction = async ({ request }) => {
    const orgName = await getSelectedOrganization(request);
    const response = await AdapterAPI.getAdapters(orgName);
    return json({ adapters: response.error ? null : response, orgName, error: response.error });
};

export default function Index() {
    const breadcrumbs = [{ name: 'Adaptere', link: '/adaptere' }];
    const { adapters, error } = useLoaderData<IPageLoaderData>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const deleted = searchParams.get('deleted');

    const handleCreate = () => {
        navigate(`/adapter/create`);
    };

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            {deleted && <InfoBox message={`Adaptere ${deleted} slettet`} />}
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

            {error && <InfoBox message={error}></InfoBox>}
            {adapters && adapters.length == 0 && <InfoBox message="Ingen adaptere" />}

            {/* {adapters && <AdapterList items={adapters} />} */}
            {adapters && <CustomTabs items={adapters} />}
        </>
    );
}
