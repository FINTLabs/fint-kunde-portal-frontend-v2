import React, { useState } from 'react';
import { Box, Button, HGrid, Search, Select, VStack } from '@navikt/ds-react';
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
    onFilter: (searchValue: string) => void;
}

const LogSearchForm: React.FC<LogSearchFormProps> = ({
    onSearchSubmit,
    components,
    configs,
    onFilter,
}) => {
    const [selectedComponent, setSelectedComponent] = useState<string>('');
    const [selectedConfig, setSelectedConfig] = useState<string>('');
    const [selectedAction, setSelectedAction] = useState<string>('');
    const [selectedEnv, setSelectedEnv] = useState<string>('');
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
        formData.append('environment', selectedEnv);
        formData.append('component', selectedComponent);
        formData.append('resource', selectedConfig);
        formData.append('action', selectedAction);
        onSearchSubmit(formData);
    }

    return (
        <VStack gap={'10'}>
            {/*<input*/}
            {/*    type={'hidden'}*/}
            {/*    name={'component'}*/}
            {/*    value={selectedComponent}*/}
            {/*    onChange={(e) => setSelectedEnv(e.target.value)}*/}
            {/*/>*/}
            <HGrid gap="6" columns={5}>
                <Select
                    label="Miljø"
                    size="small"
                    name={'environment'}
                    onChange={(e) => setSelectedEnv(e.target.value)}>
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
                <Box className="flex items-end">
                    {/*<Button icon={<MagnifyingGlassIcon title="Rediger" />} onClick={onSearch} />*/}
                    <Button
                        size="small"
                        icon={<MagnifyingGlassIcon title="Rediger" />}
                        onClick={handleFormSubmit}>
                        Søk
                    </Button>
                </Box>
            </HGrid>

            <Search
                label="Filtrer på ID - Skriv nøyaktig ID"
                variant="simple"
                size={'small'}
                hideLabel={false}
                onChange={(value: string) => onFilter(value)}
            />
        </VStack>
    );
};

export default LogSearchForm;
