"use client";

import { useState, useEffect, useActionState } from "react";
import { authClient } from "@/util/auth-client";
import { Effect, ParseResult, Schema } from "effect";

// export const metadata: Metadata = {
//   title: "user update",
//   description: "user update",
// };

export type FormState = {
  errors?: {
    name?: string[];
  };
  message?: string;
} | null;

class UserUpdateError extends Schema.TaggedError<UserUpdateError>(
  "UserUpdateError"
)("UserUpdateError", { message: Schema.String }) {}

export default function Page() {
  async function update(
    state: FormState,
    formData: FormData
  ): Promise<FormState> {
    const UserSchemaUpdate = Schema.Struct({
      name: Schema.NonEmptyString,
    });
    const program = Schema.decodeUnknown(UserSchemaUpdate)({
      name: formData.get("name"),
    }).pipe(
      Effect.flatMap(({ name }) =>
        Effect.tryPromise({
          try: () => authClient.updateUser({ name }),
          catch: (error) => new Error(`Failed to update user: ${error}`),
        }).pipe(
          Effect.flatMap((response) => {
            if (response.error) {
              return Effect.fail(
                new UserUpdateError({ message: response.error.message ?? "" })
              );
            }
            return Effect.void;
          }),
          Effect.flatMap(() =>
            Effect.tryPromise({
              try: () => refreshSession(),
              catch: (error) =>
                new UserUpdateError({
                  message: `Failed to refresh session: ${error}`,
                }),
            })
          ),
          Effect.map(
            () =>
              ({
                message: "User updated successfully!",
              } as FormState)
          )
        )
      ),
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
          message: `Failed to change password. Please try again. ${error.message}`,
        } as FormState);
      })
    );

    return Effect.runPromise(program);
  }

  const [state, action, pending] = useActionState(update, null);

  const [session, setSession] = useState<
    typeof authClient.$Infer.Session | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState("");

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

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  if (loading) {
    return (
      <div>
        <h2>User Update</h2>
        <div>LOADING...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div>
        <h2>User Update</h2>
        <p>No user session found. Please log in.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>User Update</h2>
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
        <button disabled={pending} type="submit">
          {pending ? "Submitting..." : "Submit"}
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
