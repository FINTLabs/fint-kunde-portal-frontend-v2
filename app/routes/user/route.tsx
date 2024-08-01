import { BodyLong, Label, Tag } from '@navikt/ds-react';
import { json, useLoaderData } from '@remix-run/react';
import { IMeData } from '~/types/types';
import MeApi from '~/api/MeApi';
import { PersonIcon } from '@navikt/aksel-icons';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';

export let loader = async () => {
    try {
        const user = await MeApi.fetchMe();
        return json(user);
    } catch (error) {
        throw new Response('Failed to load user data', { status: 500 });
    }
};

export default function Index() {
    const user = useLoaderData<IMeData>();
    const breadcrumbs = [{ name: 'Profile', link: '/user' }];

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={'User Information'} icon={PersonIcon} />
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
                        <Tag key={index} style={{ marginRight: '0.5rem' }} variant={'info'}>
                            {role}
                        </Tag>
                    ))}
                </BodyLong>
            </div>
        </div>
    );
}
