"use client";

import { Result, useAtomValue } from "@effect-atom/atom-react";
import { useTranslations } from "next-intl";
import * as React from "react";

import { ServiceListEmpty } from "@/components/service-list-empty";
import Link from "@/components/ui/link";
import { HttpClient } from "@/lib/http-client";

type ServiceListProps = { userId?: string };

export default function ServiceList({ userId }: ServiceListProps) {
  const t = useTranslations("component.service-list");
  const readAll = React.useMemo(
    () =>
      HttpClient.query("service", "readAll", {
        reactivityKeys: userId ? [`services:${userId}`] : ["services"],
        urlParams: userId
          ? {
              filters: [
                {
                  column: "ownerId",
                  operator: "=",
                  value: userId,
                },
              ],
              sort: [{ column: "ownerId", sort: "ASC" }],
            }
          : { sort: [{ column: "ownerId", sort: "ASC" }] },
      }),
    [userId],
  );

  const result = useAtomValue(readAll);

  return Result.builder(result)
    .onDefect((defect) => <div>Defect: {String(defect)}</div>)
    .onErrorTag("ActorErrorUnauthorized", (error) => (
      <div>ActorErrorUnauthorized: {error.toString()}</div>
    ))
    .onErrorTag("ParseError", (error) => (
      <div>ParseError: {error.toString()}</div>
    ))
    .onErrorTag("RequestError", (error) => (
      <div>RequestError: {error.toString()}</div>
    ))
    .onErrorTag("ResponseError", (error) => (
      <div>ResponseError: {error.toString()}</div>
    ))
    .onInitial(() => <div>Initial...</div>)
    .onSuccess((data) => {
      if (data.data.length === 0) {
        return <ServiceListEmpty />;
      }

      return (
        <div>
          <table>
            <thead>
              <tr>
                <th>{t("table.head.ownerId")}</th>
                <th>{t("table.head.id")}</th>
                <th>{t("table.head.name")}</th>
                <th>{t("table.head.help")}</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((value) => (
                <tr key={value.id}>
                  <td>{value.ownerId}</td>
                  <td>{value.id}</td>
                  <td>{value.name}</td>
                  <td>
                    <Link href={`/user/service-help/${String(value.id)}`}>
                      {t("table.body.help")}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    })
    .onWaiting(() => <div>Waiting...</div>)
    .render();
}
