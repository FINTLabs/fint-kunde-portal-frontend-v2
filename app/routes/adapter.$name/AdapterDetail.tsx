import { BodyLong, Box, Button, HStack, Heading, Modal, Select, VStack } from '@navikt/ds-react';
import { IAdapter } from '~/types/types';
import { Form, useFetcher, useLoaderData, useNavigate, useSubmit } from '@remix-run/react';
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
import { useState } from 'react';
import { EditableTextField } from './EditableTextField';
import { DeleteAdapter } from './DeleteAdapter';

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
                                <EditableTextField
                                    label={'Kort beskrivelse'}
                                    value={adapterShortDesc}
                                    isEditing={isEditing}
                                    setValue={setAdapterShortDesc}
                                />
                                <HStack justify={'space-between'}>
                                    <EditableTextField
                                        label={'Note'}
                                        value={adapterNote}
                                        isEditing={isEditing}
                                        setValue={setAdapterNote}
                                    />
                                    <HStack className="w-full" align={'end'} justify={'end'}>
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
                                    </HStack>
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
                            <DeleteAdapter />
                        </VStack>
                    </Box>
                </VStack>
            </HStack>
        </Box>
    );
}
