import React from 'react';
import { Box, Button, HGrid, Select, TextField } from '@navikt/ds-react';
import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { IComponent } from '~/types/Component';
import { IClient } from '~/types/Clients';
import { log } from '~/utils/logger';
import { IAsset } from '~/types/Asset';

interface TestAddFormProps {
    components: IComponent[];
    clients: IClient[];
    assets: IAsset[];
    runTest: (formData: { testString: string }) => void;
}

const RelationTestAddForm: React.FC<TestAddFormProps> = ({
    components,
    clients,
    assets,
    runTest,
}) => {
    function onRunTest() {
        const formData = {
            testString: 'testing',
        };
        runTest(formData);
    }

    return (
        <HGrid gap="6" columns={5}>
            <Select label="Miljø" size="small">
                <option value="pwf">Play-With-FINT</option>
                <option value="beta">BETA</option>
                <option value="api">Production</option>
            </Select>
            <Select label="Komponent" size="small">
                <option value="">Velg</option>
                {components.map((component, index) => (
                    <option value={component.name} key={index}>
                        {component.description}
                    </option>
                ))}
            </Select>
            <Select label="Klient" size="small">
                <option value="">Velg</option>
                {clients.map((client, index) => (
                    <option value={client.name} key={index}>
                        {client.shortDescription}
                    </option>
                ))}
            </Select>
            <Select label="Resource" size="small">
                <option value="">Velg</option>
                {assets.map((asset, index) => (
                    <option value={asset.dn} key={index}>
                        {asset.name}
                    </option>
                ))}
            </Select>
            {/*<TextField label="Ressurs" size="small" />*/}
            <Box>
                {/*<Button icon={<MagnifyingGlassIcon title="Rediger" />} onClick={onRunTest}/>*/}
                <Button
                    variant="primary"
                    onClick={() => onRunTest()}
                    icon={<MagnifyingGlassIcon title="Rediger" />}>
                    run test
                </Button>
            </Box>
        </HGrid>
    );
};

export default RelationTestAddForm;
