"use client";

import { useAtomValue, useAtomSet, Result } from "@effect-atom/atom-react";
import { IdempotencyKeyClient } from "@template/domain/shared/application/IdempotencyKeyClient";
import { useState } from "react";
import { v7 } from "uuid";
import { HttpClient } from "@/util/http-client";
import { useTranslations } from "next-intl";
import Button from "@/component/ui/button";

export default function Client() {
  const t = useTranslations("user.service-create");
  const [name, setName] = useState("");
  const [pending, setPending] = useState(false);

  const create = HttpClient.mutation("service", "create");
  const createPromise = useAtomSet(create, { mode: "promise" });
  const result = useAtomValue(create);

  const action = async () => {
    setPending(true);
    try {
      const result = await createPromise({
        headers: { "idempotency-key": IdempotencyKeyClient.make(v7()) },
        payload: { name },
        reactivityKeys: ["services"],
      });
      console.log("Service created:", result);
    } catch (error) {
      console.error("Failed to create service:", error);
    } finally {
      setPending(false);
    }
  };

  return (
    <div>
      <h2>{t("title")}</h2>
      <form action={action}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            aria-disabled={pending}
            disabled={pending}
            id="name"
            name="name"
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
            type="text"
            value={name}
          />
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Submitting..." : "Submit"}
        </Button>
      </form>
      {result &&
        Result.builder(result)
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
          .onErrorTag("ServiceErrorAlreadyExists", (error) => (
            <div>ServiceErrorAlreadyExists: {error.toString()}</div>
          ))
          .onInitial(() => null)
          .onSuccess((data) => (
            <div>Service {data.data} created successfully!</div>
          ))
          .onWaiting(() => <div>Creating service...</div>)
          .render()}
    </div>
  );
}
