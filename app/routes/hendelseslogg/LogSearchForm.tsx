import React, { useState } from 'react';
import { Box, Button, HGrid, Select, TextField, VStack } from '@navikt/ds-react';
import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { IComponent } from '~/types/Component';
import { IComponentConfig } from '~/types/ComponentConfig';
interface LogSearchFormProps {
    handleSearch: (
        environment: string,
        component: string,
        configClass: string,
        selectedAction: string
    ) => void;
    components: IComponent[];
    configs: IComponentConfig[];
}

const LogSearchForm: React.FC<LogSearchFormProps> = ({ handleSearch, components, configs }) => {
    const [selectedEnvironment, setSelectedEnvironment] = useState<string>('API');
    const [selectedComponent, setSelectedComponent] = useState<string>('');
    const [selectedConfig, setSelectedConfig] = useState<string>('');
    const [selectedAction, setSelectedAction] = useState<string>('GET_ALL');
    const [componentConfig, setComponentConfig] = useState<IComponentConfig>();

    const onSearch = () => {
        handleSearch(selectedEnvironment, selectedComponent, selectedConfig, selectedAction);
    };

    function handleChangeComponent(value: string) {
        const findConfig = configs.find((config) => config.dn === value);
        setComponentConfig(findConfig);
        setSelectedConfig('');
        setSelectedComponent(findConfig ? findConfig.name : '');
    }

    //TODO: form error handling
    return (
        <VStack gap={'10'}>
            <HGrid gap="6" columns={5}>
                <Select
                    label="Miljø"
                    size="small"
                    onChange={(e) => setSelectedEnvironment(e.target.value)}>
                    <option value="api">API</option>
                    <option value="beta">BETA</option>
                    <option value="alpha">ALPHA</option>
                </Select>
                <Select
                    label="Komponent"
                    size="small"
                    onChange={(e) => handleChangeComponent(e.target.value)}>
                    <option value="">Velg</option>
                    {components.map((component, index) => (
                        <option value={component.dn} key={index}>
                            {component.name}
                        </option>
                    ))}
                </Select>
                <Select
                    label="Configs"
                    size="small"
                    onChange={(e) => setSelectedConfig(e.target.value)}
                    value={selectedConfig}
                    name={'config'}>
                    <option value="">Velg</option>
                    {componentConfig?.classes.map((item, index) => (
                        <option value={item.name} key={index}>
                            {item.name}
                        </option>
                    ))}
                </Select>
                <Select
                    label="Action"
                    size="small"
                    onChange={(e) => setSelectedAction(e.target.value)}>
                    <option value="GET_ALL">GET_ALL</option>
                    <option value="GET">GET</option>
                    <option value="UPDATE">UPDATE</option>
                </Select>
                <Box>
                    <Button icon={<MagnifyingGlassIcon title="Rediger" />} onClick={onSearch} />
                </Box>
            </HGrid>
            <HGrid gap={'10'} columns={2}>
                <TextField label="Filtrer på ID - Ved blank vises alle" size="small" />
            </HGrid>
        </VStack>
    );
};

export default LogSearchForm;
