import type { MetaFunction } from "@remix-run/node";
import MeApi from "~/api/me-api";
import {json} from "@remix-run/react";
import {useLoaderData} from "@remix-run/react";
import {IMeData} from "~/api/types";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({request}: {request: Request}) => {
  const cookies = request.headers.get('Cookie');
  // if (cookies === null) {
  //     return json({ error: "Authentication required" }, { status: 401 });
  // }
  const meData = await MeApi.fetchDisplayName(cookies);
  return json({ meData });
}

export default function Index() {
  const { meData } = useLoaderData<typeof loader>();

  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Welcome to Kunde Portalen, {meData.firstName}</h1>

    </div>
  );
}
