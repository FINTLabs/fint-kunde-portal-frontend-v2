// app/components/InternalPageHeader.tsx
import React from 'react';
import { Box, Heading, HelpText, Hide, HStack, VStack } from '@navikt/ds-react';
import { helpData, HelpDataItem } from '~/routes/help/HelpData';

interface LayoutHeaderProps {
    icon?: React.ElementType;
    title: string;
    helpText?: string; // Make helpText optional
    hideBorder?: boolean;
}

const InternalPageHeader: React.FC<LayoutHeaderProps> = ({
    icon: IconComponent,
    title,
    helpText,
    hideBorder = false,
}) => {
    const helpDescription = helpData.find(
        (item: HelpDataItem) => item.id === helpText
    )?.description;

    return (
        <Box
            as="header"
            borderWidth={`0 0 ${!hideBorder ? '4' : '0'} 0`}
            borderColor="border-info"
            className={'mb-10'}>
            <div className="max-w-5xl">
                <Box paddingInline="4" paddingBlock="0 6">
                    <VStack gap={'3'}>
                        <HStack align="start" gap="8">
                            <Hide below="md">
                                {IconComponent && (
                                    <IconComponent title="a11y-title" fontSize="3.5rem" />
                                )}
                            </Hide>
                            <Heading level="1" size="xlarge">
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
