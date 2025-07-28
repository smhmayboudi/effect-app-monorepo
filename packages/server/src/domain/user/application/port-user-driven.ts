import { Context, Effect } from "effect"
import { ErrorUserEmailAlreadyTaken } from "@template/domain/user/application/error-user-email-already-taken"
import { DomainUser } from "@template/domain/user/application/domain-user"

export class PortUserDriven extends Context.Tag("PortUserDriven")<PortUserDriven, {
  signup: (user: DomainUser) => Effect.Effect<void, ErrorUserEmailAlreadyTaken, never>
}>() {}
