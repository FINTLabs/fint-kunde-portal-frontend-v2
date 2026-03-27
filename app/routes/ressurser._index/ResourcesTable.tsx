// AssetsTable.tsx
import { ChevronRightIcon, StarIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Detail, Heading, Table } from '@navikt/ds-react';

import { IAsset } from '~/types/Asset';
import React from 'react';

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
                        className="active:bg-[--a-surface-active] hover:cursor-pointer">
                        <Table.DataCell width={'5em'}>
                            {item.primaryAsset && (
                                <StarIcon
                                    title="a11y-title"
                                    fontSize="1.5rem"
                                    style={{ color: 'var(--ax-bg-warning-strong)' }}
                                />
                            )}
                        </Table.DataCell>
                        <Table.DataCell>
                            <Heading size={'small'}>{item.name}</Heading>
                            <Detail>{item.primaryAsset && ' [PRIMARY]'}</Detail>
                            <BodyShort textColor="subtle">{item.description}</BodyShort>
                        </Table.DataCell>
                        <Table.DataCell>
                            {/*<ChevronRightIcon title="vis detaljer" fontSize="1.5rem" />*/}
                            <Button
                                variant="tertiary"
                                size={'small'}
                                icon={<ChevronRightIcon title="Rediger" />}
                                onClick={() => onRowClick(item.name)}
                            />
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
}
