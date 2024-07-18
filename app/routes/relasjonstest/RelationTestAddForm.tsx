import React from 'react';
import { Box, Button, HGrid, Select, TextField } from '@navikt/ds-react';
import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { IComponent } from '~/types/Component';
import { IClient } from '~/types/Clients';
import { log } from '~/utils/logger';

interface TestAddFormProps {
    f: any;
    components: IComponent[];
    clients: IClient[];
}

const RelationTestAddForm: React.FC<TestAddFormProps> = ({ f, components, clients }) => {
    log('data', components.length, clients.length);
    return (
        <f.Form>
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
                <TextField label="Ressurs" size="small" />
                <Box>
                    <Button icon={<MagnifyingGlassIcon title="Rediger" />} type={'submit'} />
                </Box>
            </HGrid>
        </f.Form>
    );
};

export default RelationTestAddForm;
