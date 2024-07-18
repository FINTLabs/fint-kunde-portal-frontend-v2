import { Table, Tabs, VStack } from '@navikt/ds-react';
import { IAdapter } from '~/types/types';
import { useNavigate } from '@remix-run/react';
import { tabInfo } from '~/routes/adaptere/constants';
import { NotePencilDashIcon, CogRotationIcon } from '@navikt/aksel-icons';

function AdapterTable({
    items,
    selectable,
    onSelect,
}: {
    items: IAdapter[];

    selectable?: boolean;
    onSelect?: () => void;
}) {
    const navigate = useNavigate();

    const handleClick = (id: string) => {
        navigate(`/adapter/${id}`);
    };

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Beskrivelse</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {items?.map((item, i) => (
                    <Table.Row
                        key={i + item.name}
                        className="active:bg-[--a-surface-active] hover:cursor-pointer"
                        onClick={() => handleClick(item.name)}>
                            
                        <Table.DataCell scope="row">{item.shortDescription}</Table.DataCell>
                        <Table.DataCell scope="row">{item.name}</Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
}

function Tab({
    value,
    adapters,
    selectable,
    onSelect,
}: {
    value: string;
    adapters: IAdapter[];
    selectable?: boolean;
    onSelect?: () => void;
}) {
    return (
        <Tabs.Panel value={value} className="w-full">
            <AdapterTable items={adapters} selectable={selectable} onSelect={onSelect} />
        </Tabs.Panel>
    );
}

export function AdapterList({
    items,
    selectable = false,
    onSelect,
}: {
    items: IAdapter[];
    selectable?: boolean;
    onSelect?: () => void;
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
                    selectable={selectable}
                    onSelect={onSelect}
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
