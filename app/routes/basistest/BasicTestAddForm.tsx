import React, { useRef } from 'react';
import {
    Alert,
    Box,
    Button,
    HGrid,
    HStack,
    Modal,
    Select,
    TextField,
    VStack,
} from '@navikt/ds-react';
import { PlayIcon, XMarkIcon } from '@navikt/aksel-icons';
import { IComponent } from '~/types/Component';
import { IClient } from '~/types/Clients';

interface TestAddFormProps {
    components: IComponent[];
    clients: IClient[];
    f: any;
}

const BasicTestAddForm: React.FC<TestAddFormProps> = ({ components, clients, f }) => {
    const ref = useRef<HTMLDialogElement>(null);
    return (
        <f.Form>
            <HStack align={'center'} justify={'space-between'}>
                <HGrid gap="6" columns={3} className="w-11/12">
                    <Select label="Miljø" size="small" name={'environment'}>
                        <option value="pwf">Play-With-FINT</option>
                        <option value="beta">BETA</option>
                        <option value="api">Production</option>
                    </Select>

                    <Select label="Komponent" size="small" name={'component'}>
                        <option value="">Velg</option>
                        {components
                            .sort((a, b) => a.description.localeCompare(b.description))
                            .map((component, index) => (
                                <option value={component.description} key={index}>
                                    {component.description}
                                </option>
                            ))}
                    </Select>

                    <Select label="Klient" size="small" name="client">
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

                                <Button onClick={() => ref.current?.close()} formMethod="post">
                                    Kjør test
                                </Button>
                            </HStack>
                        </VStack>
                    </Alert>
                </Modal>
            </HStack>
        </f.Form>
    );
};

export default BasicTestAddForm;
