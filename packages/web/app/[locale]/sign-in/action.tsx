import { Effect, Schema } from "effect";
import { authClient } from "@/lib/auth-client";

type FormState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
} | null;

class SignInError extends Schema.TaggedError<SignInError>("SignInError")(
  "SignInError",
  { message: Schema.String }
) {}

export async function signInEmail(
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
        password: Schema.NonEmptyString,
      })
    )(Object.fromEntries(formData)).pipe(
      Effect.flatMap(({ email, password }) =>
        Effect.tryPromise({
          try: (signal) =>
            authClient.signIn.email(
              { callbackURL, email, password, rememberMe: true },
              { signal }
            ),
          catch: (error) => new Error(String(error)),
        }).pipe(
          Effect.flatMap((response) => {
            if (response.error) {
              return Effect.fail(
                new SignInError({ message: response.error.message ?? "" })
              );
            }
            return Effect.void;
          }),
          Effect.map(
            () =>
              ({
                message: "User sign in successfully!",
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
          message: `Failed to sign in. Please try again. ${error.message}`,
        } as FormState)
      )
    )
  );
}
