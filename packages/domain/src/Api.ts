import { HttpApi, OpenApi } from "@effect/platform"
import { TodoApiGroup } from "./TodoApi.js"
import { UserApiGroup } from "./UserApi.js"

export const Api = HttpApi.make("api")
  .add(TodoApiGroup)
  .add(UserApiGroup)
  .add(UserApiGroup)
  .annotate(OpenApi.Description, "Manage API")
  .annotate(OpenApi.Title, "API")
