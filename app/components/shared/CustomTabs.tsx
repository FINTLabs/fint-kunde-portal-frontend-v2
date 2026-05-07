import { ChevronRightIcon, CogRotationIcon, NotePencilDashIcon } from '@navikt/aksel-icons';
import {
    BodyShort,
    Box,
    Button,
    Heading,
    Label,
    Switch,
    Table,
    Tag,
    ToggleGroup,
} from '@navikt/ds-react';

import { tabInfo } from '~/routes/adaptere._index/constants';
import React, { useState } from 'react';
import { LoginStatusIcon } from '~/components/shared/LoginStatusIcon';

interface CustomTabsProps<T extends { name: string; shortDescription: string }> {
    items: T[];
    selectable?: boolean;
    selectedItems?: string[];
    toggleSwitch?: (name: string, checked: boolean) => void;
    showDetails: (id: string) => void;
    isManaged: (item: T) => boolean;
    lastLoginTime?: (item: T) => string | null | undefined;
}
export function CustomTabs<T extends { name: string; shortDescription: string }>({
    items,
    selectable = false,
    selectedItems,
    toggleSwitch,
    showDetails,
    isManaged,
    lastLoginTime,
}: CustomTabsProps<T>) {
    const [selectedTab, setSelectedTab] = useState(tabInfo[0].value);

    if (!items) {
        return <div>Fant ingen</div>;
    }

    const getModelVersion = (item: T): string | undefined => {
        if (typeof item === 'object' && item !== null && 'modelVersion' in item) {
            const modelVersion = (item as { modelVersion?: unknown }).modelVersion;
            if (modelVersion === null || modelVersion === undefined) {
                return 'V3';
            }
            return typeof modelVersion === 'string' ? modelVersion : 'V3';
        }
        return undefined;
    };

    const filteredItems =
        selectedTab === tabInfo[1].value
            ? items.filter((i) => isManaged(i))
            : items.filter((i) => !isManaged(i));

    return (
        <Box>
            <ToggleGroup
                className="pb-2"
                defaultValue={tabInfo[0].value}
                onChange={setSelectedTab}
                size="small"
                fill>
                <ToggleGroup.Item value={tabInfo[0].value} data-cy="tab-item-0">
                    <NotePencilDashIcon aria-hidden />
                    {tabInfo[0].label}
                </ToggleGroup.Item>
                <ToggleGroup.Item value={tabInfo[1].value} data-cy="tab-item-1">
                    <CogRotationIcon aria-hidden />
                    {tabInfo[1].label}
                </ToggleGroup.Item>
            </ToggleGroup>
            <Box padding="space-16" borderColor="neutral-subtle" borderWidth="2" borderRadius="12">
                <Table size="small">
                    <Table.Body>
                        {filteredItems.map((item, i) => {
                            const modelVersion = getModelVersion(item);

                            return (
                                <Table.Row
                                    data-cy="details-row"
                                    key={i + item.name}
                                    className="active:bg-[--a-surface-active] hover:cursor-pointer"
                                    onClick={() => showDetails(item.name)}>
                                    {selectable && (
                                        <Table.DataCell scope="row">
                                            <Switch
                                                checked={
                                                    selectedItems &&
                                                    selectedItems.some(
                                                        (selected) => selected === item.name
                                                    )
                                                }
                                                onChange={(e) => {
                                                    const isChecked = e.target.checked;
                                                    toggleSwitch?.(item.name, isChecked);
                                                }}>
                                                <Label>{''}</Label>
                                            </Switch>
                                        </Table.DataCell>
                                    )}
                                    {lastLoginTime && (
                                        <Table.DataCell>
                                            <LoginStatusIcon lastLoginTime={lastLoginTime(item)} />
                                        </Table.DataCell>
                                    )}
                                    <Table.DataCell>
                                        <Heading size="small">{item.shortDescription}</Heading>
                                        <BodyShort textColor="subtle">{item.name}</BodyShort>
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {modelVersion && (
                                            <Tag
                                                variant="moderate"
                                                size="small"
                                                data-color={
                                                    modelVersion.toUpperCase() === 'V3'
                                                        ? 'accent'
                                                        : 'meta-purple'
                                                }>
                                                Model version utdanningsdomenet: {modelVersion}
                                            </Tag>
                                        )}
                                    </Table.DataCell>

                                    <Table.DataCell>
                                        <Button
                                            variant="tertiary"
                                            size="small"
                                            icon={<ChevronRightIcon title="Rediger" />}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                showDetails(item.name);
                                            }}
                                        />
                                    </Table.DataCell>
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                </Table>
            </Box>
        </Box>
    );
}
