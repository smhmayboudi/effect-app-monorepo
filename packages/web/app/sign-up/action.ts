import { Effect, Schema } from "effect";
import { authClient } from "@/util/auth-client";

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

export async function signUp(
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
