import type { MetaFunction } from '@remix-run/node';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { MigrationIcon } from '@navikt/aksel-icons';
import { Box, Tabs } from '@navikt/ds-react';
import { CogRotationIcon } from '@navikt/aksel-icons';
import { NotePencilDashIcon } from '@navikt/aksel-icons';

export const meta: MetaFunction = () => {
    return [{ title: 'Adapter' }, { name: 'description', content: 'Liste over adapter' }];
};

export default function Index() {
    const breadcrumbs = [{ name: 'Adapter', link: '/adapter' }];

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader
                title={'Adapter'}
                icon={MigrationIcon}
                helpText="adapter"
                hideBorder={true}
            />

            <Box>
                <Tabs defaultValue="manuelt-opprettet" fill>
                    <Tabs.List>
                        <Tabs.Tab
                            value="manuelt-opprettet"
                            label="Manuelt opprettet"
                            icon={<NotePencilDashIcon title="manuelt opprettet" aria-hidden />}
                        />
                        <Tabs.Tab
                            value="automatisk-opprettet"
                            label="Automatisk opprettet"
                            icon={<CogRotationIcon title="automatisk opprettet" aria-hidden />}
                        />
                    </Tabs.List>
                    <Tabs.Panel value="manuelt-opprettet" className="h-24 w-full bg-gray-50 p-4">
                        Logg-tab
                    </Tabs.Panel>
                    <Tabs.Panel value="automatisk-opprettet" className="h-24 w-full bg-gray-50 p-4">
                        Inbox-tab
                    </Tabs.Panel>
                </Tabs>
            </Box>
        </>
    );
}
