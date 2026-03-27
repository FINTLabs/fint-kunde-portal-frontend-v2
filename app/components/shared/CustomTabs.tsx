import { ChevronRightIcon, CogRotationIcon, NotePencilDashIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Heading, Label, Switch, Table, Tabs, Tag } from '@navikt/ds-react';

import { tabInfo } from '~/routes/adaptere._index/constants';
import React from 'react';

interface CustomTabsProps<T> {
    items: T[];
    selectable?: boolean;
    selectedItems?: string[];
    toggleSwitch?: (name: string, checked: boolean) => void;
    showDetails: (id: string) => void;
    getItemName: (item: T) => string;
    getItemDescription: (item: T) => string;
    isManaged: (item: T) => boolean;
}
export function CustomTabs<T>({
    items,
    selectable = false,
    selectedItems,
    toggleSwitch,
    showDetails,
    getItemName,
    getItemDescription,
    isManaged,
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
                            ).map((item, i) => (
                                <Table.Row
                                    data-cy="details-row"
                                    key={i + getItemName(item)}
                                    className="active:bg-[--a-surface-active] hover:cursor-pointer"
                                    onClick={() => showDetails(getItemName(item))}>
                                    {selectable && (
                                        <Table.DataCell scope="row">
                                            <Switch
                                                checked={
                                                    selectedItems &&
                                                    selectedItems.some(
                                                        (selected) => selected === getItemName(item)
                                                    )
                                                }
                                                onChange={(e) => {
                                                    const isChecked = e.target.checked;
                                                    toggleSwitch?.(getItemName(item), isChecked);
                                                }}>
                                                <Label>{''}</Label>
                                            </Switch>
                                        </Table.DataCell>
                                    )}
                                    <Table.DataCell>
                                        <Heading size="small">{getItemDescription(item)}</Heading>
                                        <BodyShort textColor="subtle">
                                            {getItemName(item)}
                                        </BodyShort>
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {(() => {
                                            const modelVersion = getModelVersion(item);
                                            if (!modelVersion) {
                                                return null;
                                            }

                                            return (
                                                <Tag
                                                    variant="moderate"
                                                    data-color={
                                                        modelVersion.toUpperCase() === 'V3'
                                                            ? 'accent'
                                                            : 'meta-purple'
                                                    }>
                                                    Model version: {modelVersion}
                                                </Tag>
                                            );
                                        })()}
                                    </Table.DataCell>

                                    <Table.DataCell>
                                        {/*<ChevronRightIcon title="vis detaljer" fontSize="1.5rem" />*/}
                                        <Button
                                            variant="tertiary"
                                            size={'small'}
                                            icon={<ChevronRightIcon title="Rediger" />}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                showDetails(getItemName(item));
                                            }}
                                        />
                                    </Table.DataCell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </Tabs.Panel>
            ))}
        </Tabs>
    );
}
