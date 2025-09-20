import type { Route } from "./+types/_index";

export function meta({}: Route.MetaArgs) {
  return [{ title: "index" }, { name: "description", content: "index" }];
}

export default function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}
