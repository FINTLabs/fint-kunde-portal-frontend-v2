import { useEffect, useState } from 'react';
import { CopyButton, Table } from '@navikt/ds-react';
import { ArrowsSquarepathIcon, BagdeIcon, DownloadIcon, ThumbUpIcon } from '@navikt/aksel-icons';
import { TableDataCell } from '@navikt/ds-react/Table';
import { useFetcher } from '@remix-run/react';
import { IAdapter } from '~/types/types';
import { IClient } from '~/types/Clients';

type FetcherResponse = {
    clientSecret?: string;
    message?: string;
    variant?: string;
};

// Create a union type for entity (adapter or client)
type AuthEntity = IAdapter | IClient;

interface AuthTableProps {
    entity: AuthEntity; // The entity can be either an adapter or a client
    entityType: 'adapter' | 'client'; // To distinguish between the two
    actionName: string; // The name to be used in the form's hidden input (e.g., adapterName or clientName)
}

export const AuthTable = ({ entity, entityType, actionName }: AuthTableProps) => {
    const [password, setPassword] = useState('******************************');
    const [isPasswordGenerated, setIsPasswordGenerated] = useState(false);
    const [isCopyPasswordEnabled, setIsCopyPasswordEnabled] = useState(false);
    const [isCopySecretEnabled, setIsCopySecretEnabled] = useState(false);
    const [clientSecret, setClientSecret] = useState('******************************');
    const fetcher = useFetcher<FetcherResponse>();

    useEffect(() => {
        if (fetcher.data?.clientSecret) {
            setClientSecret(fetcher.data.clientSecret); // Update client secret
            setIsCopySecretEnabled(true); // Enable copy functionality
        }
    }, [fetcher.data]);

    function generatePass() {
        let pass = '';
        const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 1; i <= 32; i++) {
            const char = Math.floor(Math.random() * str.length);
            pass += str.charAt(char);
        }
        return pass;
    }

    const generatePassword = () => {
        setPassword(generatePass());
        setIsPasswordGenerated(true);
        setIsCopyPasswordEnabled(true);
        // TODO: Save password to backend
    };

    // Handle assetId (string for IClient) and assetIds (array for IAdapter)
    const assetIdsString =
        entityType === 'adapter'
            ? ((entity as IAdapter).assetIds || []).join(', ') // Ensure it's a string by joining the array for IAdapter
            : (entity as IClient).assetId || ''; // Use assetId for IClient, default to empty string if undefined

    const generateAuthInfo = () => {
        const authInfo = {
            username: entity.name,
            password: password,
            clientId: entity.clientId,
            clientSecret: clientSecret,
            assetIds: assetIdsString,
        };
        return JSON.stringify(authInfo, null, 2);
    };

    return (
        <>
            <Table>
                <Table.Body>
                    <Table.Row>
                        <Table.HeaderCell scope="row">Brukernavn</Table.HeaderCell>
                        <Table.DataCell>{entity.name}</Table.DataCell>
                        <TableDataCell />
                        <Table.DataCell>
                            <CopyButton copyText={entity.name} />
                        </Table.DataCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell scope="row">Passord</Table.HeaderCell>
                        <Table.DataCell>{password}</Table.DataCell>
                        <TableDataCell>
                            <ArrowsSquarepathIcon
                                title="Regenerate password"
                                fontSize="1.5rem"
                                onClick={generatePassword}
                            />
                        </TableDataCell>
                        <Table.DataCell>
                            <CopyButton copyText={password} disabled={!isPasswordGenerated} />
                        </Table.DataCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell scope="row">
                            {entityType == 'client' ? 'Klient Id' : 'Adaptere Id'}
                        </Table.HeaderCell>
                        <Table.DataCell>{entity.clientId}</Table.DataCell>
                        <TableDataCell />
                        <Table.DataCell>
                            <CopyButton copyText={entity.clientId} />
                        </Table.DataCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell scope="row">
                            {entityType == 'client' ? 'Klient' : 'Adaptere'} Hemmelighet
                        </Table.HeaderCell>
                        <Table.DataCell>{clientSecret}</Table.DataCell>
                        <Table.DataCell>
                            <fetcher.Form method="post">
                                <input type="hidden" name="actionType" value="GET_SECRET" />
                                <input type="hidden" name={actionName} value={entity.name} />
                                <button type="submit">
                                    <DownloadIcon
                                        title="Trykk for å hente hemmeligheten"
                                        fontSize="1.5rem"
                                    />
                                </button>
                            </fetcher.Form>
                        </Table.DataCell>
                        <Table.DataCell>
                            <CopyButton copyText={clientSecret} disabled={!isCopySecretEnabled} />
                        </Table.DataCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell scope="row">RessursId-er</Table.HeaderCell>
                        <Table.DataCell>{assetIdsString}</Table.DataCell> <TableDataCell />
                        <Table.DataCell>
                            <CopyButton copyText={assetIdsString.toString()} />
                        </Table.DataCell>
                    </Table.Row>
                </Table.Body>
            </Table>

            <CopyButton
                className="!mx-auto"
                copyText={generateAuthInfo()}
                text="Kopier autentiseringsinformasjon"
                activeText="Autentiseringsinformasjon er kopiert"
                icon={<BagdeIcon aria-hidden />}
                activeIcon={<ThumbUpIcon aria-hidden />}
                variant={'action'}
                disabled={!isCopyPasswordEnabled || !isCopySecretEnabled}
            />
        </>
    );
};
