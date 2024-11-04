import React from 'react';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { PlusIcon, TokenIcon } from '@navikt/aksel-icons';
import { Button, HStack, Search, VStack } from '@navikt/ds-react';

interface ClientPageHeaderProps {
    title: string;
    helpText: string;
    onCreate: () => void;
    onSearch: (value: string) => void;
}

const ClientPageHeader: React.FC<ClientPageHeaderProps> = ({
    title,
    helpText,
    onCreate,
    onSearch,
}) => {
    return (
        <>
            <HStack align={'center'} justify={'space-between'}>
                <VStack>
                    <InternalPageHeader title={title} icon={TokenIcon} helpText={helpText} />
                </VStack>
                <VStack>
                    <Button
                        className="float-right"
                        onClick={onCreate}
                        icon={<PlusIcon aria-hidden />}
                        size="small">
                        Legg til
                    </Button>
                </VStack>
            </HStack>
            <Search
                label="Søk etter klienter"
                hideLabel
                variant="secondary"
                size="small"
                onChange={(value: string) => onSearch(value)}
                placeholder="Søk etter navn eller beskrivelse"
                className="pb-6"
            />
        </>
    );
};

export default ClientPageHeader;
