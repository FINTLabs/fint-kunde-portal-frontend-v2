import { Box, Heading, HGrid, VStack } from '@navikt/ds-react';
import { IAdapter } from '~/types/types';
import { useLoaderData, useSubmit } from '@remix-run/react';
import Divider from 'node_modules/@navikt/ds-react/esm/dropdown/Menu/Divider';
import { IComponent } from '~/types/Component';
import { GeneralDetailView } from './GeneralDetailView';
import { BackButton } from '~/components/shared/BackButton';
import { getComponentIds } from '~/utils/helper';
import ComponentList from '~/components/shared/ComponentList';
import ComponentSelector from '~/components/shared/ComponentSelector';
import { IAccess } from '~/types/Access';
import { AuthTable } from '~/components/shared/AuthTable';

export function AdapterDetail({
    adapter,
    hasAccessControl,
    access,
}: {
    adapter: IAdapter;
    hasAccessControl: boolean;
    access: IAccess[];
}) {
    const { components } = useLoaderData<{ components: IComponent[] }>();
    const submit = useSubmit();

    function onComponentToggle() {
        console.info('------- handle component checkbox (function not in use yet)');
    }

    return (
        <HGrid gap="2" align={'start'}>
            <BackButton to={`/adaptere`} className="relative h-12 w-12 top-2 right-14" />
            <Box padding="6" borderRadius="large" shadow="small" className="relative bottom-12">
                <VStack gap="5">
                    <GeneralDetailView adapter={adapter} />

                    <Divider className="pt-3" />
                    <Heading size={'medium'}>Autentisering</Heading>
                    <AuthTable entity={adapter} entityType="adapter" actionName="adapterName" />

                    <Divider className="pt-3" />

                    <Heading size={'medium'}>Tilgangsstyring for Komponenter</Heading>
                    {hasAccessControl ? (
                        <ComponentList
                            accessList={access}
                            clientName={adapter.name}
                            onToggle={onComponentToggle}
                        />
                    ) : (
                        <ComponentSelector
                            items={components}
                            adapterName={adapter.name}
                            selectedItems={getComponentIds(adapter.components)}
                            toggle={(name, isChecked) => {
                                submit(
                                    {
                                        componentName: name,
                                        updateType: isChecked ? 'add' : 'remove',
                                        actionType: 'UPDATE_COMPONENT_IN_ADAPTER',
                                    },
                                    {
                                        method: 'POST',
                                        action: 'update',
                                        navigate: false,
                                    }
                                );
                            }}
                        />
                    )}
                </VStack>
            </Box>
        </HGrid>
    );
}
