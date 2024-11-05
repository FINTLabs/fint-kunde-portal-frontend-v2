import React, { useState } from 'react';
import { ActionFunctionArgs, LoaderFunction, MetaFunction } from '@remix-run/node';
import { PersonGroupIcon, PersonSuitIcon, PlusIcon } from '@navikt/aksel-icons';
import { BodyLong, BodyShort, Box, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { json, useFetcher, useLoaderData } from '@remix-run/react';
import ContactApi from '~/api/ContactApi';
import RoleApi from '~/api/RolesApi';
import OrganisationApi from '~/api/OrganisationApi';
import ContactTable from '~/routes/kontakter/ContactTable';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import ContactModal from '~/routes/kontakter/ContactModal';
import { getSelectedOrganization as getSelectedOrganization } from '~/utils/selectedOrganization';
import { getFormData } from '~/utils/requestUtils';
import { handleApiResponse } from '~/utils/handleApiResponse';
import AlertManager from '~/components/AlertManager';
import useAlerts from '~/components/useAlerts';
import { IContact } from '~/types/Contact';
import { IRole } from '~/types/Role';
import { IFetcherResponseData } from '~/types/FetcherResponseData';

interface IPageLoaderData {
    technicalContacts?: IContact[] | string;
    rolesData?: IRole[];
    allContacts?: IContact[];
    error?: string;
    selectedOrg: string;
}

export const meta: MetaFunction = () => {
    return [{ title: 'Kontakter' }, { name: 'description', content: 'Liste over kontakter' }];
};

export const loader: LoaderFunction = async ({ request }) => {
    const selectedOrg = await getSelectedOrganization(request);

    const technicalContacts = await ContactApi.getTechnicalContacts(selectedOrg);
    const rolesData = await RoleApi.getRoles();
    const legalContact = await OrganisationApi.getLegalContact(selectedOrg);
    const allContacts = await ContactApi.getAllContacts();

    return json({
        technicalContacts,
        rolesData,
        legalContact,
        allContacts,
        selectedOrg,
    });
};

export default function Index() {
    const breadcrumbs = [{ name: 'Kontakter', link: '/kontakter' }];
    const { legalContact, technicalContacts, allContacts, rolesData, selectedOrg } = useLoaderData<
        IPageLoaderData & { legalContact?: IContact }
    >();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const fetcher = useFetcher();
    const actionData = fetcher.data as IFetcherResponseData;
    const { alerts } = useAlerts(actionData, fetcher.state);

    const handleFormSubmit = (formData: FormData) => {
        fetcher.submit(formData, { method: 'post', action: '/kontakter' });
    };

    function handleAddContact(formData: FormData) {
        formData.append('actionType', 'ADD_TECHNICAL_CONTACT');
        fetcher.submit(formData, {
            method: 'post',
        });
    }

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

            <AlertManager alerts={alerts} />

            <Box className="m-10">
                <Heading size="xsmall">Juridisk kontakt</Heading>
                {legalContact ? (
                    <HStack gap="4" align="center" className="px-4">
                        <PersonSuitIcon className="h-10 w-10 bg-slate-200 rounded-full border-4" />
                        <BodyShort size="medium">
                            {legalContact.firstName} {legalContact.lastName}
                        </BodyShort>
                    </HStack>
                ) : (
                    <BodyShort size="medium">Ingen juridisk kontakt funnet</BodyShort>
                )}
            </Box>

            {technicalContacts && typeof technicalContacts === 'string' && (
                <Box padding="8" background="surface-info-moderate">
                    <BodyLong>{technicalContacts}</BodyLong>
                </Box>
            )}
            {technicalContacts && typeof technicalContacts !== 'string' && (
                <ContactTable
                    contactsData={technicalContacts}
                    rolesData={rolesData}
                    onButtonClick={handleFormSubmit}
                    selectedOrg={selectedOrg}
                />
            )}
            <ContactModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                contacts={allContacts || []}
                onAddContact={handleAddContact}
            />
        </>
    );
}

export async function action({ request }: ActionFunctionArgs) {
    const actionName = 'Action in kontakter/route.tsx';
    const formData = await request.formData();

    const actionType = getFormData(formData.get('actionType'), 'actionType', actionName);
    const selectedOrg = await getSelectedOrganization(request);
    const contactNin = getFormData(formData.get('contactNin'), 'contactNin', actionName);
    const contactName = formData.get('contactName') as string;
    const roleName = formData.get('roleName') as string;
    const roleIdToAdd = formData.get('roleId') as string;
    const roleIdToDelete = formData.get('roleId') as string;

    let response;
    let apiResponse;
    switch (actionType) {
        case 'ADD_TECHNICAL_CONTACT':
            apiResponse = await ContactApi.addTechnicalContact(contactNin, selectedOrg);
            response = handleApiResponse(
                apiResponse,
                'Kontakten er lagt til. Husk å tildele roller til kontakten.'
            );
            break;
        case 'REMOVE_CONTACT':
            apiResponse = await ContactApi.removeTechnicalContact(contactNin, selectedOrg);
            response = handleApiResponse(
                apiResponse,
                'Kontakten er fjernet som teknisk kontakt',
                true
            );
            break;
        case 'SET_LEGAL_CONTACT':
            apiResponse = await ContactApi.setLegalContact(contactNin, selectedOrg);
            response = handleApiResponse(apiResponse, 'Kontakten er satt som juridisk kontakt');
            break;
        case 'ADD_ROLE':
            apiResponse = await RoleApi.addRole(selectedOrg, contactNin, roleIdToAdd);
            response = handleApiResponse(apiResponse, ` ${roleName} Lagt til ${contactName}`);
            break;
        case 'DELETE_ROLE':
            apiResponse = await RoleApi.removeRole(selectedOrg, contactNin, roleIdToDelete);
            response = handleApiResponse(
                apiResponse,
                ` ${roleName} fjernet fra ${contactName}`,
                true
            );
            break;
        default:
            return json({
                message: `Unknown action type '${actionType}'`,
                variant: 'error',
            });
    }

    // return json({ show: true, message: response?.message, variant: response?.variant });
    return response;
}
