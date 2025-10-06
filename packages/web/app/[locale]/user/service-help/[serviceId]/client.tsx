"use client";

import { authClient } from "@/lib/auth-client";
import { useTranslations } from "next-intl";
import Link from "@/component/ui/link";
import { LuExternalLink } from "react-icons/lu";

interface ClientProps {
  serviceId: string;
}

export default function Client({ serviceId }: ClientProps) {
  const t = useTranslations("user.service-help");
  const { data, isPending } = authClient.useSession();

  return (
    <div>
      <h2>{t("title", { serviceId })}</h2>
      {isPending ? (
        <div>LOADING...</div>
      ) : !data ? (
        <p>No user session found. Please log in.</p>
      ) : (
        <Link href={`http://127.0.0.1:3001/auth/${serviceId}/reference`}>
          Reference <LuExternalLink />
        </Link>
      )}
    </div>
  );
}
