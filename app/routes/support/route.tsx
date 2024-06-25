import {BodyLong, Heading, Label, Tag} from "@navikt/ds-react";
import {json, useLoaderData} from "@remix-run/react";
import {IMeData} from "~/api/types";
import MeApi from "~/api/me-api";
import Breadcrumbs from "~/components/breadcrumbs";
import InternalHeader from "~/components/InternalHeader";
import { PersonIcon } from '@navikt/aksel-icons';


export let loader = async () => {
    try {
        const user = await MeApi.fetchMe();
        return json(user);
    } catch (error) {
        throw new Response("Failed to load user data", {status: 500});
    }
};

export default function Index() {
    const user = useLoaderData<IMeData>();
    const breadcrumbs = [
        { name: 'User Page', link: '/user' },
    ];

    return (

        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalHeader title={"User Information"} icon={PersonIcon}/>
            support form goes here
        </div>
    );
}
