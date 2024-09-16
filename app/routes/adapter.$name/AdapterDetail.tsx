import { Box, GuidePanel, Heading, HGrid, VStack } from '@navikt/ds-react';
import { IAdapter } from '~/types/types';
import { useFetcher, useLoaderData, useSubmit } from '@remix-run/react';
import Divider from 'node_modules/@navikt/ds-react/esm/dropdown/Menu/Divider';
import { IComponent } from '~/types/Component';
import { FETCHER_CLIENT_SECRET_KEY, FETCHER_PASSORD_KEY } from './constants';
import Autentisering from '../../components/shared/Autentisering';
import { AutentiseringDetail } from '~/types/AutentinseringDetail';
import { GeneralDetailView } from './GeneralDetailView';
import { BackButton } from '~/components/shared/BackButton';
import { DeleteModal } from '~/components/shared/DeleteModal';
import { getComponentIds } from '~/utils/helper';
import ComponentList from '~/routes/accesscontrol.$id/ComponentList';
import { SealCheckmarkIcon } from '@navikt/aksel-icons';
import ComponentSelector from '~/components/shared/ComponentSelector';

export function AdapterDetail({
    adapter,
    hasAccessControl,
}: {
    adapter: IAdapter;
    hasAccessControl: boolean;
}) {
    const { components } = useLoaderData<{ components: IComponent[] }>();

    // const navigate = useNavigate();
    // const selectedComponents = adapter.components;

    const passordFetcher = useFetcher({ key: FETCHER_PASSORD_KEY });
    const clientSecretFetcher = useFetcher({ key: FETCHER_CLIENT_SECRET_KEY });

    const clientSecret = clientSecretFetcher.data ? (clientSecretFetcher.data as string) : '';
    const passord = passordFetcher.data ? (passordFetcher.data as string) : '';

    const allDetails: AutentiseringDetail = {
        username: adapter.name,
        password: passord,
        clientId: adapter.clientId,
        openIdSecret: clientSecret,
        scope: 'fint-client',
        idpUri: 'https://idp.felleskomponent.no/nidp/oauth/nam/token',
        assetIds: adapter.assetIds,
    };

    const submit = useSubmit();

    function onComponentToggle() {
        console.log('------- handle component checkbox');
    }

    return (
        <HGrid gap="2" align={'start'}>
            <BackButton to={`/adaptere`} className="relative h-12 w-12 top-2 right-14" />
            <Box padding="6" borderRadius="large" shadow="small" className="relative bottom-12">
                <VStack gap="5">
                    <GeneralDetailView adapter={adapter} />
                    <Divider className="pt-3" />
                    <Autentisering
                        name={adapter.name}
                        clientId={adapter.clientId}
                        resourceIds={adapter.assetIds.reduce(
                            (acc, curr) => acc.concat(!acc ? curr : `, ${curr}`),
                            ''
                        )}
                        clientSecret={clientSecret}
                        password={passord}
                        allDetails={allDetails}
                    />
                    <Divider className="pt-3" />

                    <Heading size={'medium'}>Tilgangsstyring for Komponenter</Heading>
                    {hasAccessControl ? (
                        <ComponentList
                            items={components}
                            selectedItems={getComponentIds(adapter.components)}
                            clientName={adapter.name}
                            onToggle={onComponentToggle}
                        />
                    ) : (
                        <>
                            <GuidePanel
                                poster
                                illustration={
                                    <SealCheckmarkIcon title="a11y-title" fontSize="1.5rem" />
                                }>
                                Vi jobber for tiden med å utvikle et system som vil gjøre det mulig
                                for brukere å finjustere tilgangen til komponenter i klienter og
                                adaptere
                            </GuidePanel>
                            <ComponentSelector
                                items={components}
                                adapterName={adapter.name}
                                selectedItems={getComponentIds(adapter.components)}
                                toggle={(name, isChecked) => {
                                    submit(
                                        {
                                            componentName: name,
                                            updateType: isChecked ? 'add' : 'remove',
                                            actionType: 'UPDATE_COMPONENT_IN_ADAPTER',
                                        },
                                        {
                                            method: 'POST',
                                            action: 'update',
                                            navigate: false,
                                        }
                                    );
                                }}
                            />
                        </>
                    )}

                    <HGrid columns={3}>
                        {!adapter.managed && (
                            <DeleteModal
                                title="Slett adapter"
                                bodyText="Er du sikker på at du vil slette dette adapteret?"
                                action="delete"
                            />
                        )}
                    </HGrid>
                </VStack>
            </Box>
        </HGrid>
    );
}
