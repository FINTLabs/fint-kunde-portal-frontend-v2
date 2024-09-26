import React from 'react';
import { Box, Button, Checkbox, FormSummary, HGrid, HStack } from '@navikt/ds-react';
import { ChevronRightCircleIcon, KeyVerticalIcon } from '@navikt/aksel-icons';
import { useNavigate } from '@remix-run/react';

interface Access {
    domain: string;
    packageName: string;
    status: string;
}

interface ComponentListProps {
    accessList: Access[];
    onToggle: (domain: string, packageName: string, checked: boolean) => void;
    adapterName?: string;
    clientName?: string;
}

const ComponentList: React.FC<ComponentListProps> = ({
    accessList,
    onToggle,
    adapterName,
    clientName,
}) => {
    const navigate = useNavigate();

    const handleRowClick = (domain: string, packageName: string) => {
        if (adapterName) {
            navigate(`/accesscontrol/${domain}?package=${packageName}&adapter=${adapterName}`);
        } else if (clientName) {
            navigate(`/accesscontrol/${domain}?package=${packageName}&client=${clientName}`);
        }
    };

    // Group the accessList by domain
    const groupedByDomain = accessList.reduce((acc: Record<string, Access[]>, item: Access) => {
        if (!acc[item.domain]) {
            acc[item.domain] = [];
        }
        acc[item.domain].push(item);
        return acc;
    }, {});

    return (
        <Box>
            <HGrid gap={'3'} columns={3}>
                {Object.keys(groupedByDomain).map((domain, i) => {
                    const domainAccess = groupedByDomain[domain];

                    return (
                        <FormSummary key={`${domain}-${i}`}>
                            <FormSummary.Header>
                                <HStack align={'center'} justify={'space-between'}>
                                    <KeyVerticalIcon title="a11y-title" fontSize="1.5rem" />
                                    <FormSummary.Heading level="2">
                                        {capitalizeFirstLetter(domain)}
                                    </FormSummary.Heading>
                                </HStack>
                            </FormSummary.Header>

                            <FormSummary.Answers>
                                <FormSummary.Answer>
                                    {domainAccess.map((item, i) => (
                                        <HStack
                                            key={`${domain}-${i}`}
                                            justify={'space-between'}
                                            align={'center'}>
                                            <Checkbox
                                                onClick={() =>
                                                    onToggle(
                                                        item.domain,
                                                        item.packageName,
                                                        item.status === 'ENABLED'
                                                    )
                                                }
                                                value={item.packageName}
                                                size={'small'}
                                                checked={item.status === 'ENABLED'}>
                                                {item.packageName}
                                            </Checkbox>
                                            <Button
                                                icon={<ChevronRightCircleIcon title="Rediger" />}
                                                onClick={() =>
                                                    handleRowClick(item.domain, item.packageName)
                                                }
                                                variant={'tertiary'}
                                                size={'xsmall'}
                                            />
                                        </HStack>
                                    ))}
                                </FormSummary.Answer>
                            </FormSummary.Answers>
                        </FormSummary>
                    );
                })}
            </HGrid>
        </Box>
    );
};

export default ComponentList;

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
