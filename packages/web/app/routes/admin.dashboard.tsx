import { AdminServiceList } from "~/components/admin-service-list";
import type { Route } from "./+types/admin.dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "admin dashboard" },
    { name: "description", content: "admin dashboard" },
  ];
}

export default function AdminDashboard() {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <AdminServiceList />
    </div>
  );
}
