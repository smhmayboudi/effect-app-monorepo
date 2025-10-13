import { Effect } from "effect";
import { toast } from "sonner";

type ToastOptions<A, E, Args extends ReadonlyArray<unknown>> = {
  onFailure: ((error: E, ...args: Args) => string) | string;
  onSuccess: ((a: A, ...args: Args) => string) | string;
  onWaiting: ((...args: Args) => string) | string;
};

export const withToast =
  <A, E, Args extends ReadonlyArray<unknown>, R>(
    options: ToastOptions<A, E, Args>,
  ) =>
  (self: Effect.Effect<A, E, R>, ...args: Args): Effect.Effect<A, E, R> => {
    const toastId = toast.loading(
      typeof options.onWaiting === "string"
        ? options.onWaiting
        : options.onWaiting(...args),
    );

    return self.pipe(
      Effect.tapBoth({
        onFailure: (e) =>
          Effect.sync(() => {
            toast.error(
              typeof options.onFailure === "string"
                ? options.onFailure
                : options.onFailure(e, ...args),
              { id: toastId },
            );
          }),
        onSuccess: (a) =>
          Effect.sync(() => {
            toast.success(
              typeof options.onSuccess === "string"
                ? options.onSuccess
                : options.onSuccess(a, ...args),
              { id: toastId },
            );
          }),
      }),
    );
  };
