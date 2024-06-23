import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

// export const loader = async ({ request }: { request: Request }) => {
//   return json({ meData });
// };

export default function Index() {
  // const { meData } = useLoaderData<typeof loader>();

  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Velkomment til kontakter</h1>
    </div>
  );
}
