"use client";

import Link from "next/link";
import useAuth from "@/hook/use-auth";
import { useTranslations } from "next-intl";

interface ClientProps {
  serviceId: string;
}

export default function Client({ serviceId }: ClientProps) {
  const t = useTranslations("user.service-help");
  const { loading, session } = useAuth();

  return (
    <div>
      <h2>{t("title", { serviceId })}</h2>
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
