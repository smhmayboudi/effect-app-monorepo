import { HttpApiBuilder } from "@effect/platform"
import { Api } from "@template/domain/Api"
import { Layer } from "effect"
import { TodoApiLive } from "./TodoApi.js"
import { UserApiLive } from "./UserApi.js"

export const ApiLive = HttpApiBuilder.api(Api).pipe(
  Layer.provide(TodoApiLive),
  Layer.provide(UserApiLive)
)
