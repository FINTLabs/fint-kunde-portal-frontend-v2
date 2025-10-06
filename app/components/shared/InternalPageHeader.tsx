// app/components/InternalPageHeader.tsx
import { PlusIcon } from '@navikt/aksel-icons';
import { Button, Heading, HelpText, Hide, HStack } from '@navikt/ds-react';
import React from 'react';

import { helpData, HelpDataItem } from '~/routes/help/HelpData';


interface LayoutHeaderProps {
    icon?: React.ElementType;
    title: string;
    helpText?: string;
    onAddClick?: () => void;
}

const InternalPageHeader = ({
    icon: IconComponent,
    title,
    helpText,
    onAddClick,
}: LayoutHeaderProps) => {
    const helpDescription = helpData.find(
        (item: HelpDataItem) => item.id === helpText
    )?.description;

    return (
        <HStack align={'center'} justify={'space-between'} data-cy="internal-page-header">
            <HStack align="start" gap="2" className={'my-4 '}>
                <Hide below="md">
                    {IconComponent && <IconComponent title="Header Icon" fontSize="2.5rem" />}
                </Hide>
                <Heading className="" level="1" size="large" data-cy="page-title">
                    {title}
                </Heading>
                {helpText && helpDescription && (
                    <HelpText title={helpText}>{helpDescription}</HelpText>
                )}
            </HStack>
            {onAddClick && (
                <Button
                    data-cy="add-button"
                    className="float-right"
                    onClick={onAddClick}
                    icon={<PlusIcon aria-hidden />}
                    size={'small'}>
                    Legg til
                </Button>
            )}
        </HStack>
    );
};

export default InternalPageHeader;
