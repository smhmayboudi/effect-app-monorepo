import { HttpApi, OpenApi } from "@effect/platform"
import { ApiGroupTodo } from "./todo/api-group-todo.js"
import { ApiGroupUser } from "./user/api-group-user.js"

export const Api = HttpApi.make("api")
  .add(ApiGroupTodo)
  .add(ApiGroupUser)
  .annotate(OpenApi.Description, "Manage API")
  .annotate(OpenApi.Title, "API")
