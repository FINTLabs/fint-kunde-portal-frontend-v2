import { BodyShort, Heading, Label, Switch, Table, Tabs } from '@navikt/ds-react';
import { ChevronRightIcon, CogRotationIcon, NotePencilDashIcon } from '@navikt/aksel-icons';
import { tabInfo } from '~/routes/adaptere._index/constants';

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
                        <Table.Body>
                            {(index === 1
                                ? items.filter((i) => isManaged(i))
                                : items.filter((i) => !isManaged(i))
                            ).map((item, i) => (
                                <Table.Row
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
                                                    toggleSwitch &&
                                                        toggleSwitch(getItemName(item), isChecked);
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

                                    <Table.DataCell onClick={() => showDetails(getItemName(item))}>
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
