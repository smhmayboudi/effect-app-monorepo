import { HttpApi, OpenApi } from "@effect/platform"
import { AccountDriving } from "./account/adapter/AccountAdapterDriving.js"
import { GroupDriving } from "./group/adapter/GroupAdapterDriving.js"
import { PersonDriving } from "./person/adapter/PersonAdapterDriving.js"
import { SSEDriving } from "./sse/adapter/SSEAdapterDriving.js"
import { TodoDriving } from "./todo/adapter/TodoAdapterDriving.js"
import { UserDriving } from "./user/adapter/UserAdapterDriving.js"

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
