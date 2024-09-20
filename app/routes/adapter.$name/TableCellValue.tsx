import { BodyShort, Button, CopyButton, Table, Tooltip } from '@navikt/ds-react';
import { DownloadIcon, ArrowsCirclepathIcon } from '@navikt/aksel-icons'; // Import additional icon for password
import { useFetcher } from '@remix-run/react';

export function TableCellValue({
    label,
    value,
    fetcherKey,
    type, // Add type as an optional prop
}: {
    label: string;
    value: string;
    fetcherKey?: string;
    type?: string; // Optional type prop
}) {
    const fetcher = useFetcher({ key: fetcherKey });

    const Fetcher = () => {
        return (
            <fetcher.Form method="post">
                <input type="hidden" name="actionType" value={label} />
                *****{' '}
                <Tooltip
                    content={
                        type === 'password'
                            ? 'Trykk for å generere nytt passord'
                            : 'Trykk for å hente hemmligheten'
                    }>
                    <Button
                        type="submit"
                        variant="tertiary-neutral"
                        icon={
                            type === 'password' ? (
                                <ArrowsCirclepathIcon
                                    fontSize="1.5rem"
                                    title={'Trykk for å generere nytt passord'}
                                />
                            ) : (
                                <DownloadIcon
                                    title="Trykk for å hente hemmligheten"
                                    fontSize="1.5rem"
                                />
                            )
                        }></Button>
                </Tooltip>
            </fetcher.Form>
        );
    };

    return (
        <>
            <Table.DataCell>{label}</Table.DataCell>
            <Table.DataCell className="max-w-xs">
                {value ? <BodyShort truncate>{value}</BodyShort> : <Fetcher />}
            </Table.DataCell>

            <Table.DataCell>{!!value && <CopyButton copyText={value} />}</Table.DataCell>
        </>
    );
}
