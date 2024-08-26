import React from 'react';
import { Table } from '@navikt/ds-react';
import { IBehandling, IBehandlingsgrunnlag, IPersonopplysning, ITjeneste } from '~/types/Consent';

interface IServiceTableProps {
    behandlings: IBehandling[];
    tjenester: ITjeneste[];
    personopplysninger: IPersonopplysning[];
    grunnlager: IBehandlingsgrunnlag[];
}

const ServiceTable: React.FC<IServiceTableProps> = ({
    behandlings,
    tjenester,
    personopplysninger,
    grunnlager,
}) => {
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell />
                    <Table.HeaderCell>formal</Table.HeaderCell>
                    <Table.HeaderCell>tjenste</Table.HeaderCell>
                    <Table.HeaderCell>person opplysnings</Table.HeaderCell>
                    <Table.HeaderCell>active</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {behandlings?.map((behandling, i) => (
                    <Table.ExpandableRow
                        key={i + behandling.id}
                        content={
                            <div>
                                {behandling.personopplysningIds.map((personopplysningId) => {
                                    const p = personopplysninger.find(
                                        (x) => x.id === personopplysningId
                                    );
                                    return p ? <div>{p.id}</div> : 'Unknown personopplysninger';
                                })}
                                {
                                    behandling.behandlingsgrunnlagIds.map((grunnlagId) => {
                                        const b = grunnlager.find((x) => x.id === grunnlagId);
                                        return b ? (
                                            <div>{b.navn}</div>
                                        ) : (
                                            'Unknown behandlingsgrunnlag'
                                        );
                                    })
                                    // .reduce((prev, curr) => [prev, ', ', curr])
                                }
                            </div>
                        }>
                        <Table.DataCell>{behandling.formal}</Table.DataCell>
                        <Table.DataCell>
                            {behandling.tjenesteIds
                                .map((tjenesteId) => {
                                    const tjeneste = tjenester.find((t) => t.id === tjenesteId);
                                    return tjeneste ? tjeneste.navn : 'Unknown tjeneste';
                                })
                                .join(', ')}
                        </Table.DataCell>

                        <Table.DataCell>
                            {behandling.personopplysningIds
                                .map((personopplysningId) => {
                                    const p = personopplysninger.find(
                                        (x) => x.id === personopplysningId
                                    );
                                    return p
                                        ? `${p.navn} (${p.kode})`
                                        : 'Unknown personopplysninger';
                                })
                                .join(', ')}
                        </Table.DataCell>

                        <Table.DataCell>{behandling.aktiv ? 'Active' : 'Inactive'}</Table.DataCell>
                    </Table.ExpandableRow>
                ))}
            </Table.Body>
        </Table>
    );
};

export default ServiceTable;
