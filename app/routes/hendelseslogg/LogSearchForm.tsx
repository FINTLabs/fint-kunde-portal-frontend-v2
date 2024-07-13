import React from 'react';
import { Box, Button, HGrid, Select } from '@navikt/ds-react';
import { MagnifyingGlassIcon } from '@navikt/aksel-icons';

const LogSearchForm: React.FC = () => {
    return (
        <HGrid gap="6" columns={5}>
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
            <Select label="Ressurs" size="small">
                <option value="">Velg land</option>
                <option value="norge">Norge</option>
                <option value="sverige">Sverige</option>
                <option value="danmark">Danmark</option>
            </Select>
            <Select label="Action" size="small">
                <option value="norge">GET_ALL</option>
                <option value="sverige">GET</option>
                <option value="danmark">UPDATE</option>
            </Select>
            <Box>
                <Button icon={<MagnifyingGlassIcon title="Rediger" />} />
            </Box>
        </HGrid>
    );
};

export default LogSearchForm;
