import type {MetaFunction} from "@remix-run/node";
import {Link, useOutletContext} from "@remix-run/react";
import {UserSession} from "~/api/types";
import {log} from "~/utils/logger";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};



export default function Index() {
    const userSession = useOutletContext<UserSession>();

log("userSession", userSession)
    return (
      <div className="font-sans p-4">
        <h1 className="text-3xl">
          Welcome to Kunde Portalen, {userSession.firstName}
          <div>Is part of {userSession.organizationCount} organization(s)</div>
          <div>
            <Link to={"test"}>Test Page</Link>
          </div>
        </h1>
      </div>
  );
}
