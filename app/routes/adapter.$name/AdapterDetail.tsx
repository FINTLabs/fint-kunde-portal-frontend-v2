import { Box, HGrid, HStack, VStack } from '@navikt/ds-react';
import { IAdapter } from '~/types/types';
import { useFetcher, useLoaderData, useNavigate, useSubmit } from '@remix-run/react';
import Divider from 'node_modules/@navikt/ds-react/esm/dropdown/Menu/Divider';
import { IComponent } from '~/types/Component';
import { FETCHER_PASSORD_KEY, FETCHER_CLIENT_SECRET_KEY } from './constants';
import Autentisering from '../../components/shared/Autentisering';
import { AutentiseringDetail } from '~/types/AutentinseringDetail';
import { GeneralDetailView } from './GeneralDetailView';
import { BackButton } from '~/components/shared/BackButton';
import { DeleteModal } from '~/components/shared/DeleteModal';
import ComponentSelector from '../../components/shared/ComponentSelector';
import { getComponentIds } from '~/utils/helper';

export function AdapterDetail({ adapter }: { adapter: IAdapter }) {
    const { components } = useLoaderData<{ components: IComponent[] }>();

    const navigate = useNavigate();
    const selectedComponents = adapter.components;

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

    console.log(adapter);
    const submit = useSubmit();

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
                        ressourceIds={adapter.assetIds.reduce(
                            (acc, curr) => acc.concat(!acc ? curr : `, ${curr}`),
                            ''
                        )}
                        clientSecret={clientSecret}
                        passord={passord}
                        allDetails={allDetails}
                    />
                    <Divider className="pt-3" />
                    <ComponentSelector
                        items={components}
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
                    <DeleteModal
                        title="Slett adapter"
                        bodyText="Er du sikker på at du vil slette dette adapteret?"
                        action="delete"
                    />
                </VStack>
            </Box>
        </HGrid>
    );
}
