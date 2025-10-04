import { Effect, Schema } from "effect";
import { authClient } from "@/lib/auth-client";

type FormState = {
  errors?: {
    newPassword?: string[];
  };
  message?: string;
} | null;

class ResetPasswordError extends Schema.TaggedError<ResetPasswordError>(
  "ResetPasswordError"
)("ResetPasswordError", { message: Schema.String }) {}

export async function signInEmail(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  return Effect.runPromise(
    Schema.decodeUnknown(
      Schema.Struct({
        newPassword: Schema.NonEmptyString,
        token: Schema.NonEmptyString,
      })
    )(Object.fromEntries(formData)).pipe(
      Effect.flatMap(({ newPassword, token }) =>
        Effect.tryPromise({
          try: (signal) =>
            authClient.resetPassword({ newPassword, token }, { signal }),
          catch: (error) => new Error(String(error)),
        }).pipe(
          Effect.flatMap((response) => {
            if (response.error) {
              return Effect.fail(
                new ResetPasswordError({
                  message: response.error.message ?? "",
                })
              );
            }
            return Effect.void;
          }),
          Effect.map(
            () =>
              ({
                message: "User reset password successfully!",
              } as FormState)
          )
        )
      ),
      Effect.catchTag("ParseError", (error) => {
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes('["newpassword"]')) {
          return Effect.succeed({
            errors: {
              newPassword: ["Please enter your new password."],
            },
            message: "Please check your input and try again.",
          } as FormState);
        }

        return Effect.succeed({
          message: "Please check your input and try again.",
        } as FormState);
      }),
      Effect.catchAll((error) =>
        Effect.succeed({
          message: `Failed to reset password. Please try again. ${error.message}`,
        } as FormState)
      )
    )
  );
}
