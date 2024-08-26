import React from 'react';
import { TerminalIcon } from '@navikt/aksel-icons';
import { HStack, VStack } from '@navikt/ds-react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';

export const meta = () => {
    return [{ title: 'Samtykke' }, { name: 'description', content: 'Liste over Samtykke' }];
};

export default function Index() {
    const breadcrumbs = [{ name: 'Samtykke', link: '/samtykke' }];

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <HStack align={'center'} justify={'space-between'}>
                <VStack>
                    <InternalPageHeader
                        title={'Samtykke'}
                        icon={TerminalIcon}
                        helpText="samtykke"
                    />
                </VStack>
            </HStack>
        </>
    );
}
