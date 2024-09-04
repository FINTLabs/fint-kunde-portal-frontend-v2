import React, { useState } from 'react';
import { Box, Button, HGrid, Select, VStack } from '@navikt/ds-react';
import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { IComponent } from '~/types/Component';
import { IComponentConfig } from '~/types/ComponentConfig';

interface LogSearchFormProps {
    // handleSearch: (
    //     environment: string,
    //     component: string,
    //     configClass: string,
    //     selectedAction: string
    // ) => void;
    onSearchSubmit: (formData: FormData) => void;
    components: IComponent[];
    configs: IComponentConfig[];
}

const LogSearchForm: React.FC<LogSearchFormProps> = ({ onSearchSubmit, components, configs }) => {
    const [selectedComponent, setSelectedComponent] = useState<string>('');
    const [selectedConfig, setSelectedConfig] = useState<string>('');
    const [selectedAction, setSelectedAction] = useState<string>('');
    const [matchingConfigs, setMatchingConfigs] = useState<IComponentConfig[]>([]);

    function handleChangeComponent(value: string) {
        setSelectedComponent(value);
        const matchedConfigs = configs.filter((config) => config.dn.includes(value));
        setMatchingConfigs(matchedConfigs);
        // setSelectedComponentError(undefined);
    }

    if (!components) {
        return <div>No components</div>;
    }

    function handleFormSubmit() {
        const formData = new FormData();
        formData.append('environment', 'beta');
        formData.append('component', selectedComponent);
        formData.append('resource', selectedConfig);
        formData.append('action', selectedAction);
        onSearchSubmit(formData);
    }

    return (
        <VStack gap={'10'}>
            <input type={'hidden'} name={'component'} value={selectedComponent} />
            <HGrid gap="6" columns={5}>
                <Select
                    label="Miljø"
                    size="small"
                    // onChange={(e) => setSelectedEnvironment(e.target.value)}
                    name={'environment'}>
                    <option value="api">API</option>
                    <option value="beta">BETA</option>
                    <option value="alpha">ALPHA</option>
                </Select>
                <Select
                    label="Komponent"
                    size="small"
                    onChange={(e) => handleChangeComponent(e.target.value)}>
                    <option value="">Velg</option>
                    {components
                        .sort((a, b) => a.description.localeCompare(b.description))
                        .map((component, index) => (
                            <option value={component.name} key={index}>
                                {component.description}
                            </option>
                        ))}
                </Select>

                <Select
                    label="Ressurs"
                    size="small"
                    onChange={(e) => setSelectedConfig(e.target.value)}
                    value={selectedConfig}
                    name={'configClass'}>
                    <option value="">Velg</option>
                    {matchingConfigs.flatMap((config) =>
                        config.classes.map((item, index) => (
                            <option value={item.name} key={index}>
                                {item.name}
                            </option>
                        ))
                    )}
                </Select>
                <Select
                    label="Type"
                    size="small"
                    onChange={(e) => setSelectedAction(e.target.value)}
                    name={'action'}>
                    <option value="GET_ALL">GET_ALL</option>
                    <option value="GET">GET</option>
                    <option value="UPDATE">UPDATE</option>
                </Select>
                <Box>
                    {/*<Button icon={<MagnifyingGlassIcon title="Rediger" />} onClick={onSearch} />*/}
                    <Button
                        icon={<MagnifyingGlassIcon title="Rediger" />}
                        onClick={handleFormSubmit}>
                        Search
                    </Button>
                </Box>
            </HGrid>
            {/*<HGrid gap={'10'} columns={2}>*/}
            {/*    <TextField*/}
            {/*        label="Filtrer på ID - Ved blank vises alle"*/}
            {/*        size="small"*/}
            {/*        name={'filter'}*/}
            {/*    />*/}
            {/*</HGrid>*/}
        </VStack>
    );
};

export default LogSearchForm;
