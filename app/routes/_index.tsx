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

  const meData = await MeApi.fetchDisplayName();
  return json({ meData });
};

export default function Index() {
  const { meData } = useLoaderData<typeof loader>();

  log(meData);
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">
        Welcome to Kunde Portalen, {meData.firstName}
        <div><Link to={'test'}>Test Page</Link></div>
      </h1>
    </div>
  );
}
