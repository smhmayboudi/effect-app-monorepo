"use client";

import ServiceList from "@/component/service-list";
import { authClient } from "@/util/auth-client";
import { useTranslations } from "next-intl";

export default function Client() {
  const t = useTranslations("user.dashboard");
  const { data, isPending } = authClient.useSession();

  return (
    <div>
      <h2>{t("title")}</h2>
      {isPending ? (
        <div>LOADING...</div>
      ) : !data ? (
        <p>No user session found. Please log in.</p>
      ) : (
        <ServiceList params={{ userId: data.user.id }} />
      )}
    </div>
  );
}
