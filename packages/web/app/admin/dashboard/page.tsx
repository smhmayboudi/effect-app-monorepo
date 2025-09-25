"use client";

import { ServiceList } from "@/component/service-list";
import useAuth from "@/hook/use-auth";

// export const metadata: Metadata = {
//   title: "admin dashboard",
//   description: "admin dashboard",
// };

export default function Page() {
  const { loading, session } = useAuth();

  if (loading) {
    return (
      <div>
        <h2>Admin Dashboard</h2>
        <div>LOADING...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div>
        <h2>Admin Dashboard</h2>
        <p>No user session found. Please log in.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <ServiceList params={{}} />
    </div>
  );
}
