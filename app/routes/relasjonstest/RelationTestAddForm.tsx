import React, { useState } from 'react';
import { Box, Button, HGrid, Select } from '@navikt/ds-react';
import { PlayIcon } from '@navikt/aksel-icons';
import { IComponent } from '~/types/Component';
import { IComponentConfig } from '~/types/ComponentConfig';

interface TestAddFormProps {
    components: IComponent[];
    configs: IComponentConfig[];
    runTest: (testUrl: string) => void;
}

const RelationTestAddForm = ({ components, configs, runTest }: TestAddFormProps) => {
    const [selectedComponent, setSelectedComponent] = useState<string>('');
    const [selectedConfig, setSelectedConfig] = useState<string>('');
    const [selectedBaseUrl, setSelectedBaseUrl] = useState(
        'https://play-with-fint.felleskomponent.no'
    );
    const [selectedComponentError, setSelectedComponentError] = useState<string | undefined>();
    const [matchingConfigs, setMatchingConfigs] = useState<IComponentConfig[]>([]);

    function handleChangeComponent(value: string) {
        setSelectedComponent(value);

        const matchedConfig = configs.find((config) => config.dn.includes(value));

        if (matchedConfig) {
            setSelectedConfig(matchedConfig.path);
        }

        setMatchingConfigs(matchedConfig ? [matchedConfig] : []);
        setSelectedComponentError(undefined);
    }

    function onRunTest() {
        let isValid = true;
        if (selectedComponent === '') {
            setSelectedComponentError('påkrevd');
            isValid = false;
        } else {
            setSelectedComponentError(undefined);
        }

        if (isValid) {
            // const component = components.find((comp) => comp.dn === selectedComponent);
            const fullUrl = `${selectedBaseUrl}${selectedConfig}`;
            // console.debug('FULL URL:', fullUrl);
            runTest(fullUrl);
        }
    }

    return (
        <HGrid gap="6" columns={5}>
            <Select
                label="Miljø"
                size="small"
                name={'baseUrl'}
                error={selectedComponentError}
                onChange={(e) => setSelectedBaseUrl(e.target.value)}>
                <option value="https://play-with-fint.felleskomponent.no">Play-With-FINT</option>
                <option value="https://beta.felleskomponent.no">BETA</option>
                <option value="https://api.felleskomponent.no">Produksjon</option>
            </Select>

            <Select
                label="Komponent"
                size="small"
                onChange={(e) => handleChangeComponent(e.target.value)}
                value={selectedComponent}
                error={selectedComponentError}>
                <option value="">Velg</option>
                {components.map((component, index) => (
                    <option value={component.dn} key={index}>
                        {component.description}
                    </option>
                ))}
            </Select>

            <Select
                label="Ressurs"
                size="small"
                onChange={(e) => setSelectedConfig(e.target.value)}
                value={selectedConfig}
                name={'configClass'}
                disabled={matchingConfigs.length === 0}>
                <option value="">Velg</option>
                {matchingConfigs.flatMap((config) =>
                    config.classes.map((item, index) => (
                        <option value={item.path} key={index}>
                            {item.name}
                        </option>
                    ))
                )}
            </Select>

            <Box className="flex items-end">
                <Button
                    size="small"
                    variant="primary"
                    onClick={onRunTest}
                    icon={<PlayIcon title="Rediger" />}>
                    Kjør
                </Button>
            </Box>
        </HGrid>
    );
};

export default RelationTestAddForm;
