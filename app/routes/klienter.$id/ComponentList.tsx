import {
    ChevronRightCircleIcon,
    ExclamationmarkTriangleIcon,
    KeyVerticalIcon,
} from '@navikt/aksel-icons';
import {
    Box,
    Button,
    Checkbox,
    FormSummary,
    HGrid,
    HStack,
    Spacer,
    Tooltip,
} from '@navikt/ds-react';
import React from 'react';
import { useNavigate } from 'react-router';

import { IDomainPackages } from '~/types/Access';

interface ComponentListProps {
    accessList: IDomainPackages[];
    onToggle: (formData: FormData) => void;
    entity: string;
}

function ComponentList({ accessList, onToggle, entity }: ComponentListProps) {
    const navigate = useNavigate();

    const handleRowClick = (domain: string, packageName: string) => {
        navigate(`/tilgang/${entity}/${domain}-${packageName}`);
    };

    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const isChecked = e.target.checked;

        const formData = new FormData();
        formData.append('componentName', value);
        formData.append('isChecked', isChecked.toString());
        onToggle(formData);
    };

    return (
        <Box>
            <HGrid gap={'3'} columns={3}>
                {accessList.map((domain, i) => {
                    // const domainAccess = groupedByDomain[domain];
                    //indeterminate={
                    //             selectedRows.length > 0 && selectedRows.length !== data.length
                    //           }

                    return (
                        <FormSummary key={`${domain}-${i}`}>
                            <FormSummary.Header>
                                <HStack align={'center'} justify={'space-between'}>
                                    <KeyVerticalIcon title="key icon" fontSize="1.5rem" />
                                    <FormSummary.Heading level="2">
                                        {capitalizeFirstLetter(domain.domain)}
                                    </FormSummary.Heading>
                                </HStack>
                            </FormSummary.Header>

                            <FormSummary.Answers>
                                <FormSummary.Answer>
                                    {domain.packages.map((item, i) => (
                                        <HStack
                                            key={`${domain}-${i}`}
                                            justify={'space-between'}
                                            align={'center'}
                                            data-cy={`component-toggle-${item.packageName}`}>
                                            <Checkbox
                                                // onClick={() =>
                                                //     onToggle(
                                                //         item.domain,
                                                //         item.packageName,
                                                //         item.status === 'ENABLED'
                                                //     )
                                                // }
                                                // indeterminate={isIntermediate(item.access, domain.packages)}
                                                onChange={(e) => {
                                                    handleToggle(e);
                                                }}
                                                value={domain.domain + '-' + item.packageName}
                                                size={'small'}
                                                checked={item.access}
                                                // only add description if item is partialaccess or fullaccess
                                                // description={
                                                //     item.access &&
                                                //     item.hasResourceAccess === 'PARTIALACCESS'
                                                //         ? 'Delvis tilgang'
                                                //         : item.access &&
                                                //             item.hasResourceAccess === 'FULLACCESS'
                                                //           ? 'Full tilgang'

                                                //             : ''
                                                // }
                                            >
                                                {item.packageName}
                                            </Checkbox>
                                            <Spacer />
                                            {item.access &&
                                                item.hasResourceAccess === 'NOACCESS' && (
                                                    <>
                                                        <Tooltip
                                                            content="Tilgang mangler på ressurser"
                                                            placement="left">
                                                            <ExclamationmarkTriangleIcon
                                                                aria-label="Tilgang mangler"
                                                                fontSize="1.5rem"
                                                                color="var(--a-icon-warning)"
                                                            />
                                                        </Tooltip>
                                                    </>
                                                )}

                                            <Button
                                                icon={<ChevronRightCircleIcon title="Rediger" />}
                                                onClick={() =>
                                                    handleRowClick(domain.domain, item.packageName)
                                                }
                                                variant={'tertiary'}
                                                size={'xsmall'}
                                                disabled={!item.access}
                                                data-cy={`component-details-${item.packageName}`}
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
}

export default ComponentList;

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
