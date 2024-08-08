import React, { useEffect, useState } from 'react';
import { ActionFunctionArgs, LoaderFunction, MetaFunction } from '@remix-run/node';
import { PersonGroupIcon, PersonSuitIcon, PlusIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Box, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { json, useFetcher, useLoaderData } from '@remix-run/react';
import ContactApi from '~/api/ContactApi';
import RoleApi from '~/api/RolesApi';
import OrganisationApi from '~/api/OrganisationApi';
import ContactTable from '~/routes/kontakter/ContactTable';
import { log } from '~/utils/logger';
import { IContact, IFetcherResponseData, IRole } from '~/types/types';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import ContactModal from '~/routes/kontakter/ContactModal';
import { getSelectedOrganization as getSelectedOrganization } from '~/utils/selectedOrganization';

interface IPageLoaderData {
    technicalContacts?: IContact[];
    rolesData?: IRole[];
    allContacts?: IContact[];
    error?: string;
}

export const meta: MetaFunction = () => {
    return [{ title: 'Kontakter' }, { name: 'description', content: 'Liste over kontakter' }];
};

export const loader: LoaderFunction = async ({ request }) => {
    log('Request headers:', request.headers.get('x-nin'));

    try {
        const selectedOrg = await getSelectedOrganization(request);

        const technicalContacts = await ContactApi.getTechnicalContacts(selectedOrg);
        const rolesData = await RoleApi.getRoles();
        const legalContact = await OrganisationApi.getLegalContact(selectedOrg);
        const allContacts = await ContactApi.getAllContacts();

        return json({ technicalContacts, rolesData, legalContact, allContacts });
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};

// export async function action({ request }: ActionFunctionArgs) {
//     const formData = await request.formData();
//     const formValues: Record<string, FormDataEntryValue> = {};
//
//     for (const [key, value] of formData) {
//         formValues[key] = value;
//     }
//
//     const contactNin = (formValues['selectedContactNin'] as string) || '';
//
//     const session = await getSession(request.headers.get('Cookie'));
//     const userSession = session.get('user_session');
//     const selectedOrg = userSession.selectedOrganization.name;
//
//     const response = await ContactApi.addTechnicalContact(contactNin, selectedOrg);
//
//     return json({ show: true, message: response?.message, variant: response?.variant });
// }
export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const actionType = formData.get('actionType');
    const selectedOrg = await getSelectedOrganization(request);
    const contactNin = (formData.get('contactNin') as string) || '';
    const roleId = (formData.get('roleId') as string) || '';

    log('INSIDE ACTION', actionType);
    // let formValues: any = {};
    // for (const [key, value] of formData) {
    //     formValues[key] = value;
    // }

    let response;
    switch (actionType) {
        case 'addTechnicalContact':
            response = await ContactApi.addTechnicalContact(contactNin, selectedOrg);
            break;
        case 'removeTechnicalContact':
            response = await ContactApi.removeTechnicalContact(contactNin, selectedOrg);
            break;
        case 'setLegalContact':
            response = await ContactApi.setLegalContact(contactNin, selectedOrg);
            break;
        case 'addRole':
            response = await RoleApi.addRole(selectedOrg, contactNin, roleId);
            break;
        case 'deleteRole':
            response = await RoleApi.removeRole(selectedOrg, contactNin, roleId);
            break;
        default:
            return json({ show: true, message: 'Unknown action type', variant: 'error' });
    }

    return json({ show: true, message: 'Unknown action type', variant: 'error' });
}

export default function Index() {
    const breadcrumbs = [{ name: 'Kontakter', link: '/kontakter' }];
    const data = useLoaderData<IPageLoaderData & { legalContact?: IContact }>();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const fetcher = useFetcher();
    const actionData = fetcher.data as IFetcherResponseData;
    const [show, setShow] = React.useState(false);

    useEffect(() => {
        setShow(true);
        setIsModalOpen(false);
    }, [fetcher.state]);

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <HStack align={'center'} justify={'space-between'}>
                <VStack>
                    <InternalPageHeader
                        title={'Kontakter'}
                        icon={PersonGroupIcon}
                        helpText="contacts"
                    />
                </VStack>
                <VStack>
                    <Button
                        size="small"
                        onClick={() => setIsModalOpen(true)}
                        icon={<PlusIcon aria-hidden />}>
                        Legg til
                    </Button>
                </VStack>
            </HStack>

            {actionData && show && (
                <Alert
                    variant={actionData.variant as 'error' | 'info' | 'warning' | 'success'}
                    closeButton
                    onClose={() => setShow(false)}>
                    {actionData.message || 'Content'}
                </Alert>
            )}

            <Box className="m-10">
                <Heading size="xsmall">Juridisk kontakt</Heading>
                {data.legalContact ? (
                    <HStack gap="4" align="center" className="px-4">
                        <PersonSuitIcon className="h-10 w-10 bg-slate-200 rounded-full border-4" />
                        <BodyShort size="medium">{data.legalContact.firstName}</BodyShort>
                    </HStack>
                ) : (
                    <BodyShort size="medium">Ingen juridisk kontakt funnet</BodyShort>
                )}
            </Box>

            <ContactTable contactsData={data.technicalContacts} rolesData={data.rolesData} />
            <ContactModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                contacts={data.allContacts || []}
                f={fetcher}
            />
        </>
    );
}
