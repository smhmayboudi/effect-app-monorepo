import { Effect, Schema } from "effect";
import { authClient } from "@/lib/auth-client";

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

export async function signUpEmail(
  callbackURL: string,
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
        name: Schema.NonEmptyString,
        password: Schema.NonEmptyString,
      })
    )(Object.fromEntries(formData)).pipe(
      Effect.flatMap(({ email, name, password }) =>
        Effect.tryPromise({
          try: (signal) =>
            authClient.signUp.email(
              { callbackURL, email, name, password },
              { signal }
            ),
          catch: (error) => new Error(String(error)),
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
        if (errorMessage.includes('["name"]')) {
          return Effect.succeed({
            errors: {
              name: ["Please enter your name."],
            },
            message: "Please check your input and try again.",
          } as FormState);
        }
        if (errorMessage.includes('["password"]')) {
          return Effect.succeed({
            errors: {
              password: ["Please enter your password."],
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
          message: `Failed to sign up. Please try again. ${error.message}`,
        } as FormState)
      )
    )
  );
}
