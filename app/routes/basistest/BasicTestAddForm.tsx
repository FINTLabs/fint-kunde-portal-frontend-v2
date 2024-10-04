import React, { useRef, useState } from 'react';
import { Alert, Button, HGrid, HStack, Modal, Select, VStack } from '@navikt/ds-react';
import { PlayIcon } from '@navikt/aksel-icons';
import { IComponent } from '~/types/Component';
import { IClient } from '~/types/Clients';

interface TestAddFormProps {
    components: IComponent[];
    clients: IClient[];
    onSearchSubmit: (formData: FormData) => void;
}

const BasicTestAddForm: React.FC<TestAddFormProps> = ({ components, clients, onSearchSubmit }) => {
    const ref = useRef<HTMLDialogElement>(null);

    const [selectedComponent, setSelectedComponent] = useState<string>('');
    const [selectedClient, setSelectedClient] = useState<string>('');
    const [selectedEnv, setSelectedEnv] = useState<string>('');

    function handleFormSubmit() {
        const formData = new FormData();
        formData.append('environment', selectedEnv);
        formData.append('component', selectedComponent);
        formData.append('client', selectedClient);
        onSearchSubmit(formData);
    }

    return (
        <>
            <HStack align={'center'} justify={'space-between'}>
                <HGrid gap="6" columns={3} className="w-11/12">
                    <Select
                        label="Miljø"
                        size="small"
                        name={'environment'}
                        onChange={(e) => setSelectedEnv(e.target.value)}>
                        <option value="pwf">Play-With-FINT</option>
                        <option value="beta">BETA</option>
                        <option value="api">Produksjon</option>
                    </Select>

                    <Select
                        label="Komponent"
                        size="small"
                        name={'component'}
                        onChange={(e) => setSelectedComponent(e.target.value)}>
                        <option value="">Velg</option>
                        {components
                            .sort((a, b) => a.description.localeCompare(b.description))
                            .map((component, index) => (
                                <option value={component.description} key={index}>
                                    {component.description}
                                </option>
                            ))}
                    </Select>

                    <Select
                        label="Klient"
                        size="small"
                        name="client"
                        onChange={(e) => setSelectedClient(e.target.value)}>
                        <option value="">Velg</option>
                        {clients.map((client) => (
                            <option value={client.shortDescription} key={client.dn}>
                                {client.shortDescription}
                            </option>
                        ))}
                    </Select>
                </HGrid>

                <Button
                    icon={<PlayIcon title="Start Test" />}
                    onClick={() => ref.current?.showModal()}
                />
                <Modal ref={ref} closeOnBackdropClick aria-label="Advarsel, passord vil resettes">
                    <Alert variant="warning" className="justify-center">
                        <VStack gap="6">
                            <p>Passordet på klienten kommer til å bli nullstilt.</p>
                            <HStack gap="8" justify="center">
                                <Button variant="secondary" onClick={() => ref.current?.close()}>
                                    Avbryt
                                </Button>

                                <Button onClick={handleFormSubmit}>Kjør test</Button>
                            </HStack>
                        </VStack>
                    </Alert>
                </Modal>
            </HStack>
        </>
    );
};

export default BasicTestAddForm;
