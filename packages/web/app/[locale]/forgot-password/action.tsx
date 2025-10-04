import { Effect, Schema } from "effect";
import { authClient } from "@/lib/auth-client";

type FormState = {
  errors?: {
    email?: string[];
  };
  message?: string;
} | null;

class ForgotPasswordError extends Schema.TaggedError<ForgotPasswordError>(
  "ForgotPasswordError"
)("ForgotPasswordError", { message: Schema.String }) {}

export async function forgotPassword(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  return Effect.runPromise(
    Schema.decodeUnknown(
      Schema.Struct({
        email: Schema.NonEmptyString.pipe(
          Schema.minLength(5),
          Schema.pattern(/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim)
        ),
      })
    )(Object.fromEntries(formData)).pipe(
      Effect.flatMap(({ email }) =>
        Effect.tryPromise({
          try: (signal) => authClient.forgetPassword({ email }, { signal }),
          catch: (error) => new Error(String(error)),
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
      Effect.catchTag("ParseError", (error) => {
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes('["email"]')) {
          return Effect.succeed({
            errors: {
              email: ["Please enter your email."],
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
          message: `Failed to forgot password. Please try again. ${error.message}`,
        } as FormState)
      )
    )
  );
}
