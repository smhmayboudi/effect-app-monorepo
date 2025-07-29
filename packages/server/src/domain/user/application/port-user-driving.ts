import { Context, Effect } from "effect"
import { ErrorUserEmailAlreadyTaken } from "@template/domain/user/application/error-user-email-already-taken"
import { ErrorUserNotFound } from "@template/domain/user/application/error-user-not-found"
import { DomainUser, DomainUserWithSensitive, UserId } from "@template/domain/user/application/domain-user"

export class PortUserDriving extends Context.Tag("PortUserDriving")<PortUserDriving, {
  create: (user: Omit<DomainUser, "id">) => Effect.Effect<UserId, ErrorUserEmailAlreadyTaken, never>
  delete: (id: UserId) => Effect.Effect<UserId, ErrorUserNotFound, never>
  readAll: () => Effect.Effect<DomainUser[], never, never>
  readById: (id: UserId) => Effect.Effect<DomainUser, ErrorUserNotFound, never>
  readMe: (id: UserId) => Effect.Effect<DomainUserWithSensitive, never, never>
  update: (id: UserId, user: Partial<Omit<DomainUser, "id">>) => Effect.Effect<UserId, ErrorUserEmailAlreadyTaken | ErrorUserNotFound, never>
}>() {}
