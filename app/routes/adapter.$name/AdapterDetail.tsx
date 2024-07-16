import {
    BodyLong,
    Box,
    Button,
    HStack,
    Heading,
    Label,
    Select,
    TextField,
    VStack,
} from '@navikt/ds-react';
import { IAdapter } from '~/types/types';
import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react';
import Divider from 'node_modules/@navikt/ds-react/esm/dropdown/Menu/Divider';
import { PencilIcon, ArrowLeftIcon } from '@navikt/aksel-icons';
import { TrashIcon, FloppydiskIcon } from '@navikt/aksel-icons';
import ComponentsTable from '../komponenter._index/ComponentsTable';
import { IComponent } from '~/types/Component';
import { FETCH_PASSORD_KEY, FETCH_CLIENT_SECRET_KEY } from './constants';
import Autentisering from '../../components/shared/Autentisering';
import { AutentiseringDetail } from '~/types/AutentinseringDetail';
import { useState } from 'react';

function DetailValue({ value, isEditing }: { value: string; isEditing: boolean }) {
    return (
        <HStack justify={'space-between'} className="h-20">
            <VStack>
                {isEditing ? (
                    <TextField
                        type="text"
                        htmlSize={value.length + 10}
                        label={'Kort beskrivelse'}
                        defaultValue={value}></TextField>
                ) : (
                    <VStack justify={'space-between'} className="h-full">
                        <Label>Kort beskrivelse</Label>
                        <BodyLong className="h-10">{value}</BodyLong>
                    </VStack>
                )}
            </VStack>
        </HStack>
    );
}

export function AdapterDetail({ adapter }: { adapter: IAdapter }) {
    const { components } = useLoaderData<{ components: IComponent[] }>();

    const navigate = useNavigate();
    const selectedComponents = adapter.components;

    const passordFetcher = useFetcher({ key: FETCH_PASSORD_KEY });
    const clientSecretFetcher = useFetcher({ key: FETCH_CLIENT_SECRET_KEY });

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

    const [isEditing, setIsEditing] = useState(false);

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
                            <VStack gap="3">
                                <HStack justify={'space-between'} align={'center'}>
                                    <Heading align="start" size="medium">
                                        Detaljer
                                    </Heading>
                                </HStack>
                                <DetailValue
                                    value={adapter.shortDescription}
                                    isEditing={isEditing}
                                />
                                <HStack justify={'space-between'}>
                                    <DetailValue value={adapter.note} isEditing={isEditing} />
                                    <VStack align={'end'} justify={'end'}>
                                        <Button
                                            icon={
                                                isEditing ? (
                                                    <FloppydiskIcon title="Lagre" />
                                                ) : (
                                                    <PencilIcon title="Rediger" />
                                                )
                                            }
                                            variant="tertiary"
                                            onClick={() => setIsEditing(!isEditing)}
                                        />
                                    </VStack>
                                </HStack>
                                <Divider className="pt-3" />
                            </VStack>
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
