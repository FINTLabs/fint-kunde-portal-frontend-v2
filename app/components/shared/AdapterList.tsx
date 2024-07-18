import { Detail, Label, Switch, Table, Tabs, VStack } from '@navikt/ds-react';
import { IAdapter } from '~/types/types';
import { useNavigate } from '@remix-run/react';
import { tabInfo } from '~/routes/adaptere/constants';
import { NotePencilDashIcon, CogRotationIcon } from '@navikt/aksel-icons';
import { ChevronRightIcon } from '@navikt/aksel-icons';

function AdapterTable({
    items,
    selectable,
    selectedItems,
    toggleSwitch,
}: {
    items: IAdapter[];

    selectable?: boolean;
    selectedItems?: string[];
    toggleSwitch?: () => void;
}) {
    const navigate = useNavigate();

    const showDetails = (id: string) => {
        navigate(`/adapter/${id}`);
    };

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    {selectable && <Table.HeaderCell scope="col"></Table.HeaderCell>}
                    <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Beskrivelse</Table.HeaderCell>
                    <Table.HeaderCell scope="col"></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {items?.map((item, i) => (
                    <Table.Row
                        key={i + item.name}
                        className="active:bg-[--a-surface-active] hover:cursor-pointer">
                        {selectable && (
                            <Table.DataCell scope="row">
                                <Switch
                                    checked={
                                        selectedItems &&
                                        selectedItems.some((selected) => {
                                            const match = selected.match(/cn=([^,]+)/);
                                            if (match) {
                                                const cn = match[1];
                                                if (cn === item.name) return true;
                                            }
                                            return false;
                                        })
                                    }
                                    onChange={toggleSwitch}>
                                    <Label>{''}</Label>
                                </Switch>
                            </Table.DataCell>
                        )}
                        <Table.DataCell scope="row" onClick={() => showDetails(item.name)}>
                            {item.name}
                        </Table.DataCell>
                        <Table.DataCell scope="row" onClick={() => showDetails(item.name)}>
                            {item.shortDescription}
                        </Table.DataCell>
                        <Table.DataCell onClick={() => showDetails(item.name)}>
                            <ChevronRightIcon title="vis detaljer" fontSize="1.5rem" />
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
}

function Tab({
    value,
    adapters,
    selectedItems,
    selectable,
    toggleSwitch,
}: {
    value: string;
    adapters: IAdapter[];
    selectable?: boolean;
    selectedItems?: string[];
    toggleSwitch?: () => void;
}) {
    return (
        <Tabs.Panel value={value} className="w-full">
            <AdapterTable
                items={adapters}
                selectable={selectable}
                selectedItems={selectedItems}
                toggleSwitch={toggleSwitch}
            />
        </Tabs.Panel>
    );
}

export function AdapterList({
    items,
    selectable = false,
    selectedItems,
    toggleSwitch,
}: {
    items: IAdapter[];
    selectable?: boolean;
    selectedItems?: string[];
    toggleSwitch?: () => void;
}) {
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
                    icon={<CogRotationIcon title={tabInfo[0].label} aria-hidden />}
                />
            </Tabs.List>
            {tabInfo.map((tab, index) => (
                <Tab
                    key={index}
                    value={tab.value}
                    selectedItems={selectedItems}
                    selectable={selectable}
                    toggleSwitch={toggleSwitch}
                    adapters={
                        index === 1
                            ? items.filter((adapter) => adapter.managed)
                            : items.filter((adapter) => !adapter.managed)
                    }
                />
            ))}
        </Tabs>
    );
}
