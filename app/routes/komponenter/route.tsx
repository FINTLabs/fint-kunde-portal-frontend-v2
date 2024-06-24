import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Komponenter" },
    { name: "description", content: "Liste over komponenter" },
  ];
};

export default function Index() {
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Velkomment til komponenter :)</h1>
    </div>
  );
}
