import { UserServiceList } from "~/components/user-service-list";
import type { Route } from "./+types/user.dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "user dashboard" },
    { name: "description", content: "user dashboard" },
  ];
}

export default function UserDashboard({}: Route.ComponentProps) {
  return (
    <div>
      <h2>User Dashbaord</h2>
      <UserServiceList />
    </div>
  );
}
