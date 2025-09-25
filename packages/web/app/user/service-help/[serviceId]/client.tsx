"use client";

import Link from "next/link";
import useAuth from "@/hook/use-auth";

interface ClientProps {
  serviceId: string;
}

export default function Client({ serviceId }: ClientProps) {
  const { loading, session } = useAuth();

  return (
    <div>
      <h2>User Service Help {serviceId}</h2>
      {loading ? <div>LOADING...</div> : <></>}
      {!session ? (
        <p>No user session found. Please log in.</p>
      ) : (
        <Link href={`http://localhost:3001/auth/${serviceId}/reference`}>
          Reference
        </Link>
      )}
    </div>
  );
}
