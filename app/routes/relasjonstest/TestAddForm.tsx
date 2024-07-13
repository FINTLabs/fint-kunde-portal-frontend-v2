import React from 'react';
import { Box, Button, HGrid, Select, TextField } from '@navikt/ds-react';
import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { IComponent } from '~/types/Component';
import { IClient } from '~/types/Clients';

interface TestAddFormProps {
    handleSearch: () => void;
    components: IComponent[];
    clients: IClient[];
}

const TestAddForm: React.FC<TestAddFormProps> = ({ handleSearch, components, clients }) => {
    return (
        <HGrid gap="6" columns={5}>
            <Select label="Miljø" size="small">
                <option value="norge">Play-With-FINT</option>
                <option value="sverige">BETA</option>
                <option value="danmark">Production</option>
            </Select>
            <Select label="Komponent" size="small">
                <option value="">Velg</option>
                {components.map((component, index) => (
                    <option value={component.name} key={index}>
                        {component.name}
                    </option>
                ))}
            </Select>
            <Select label="Klient" size="small">
                <option value="">Velg</option>
                {clients.map((client, index) => (
                    <option value={client.name} key={index}>
                        {client.name}
                    </option>
                ))}
            </Select>
            <TextField label="Ressurs" size="small" />
            <Box>
                <Button icon={<MagnifyingGlassIcon title="Rediger" />} onClick={handleSearch} />
            </Box>
        </HGrid>
    );
};

export default TestAddForm;
