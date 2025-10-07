import { ArrowsSquarepathIcon, BagdeIcon, DownloadIcon, ThumbUpIcon } from '@navikt/aksel-icons';
import { Button, CopyButton, Table } from '@navikt/ds-react';
import { useState } from 'react';

import ConfirmAction from '~/components/shared/ConfirmActionModal';
import { IAdapter } from '~/types/Adapter';
import { IClient } from '~/types/Clients';

type AuthEntity = IAdapter | IClient;

interface AuthTableProps {
    entity: AuthEntity;
    entityType: 'adapter' | 'client';
    onUpdatePassword: (formData: FormData) => void;
    onUpdateAuthInfo: (formData: FormData) => void;
    clientSecret?: string;
}

export const AuthTable = ({
    entity,
    entityType,
    onUpdatePassword,
    onUpdateAuthInfo,
    clientSecret,
}: AuthTableProps) => {
    const [password, setPassword] = useState('******************************');
    const [isPasswordGenerated, setIsPasswordGenerated] = useState(false);
    const [isCopyPasswordEnabled, setIsCopyPasswordEnabled] = useState(false);

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
        const newPassword = generatePass();
        setPassword(newPassword);
        setIsPasswordGenerated(true);
        setIsCopyPasswordEnabled(true);

        const formData = new FormData();
        formData.append('password', newPassword);
        formData.append('entityName', entity.name);
        onUpdatePassword(formData);
    };

    const assetIdsString =
        entityType === 'adapter'
            ? ((entity as IAdapter).assetIds || []).join(', ')
            : (entity as IClient).assetId || '';

    const generateAuthInfo = () => {
        const assetArray =
            entityType === 'adapter' ? (entity as IAdapter).assetIds : (entity as IClient).assetId;

        const authInfo = {
            username: entity.name,
            password: password,
            clientId: entity.clientId,
            openIdSecret: clientSecret,
            assetIds: assetArray,
            scope: 'fint-client',
            idpUri: 'https://idp.felleskomponent.no/nidp/oauth/nam/token',
        };
        return JSON.stringify(authInfo, null, 2);
    };

    const handleUpdateAuthInfo = () => {
        const formData = new FormData();
        formData.append('entityName', entity.name);
        onUpdateAuthInfo(formData);
    };

    return (
        <>
            <Table>
                <Table.Body>
                    <Table.Row>
                        <Table.HeaderCell scope="row">Brukernavn</Table.HeaderCell>
                        <Table.DataCell>{entity.name}</Table.DataCell>
                        <Table.DataCell />
                        <Table.DataCell>
                            <CopyButton copyText={entity.name} />
                        </Table.DataCell>
                    </Table.Row>

                    <Table.Row>
                        <Table.HeaderCell scope="row">Passord</Table.HeaderCell>
                        <Table.DataCell>{password}</Table.DataCell>
                        <Table.DataCell>
                            <ConfirmAction
                                buttonVariant="tertiary-neutral"
                                buttonText=""
                                subTitleText={
                                    'Hvis du gjør det må alle som bruker autentiseringsinformasjonen få det nye passordet og konfigurere tjenesten sin på nytt!'
                                }
                                titleText="Er du sikker på at du vil sette nytt passord? "
                                onConfirm={generatePassword}
                                icon={
                                    <ArrowsSquarepathIcon
                                        title="Regenerate password"
                                        fontSize="1.5rem"
                                    />
                                }
                            />
                        </Table.DataCell>
                        <Table.DataCell>
                            <CopyButton copyText={password} disabled={!isPasswordGenerated} />
                        </Table.DataCell>
                    </Table.Row>

                    <Table.Row>
                        <Table.HeaderCell scope="row">Klientid</Table.HeaderCell>
                        <Table.DataCell>{entity.clientId}</Table.DataCell>
                        <Table.DataCell />
                        <Table.DataCell>
                            <CopyButton copyText={entity.clientId} />
                        </Table.DataCell>
                    </Table.Row>

                    <Table.Row>
                        <Table.HeaderCell scope="row">Klient hemmelighet</Table.HeaderCell>
                        <Table.DataCell style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>
                            {clientSecret ? clientSecret : '******************************'}
                        </Table.DataCell>
                        <Table.DataCell>
                            <Button
                                variant="tertiary-neutral"
                                icon={
                                    <DownloadIcon
                                        title="Trykk for å hente hemmeligheten"
                                        fontSize="1.5rem"
                                    />
                                }
                                size="small"
                                type="submit"
                                onClick={handleUpdateAuthInfo}
                            />
                        </Table.DataCell>
                        <Table.DataCell>
                            <CopyButton
                                copyText={clientSecret ? clientSecret : ''}
                                disabled={!clientSecret}
                            />
                        </Table.DataCell>
                    </Table.Row>

                    <Table.Row>
                        <Table.HeaderCell scope="row">Ressurs id</Table.HeaderCell>
                        <Table.DataCell>{assetIdsString}</Table.DataCell>
                        <Table.DataCell />
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
                disabled={!isCopyPasswordEnabled || !clientSecret}
            />
        </>
    );
};
