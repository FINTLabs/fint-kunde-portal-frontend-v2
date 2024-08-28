import { BodyShort, Heading, Label, Switch, Table, Tabs } from '@navikt/ds-react';
import { IAdapter } from '~/types/types';
import { useNavigate } from '@remix-run/react';
import { tabInfo } from '~/routes/adaptere/constants';
import { ChevronRightIcon, CogRotationIcon, NotePencilDashIcon } from '@navikt/aksel-icons';
import React from 'react';

interface CustomTabsProps<T> {
    items: T[];
    selectable?: boolean;
    selectedItems?: string[];
    toggleSwitch?: (name: string, checked: boolean) => void;
}

export function CustomTabs<T extends IAdapter>({
    items,
    selectable = false,
    selectedItems,
    toggleSwitch,
}: CustomTabsProps<T>) {
    const navigate = useNavigate();

    const showDetails = (id: string) => {
        navigate(`/adapter/${id}`);
    };

    if (!items) {
        return <div>Fant ingen</div>;
    }

    return (
        <Tabs defaultValue={tabInfo[0].value} fill>
            <Tabs.List>
                <Tabs.Tab
                    value={tabInfo[0].value}
                    label={tabInfo[0].label}
                    icon={<NotePencilDashIcon title={tabInfo[0].label} aria-hidden />}
                />
                <Tabs.Tab
                    value={tabInfo[1].value}
                    label={tabInfo[1].label}
                    icon={<CogRotationIcon title={tabInfo[1].label} aria-hidden />}
                />
            </Tabs.List>
            {tabInfo.map((tab, index) => (
                <Tabs.Panel key={index} value={tab.value} className="w-full">
                    <Table size={'small'}>
                        {/*<Table.Header>*/}
                        {/*    <Table.Row>*/}
                        {/*        {selectable && <Table.HeaderCell scope="col"></Table.HeaderCell>}*/}
                        {/*        <Table.HeaderCell scope="col">Navn</Table.HeaderCell>*/}
                        {/*        <Table.HeaderCell scope="col"></Table.HeaderCell>*/}
                        {/*    </Table.Row>*/}
                        {/*</Table.Header>*/}
                        <Table.Body>
                            {(index === 1
                                ? items.filter((i) => i.managed)
                                : items.filter((i) => !i.managed)
                            ).map((item, i) => (
                                <Table.Row
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
                                                    toggleSwitch &&
                                                        toggleSwitch(item.name, isChecked);
                                                }}>
                                                <Label>{''}</Label>
                                            </Switch>
                                        </Table.DataCell>
                                    )}
                                    <Table.DataCell>
                                        <Heading size="small">{item.shortDescription}</Heading>
                                        <BodyShort textColor="subtle">{item.name}</BodyShort>
                                    </Table.DataCell>

                                    <Table.DataCell onClick={() => showDetails(item.name)}>
                                        <ChevronRightIcon title="vis detaljer" fontSize="1.5rem" />
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
