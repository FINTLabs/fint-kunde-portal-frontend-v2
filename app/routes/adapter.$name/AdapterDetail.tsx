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
import { useFetcher, useLoaderData, useNavigate, useSubmit } from '@remix-run/react';
import Divider from 'node_modules/@navikt/ds-react/esm/dropdown/Menu/Divider';
import { PencilIcon, ArrowLeftIcon } from '@navikt/aksel-icons';
import { TrashIcon, FloppydiskIcon } from '@navikt/aksel-icons';
import ComponentsTable from '../komponenter._index/ComponentsTable';
import { IComponent } from '~/types/Component';
import {
    FETCHER_PASSORD_KEY,
    FETCHER_CLIENT_SECRET_KEY,
    FETCHER_UPDATE_ADAPTER,
} from './constants';
import Autentisering from '../../components/shared/Autentisering';
import { AutentiseringDetail } from '~/types/AutentinseringDetail';
import { useEffect, useState } from 'react';

function DetailValue({
    defaultValue,
    value,
    isEditing,
    setValue,
}: {
    defaultValue: string;
    value: string;
    isEditing: boolean;
    setValue: React.Dispatch<React.SetStateAction<string>>;
}) {
    return (
        <HStack justify={'space-between'} className="h-20">
            <VStack>
                {isEditing ? (
                    <TextField
                        value={value}
                        type="text"
                        htmlSize={defaultValue.length + 10}
                        label={'Kort beskrivelse'}
                        onChange={(e) => setValue(e.target.value)}
                        // defaultValue={defaultValue}
                    ></TextField>
                ) : (
                    <VStack justify={'space-between'} className="h-full">
                        <Label>Kort beskrivelse</Label>
                        <BodyLong className="h-10">{defaultValue}</BodyLong>
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

    const [isEditing, setIsEditing] = useState(false);
    const [adapterShortDesc, setAdapterShortDesc] = useState(adapter.shortDescription);
    const [adapterNote, setAdapterNote] = useState(adapter.note);

    const fetcher = useFetcher({ key: FETCHER_UPDATE_ADAPTER });
    const submit = useSubmit();

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
                                    value={adapterShortDesc}
                                    defaultValue={adapter.shortDescription}
                                    isEditing={isEditing}
                                    setValue={setAdapterShortDesc}
                                />
                                <HStack justify={'space-between'}>
                                    <DetailValue
                                        value={adapterNote}
                                        defaultValue={adapter.note}
                                        isEditing={isEditing}
                                        setValue={setAdapterNote}
                                    />
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
                                            type="submit"
                                            onClick={async () => {
                                                if (isEditing) {
                                                    if (
                                                        adapterNote.trim() !== adapter.note ||
                                                        adapterShortDesc.trim() !==
                                                            adapter.shortDescription
                                                    ) {
                                                        submit(
                                                            {
                                                                note: adapterNote,
                                                                shortDescription: adapterShortDesc,
                                                            },
                                                            {
                                                                method: 'POST',
                                                                action: 'update',
                                                                navigate: false,
                                                            }
                                                        );
                                                    }
                                                }
                                                setIsEditing(!isEditing);
                                            }}
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
