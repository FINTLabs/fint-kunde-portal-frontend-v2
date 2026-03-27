import { Box, Heading, HelpText, Hide, HStack } from '@navikt/ds-react';
import React, { ReactNode } from 'react';
import { helpData, HelpDataItem } from '~/routes/help/HelpData';

interface PageHeaderProps {
    title: string;
    icon?: React.ElementType;
    helpText?: string;
    children?: ReactNode;
}

export function InternalPageHeader({
    title,
    icon: IconComponent,
    helpText,
    children,
}: PageHeaderProps) {
    const helpDescription = helpData.find(
        (item: HelpDataItem) => item.id === helpText
    )?.description;

    return (
        <Box
            paddingBlock="space-24"
            paddingInline="space-0"
            style={{
                borderBottom: '1px solid #e0e0e0',
                marginBottom: '1.5rem',
            }}>
            <HStack gap={'space-8'} justify="space-between">
                <HStack gap="space-8">
                    <Hide below="md">
                        {IconComponent && <IconComponent title="Header Icon" fontSize="2.5rem" />}
                    </Hide>
                    <Heading size="medium" level="2" spacing>
                        {title}
                    </Heading>
                    {helpText && helpDescription && (
                        <HelpText title={helpText}>{helpDescription}</HelpText>
                    )}
                </HStack>

                <Box padding="space-2">{children}</Box>
            </HStack>
        </Box>
    );
}

export default InternalPageHeader;
