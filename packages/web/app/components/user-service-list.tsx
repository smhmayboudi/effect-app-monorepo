import { Result, useAtomValue } from "@effect-atom/atom-react";
import { HttpClient } from "~/libs/http-client";
import { authClient } from "~/libs/auth-client";
import { useEffect, useState, useMemo } from "react";
import { href, Link } from "react-router";

export function UserServiceList() {
  const [session, setSession] = useState<
    typeof authClient.$Infer.Session | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshSession = async () => {
    setLoading(true);
    try {
      const newSession = await authClient.getSession();
      setSession(newSession.data);
    } catch (error) {
      console.error("Failed to refresh session:", error);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const readAll = useMemo(
    () =>
      HttpClient.query("service", "readAll", {
        reactivityKeys: ["services", session?.user.id],
        urlParams: session?.user.id
          ? {
              filters: [
                {
                  column: "ownerId",
                  operator: "=",
                  value: session.user.id,
                },
              ],
            }
          : {},
      }),
    [session?.user.id]
  );

  const readAllResult = useAtomValue(readAll);

  if (loading) {
    return <div>Loading session...</div>;
  }

  if (!session?.user.id) {
    return <div>No user session found. Please log in.</div>;
  }

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
    .onInitialOrWaiting(() => <div>Loading services...</div>)
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
                  {" "}
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
