import { Result, useAtomValue } from "@effect-atom/atom-react";
import { href, Link } from "react-router";
import { HttpClient } from "~/libs/http-client";
import { useMemo } from "react";

export function AdminServiceList() {
  const readAll = useMemo(
    () =>
      HttpClient.query("service", "readAll", {
        reactivityKeys: ["services"],
        urlParams: { sort: [{ column: "ownerId", sort: "ASC" }] },
      }),
    []
  );

  const readAllResult = useAtomValue(readAll);

  return Result.builder(readAllResult)
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
    .onInitialOrWaiting(() => <div>LOADING....</div>)
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
                  <Link
                    to={href("/user/service-help/:serviceId", {
                      serviceId: String(value.id),
                    })}
                  >
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
    .render();
}
