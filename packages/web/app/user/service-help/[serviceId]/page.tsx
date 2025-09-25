"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSession, type Session } from "@/util/auth-client";

// export async function generateMetadata(
//   props: PageProps<"/user/service-help/[serviceId]">
// ) {
//   const { serviceId } = await props.params;

//   return Promise.resolve({
//     title: `user service-help ${serviceId}`,
//     description: `user service-help ${serviceId}`,
//   } as Metadata);
// }

// export async function generateStaticParams() {
//   // SELECT serviceId from tbl_service
//   const results = [{}]
//   return results.map(value => ({ serviceId: value.service_id }));
// }

export default async function Page(
  props: PageProps<"/user/service-help/[serviceId]">
) {
  const { serviceId } = await props.params;

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshSession = async () => {
    setLoading(true);
    try {
      const newSession = await getSession();
      setSession(newSession.data);
    } catch (error) {
      console.error("Failed to refresh session:", error);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  if (loading) {
    return (
      <div>
        <h2>User Service Help {serviceId}</h2>
        <div>LOADING...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div>
        <h2>User Service Help {serviceId}</h2>
        <p>No user session found. Please log in.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>User Service Help {serviceId}</h2>
      <Link href={`http://localhost:3001/auth/${serviceId}/reference`}>
        Reference
      </Link>
    </div>
  );
}
