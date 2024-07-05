import InternalPageHeader from '~/components/shared/InternalPageHeader';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { MigrationIcon } from '@navikt/aksel-icons';
import { Box, Tabs } from '@navikt/ds-react';
import { CogRotationIcon } from '@navikt/aksel-icons';
import { NotePencilDashIcon } from '@navikt/aksel-icons';
import { useLoaderData } from '@remix-run/react';
import { tabInfo } from './constants';
import { IPageLoaderData, Tab } from './route';

export default function Index() {
    const breadcrumbs = [{ name: 'Adaptere', link: '/adaptere' }];

    const { adapters } = useLoaderData<IPageLoaderData>();

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader
                title={'Adaptere'}
                icon={MigrationIcon}
                helpText="adaptere"
                hideBorder={true}
            />

            {!adapters && (
                <Box padding="4" background="surface-danger-moderate">
                    Fant ingen adaptere
                </Box>
            )}
            {adapters && (
                <Tabs defaultValue={tabInfo[0].value} fill>
                    <Tabs.List>
                        <Tabs.Tab
                            value={tabInfo[0].value}
                            label={tabInfo[0].label}
                            icon={<NotePencilDashIcon title={tabInfo[0].label} aria-hidden />}
                        />
                        <Tabs.Tab
                            value={tabInfo[1].value}
                            label={tabInfo[1].label}
                            icon={<CogRotationIcon title={tabInfo[0].label} aria-hidden />}
                        />
                    </Tabs.List>
                    {tabInfo.map((tab, index) => (
                        <Tab
                            key={index}
                            value={tab.value}
                            adapters={
                                index === 1
                                    ? adapters.filter((adapter) => adapter.managed)
                                    : adapters.filter((adapter) => !adapter.managed)
                            }
                        />
                    ))}
                </Tabs>
            )}
        </>
    );
}
