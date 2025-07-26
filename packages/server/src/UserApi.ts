import { HttpApiBuilder } from "@effect/platform"
import { Api } from "@template/domain/Api"
import { Effect } from "effect"

// export const UserApiLive = HttpApiBuilder.group(Api, "user", (handlers) =>
//   Effect.gen(function*() {
//     return handlers
//       .handle("signup", ({ payload }) => Effect.void)
//   }))

export const UserApiLive = HttpApiBuilder.group(Api, "user", (handlers) =>
  handlers
    .handle("signup", (_payload) => Effect.void))
