import { Result, useAtomValue } from "@effect-atom/atom-react";
import type { HttpClientError } from "@effect/platform/HttpClientError";
import { IdempotencyKeyClient } from "@template/domain";
import type { ActorErrorUnauthorized } from "@template/domain/Actor";
import type { ServiceId } from "@template/domain/service/application/ServiceApplicationDomain";
import type { ServiceErrorAlreadyExists } from "@template/domain/service/application/ServiceApplicationErrorAlreadyExists";
import type { IdempotencyError } from "@template/domain/shared/application/IdempotencyError";
import type { IdempotencyErrorKeyMismatch } from "@template/domain/shared/application/IdempotencyErrorKeyMismatch";
import type { IdempotencyErrorKeyRequired } from "@template/domain/shared/application/IdempotencyErrorKeyRequired";
import type { IdempotencyErrorRequestInProgress } from "@template/domain/shared/application/IdempotencyErrorRequestInProgress";
import type { ParseError } from "effect/ParseResult";
import { useState } from "react";
import { Form } from "react-router";
import { v7 } from "uuid";
import { HttpClient } from "~/libs/http-client";
import type { Route } from "./+types/user.service-create";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "user create service" },
    { name: "description", content: "user create service" },
  ];
}

export default function UserServiceCreate() {
  const [name, setName] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);
  const [result, setResult] = useState<Result.Result<
    {
      readonly data: ServiceId;
    },
    | IdempotencyError
    | IdempotencyErrorKeyMismatch
    | IdempotencyErrorKeyRequired
    | IdempotencyErrorRequestInProgress
    | ServiceErrorAlreadyExists
    | ActorErrorUnauthorized
    | HttpClientError
    | ParseError
  > | null>(null);

  // Only create the query when shouldFetch is true
  const create = shouldFetch
    ? HttpClient.query("service", "create", {
        headers: {
          "idempotency-key": IdempotencyKeyClient.IdempotencyKeyClient.make(
            v7()
          ),
        },
        payload: { name },
        reactivityKeys: ["services"],
      })
    : null;

  const createResult = shouldFetch ? useAtomValue(create!) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShouldFetch(true);
  };

  useState(() => {
    if (createResult) {
      setResult(createResult);
    }
  });

  return (
    <div>
      <h2>User Service Create</h2>
      <Form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          type="text"
          value={name}
        />
        <button type="submit">Submit</button>
      </Form>
      {result &&
        Result.builder(result)
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
          .onSuccess((data) => <div>Service {data.data} created.</div>)
          .render()}
    </div>
  );
}
