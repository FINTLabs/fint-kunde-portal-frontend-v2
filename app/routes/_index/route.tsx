import {
    Box,
    Heading,
    HGrid,
    InlineMessage,
    LinkCard,
    ProgressBar,
    VStack,
} from '@navikt/ds-react';
import { useTranslation } from 'react-i18next';
import {
    type LoaderFunction,
    type MetaFunction,
    useLoaderData,
    useOutletContext,
} from 'react-router';

import { getNovariMenu } from '~/components/Menu/MenuConfig';
import { IUserSession } from '~/types/Session';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import ClientApi from '~/api/ClientApi';
import { IClientModelVersion } from '~/types/Clients';

export const meta: MetaFunction = () => {
    return [
        { title: 'Novari Kundeportalen' },
        {
            name: 'description',
            content:
                'FINT Kundeportal gir enkel styring av tilganger og kontroll over FINT, levert av Novari IKS.',
        },
    ];
};
interface IPageLoaderData {
    modelVersion?: IClientModelVersion;
}
export const loader: LoaderFunction = async ({ request }) => {
    const orgName = await getSelectedOrganization(request);
    const modelVersionResponse = await ClientApi.getClientModelVersions(orgName);
    const modelVersion = modelVersionResponse.data;

    return Response.json({ modelVersion });
};

export default function Index() {
    const { t } = useTranslation();
    const userSession = useOutletContext<IUserSession>();
    const novariMenu = getNovariMenu(t);
    const { modelVersion } = useLoaderData<IPageLoaderData>();

    const hasRole = (roleId: string): boolean => {
        const orgName = userSession.selectedOrganization?.name;
        const roles = userSession.meData?.roles ?? [];

        if (roles.includes(`ROLE_ADMIN@${orgName}`)) {
            return true;
        }

        return roles.includes(`${roleId}@${orgName}`);
    };

    return (
        <VStack gap="space-6" justify={'center'} align="center" style={{ marginTop: '3rem' }}>
            <Heading size="large">
                {t('home.welcome', { name: userSession.meData.firstName })}
            </Heading>

            <HGrid
                gap="space-24"
                columns={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
                paddingBlock={'space-24'}>
                {novariMenu.flatMap((menuItem) => {
                    // if (menuItem.action && !menuItem.submenu) {
                    //     if (menuItem.displayBox === false) {
                    //         return null;
                    //     }
                    //
                    //     return (
                    //         <LinkCard key={menuItem.action} size="medium">
                    //             {/* No icon property on menuItem, so do not render icon */}
                    //             <LinkCard.Title as="h3">
                    //                 <LinkCard.Anchor
                    //                     href={menuItem.action}
                    //                     data-cy={menuItem.label}>
                    //                     {menuItem.label}
                    //                 </LinkCard.Anchor>
                    //             </LinkCard.Title>
                    //             {menuItem.description && (
                    //                 <LinkCard.Description className="panel-description">
                    //                     {menuItem.description}
                    //                 </LinkCard.Description>
                    //             )}
                    //         </LinkCard>
                    //     );
                    // }

                    // Handle submenu items
                    if (menuItem.submenu) {
                        return menuItem.submenu
                            .filter(
                                (item) => item.role && hasRole(item.role)
                                // && (item.displayBox === null || item.displayBox !== false)
                            )
                            .map((item) => (
                                <LinkCard key={item.action} size="medium">
                                    {item.icon && (
                                        <LinkCard.Icon className="panel-icon">
                                            {item.icon}
                                        </LinkCard.Icon>
                                    )}
                                    <LinkCard.Title as="h3">
                                        <LinkCard.Anchor href={item.action}>
                                            {item.label}
                                        </LinkCard.Anchor>
                                    </LinkCard.Title>
                                    {item.description && (
                                        <LinkCard.Description className="panel-description">
                                            {item.description}
                                            {item.notification && (
                                                <Box
                                                    padding="space-16"
                                                    background="info-soft"
                                                    borderRadius="12">
                                                    <InlineMessage status="info">
                                                        {modelVersion?.V4} av{' '}
                                                        {(modelVersion?.V3 ?? 0) +
                                                            (modelVersion?.V4 ?? 0)}{' '}
                                                        informasjonsmodell konvertert fra V3 til V4
                                                        <ProgressBar
                                                            value={modelVersion?.V4 || 0}
                                                            valueMax={
                                                                (modelVersion?.V3 ?? 0) +
                                                                (modelVersion?.V4 ?? 0)
                                                            }
                                                            size="small"
                                                            aria-labelledby="progress-bar-label-small"
                                                        />
                                                    </InlineMessage>
                                                </Box>
                                            )}
                                        </LinkCard.Description>
                                    )}
                                </LinkCard>
                            ));
                    }

                    return [];
                })}
            </HGrid>
        </VStack>
    );
}
