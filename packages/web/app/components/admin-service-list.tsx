import { Result, useAtomValue } from "@effect-atom/atom-react";
import { HttpClient } from "~/libs/http-client";

export function AdminServiceList() {
  const list = HttpClient.query("service", "readAll", {
    reactivityKeys: ["services"],
    urlParams: {},
  });
  const result = useAtomValue(list);

  return Result.builder(result)
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
            </tr>
          </thead>
          <tbody>
            {data.data.map((value) => (
              <tr key={value.id}>
                <td>{value.ownerId}</td>
                <td>{value.id}</td>
                <td>{value.name}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>F1</td>
              <td>F2</td>
              <td>F3</td>
            </tr>
          </tfoot>
        </table>
      </div>
    ))
    .render();
}
