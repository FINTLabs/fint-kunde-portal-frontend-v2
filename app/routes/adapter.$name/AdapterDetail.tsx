import {
    BodyLong,
    Box,
    Button,
    Chips,
    CopyButton,
    HStack,
    Heading,
    Label,
    VStack,
} from '@navikt/ds-react';
import { IAdapter } from '~/types/types';
import { useNavigate } from '@remix-run/react';
import Divider from 'node_modules/@navikt/ds-react/esm/dropdown/Menu/Divider';
import { PencilIcon, ArrowLeftIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { ValueDisplayPanel } from './ValueDisplayPanel';
import AdapterAPI from '~/api/AdapterApi';
import { fetchClientSecret, resetPassword } from './actions';
import { TrashIcon, PlusIcon } from '@navikt/aksel-icons';

export function AdapterDetail({
    adapter,
    organisationName,
}: {
    adapter: IAdapter;
    organisationName: string;
}) {
    const navigate = useNavigate();

    const [clientSecret, setClientSecret] = useState('');
    const [passord, setPassord] = useState('');

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
                            {/* <Heading size="medium" spacing>
                                {adapter.note}
                            </Heading> */}
                            <VStack>
                                <Label>Note</Label>
                                <HStack className="!flex !justify-between !items-center">
                                    <BodyLong>{adapter.note}</BodyLong>
                                    <Button
                                        icon={<PencilIcon title="Rediger" />}
                                        variant="tertiary"
                                    />
                                </HStack>
                                <Divider className="pt-3" />
                            </VStack>
                            {/* <VStack>
                                <Label>Komponenter:</Label>
                                <ComponentsList selected={adapter.components} />
                                <Divider className="pt-3" />
                            </VStack> */}
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
                                    revalidate={() => resetPassword(setPassord)}
                                />

                                <ValueDisplayPanel
                                    label="Klient Hemmelighet"
                                    value={clientSecret}
                                    revalidate={() =>
                                        fetchClientSecret(
                                            adapter.name,
                                            organisationName,
                                            setClientSecret
                                        )
                                    }
                                />
                                <div className="h-10"></div>
                                <HStack justify={'center'}>
                                    <CopyButton
                                        copyText={JSON.stringify(allDetails)}
                                        text="Kopier alt"
                                        activeText={`Alt er kopiert!`}
                                    />
                                    <Button variant="danger" icon={<TrashIcon aria-hidden />}>
                                        Slett
                                    </Button>
                                </HStack>

                                {/* <Divider className="pt-3" /> */}
                            </VStack>
                        </VStack>
                    </Box>
                </VStack>
            </HStack>
        </Box>
    );
}
