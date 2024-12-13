import React, { useState } from 'react';
import { ActionFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { PersonGroupIcon, PersonSuitIcon, PlusIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { useFetcher, useLoaderData } from '@remix-run/react';
import ContactApi from '~/api/ContactApi';
import RoleApi from '~/api/RolesApi';
import OrganisationApi from '~/api/OrganisationApi';
import ContactTable from '~/routes/kontakter/ContactTable';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import ContactModal from '~/routes/kontakter/ContactModal';
import { getSelectedOrganization as getSelectedOrganization } from '~/utils/selectedOrganization';
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
    legalContact?: IContact;
}

export const meta: MetaFunction = () => {
    return [{ title: 'Kontakter' }, { name: 'description', content: 'Liste over kontakter' }];
};

export const loader: LoaderFunction = async ({ request }) => {
    const selectedOrg = await getSelectedOrganization(request);

    const technicalContactsResponse = await ContactApi.getTechnicalContacts(selectedOrg);
    const technicalContacts = technicalContactsResponse.success
        ? technicalContactsResponse.data
        : [];
    if (technicalContacts) {
        technicalContacts.sort((a: { firstName: string }, b: { firstName: string }) =>
            a.firstName.localeCompare(b.firstName)
        );
    }

    const rolesDataResponse = await RoleApi.getRoles();
    const legalContactResponse = await OrganisationApi.getLegalContact(selectedOrg);
    const allContactsResponse = await ContactApi.getAllContacts();

    return new Response(
        JSON.stringify({
            technicalContacts,
            rolesData: rolesDataResponse.data,
            legalContact: legalContactResponse.data,
            allContacts: allContactsResponse.data,
            selectedOrg,
        }),
        {
            headers: { 'Content-Type': 'application/json' },
        }
    );
};

export default function Index() {
    const breadcrumbs = [{ name: 'Kontakter', link: '/kontakter' }];
    const { legalContact, technicalContacts, allContacts, rolesData, selectedOrg } =
        useLoaderData<IPageLoaderData>();
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

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const actionType = formData.get('actionType') as string;
    const contactNin = formData.get('contactNin') as string;
    const roleId = formData.get('roleId') as string;
    const roleName = formData.get('roleName') as string;

    const selectedOrg = await getSelectedOrganization(request);
    let response;

    switch (actionType) {
        case 'ADD_TECHNICAL_CONTACT':
            response = await ContactApi.addTechnicalContact(contactNin, selectedOrg);
            break;
        case 'REMOVE_CONTACT':
            response = await ContactApi.removeTechnicalContact(contactNin, selectedOrg);
            break;
        case 'SET_LEGAL_CONTACT':
            response = await ContactApi.setLegalContact(contactNin, selectedOrg);
            break;
        case 'ADD_ROLE':
            response = await RoleApi.addRole(selectedOrg, contactNin, roleId, roleName);
            break;
        case 'DELETE_ROLE':
            response = await RoleApi.removeRole(selectedOrg, contactNin, roleId, roleName);
            break;
        default:
            response = {
                success: false,
                message: `Ukjent handlingstype: '${actionType}'`,
                variant: 'error',
            };
    }

    return response;
};
