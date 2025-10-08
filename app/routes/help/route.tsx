import { InformationSquareIcon } from '@navikt/aksel-icons';
import { Accordion, Box } from '@navikt/ds-react';
import { type MetaFunction } from 'react-router';

import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { helpData, HelpDataItem } from '~/routes/help/HelpData';

export const meta: MetaFunction = () => {
    return [
        { title: 'Hjelpe' },
        { name: 'description', content: 'Hjelpeliste over hjelpetekster' },
    ];
};

export default function Index() {
    const breadcrumbs = [{ name: 'Support', link: '/support' }];

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={'Mer informasjon'} icon={InformationSquareIcon} />
            <Box
                // background="surface-alt-4-moderate"
                padding="8"
                paddingBlock="16">
                <Accordion>
                    {helpData.map((item: HelpDataItem) => (
                        <Accordion.Item key={item.id}>
                            <Accordion.Header>{item.title}</Accordion.Header>
                            <Accordion.Content>
                                {item.description.split('LINE_BREAK_HERE').map((text, index) => (
                                    <p key={index}>{text}</p>
                                ))}
                            </Accordion.Content>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </Box>
        </>
    );
}
