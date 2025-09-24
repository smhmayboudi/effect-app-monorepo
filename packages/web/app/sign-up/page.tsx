"use client";

import { useActionState, useState } from "react";
import { authClient } from "@/util/auth-client";
import { Effect, Schema } from "effect";

// export const metadata: Metadata = {
//   title: "sign-up",
//   description: "sign-up",
// };

export type FormState = {
  errors?: {
    email?: string[];
    name?: string[];
    password?: string[];
  };
  message?: string;
} | null;

class SignUpError extends Schema.TaggedError<SignUpError>("SignUpError")(
  "SignUpError",
  { message: Schema.String }
) {}

export default function Page() {
  async function signUp(
    state: FormState,
    formData: FormData
  ): Promise<FormState> {
    const UserSchemaUpdate = Schema.Struct({
      email: Schema.NonEmptyString,
      name: Schema.NonEmptyString,
      password: Schema.NonEmptyString,
    });
    const program = Schema.decodeUnknown(UserSchemaUpdate)(
      Object.fromEntries(formData)
    ).pipe(
      Effect.flatMap(({ email, name, password }) =>
        Effect.tryPromise({
          try: (signal) =>
            authClient.signUp.email({ email, name, password }, { signal }),
          catch: (error) => new Error(`Failed to sign up user: ${error}`),
        }).pipe(
          Effect.flatMap((response) => {
            if (response.error) {
              return Effect.fail(
                new SignUpError({ message: response.error.message ?? "" })
              );
            }
            return Effect.void;
          }),
          Effect.map(
            () =>
              ({
                message: "User sign up successfully!",
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
        if (errorMessage.includes("name")) {
          return Effect.succeed({
            errors: {
              name: ["Please enter your name"],
            },
            message: "Please check your input and try again.",
          } as FormState);
        }
        if (errorMessage.includes("password")) {
          return Effect.succeed({
            errors: {
              password: ["Please enter your password"],
            },
            message: "Please check your input and try again.",
          } as FormState);
        }

        return Effect.succeed({
          message: `Failed to sign up. Please try again. ${error.message}`,
        } as FormState);
      })
    );

    return Effect.runPromise(program);
  }

  const [state, action, pending] = useActionState(signUp, null);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <h2>Sign Up</h2>
      <form action={action}>
        <div>
          <label htmlFor="name">Name</label>
          <input
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
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            type="password"
            value={password}
          />
        </div>
        {state?.errors?.password && (
          <div style={{ color: "red" }}>
            {state.errors.password.map((error, index) => (
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
