import { Box, Button, HStack, Heading, VStack } from '@navikt/ds-react';
import { IAdapter } from '~/types/types';
import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react';
import Divider from 'node_modules/@navikt/ds-react/esm/dropdown/Menu/Divider';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import ComponentsTable from '../komponenter._index/ComponentsTable';
import { IComponent } from '~/types/Component';
import { FETCHER_PASSORD_KEY, FETCHER_CLIENT_SECRET_KEY } from './constants';
import Autentisering from '../../components/shared/Autentisering';
import { AutentiseringDetail } from '~/types/AutentinseringDetail';
import { DeleteAdapter } from './DeleteAdapter';
import { GeneralDetailView } from './GeneralDetailView';
import { BackButton } from '~/components/shared/BackButton';
import { DeleteModal } from '~/components/shared/DeleteModal';

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

    return (
        <Box padding={'2'}>
            <HStack>
                <VStack>
                    <BackButton to={`/adaptere`} />
                </VStack>
                <VStack className="flex flex-grow">
                    <Box className="w-full" padding="6" borderRadius="large" shadow="small">
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
                            <VStack>
                                <Heading size="medium" spacing>
                                    Komponenter
                                </Heading>
                                <ComponentsTable
                                    components={components}
                                    selectedComponents={selectedComponents}
                                />
                            </VStack>
                            <DeleteModal
                                title="Slett adapter"
                                bodyText="Er du sikker på at du vil slette dette adapteret?"
                                action="delete"
                            />
                        </VStack>
                    </Box>
                </VStack>
            </HStack>
        </Box>
    );
}
