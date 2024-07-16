import {
    BodyLong,
    Box,
    Button,
    CopyButton,
    HStack,
    Heading,
    Label,
    VStack,
} from '@navikt/ds-react';
import { IAdapter } from '~/types/types';
import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react';
import Divider from 'node_modules/@navikt/ds-react/esm/dropdown/Menu/Divider';
import { PencilIcon, ArrowLeftIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { ValueDisplayPanel } from './ValueDisplayPanel';
import { deleteAdapter } from './actions';
import { TrashIcon } from '@navikt/aksel-icons';
import ComponentsTable from '../komponenter._index/ComponentsTable';
import { IComponent } from '~/types/Component';
import { FETCH_PASSORD_KEY, FETCH_CLIENT_SECRET_KEY } from './constants';

export function AdapterDetail({ adapter }: { adapter: IAdapter }) {
    const { components } = useLoaderData<{ components: IComponent[] }>();

    const navigate = useNavigate();
    const selectedComponents = adapter.components;

    const passordFetcher = useFetcher({ key: FETCH_PASSORD_KEY });
    const clientSecretFetcher = useFetcher({ key: FETCH_CLIENT_SECRET_KEY });

    const clientSecret = clientSecretFetcher.data ? (clientSecretFetcher.data as string) : '';
    const passord = passordFetcher.data ? (passordFetcher.data as string) : '';

    // console.log(adapter);
    const allDetails = {
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
                    <Button
                        icon={<ArrowLeftIcon title="a11y-title" fontSize="1.5rem" />}
                        variant="tertiary"
                        onClick={() => navigate(`/adaptere`)}></Button>
                </VStack>
                <VStack className="flex flex-grow">
                    <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                        <VStack gap="5">
                            <VStack>
                                <Heading size="medium" spacing>
                                    Detaljer
                                </Heading>
                                <Label>Kort beskrivelse</Label>
                                <HStack className="!flex !justify-between !items-center">
                                    <BodyLong>{adapter.shortDescription}</BodyLong>
                                    <Button
                                        icon={<PencilIcon title="Rediger" />}
                                        variant="tertiary"
                                    />
                                </HStack>
                                <Label>Note</Label>
                                <HStack className="!flex !justify-between !items-center">
                                    <BodyLong>{adapter.note}</BodyLong>
                                </HStack>
                                <Divider className="pt-3" />
                            </VStack>

                            <VStack>
                                <Heading size="medium" spacing>
                                    Autentisering
                                </Heading>
                                <ValueDisplayPanel label="Brukernavn" value={adapter.name} />
                                <ValueDisplayPanel label="Klient ID" value={adapter.clientId} />
                                <ValueDisplayPanel
                                    label="Ressurs Id-er"
                                    value={adapter.assetIds.reduce(
                                        (acc, curr) => acc.concat(!acc ? curr : `, ${curr}`),
                                        ''
                                    )}
                                />
                                <ValueDisplayPanel
                                    label="Passord"
                                    value={passord}
                                    fetcherKey={FETCH_PASSORD_KEY}
                                />

                                <ValueDisplayPanel
                                    label="Klient Hemmelighet"
                                    value={clientSecret}
                                    fetcherKey={FETCH_CLIENT_SECRET_KEY}
                                />
                                <div className="h-10"></div>
                                <HStack justify={'center'}>
                                    <CopyButton
                                        copyText={JSON.stringify(allDetails)}
                                        text="Kopier alt"
                                        activeText={`Alt er kopiert!`}
                                    />
                                </HStack>
                                <Divider className="pt-3" />
                            </VStack>
                            <VStack>
                                <Heading size="medium" spacing>
                                    Komponenter
                                </Heading>
                                <ComponentsTable
                                    components={components}
                                    selectedComponents={selectedComponents}
                                />
                            </VStack>
                            <Button
                                variant="danger"
                                onClick={() => alert('Display a modal')}
                                icon={<TrashIcon aria-hidden />}>
                                Slett
                            </Button>
                        </VStack>
                    </Box>
                </VStack>
            </HStack>
        </Box>
    );
}
