import type {MetaFunction} from "@remix-run/node";
import MeApi from "~/api/me-api";
import {json, Link, useLoaderData} from "@remix-run/react";
import {log} from "~/utils/logger";


export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async () => {
  const meData = await MeApi.fetchMe();
  const organizationsData = await MeApi.fetchOrganisations();
  return json({ meData, organizationsData });
};

export default function Index() {
  const { meData, organizationsData } = useLoaderData<typeof loader>();

  log(meData);
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">
        Welcome to Kunde Portalen, {meData.firstName}
        <div>Is part of {organizationsData.length} organization(s)</div>
        <div><Link to={'test'}>Test Page</Link></div>
      </h1>
    </div>
  );
}
