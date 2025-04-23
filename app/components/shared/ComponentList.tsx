import React from 'react';
import { Box, Button, Checkbox, FormSummary, HGrid, HStack } from '@navikt/ds-react';
import { ChevronRightCircleIcon, KeyVerticalIcon } from '@navikt/aksel-icons';
import { useNavigate } from '@remix-run/react';
import { IPackageAccess } from '~/types/Access';

interface ComponentListProps {
    accessList: IPackageAccess[];
    onToggle: (formData: FormData) => void;
    entity: string;
}

function ComponentList({ accessList, onToggle, entity }: ComponentListProps) {
    const navigate = useNavigate();

    const handleRowClick = (domain: string, packageName: string) => {
        navigate(`/tilgang/${entity}/${domain}_${packageName}`);
    };

    const groupedByDomain = Array.isArray(accessList)
        ? accessList.reduce((acc: Record<string, IPackageAccess[]>, item: IPackageAccess) => {
              if (!acc[item.domain]) {
                  acc[item.domain] = [];
              }
              acc[item.domain].push(item);
              return acc;
          }, {})
        : {};

    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const isChecked = e.target.checked;

        if (onToggle) {
            const formData = new FormData();
            formData.append('componentName', value);
            formData.append('isChecked', isChecked.toString());
            onToggle(formData);
        }
    };

    return (
        <Box>
            <HGrid gap={'3'} columns={3}>
                {Object.keys(groupedByDomain).map((domain, i) => {
                    const domainAccess = groupedByDomain[domain];

                    return (
                        <FormSummary key={`${domain}-${i}`}>
                            <FormSummary.Header>
                                <HStack align={'center'} justify={'space-between'}>
                                    <KeyVerticalIcon title="key icon" fontSize="1.5rem" />
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
                                                // onClick={() =>
                                                //     onToggle(
                                                //         item.domain,
                                                //         item.packageName,
                                                //         item.status === 'ENABLED'
                                                //     )
                                                // }
                                                onChange={(e) => {
                                                    handleToggle(e);
                                                }}
                                                value={item.packageName}
                                                size={'small'}
                                                checked={item.accessLevel === 'ENABLED'}>
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
}

export default ComponentList;

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
