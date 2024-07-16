import React from 'react';
import { Box, Button, HGrid, Select } from '@navikt/ds-react';
import { PlayIcon } from '@navikt/aksel-icons';

const TestCreateForm: React.FC = () => {
    return (
        <HGrid gap="6" columns={4}>
            <Select label="Miljø" size="small">
                <option value="norge">API</option>
                <option value="sverige">BETA</option>
                <option value="danmark">ALPHA</option>
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
            <Box>
                <Button icon={<PlayIcon title="Rediger" />} />
            </Box>
        </HGrid>
    );
};

export default TestCreateForm;
