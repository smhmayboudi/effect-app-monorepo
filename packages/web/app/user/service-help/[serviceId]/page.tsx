"use client";

import Link from "next/link";
import useAuth from "@/hook/use-auth";
import { useEffect, useState } from "react";

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

export default function Page(
  props: PageProps<"/user/service-help/[serviceId]">
) {
  const [serviceId, setServiceId] = useState<string | null>(null);
  const { loading, session } = useAuth();

  useEffect(() => {
    async function getParams() {
      const params = await props.params;
      setServiceId(params.serviceId);
    }
    getParams();
  }, [props.params]);

  if (!serviceId) {
    return (
      <div>
        <h2>Loading service details...</h2>
        <div>LOADING...</div>
      </div>
    );
  }

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
