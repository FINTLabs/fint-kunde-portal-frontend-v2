import { BodyLong, Box, HGrid, Label, Tag } from '@navikt/ds-react';
import { json, useLoaderData } from '@remix-run/react';
import MeApi from '~/api/MeApi';
import { PersonIcon } from '@navikt/aksel-icons';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { BackButton } from '~/components/shared/BackButton';
import FeaturesApi from '~/api/FeaturesApi';
import { IMeData } from '~/types/Me';

type LoaderData = {
    user: IMeData;
    features: Record<string, boolean>;
};

export let loader = async () => {
    try {
        const user = await MeApi.fetchMe();
        const features = await FeaturesApi.fetchFeatures();
        return json({ user: user, features: features });
    } catch (error) {
        throw new Response('Failed to load user data', { status: 500 });
    }
};

export default function Index() {
    const { user, features } = useLoaderData<LoaderData>();
    const breadcrumbs = [{ name: 'Profile', link: '/user' }];
    const trueFeatures = Object.entries(features).filter(([_, value]) => value);

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={'User Information'} icon={PersonIcon} />

            <HGrid gap="2" align={'start'}>
                <BackButton to={`/`} className="relative h-12 w-12 top-2 right-14" />
                <Box padding="6" borderRadius="large" shadow="small" className="relative bottom-12">
                    <div>
                        {/* <Breadcrumbs breadcrumbs={breadcrumbs} /> */}
                        {/*<InternalPageHeader title={'User Information'} icon={PersonIcon} />*/}
                        <div style={{ marginBottom: '1rem' }}>
                            <Label>Full Name:</Label>
                            <BodyLong>{`${user.firstName} ${user.lastName}`}</BodyLong>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <Label>Email:</Label>
                            <BodyLong>{user.mail}</BodyLong>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <Label>Mobile:</Label>
                            <BodyLong>{user.mobile}</BodyLong>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <Label>Support ID:</Label>
                            <BodyLong>{user.supportId}</BodyLong>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <Label>Technical Details:</Label>
                            <BodyLong>{user.technical.join(', ')}</BodyLong>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <Label>Roles:</Label>
                            <BodyLong>
                                {user.roles.map((role, index) => (
                                    <Tag
                                        key={index}
                                        style={{ marginRight: '0.5rem' }}
                                        variant={'info'}>
                                        {role}
                                    </Tag>
                                ))}
                                {/*{features.map((f, index) => (*/}
                                {/*    <div key={index}>{f[index][0]}</div>*/}
                                {/*))}*/}
                            </BodyLong>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <Label>Enabled Features:</Label>
                            <BodyLong>
                                {trueFeatures.map(([feature], index) => (
                                    <Tag
                                        key={index}
                                        style={{ marginRight: '0.5rem' }}
                                        variant={'success'}>
                                        {feature}
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
