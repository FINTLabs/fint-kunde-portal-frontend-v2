import { PlayIcon } from '@navikt/aksel-icons';
import { Box, Button, HGrid, Search, Select, VStack } from '@navikt/ds-react';
import React, { useState } from 'react';

import { IComponent } from '~/types/Component';
import { IComponentConfig } from '~/types/ComponentConfig';

interface LogSearchFormProps {
    onSearchSubmit: (formData: FormData) => void;
    components: IComponent[];
    configs: IComponentConfig[];
    onFilter: (searchValue: string) => void;
}

const LogSearchForm = ({ onSearchSubmit, components, configs, onFilter }: LogSearchFormProps) => {
    const [selectedComponent, setSelectedComponent] = useState<string>('');
    const [selectedConfig, setSelectedConfig] = useState<string>('');
    const [selectedAction, setSelectedAction] = useState<string>('');
    const [selectedEnv, setSelectedEnv] = useState<string>('');
    const [matchingConfigs, setMatchingConfigs] = useState<IComponentConfig[]>([]);

    const [errors, setErrors] = useState({
        environment: false,
        component: false,
        configClass: false,
        action: false,
    });

    function handleChangeComponent(value: string) {
        setSelectedComponent(value);
        const matchedConfigs = configs.filter((config) => config.dn.includes(value));
        setMatchingConfigs(matchedConfigs);
    }

    if (!components) {
        return <div>No components</div>;
    }

    function handleFormSubmit() {
        // Validate the form resource
        const hasErrors = {
            environment: !selectedEnv,
            component: !selectedComponent,
            configClass: !selectedConfig,
            action: !selectedAction,
        };

        setErrors(hasErrors);

        // If there are any errors, do not submit the form
        if (Object.values(hasErrors).some((error) => error)) {
            return;
        }

        const formData = new FormData();
        formData.append('environment', selectedEnv);
        formData.append('component', selectedComponent);
        formData.append('resource', selectedConfig);
        formData.append('action', selectedAction);
        onSearchSubmit(formData);
    }

    return (
        <VStack gap="10" data-cy="log-search-form">
            <HGrid gap="6" columns={5}>
                <Select
                    data-cy="log-search-environment"
                    label={'Miljø'}
                    size="small"
                    name="environment"
                    error={errors.environment ? 'Påkrevd' : undefined}
                    onChange={(e) => {
                        setSelectedEnv(e.target.value);
                        setErrors((prev) => ({ ...prev, environment: false }));
                    }}>
                    <option value="">Velg</option>
                    <option value="api">API</option>
                    <option value="beta">BETA</option>
                    <option value="alpha">ALPHA</option>
                </Select>

                <Select
                    data-cy="log-search-component"
                    label={'Komponent'}
                    size="small"
                    onChange={(e) => {
                        handleChangeComponent(e.target.value);
                        setErrors((prev) => ({ ...prev, component: false }));
                    }}
                    error={errors.component ? 'Påkrevd' : undefined}>
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
                    label={'Ressurs'}
                    size="small"
                    onChange={(e) => {
                        setSelectedConfig(e.target.value);
                        setErrors((prev) => ({ ...prev, configClass: false }));
                    }}
                    value={selectedConfig}
                    name="configClass"
                    error={errors.configClass ? 'Påkrevd' : undefined}>
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
                    label={'Type'}
                    size="small"
                    onChange={(e) => {
                        setSelectedAction(e.target.value);
                        setErrors((prev) => ({ ...prev, action: false }));
                    }}
                    name="action"
                    error={errors.action ? 'Påkrevd' : undefined}>
                    <option value="">Velg</option>
                    <option value="GET_ALL">GET_ALL</option>
                    <option value="GET">GET</option>
                    <option value="UPDATE">UPDATE</option>
                </Select>

                <Box className="flex items-end">
                    <Button size="small" icon={<PlayIcon title="søk" />} onClick={handleFormSubmit}>
                        Søk
                    </Button>
                </Box>
            </HGrid>
            <Search
                label="Filtrer på id:"
                variant="simple"
                size="small"
                hideLabel={false}
                onChange={(value: string) => onFilter(value)}
                data-cy="log-search-button"
            />
        </VStack>
    );
};

export default LogSearchForm;
