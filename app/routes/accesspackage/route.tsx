import React, { useState } from 'react';
import { ArrowLeftIcon, KeyVerticalIcon, PlusIcon } from '@navikt/aksel-icons';
import { Box, Button, Heading, HGrid, HStack, VStack } from '@navikt/ds-react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { LoaderFunction } from '@remix-run/node';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { json, useLoaderData } from '@remix-run/react';
import AccessApi from '~/api/AccessApi';
import { IAccess } from '~/types/Access';
import AccessTemplateTable from '~/routes/accesspackage/AccessTemplateTable';
import AccessTemplateDetails from '~/routes/accesspackage/AccessTemplateDetails';

interface IPageLoaderData {
    templates?: IAccess[] | string;
    accesses?: IAccess[] | string;
    error?: string;
}

export const meta = () => {
    return [
        { title: 'Tilgangspakker' },
        { name: 'description', content: 'Liste over Tilgangspakker' },
    ];
};

export const loader: LoaderFunction = async ({ request }) => {
    try {
        const selectedOrg = await getSelectedOrganization(request);

        const accesses = await AccessApi.getAllAccess(selectedOrg);
        const templates = await AccessApi.getAccessTemplates();

        return json({
            accesses,
            templates,
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};

export default function Index() {
    const breadcrumbs = [{ name: 'Tilgangspakker', link: '/accesspackage' }];
    const { accesses, templates } = useLoaderData<IPageLoaderData>();
    const [selectedTemplate, setSelectedTemplate] = useState<IAccess | null>(null);

    const isTemplatesArray = Array.isArray(templates);

    const handleSelectTemplate = (template: IAccess) => {
        setSelectedTemplate(template);
    };
    const handleBackClick = () => {
        setSelectedTemplate(null);
    };

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <HStack align={'center'} justify={'space-between'}>
                <VStack>
                    <InternalPageHeader
                        title={'Tilgangspakker'}
                        icon={KeyVerticalIcon}
                        helpText="tilgangspakker"
                    />
                </VStack>

                <VStack>
                    <Button size="small" icon={<PlusIcon aria-hidden />}>
                        Legg til
                    </Button>
                </VStack>
            </HStack>

            {selectedTemplate && (
                <>
                    <HGrid gap="2" align={'start'}>
                        <Button
                            variant="tertiary"
                            className="relative h-12 w-12 top-2 right-14"
                            icon={<ArrowLeftIcon title="Gå tilbake" fontSize="1.5rem" />}
                            onClick={handleBackClick}></Button>
                    </HGrid>
                </>
            )}

            {selectedTemplate ? (
                <Box padding="6" borderRadius="large" shadow="small" className="relative bottom-12">
                    <AccessTemplateDetails template={selectedTemplate} />
                </Box>
            ) : (
                <>
                    <Box>
                        <Heading size={'medium'}>Accesses</Heading>
                        {isTemplatesArray ? (
                            <AccessTemplateTable
                                data={accesses as IAccess[]}
                                onSelectTemplate={handleSelectTemplate}
                            />
                        ) : (
                            <p>No accesses available or failed to load.</p>
                        )}
                    </Box>
                    <Box>
                        <Heading size={'medium'}>Templates?</Heading>
                        {isTemplatesArray ? (
                            <AccessTemplateTable
                                data={templates as IAccess[]}
                                onSelectTemplate={handleSelectTemplate}
                            />
                        ) : (
                            <p>No templates available or failed to load.</p>
                        )}
                    </Box>
                </>
            )}
        </>
    );
}
