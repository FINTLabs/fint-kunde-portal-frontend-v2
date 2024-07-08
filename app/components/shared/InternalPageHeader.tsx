// app/components/InternalPageHeader.tsx
import React from 'react';
import { Box, Heading, HelpText, Hide, HStack, VStack } from '@navikt/ds-react';
import { helpData, HelpDataItem } from '~/routes/help/HelpData';

interface LayoutHeaderProps {
    icon?: React.ElementType;
    title: string;
    helpText?: string; // Make helpText optional
}

const InternalPageHeader: React.FC<LayoutHeaderProps> = ({
    icon: IconComponent,
    title,
    helpText,
}) => {
    const helpDescription = helpData.find(
        (item: HelpDataItem) => item.id === helpText
    )?.description;

    return (
        <Box as="header" className={'my-4 '}>
            <div className="max-w-5xl">
                <Box paddingInline="4">
                    <VStack gap={'3'}>
                        <HStack align="start" gap="2">
                            <Hide below="md">
                                {IconComponent && (
                                    <IconComponent title="a11y-title" fontSize="2.5rem" />
                                )}
                            </Hide>
                            <Heading className="" level="1" size="large">
                                {title}
                            </Heading>
                            {helpText && helpDescription && (
                                <HelpText title={helpText}>{helpDescription}</HelpText>
                            )}
                        </HStack>
                    </VStack>
                </Box>
            </div>
        </Box>
    );
};

export default InternalPageHeader;
