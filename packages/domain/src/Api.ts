import * as HttpApi from "@effect/platform/HttpApi"
import * as OpenApi from "@effect/platform/OpenApi"
import { GroupDriving } from "./group/adapter/GroupAdapterDriving.js"
import { HealthzDriving } from "./healthz/adapter/HealthzAdapterDriving.js"
import { PersonDriving } from "./person/adapter/PersonAdapterDriving.js"
import { ServiceDriving } from "./service/adapter/ServiceAdapterDriving.js"
import { SSEDriving } from "./sse/adapter/SSEAdapterDriving.js"
import { TodoDriving } from "./todo/adapter/TodoAdapterDriving.js"
import { VWDriving } from "./vw/adapter/VWAdapterDriving.js"

export const Api = HttpApi.make("api")
  .add(GroupDriving)
  .add(HealthzDriving)
  .add(PersonDriving)
  .add(ServiceDriving)
  .add(SSEDriving)
  .add(TodoDriving)
  .add(VWDriving)
  .annotate(OpenApi.Description, "Manage API")
  .annotate(OpenApi.Summary, "Manage API")
  .annotate(OpenApi.Title, "API")
  .prefix("/api/v1")
