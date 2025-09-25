"use client";

import { ServiceList } from "@/component/service-list";
import useAuth from "@/hook/use-auth";

// export const metadata: Metadata = {
//   title: "user dashboard",
//   description: "user dashboard",
// };

export default function Page() {
  const { loading, session } = useAuth();

  if (loading) {
    return (
      <div>
        <h2>User Dashboard</h2>
        <div>LOADING...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div>
        <h2>User Dashboard</h2>
        <p>No user session found. Please log in.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>User Dashboard</h2>
      <ServiceList params={{ userId: session.user.id }} />
    </div>
  );
}
