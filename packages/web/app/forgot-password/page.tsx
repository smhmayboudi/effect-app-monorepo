"use client";

import { useActionState, useState } from "react";
import useAuth from "@/hook/use-auth";
import { Effect, Schema } from "effect";

// export const metadata: Metadata = {
//   title: "forgot-password",
//   description: "forgot-password",
// };

export type FormState = {
  errors?: {
    email?: string[];
  };
  message?: string;
} | null;

class ForgotPasswordError extends Schema.TaggedError<ForgotPasswordError>(
  "ForgotPasswordError"
)("ForgotPasswordError", { message: Schema.String }) {}

export default function Page() {
  const { forgetPassword } = useAuth();

  async function forgotPassword(
    state: FormState,
    formData: FormData
  ): Promise<FormState> {
    const UserSchemaUpdate = Schema.Struct({
      email: Schema.NonEmptyString,
    });
    const program = Schema.decodeUnknown(UserSchemaUpdate)(
      Object.fromEntries(formData)
    ).pipe(
      Effect.flatMap(({ email }) =>
        Effect.tryPromise({
          try: (signal) => forgetPassword({ email }, { signal }),
          catch: (error) =>
            new Error(`Failed to forgot password user: ${error}`),
        }).pipe(
          Effect.flatMap((response) => {
            if (response.error) {
              return Effect.fail(
                new ForgotPasswordError({
                  message: response.error.message ?? "",
                })
              );
            }
            return Effect.void;
          }),
          Effect.map(
            () =>
              ({
                message: "User forgot password successfully!",
              } as FormState)
          )
        )
      ),
      Effect.catchAll((error) => {
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes("email")) {
          return Effect.succeed({
            errors: {
              email: ["Please enter your email"],
            },
            message: "Please check your input and try again.",
          } as FormState);
        }

        return Effect.succeed({
          message: `Failed to forgot password. Please try again. ${error.message}`,
        } as FormState);
      })
    );

    return Effect.runPromise(program);
  }

  const [state, action, pending] = useActionState(forgotPassword, null);

  const [email, setEmail] = useState("");

  return (
    <div>
      <h2>Forgot Password</h2>
      <form action={action}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            type="email"
            value={email}
          />
        </div>
        {state?.errors?.email && (
          <div style={{ color: "red" }}>
            {state.errors.email.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
        <button disabled={pending} type="submit">
          Submit
        </button>
        {state?.message && (
          <p
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
