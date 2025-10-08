import { PersonGroupIcon, PersonSuitIcon, PlusIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { type ApiResponse, NovariSnackbar, useAlerts } from 'novari-frontend-components';
import { useState } from 'react';
import { type ActionFunction,type MetaFunction, useFetcher, useLoaderData } from 'react-router';

import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { handleContactsAction } from '~/routes/kontakter/actions';
import ContactModal from '~/routes/kontakter/ContactModal';
import ContactTable from '~/routes/kontakter/ContactTable';
import { IContact } from '~/types/Contact';
import { IRole } from '~/types/Role';

import { loader } from './loaders';

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

export const action: ActionFunction = async ({ request }) => {
    return await handleContactsAction(request);
};

export { loader };

export default function Index() {
    const breadcrumbs = [{ name: 'Kontakter', link: '/kontakter' }];
    const { legalContact, technicalContacts, allContacts, rolesData, selectedOrg } =
        useLoaderData<IPageLoaderData>();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const fetcher = useFetcher();
    const actionData = fetcher.data as ApiResponse<IContact>;

    const { alertState } = useAlerts<IContact>([], actionData, fetcher.state);
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

            <HStack align="center" justify="space-between">
                <VStack>
                    <InternalPageHeader
                        title={'Kontakter'}
                        icon={PersonGroupIcon}
                        helpText="contacts"
                    />
                </VStack>
                <VStack>
                    <Button
                        data-cy="add-contact-button"
                        size="small"
                        onClick={() => setIsModalOpen(true)}
                        icon={<PlusIcon aria-hidden />}>
                        Legg til
                    </Button>
                </VStack>
            </HStack>

            {/*<AlertManager alerts={alerts} />*/}
            <NovariSnackbar
                items={alertState}
                position={'top-right'}
                // onCloseItem={handleCloseItem}
            />

            <Box className="m-10">
                <Heading size="xsmall">Juridisk kontakt</Heading>
                {legalContact ? (
                    <HStack gap="4" align="center" className="px-4">
                        <PersonSuitIcon className="h-10 w-10 bg-slate-200 rounded-full " />
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
                data-cy="contact-modal"
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                contacts={allContacts || []}
                onAddContact={handleAddContact}
            />
        </>
    );
}
