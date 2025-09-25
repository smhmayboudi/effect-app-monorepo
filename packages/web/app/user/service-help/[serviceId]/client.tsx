"use client";

import Link from "next/link";
import useAuth from "@/hook/use-auth";

interface ClientProps {
  serviceId: string;
}

export default function Client({ serviceId }: ClientProps) {
  const { loading, session } = useAuth();

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
