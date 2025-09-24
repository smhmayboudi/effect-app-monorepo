"use client";

import { Result, useAtomValue } from "@effect-atom/atom-react";
import { HttpClient } from "@/util/http-client";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";

export function ServiceList({ params }: { params: { userId?: string } }) {
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const extractUserId = async () => {
      const resolvedParams = await params;
      setUserId(resolvedParams.userId);
    };
    extractUserId();
  }, [params]);

  const readAll = useMemo(
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
    [userId]
  );

  const result = useAtomValue(readAll);

  return Result.builder(result)
    .onDefect(() => <div>Defect</div>)
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
    .onSuccess((data) => (
      <div>
        <table>
          <thead>
            <tr>
              <th>ownerId</th>
              <th>id</th>
              <th>name</th>
              <th>help</th>
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
                    help
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>F1</td>
              <td>F2</td>
              <td>F3</td>
              <td>F4</td>
            </tr>
          </tfoot>
        </table>
      </div>
    ))
    .onWaiting(() => <div>Waiting...</div>)
    .render();
}
