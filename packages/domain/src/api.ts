import { HttpApi, OpenApi } from "@effect/platform"
import { TodoDriving } from "./todo/adapter/todo-driving.js"
import { UserDriving } from "./user/adapter/user-driving.js"

export const Api = HttpApi.make("api")
  .add(TodoDriving)
  .add(UserDriving)
  .annotate(OpenApi.Description, "Manage API")
  .annotate(OpenApi.Title, "API")
