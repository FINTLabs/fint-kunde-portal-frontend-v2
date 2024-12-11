// app/components/InternalPageHeader.tsx
import React from 'react';
import { Button, Heading, HelpText, Hide, HStack } from '@navikt/ds-react';
import { helpData, HelpDataItem } from '~/routes/help/HelpData';
import { PlusIcon } from '@navikt/aksel-icons';

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
        <HStack align={'center'} justify={'space-between'}>
            <HStack align="start" gap="2" className={'my-4 '}>
                <Hide below="md">
                    {IconComponent && <IconComponent title="Header Icon" fontSize="2.5rem" />}
                </Hide>
                <Heading className="" level="1" size="large">
                    {title}
                </Heading>
                {helpText && helpDescription && (
                    <HelpText title={helpText}>{helpDescription}</HelpText>
                )}
            </HStack>
            {onAddClick && (
                <Button
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
