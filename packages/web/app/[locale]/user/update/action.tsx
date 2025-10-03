import { Effect, Schema } from "effect";
import { authClient } from "@/lib/auth-client";

type FormState = {
  errors?: {
    name?: string[];
  };
  message?: string;
} | null;

class UserUpdateError extends Schema.TaggedError<UserUpdateError>(
  "UserUpdateError"
)("UserUpdateError", { message: Schema.String }) {}

export async function update(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  return Effect.runPromise(
    Schema.decodeUnknown(
      Schema.Struct({
        name: Schema.NonEmptyString,
      })
    )(Object.fromEntries(formData)).pipe(
      Effect.flatMap(({ name }) =>
        Effect.tryPromise({
          try: (signal) => authClient.updateUser({ name }, { signal }),
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
          Effect.map(
            () =>
              ({
                message: "User update successfully!",
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
    )
  );
}
