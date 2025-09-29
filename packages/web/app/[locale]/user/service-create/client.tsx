"use client";

import { useAtomSet } from "@effect-atom/atom-react";
import { IdempotencyKeyClient } from "@template/domain/shared/application/IdempotencyKeyClient";
import { useActionState, useState } from "react";
import { v7 } from "uuid";
import { HttpClient } from "@/util/http-client";
import { useTranslations } from "next-intl";
import Button from "@/component/ui/button";

export default function Client() {
  const t = useTranslations("user.service-create");
  const httpClientCreate = HttpClient.mutation("service", "create");
  const createPromise = useAtomSet(httpClientCreate, { mode: "promise" });

  type FormState = {
    errors?: {
      name?: string[];
    };
    message?: string;
  } | null;

  const serviceCreate = async (state: FormState, formData: FormData) => {
    const name = formData.get("name") as string;
    try {
      const result = await createPromise({
        headers: { "idempotency-key": IdempotencyKeyClient.make(v7()) },
        payload: { name },
        reactivityKeys: ["services"],
      });
      return {
        message: `Service ${result.data} cerated successfully!`,
      } as FormState;
    } catch (error) {
      return {
        message: `Failed to create service: ${error}`,
      } as FormState;
    }
  };

  const [state, action, pending] = useActionState(serviceCreate, null);
  const [name, setName] = useState("");

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
        {state?.errors?.name && (
          <div style={{ color: "red" }}>
            {state.errors.name.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
        <Button type="submit" disabled={pending}>
          {pending ? "Submitting..." : "Submit"}
        </Button>
        {state?.message && (
          <p
            aria-live="polite"
            role="status"
            style={{
              color: state.message.includes("successfully") ? "green" : "red",
            }}
          >
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
}
