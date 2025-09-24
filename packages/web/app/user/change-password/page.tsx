"use client";

import { useActionState, useEffect, useState } from "react";
import { authClient } from "@/util/auth-client";
import { Effect, Schema } from "effect";

// export const metadata: Metadata = {
//   title: "user change-password",
//   description: "user change-password",
// };

export type FormState = {
  errors?: {
    currentPassword?: string[];
    newPassword?: string[];
  };
  message?: string;
} | null;

class UserChangePasswordError extends Schema.TaggedError<UserChangePasswordError>(
  "UserChangePasswordError"
)("UserChangePasswordError", { message: Schema.String }) {}

export default function Page() {
  async function changePassword(
    state: FormState,
    formData: FormData
  ): Promise<FormState> {
    const UserSchemaUpdate = Schema.Struct({
      currentPassword: Schema.NonEmptyString,
      newPassword: Schema.NonEmptyString,
    });
    const program = Schema.decodeUnknown(UserSchemaUpdate)({
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
    }).pipe(
      Effect.flatMap(({ currentPassword, newPassword }) =>
        Effect.tryPromise({
          try: (signal) =>
            authClient.changePassword(
              { currentPassword, newPassword, revokeOtherSessions: true },
              { signal }
            ),
          catch: (error) =>
            new UserChangePasswordError({
              message: `Failed to change password user: ${error}`,
            }),
        }).pipe(
          Effect.flatMap((response) => {
            if (response.error) {
              return Effect.fail(
                new UserChangePasswordError({
                  message: response.error.message ?? "",
                })
              );
            }
            return Effect.void;
          }),
          Effect.map(
            () =>
              ({
                message: "User change password successfully!",
              } as FormState)
          )
        )
      ),
      Effect.catchAll((error) => {
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes("currentpassword")) {
          return Effect.succeed({
            errors: {
              currentPassword: ["Please enter your current password"],
            },
            message: "Please check your input and try again.",
          } as FormState);
        }
        if (errorMessage.includes("newpassword")) {
          return Effect.succeed({
            errors: { newPassword: ["Please enter a valid new password"] },
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

  const [state, action, pending] = useActionState(changePassword, null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

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

  if (loading) {
    return (
      <div>
        <h2>Change Password</h2>
        <div>LOADING...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div>
        <h2>Change Password</h2>
        <p>No user session found. Please log in.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>User Change Password</h2>
      <form action={action}>
        <div>
          <label htmlFor="currentPassword">Current Password</label>
          <input
            id="currentPassword"
            name="currentPassword"
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current Password"
            required
            type="password"
            value={currentPassword}
          />
        </div>
        {state?.errors?.currentPassword && (
          <div style={{ color: "red" }}>
            {state.errors.currentPassword.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
        <div>
          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            name="newPassword"
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            required
            type="password"
            value={newPassword}
          />
        </div>
        {state?.errors?.newPassword && (
          <div style={{ color: "red" }}>
            {state.errors.newPassword.map((error, index) => (
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
