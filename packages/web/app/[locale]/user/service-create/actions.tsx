import { HttpClient } from "@/util/http-client";
import { Registry } from "@effect-atom/atom-react";
import { IdempotencyKeyClient } from "@template/domain/shared/application/IdempotencyKeyClient";
import { Effect, Schema } from "effect";
import { v7 } from "uuid";

type FormState = {
  errors?: {
    name?: string[];
  };
  message?: string;
} | null;

export async function serviceCreate(state: FormState, formData: FormData) {
  return Effect.runPromise(
    Schema.decodeUnknown(
      Schema.Struct({
        name: Schema.NonEmptyString,
      })
    )(Object.fromEntries(formData)).pipe(
      Effect.flatMap(({ name }) => {
        const registry = Registry.make();
        const createMutation = HttpClient.mutation("service", "create");
        registry.set(createMutation, {
          headers: { "idempotency-key": IdempotencyKeyClient.make(v7()) },
          payload: { name },
          reactivityKeys: ["services"],
        });

        return Registry.getResult(registry, createMutation, {
          suspendOnWaiting: true,
        }).pipe(
          Effect.map(
            () =>
              ({
                message: "Service create successfully!",
              } as FormState)
          )
        );
      }),
      Effect.catchAll((error) => {
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes("name")) {
          return Effect.succeed({
            errors: {
              name: ["Please enter your name"],
            },
            message: "Please check your input and try again.",
          } as FormState);
        }

        return Effect.succeed({
          message: `Failed to service create. Please try again. ${error.message}`,
        } as FormState);
      })
    )
  );
}
