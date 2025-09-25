"use client";

import { ServiceList } from "@/component/service-list";
import useAuth from "@/hook/use-auth";

export default function Client() {
  const { loading, session } = useAuth();

  return (
    <div>
      <h2>User Dashboard</h2>
      {loading ? <div>LOADING...</div> : <></>}
      {!session ? (
        <p>No user session found. Please log in.</p>
      ) : (
        <ServiceList params={{ userId: session.user.id }} />
      )}
    </div>
  );
}
