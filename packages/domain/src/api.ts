import { HttpApi, OpenApi } from "@effect/platform"
import { AccountDriving } from "@template/domain/account/adapter/user-driving"
import { GroupDriving } from "@template/domain/group/adapter/group-driving"
import { PersonDriving } from "@template/domain/person/adapter/person-driving"
import { TodoDriving } from "@template/domain/todo/adapter/todo-driving"
import { UserDriving } from "@template/domain/user/adapter/user-driving"
import { SSEDriving } from "./sse/adapter/sse-driving.js"

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
