import {
    ChevronRightIcon,
    CogRotationIcon,
    NotePencilDashIcon,
} from '@navikt/aksel-icons';
import {
    BodyShort,
    Button,
    Heading,
    Label,
    Switch,
    Table,
    Tabs,
    Tag,
} from '@navikt/ds-react';

import { tabInfo } from '~/routes/adaptere._index/constants';
import React from 'react';
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


    return (
        <Tabs defaultValue={tabInfo[0].value} fill>
            <Tabs.List>
                <Tabs.Tab
                    data-cy={`tab-item-0`}
                    value={tabInfo[0].value}
                    label={tabInfo[0].label}
                    icon={<NotePencilDashIcon title={tabInfo[0].label} aria-hidden />}
                />
                <Tabs.Tab
                    data-cy={`tab-item-1`}
                    value={tabInfo[1].value}
                    label={tabInfo[1].label}
                    icon={<CogRotationIcon title={tabInfo[1].label} aria-hidden />}
                />
            </Tabs.List>
            {tabInfo.map((tab, index) => (
                <Tabs.Panel key={index} value={tab.value} className="w-full">
                    <Table size={'small'}>
                        <Table.Body>
                            {(index === 1
                                ? items.filter((i) => isManaged(i))
                                : items.filter((i) => !isManaged(i))
                            ).map((item, i) => {
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
                                            {/*{lastLoginTime && (*/}
                                            {/*    <BodyShort>*/}
                                            {/*        {formatLastLoginDate(lastLoginTime(item))}*/}
                                            {/*    </BodyShort>*/}
                                            {/*)}*/}
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
                                            {/*<ChevronRightIcon title="vis detaljer" fontSize="1.5rem" />*/}
                                            <Button
                                                variant="tertiary"
                                                size={'small'}
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
                </Tabs.Panel>
            ))}
        </Tabs>
    );
}
