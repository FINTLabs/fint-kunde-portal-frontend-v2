import React from 'react';
import { Box, Button, HGrid, Select, TextField } from '@navikt/ds-react';
import { MagnifyingGlassIcon } from '@navikt/aksel-icons';

interface TestAddFormProps {
    handleSearch: () => void;
}

const TestAddForm: React.FC<TestAddFormProps> = ({ handleSearch }) => {
    return (
        <HGrid gap="6" columns={5}>
            <Select label="Miljø" size="small">
                <option value="norge">Play-With-FINT</option>
                <option value="sverige">BETA</option>
                <option value="danmark">Production</option>
            </Select>
            <Select label="Komponent" size="small">
                <option value="">Velg land</option>
                <option value="norge">Norge</option>
                <option value="sverige">Sverige</option>
                <option value="danmark">Danmark</option>
            </Select>
            <Select label="Klient" size="small">
                <option value="">Velg land</option>
                <option value="norge">Norge</option>
                <option value="sverige">Sverige</option>
                <option value="danmark">Danmark</option>
            </Select>
            <TextField label="Ressurs" size="small" />
            <Box>
                <Button icon={<MagnifyingGlassIcon title="Rediger" />} onClick={handleSearch} />
            </Box>
        </HGrid>
    );
};

export default TestAddForm;
