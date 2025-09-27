"use client";

import { Result, useAtomValue } from "@effect-atom/atom-react";
import type { HttpClientError } from "@effect/platform/HttpClientError";
import { IdempotencyKeyClient } from "@template/domain/shared/application/IdempotencyKeyClient";
import type { ActorErrorUnauthorized } from "@template/domain/Actor";
import type { ServiceId } from "@template/domain/service/application/ServiceApplicationDomain";
import type { ServiceErrorAlreadyExists } from "@template/domain/service/application/ServiceApplicationErrorAlreadyExists";
import type { IdempotencyError } from "@template/domain/shared/application/IdempotencyError";
import type { IdempotencyErrorKeyMismatch } from "@template/domain/shared/application/IdempotencyErrorKeyMismatch";
import type { IdempotencyErrorKeyRequired } from "@template/domain/shared/application/IdempotencyErrorKeyRequired";
import type { IdempotencyErrorRequestInProgress } from "@template/domain/shared/application/IdempotencyErrorRequestInProgress";
import type { ParseError } from "effect/ParseResult";
import { useState, useEffect, useMemo } from "react";
import { v7 } from "uuid";
import { HttpClient } from "@/util/http-client";
import { useTranslations } from "next-intl";
import Button from "@/component/ui/button";

export default function Client() {
  const t = useTranslations("user.service-create");
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

  const create = useMemo(
    () =>
      HttpClient.query("service", "create", {
        headers: { "idempotency-key": IdempotencyKeyClient.make(v7()) },
        payload: { name },
        reactivityKeys: ["services"],
      }),
    [name]
  );

  const createResult = useAtomValue(create);

  useEffect(() => {
    if (shouldFetch && createResult) {
      setResult(createResult);
    }
  }, [shouldFetch, createResult]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShouldFetch(true);
  };

  return (
    <div>
      <h2>{t("title")}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            // aria-disabled={pending}
            // disabled={pending}
            id="name"
            name="name"
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
            type="text"
            value={name}
          />
          {/* {state?.errors?.name && (
            <div style={{ color: "red" }}>
              {state.errors.name.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )} */}
        </div>
        <Button formName="service-create" />
        {/* {state?.message && (
          <p
            aria-live="polite"
            role="status"
            style={{
              color: state.message.includes("successfully") ? "green" : "red",
            }}
          >
            {state.message}
          </p>
        )} */}
      </form>
      {result &&
        Result.builder(result)
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
          .onSuccess((data) => <div>Service {data.data} created.</div>)
          .onWaiting(() => <div>Waiting...</div>)
          .render()}
    </div>
  );
}
