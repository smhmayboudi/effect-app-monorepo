import { HttpApi, OpenApi } from "@effect/platform"
import { AccountDriving } from "./account/adapter/user-driving.js"
import { GroupDriving } from "./group/adapter/group-driving.js"
import { PersonDriving } from "./person/adapter/person-driving.js"
import { SSEDriving } from "./sse/adapter/sse-driving.js"
import { TodoDriving } from "./todo/adapter/todo-driving.js"
import { UserDriving } from "./user/adapter/user-driving.js"

export const Api = HttpApi.make("api")
  .add(AccountDriving)
  .add(GroupDriving)
  .add(PersonDriving)
  .add(SSEDriving)
  .add(TodoDriving)
  .add(UserDriving)
  .annotate(OpenApi.Description, "Manage API")
  .annotate(OpenApi.Summary, "Manage API")
  .annotate(OpenApi.Title, "API")
