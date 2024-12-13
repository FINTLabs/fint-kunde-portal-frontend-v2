import React, { useRef, useState } from 'react';
import { Alert, Box, Button, HGrid, HStack, Modal, Select, VStack } from '@navikt/ds-react';
import { PlayIcon } from '@navikt/aksel-icons';
import { IComponent } from '~/types/Component';
import { IClient } from '~/types/Clients';

interface TestAddFormProps {
    components: IComponent[];
    clients: IClient[];
    onSearchSubmit: (baseUrl: string, endpoint: string, clientName: string) => void;
}

function useFormState(clients: IClient[]) {
    const [selectedComponent, setSelectedComponent] = useState<string>('');
    const [selectedClient, setSelectedClient] = useState<string>('');
    const [selectedEnv, setSelectedEnv] = useState<string>('');

    const filteredClients = clients.filter((client) => !client.managed);
    const sortedClients = filteredClients.sort((a, b) =>
        a.shortDescription.localeCompare(b.shortDescription)
    );

    return {
        selectedComponent,
        setSelectedComponent,
        selectedClient,
        setSelectedClient,
        selectedEnv,
        setSelectedEnv,
        sortedClients,
    };
}

export default function BasicTestAddForm({
    components,
    clients,
    onSearchSubmit,
}: TestAddFormProps) {
    const ref = useRef<HTMLDialogElement>(null);
    const {
        selectedComponent,
        setSelectedComponent,
        selectedClient,
        setSelectedClient,
        selectedEnv,
        setSelectedEnv,
        sortedClients,
    } = useFormState(clients);

    function handleFormSubmit() {
        ref.current?.close();
        onSearchSubmit(selectedEnv, selectedComponent, selectedClient);
    }

    function renderSelectOptions(
        items: any[],
        keyProp: string,
        valueProp: string,
        labelProp: string
    ) {
        return items.map((item, index) => (
            <option value={item[valueProp]} key={item[keyProp] || index}>
                {item[labelProp]}
            </option>
        ));
    }

    return (
        <>
            <HGrid gap="6" columns={4}>
                <Select
                    label="Miljø"
                    size="small"
                    name="environment"
                    onChange={(e) => setSelectedEnv(e.target.value)}>
                    <option value="https://play-with-fint.felleskomponent.no">
                        Play-With-FINT
                    </option>
                    <option value="https://beta.felleskomponent.no">BETA</option>
                    <option value="https://api.felleskomponent.no">Produksjon</option>
                </Select>

                <Select
                    label="Komponent"
                    size="small"
                    name="component"
                    onChange={(e) => setSelectedComponent(e.target.value)}>
                    <option value="">Velg</option>
                    {renderSelectOptions(
                        components.sort((a, b) => a.description.localeCompare(b.description)),
                        'basePath',
                        'basePath',
                        'description'
                    )}
                </Select>

                <Select
                    label="Klient"
                    size="small"
                    name="client"
                    onChange={(e) => setSelectedClient(e.target.value)}>
                    <option value="">Velg</option>
                    {renderSelectOptions(sortedClients, 'dn', 'name', 'shortDescription')}
                </Select>

                <Box className="flex items-end">
                    <Button
                        icon={<PlayIcon title="Start Test" />}
                        onClick={() => ref.current?.showModal()}
                        size="small">
                        Kjør
                    </Button>
                </Box>
            </HGrid>

            <Modal ref={ref} closeOnBackdropClick aria-label="Advarsel, passord vil resettes">
                <Alert variant="warning" className="justify-center">
                    <VStack gap="6">
                        <p>Passordet på klienten kommer til å bli nullstilt.</p>
                        <HStack gap="8" justify="center">
                            <Button variant="secondary" onClick={() => ref.current?.close()}>
                                Avbryt
                            </Button>
                            <Button onClick={handleFormSubmit}>Kjør</Button>
                        </HStack>
                    </VStack>
                </Alert>
            </Modal>
        </>
    );
}
