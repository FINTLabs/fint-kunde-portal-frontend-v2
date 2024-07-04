import { Table, VStack } from '@navikt/ds-react';
import { IAdapter } from '~/types/types';
import { useNavigate } from '@remix-run/react';

export function AdapterList({ items }: { items: IAdapter[] }) {
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
