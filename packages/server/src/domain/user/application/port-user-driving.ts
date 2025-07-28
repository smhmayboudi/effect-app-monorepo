import { Context, Effect } from "effect"
import { ErrorUserEmailAlreadyTaken } from "@template/domain/user/application/error-user-email-already-taken"
import { DomainUser, UserId } from "@template/domain/user/application/domain-user"

export class PortUserDriving extends Context.Tag("PortUserDriving")<PortUserDriving, {
  signup: (user: Omit<DomainUser, "id">) => Effect.Effect<UserId, ErrorUserEmailAlreadyTaken, never>
}>() {}
