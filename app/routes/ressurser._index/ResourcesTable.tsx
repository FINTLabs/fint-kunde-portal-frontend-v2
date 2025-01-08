// AssetsTable.tsx
import { BodyShort, Heading, Table } from '@navikt/ds-react';
import { ChevronRightIcon, StarIcon } from '@navikt/aksel-icons';
import { IAsset } from '~/types/Asset';

interface AssetsTableProps {
    assets: IAsset[];
    onRowClick: (id: string) => void;
}

export default function AssetsTable({ assets, onRowClick }: AssetsTableProps) {
    return (
        <Table>
            <Table.Body>
                {assets.map((item, i) => (
                    <Table.Row
                        data-cy="details-row"
                        key={i + item.dn}
                        className="active:bg-[--a-surface-active] hover:cursor-pointer"
                        onClick={() => onRowClick(item.name)}>
                        <Table.DataCell width={'5em'}>
                            {item.primaryAsset && <StarIcon title="a11y-title" fontSize="1.5rem" />}
                        </Table.DataCell>
                        <Table.DataCell>
                            <Heading size={'small'}>{item.name}</Heading>
                            <BodyShort textColor="subtle">{item.description}</BodyShort>
                        </Table.DataCell>
                        <Table.DataCell>
                            <ChevronRightIcon title="vis detaljer" fontSize="1.5rem" />
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
}
