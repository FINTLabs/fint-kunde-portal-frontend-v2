import React from 'react';
import { Box, Button, HGrid, Select, TextField } from '@navikt/ds-react';
import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { IComponent } from '~/types/Component';
import { IClient } from '~/types/Clients';

interface TestAddFormProps {
    components: IComponent[];
    clients: IClient[];
    f: any;
}

const BasicTestAddForm: React.FC<TestAddFormProps> = ({ components, clients, f }) => {
    return (
        <f.Form method="post">
            <HGrid gap="6" columns={5}>
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
                <TextField label="Ressurs" size="small" />
                <Box>
                    <Button icon={<MagnifyingGlassIcon title="Rediger" />} />
                </Box>
            </HGrid>
        </f.Form>
    );
};

export default BasicTestAddForm;
