"use client";

import ServiceList from "@/component/service-list";
import useAuth from "@/hook/use-auth";
import { useTranslations } from "next-intl";

export default function Client() {
  const t = useTranslations("admin.dashboard");
  const { loading, session } = useAuth();

  return (
    <div>
      <h2>{t("title")}</h2>
      {loading ? <div>LOADING...</div> : <></>}
      {!session ? (
        <p>No user session found. Please log in.</p>
      ) : (
        <ServiceList params={{}} />
      )}
    </div>
  );
}
