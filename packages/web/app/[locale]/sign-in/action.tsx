import { Effect, Schema } from "effect";
import { authClient } from "@/util/auth-client";

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
  state: FormState,
  formData: FormData
): Promise<FormState> {
  return Effect.runPromise(
    Schema.decodeUnknown(
      Schema.Struct({
        email: Schema.NonEmptyString,
        password: Schema.NonEmptyString,
      })
    )(Object.fromEntries(formData)).pipe(
      Effect.flatMap(({ email, password }) =>
        Effect.tryPromise({
          try: (signal) =>
            authClient.signIn.email(
              { email, password, rememberMe: true },
              { signal }
            ),
          catch: (error) => new Error(`Failed to sign up user: ${error}`),
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
    )
  );
}
