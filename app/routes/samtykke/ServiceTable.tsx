import React, { useState } from 'react';
import { Table } from '@navikt/ds-react';
import { IBehandling, IBehandlingsgrunnlag, IPersonopplysning, ITjeneste } from '~/types/Consent';
import { CheckmarkCircleIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import ConfirmAction from '~/components/shared/ConfirmActionModal';
import { FetcherWithComponents } from '@remix-run/react';
import { IFetcherResponseData } from '~/types/types';

interface ScopedSortState {
    orderBy: keyof IBehandling;
    direction: 'ascending' | 'descending';
}

interface IServiceTableProps {
    policies: IBehandling[];
    services: ITjeneste[];
    personalDataList: IPersonopplysning[];
    foundations: IBehandlingsgrunnlag[];
    f: FetcherWithComponents<IFetcherResponseData>;
}

const ServiceTable: React.FC<IServiceTableProps> = ({
    policies,
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

    const sortedPolicies = [...policies].sort((a, b) => {
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
                    {sortedPolicies.map((policy, i) => (
                        <Table.ExpandableRow
                            key={i + policy.id}
                            content={
                                <div>
                                    {policy.personopplysningIds.map((personalDataId) => {
                                        const p = personalDataList.find(
                                            (x) => x.id === personalDataId
                                        );
                                        return p ? (
                                            <div key={p.id}>{p.id}</div>
                                        ) : (
                                            'Unknown personopplysninger'
                                        );
                                    })}
                                    {policy.behandlingsgrunnlagIds.map((foundationId) => {
                                        const b = foundations.find((x) => x.id === foundationId);
                                        return b ? (
                                            <div key={b.id}>{b.navn}</div>
                                        ) : (
                                            'Unknown behandlingsgrunnlag'
                                        );
                                    })}
                                    <ConfirmAction
                                        actionText={policy.aktiv ? 'Deaktiver' : 'Aktiver'}
                                        targetName={policy.formal}
                                        f={f}
                                        actionType="SET_ACTIVE"
                                        confirmationText={
                                            policy.aktiv
                                                ? `Denne handlingen vil sette statusen til inaktiv.`
                                                : `Denne handlingen vil sette statusen til aktiv.`
                                        }
                                        additionalInputs={[
                                            { name: 'policyId', value: policy.id },
                                            {
                                                name: 'isActive',
                                                value: policy.aktiv ? 'false' : 'true',
                                            },
                                        ]}
                                    />
                                </div>
                            }>
                            <Table.DataCell>{policy.formal}</Table.DataCell>
                            <Table.DataCell>
                                {policy.tjenesteIds
                                    .map((serviceId) => {
                                        const tjeneste = services.find((t) => t.id === serviceId);
                                        return tjeneste ? tjeneste.navn : 'Unknown tjeneste';
                                    })
                                    .join(', ')}
                            </Table.DataCell>
                            <Table.DataCell>
                                {policy.personopplysningIds
                                    .map((personalDataIds) => {
                                        const p = personalDataList.find(
                                            (personalData) => personalData.id === personalDataIds
                                        );
                                        return p
                                            ? `${p.navn} (${p.kode})`
                                            : 'Unknown personopplysninger';
                                    })
                                    .join(', ')}
                            </Table.DataCell>
                            <Table.DataCell>
                                {policy.aktiv ? (
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
