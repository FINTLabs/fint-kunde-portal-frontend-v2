import { Box, Button, HGrid, Select, VStack } from '@navikt/ds-react';
import { Form } from 'react-router';

interface FilterOption {
    value: string;
    label: string;
}

interface ErrorsFilterFormProps {
    searchParams: URLSearchParams;
    selectedComponent: string | null;
    selectedResource: string | null;
    selectedProblemType: string | null;
    componentOptions: FilterOption[];
    resourceOptions: FilterOption[];
    problemTypeOptions: FilterOption[];
    onSelectChange: (name: string, value: string) => void;
}

export default function BrokenLinksFilterForm({
    searchParams,
    selectedComponent,
    selectedResource,
    selectedProblemType,
    componentOptions,
    resourceOptions,
    problemTypeOptions,
    onSelectChange,
}: ErrorsFilterFormProps) {
    // const formRef = useRef<HTMLFormElement>(null);
    // const submit = useSubmit();
    //
    // const handleSelectChange = () => {
    //     console.log('form change');
    //     if (!formRef.current) return;
    //
    //     const pageInput = formRef.current.querySelector<HTMLInputElement>('input[name="page"]');
    //
    //     if (pageInput) {
    //         pageInput.value = '0';
    //     }
    //
    //     submit(formRef.current, {
    //         method: 'get',
    //         preventScrollReset: true,
    //     });
    // };

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onSelectChange(event.target.name, event.target.value);
    };

    return (
        <Box padding="space-16" borderColor="neutral-subtle" borderWidth="2" borderRadius="12">
            <Form method="get" preventScrollReset>
                {searchParams.get('size') && (
                    <input type="hidden" name="size" value={searchParams.get('size') ?? ''} />
                )}
                <VStack gap="space-8">
                    <HGrid columns={{ xs: 1, sm: 2, md: 4 }} gap="space-8">
                        <Select
                            label="Komponent"
                            name="component"
                            size="small"
                            onChange={handleSelectChange}
                            value={selectedComponent ?? ''}>
                            <option value="">Alle komponenter</option>
                            {componentOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Select>
                        <Select
                            label="Ressurs"
                            name="resource"
                            size="small"
                            onChange={handleSelectChange}
                            defaultValue={selectedResource ?? ''}>
                            <option value="">Alle ressurser</option>
                            {resourceOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Select>
                        <Select
                            label="Problemtype"
                            name="problemType"
                            size="small"
                            onChange={handleSelectChange}
                            defaultValue={selectedProblemType ?? ''}>
                            <option value="">Alle problemtyper</option>
                            {problemTypeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Select>
                        <div className="flex items-end justify-end">
                            <Button
                                as="a"
                                href="/linkwalker/broken"
                                type="button"
                                size="small"
                                variant="secondary">
                                Nullstill
                            </Button>
                        </div>
                    </HGrid>
                </VStack>
            </Form>
        </Box>
    );
}
