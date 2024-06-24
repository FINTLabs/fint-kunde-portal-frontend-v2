import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Adapter" },
    { name: "description", content: "Liste over adapter" },
  ];
};

export default function Index() {
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Velkomment til adapter :)</h1>
    </div>
  );
}
