import { BodyShort, Button, CopyButton, HStack, Label, VStack, Table } from '@navikt/ds-react';
import { ThumbUpIcon, ArrowCirclepathIcon, DownloadIcon } from '@navikt/aksel-icons';
import { useFetcher } from '@remix-run/react';

export function TableCellValue({
    label,
    value,
    fetcherKey,
}: {
    label: string;
    value: string;
    fetcherKey?: string;
}) {
    const fetcher = useFetcher({ key: fetcherKey });

    const Fetcher = () => {
        return (
            <fetcher.Form method="post">
                <input type="hidden" name="actionType" value={label} />
                <Button
                    type="submit"
                    variant="tertiary-neutral"
                    icon={<DownloadIcon title="a11y-title" fontSize="1.5rem" />}></Button>
            </fetcher.Form>
        );
    };

    return (
        <>
            <Table.DataCell>{label}</Table.DataCell>
            <Table.DataCell>{value ? value : <Fetcher />}</Table.DataCell>
            <Table.DataCell>{!!value && <CopyButton copyText={value} />}</Table.DataCell>
        </>
    );
}
