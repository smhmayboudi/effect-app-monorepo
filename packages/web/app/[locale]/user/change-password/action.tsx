import { Effect, Schema } from "effect";
import { authClient } from "@/util/auth-client";

type FormState = {
  errors?: {
    currentPassword?: string[];
    newPassword?: string[];
  };
  message?: string;
} | null;

class UserChangePasswordError extends Schema.TaggedError<UserChangePasswordError>(
  "UserChangePasswordError"
)("UserChangePasswordError", { message: Schema.String }) {}

export async function changePassword(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const UserSchemaUpdate = Schema.Struct({
    currentPassword: Schema.NonEmptyString,
    newPassword: Schema.NonEmptyString,
  });
  const program = Schema.decodeUnknown(UserSchemaUpdate)(
    Object.fromEntries(formData)
  ).pipe(
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
