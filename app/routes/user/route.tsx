import { PersonIcon } from '@navikt/aksel-icons';
import { BodyLong, Box, HGrid, Label, Tag } from '@navikt/ds-react';
import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router';

import MeApi from '~/api/MeApi';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { IMeData } from '~/types/Me';

type LoaderData = {
    user: IMeData;
    features: Record<string, boolean>;
};

export const loader = async () => {
    const user = await MeApi.fetchMe();
    return Response.json({
        user: user,
    });
};

export default function Index() {
    const { t } = useTranslation();
    const { user } = useLoaderData<LoaderData>();
    const breadcrumbs = [{ name: t('mainRoutes.user.breadcrumb'), link: '/user' }];

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={t('mainRoutes.user.title')} icon={PersonIcon} />

            <HGrid gap="space-2" align={'start'}>
                <Box
                    padding="space-16"
                    borderColor="neutral-subtle"
                    borderWidth="2"
                    borderRadius="12">
                    <div>
                        <div className="user-info-section">
                            <Label>{t('mainRoutes.user.fullNameLabel')}</Label>
                            <BodyLong>{`${user.firstName} ${user.lastName}`}</BodyLong>
                        </div>
                        <div className="user-info-section">
                            <Label>{t('mainRoutes.user.emailLabel')}</Label>
                            <BodyLong>{user.mail}</BodyLong>
                        </div>
                        <div className="user-info-section">
                            <Label>{t('mainRoutes.user.mobileLabel')}</Label>
                            <BodyLong>{user.mobile}</BodyLong>
                        </div>

                        <div className="user-info-section">
                            <Label>{t('mainRoutes.user.rolesLabel')}</Label>
                            <BodyLong>
                                {user.roles.map((role, index) => (
                                    <Tag
                                        key={index}
                                        className="user-role-tag"
                                        variant={'info'}>
                                        {role}
                                    </Tag>
                                ))}
                            </BodyLong>
                        </div>
                    </div>
                </Box>
            </HGrid>
        </>
    );
}
