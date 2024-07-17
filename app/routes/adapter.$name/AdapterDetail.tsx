import {
    BodyLong,
    Box,
    Button,
    HStack,
    Heading,
    Label,
    Modal,
    Select,
    TextField,
    VStack,
} from '@navikt/ds-react';
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
import { useEffect, useRef, useState } from 'react';

function EditableTextField({
    label,
    value,
    isEditing,
    setValue,
}: {
    label: string;
    value: string;
    isEditing: boolean;
    setValue: React.Dispatch<React.SetStateAction<string>>;
}) {
    const maxChars = 94;
    return (
        <HStack justify={'space-between'}>
            <VStack className="h-20">
                {isEditing ? (
                    <TextField
                        value={value}
                        type="text"
                        htmlSize={value.length + 10 < maxChars ? value.length + 10 : maxChars}
                        label={label}
                        onChange={(e) => setValue(e.target.value)}></TextField>
                ) : (
                    <VStack justify={'space-between'} className="">
                        <Label>{label}</Label>
                        <BodyLong className="min-h-15 pt-3">{value}</BodyLong>
                    </VStack>
                )}
            </VStack>
        </HStack>
    );
}

function DeleteAdapter() {
    const ref = useRef<HTMLDialogElement>(null);

    return (
        <>
            <Button
                variant="danger"
                onClick={() => ref.current?.showModal()}
                icon={<TrashIcon aria-hidden />}>
                Slett
            </Button>
            <Modal ref={ref} header={{ heading: 'Slett adapter' }}>
                <Modal.Body>
                    <BodyLong>Er du sikker på at du vil slette dette adapteret?</BodyLong>
                </Modal.Body>
                <Modal.Footer>
                    <Form action="delete" method="post" navigate={false}>
                        <Button type="submit" variant="danger">
                            Ja, jeg er sikker
                        </Button>
                    </Form>

                    <Button type="button" onClick={() => ref.current?.close()}>
                        Avbryt
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
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
                                                        const res = submit(
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

                                                        console.log('res');
                                                        console.log(res);
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
                            <DeleteAdapter></DeleteAdapter>
                        </VStack>
                    </Box>
                </VStack>
            </HStack>
        </Box>
    );
}
