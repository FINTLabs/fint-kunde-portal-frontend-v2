import React, { useState } from 'react';
import { Table } from '@navikt/ds-react';
import { IBehandling, IBehandlingsgrunnlag, IPersonopplysning, ITjeneste } from '~/types/Consent';
import { CheckmarkCircleIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import ConfirmAction from '~/components/shared/ConfirmActionModal';

interface ScopedSortState {
    orderBy: keyof IBehandling;
    direction: 'ascending' | 'descending';
}

interface IServiceTableProps {
    processedConsents: IBehandling[];
    services: ITjeneste[];
    personalDataList: IPersonopplysning[];
    foundations: IBehandlingsgrunnlag[];
    f: any;
}

const ServiceTable: React.FC<IServiceTableProps> = ({
    processedConsents,
    services,
    personalDataList,
    foundations,
    f,
}) => {
    const [sort, setSort] = useState<ScopedSortState | undefined>();

    const handleSort = (sortKey: keyof IBehandling) => {
        setSort(
            sort && sortKey === sort.orderBy && sort.direction === 'descending'
                ? undefined
                : {
                      orderBy: sortKey,
                      direction:
                          sort && sortKey === sort.orderBy && sort.direction === 'ascending'
                              ? 'descending'
                              : 'ascending',
                  }
        );
    };

    const comparator = <T,>(a: T, b: T, orderBy: keyof T): number => {
        if (b[orderBy] == null || b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    };

    const sortedBehandlings = [...processedConsents].sort((a, b) => {
        if (sort) {
            return sort.direction === 'ascending'
                ? comparator(a, b, sort.orderBy)
                : comparator(b, a, sort.orderBy);
        }
        return 0;
    });

    return (
        <>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell />
                        <Table.ColumnHeader
                            sortKey="formal"
                            sortable
                            onClick={() => handleSort('formal')}>
                            Formal
                        </Table.ColumnHeader>
                        <Table.ColumnHeader
                            sortKey="tjenesteIds"
                            sortable
                            onClick={() => handleSort('tjenesteIds')}>
                            Tjeneste
                        </Table.ColumnHeader>
                        <Table.ColumnHeader
                            sortKey="personopplysningIds"
                            sortable
                            onClick={() => handleSort('personopplysningIds')}>
                            Person Opplysnings
                        </Table.ColumnHeader>
                        <Table.ColumnHeader
                            sortKey="aktiv"
                            sortable
                            onClick={() => handleSort('aktiv')}>
                            Status
                        </Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {sortedBehandlings.map((behandling, i) => (
                        <Table.ExpandableRow
                            key={i + behandling.id}
                            content={
                                <div>
                                    {behandling.personopplysningIds.map((personopplysningId) => {
                                        const p = personalDataList.find(
                                            (x) => x.id === personopplysningId
                                        );
                                        return p ? (
                                            <div key={p.id}>{p.id}</div>
                                        ) : (
                                            'Unknown personopplysninger'
                                        );
                                    })}
                                    {behandling.behandlingsgrunnlagIds.map((grunnlagId) => {
                                        const b = foundations.find((x) => x.id === grunnlagId);
                                        return b ? (
                                            <div key={b.id}>{b.navn}</div>
                                        ) : (
                                            'Unknown behandlingsgrunnlag'
                                        );
                                    })}
                                    <ConfirmAction
                                        actionText={
                                            behandling.aktiv
                                                ? 'Set active to FALSE'
                                                : 'Set to active'
                                        }
                                        targetName={behandling.formal}
                                        f={f}
                                        actionType="setIsActive"
                                        confirmationText={`Change active status:`}
                                        additionalInputs={[
                                            { name: 'serviceId', value: behandling.id },
                                            {
                                                name: 'isActive',
                                                value: behandling.aktiv ? 'false' : 'true',
                                            },
                                        ]}
                                    />
                                </div>
                            }>
                            <Table.DataCell>{behandling.formal}</Table.DataCell>
                            <Table.DataCell>
                                {behandling.tjenesteIds
                                    .map((tjenesteId) => {
                                        const tjeneste = services.find((t) => t.id === tjenesteId);
                                        return tjeneste ? tjeneste.navn : 'Unknown tjeneste';
                                    })
                                    .join(', ')}
                            </Table.DataCell>
                            <Table.DataCell>
                                {behandling.personopplysningIds
                                    .map((personopplysningId) => {
                                        const p = personalDataList.find(
                                            (x) => x.id === personopplysningId
                                        );
                                        return p
                                            ? `${p.navn} (${p.kode})`
                                            : 'Unknown personopplysninger';
                                    })
                                    .join(', ')}
                            </Table.DataCell>
                            <Table.DataCell>
                                {behandling.aktiv ? (
                                    <CheckmarkCircleIcon
                                        title="a11y-title"
                                        fontSize="1.5rem"
                                        className={'text-green-600'}
                                    />
                                ) : (
                                    <XMarkOctagonIcon
                                        title="a11y-title"
                                        fontSize="1.5rem"
                                        className={'text-red-600'}
                                    />
                                )}
                            </Table.DataCell>
                        </Table.ExpandableRow>
                    ))}
                </Table.Body>
            </Table>
        </>
    );
};

export default ServiceTable;
