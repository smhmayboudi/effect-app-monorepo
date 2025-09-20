import type { Route } from "./+types/_index";

export function meta({}: Route.MetaArgs) {
  return [{ title: "index" }, { name: "description", content: "index" }];
}

export default function Home({}: Route.ComponentProps) {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}
