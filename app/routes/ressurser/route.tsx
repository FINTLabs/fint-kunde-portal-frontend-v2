import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Ressurser" },
    { name: "description", content: "Liste over ressurser" },
  ];
};

export default function Index() {
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Velkomment til Ressurser :)</h1>
    </div>
  );
}
