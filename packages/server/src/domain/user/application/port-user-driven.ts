import { Context, Effect } from "effect"
import { ErrorUserEmailAlreadyTaken } from "@template/domain/user/application/error-user-email-already-taken"
import { ErrorUserNotFound } from "@template/domain/user/application/error-user-not-found"
import { ErrorUserNotFoundWithAccessToken } from "@template/domain/user/application/error-user-not-found-with-access-token"
import { AccessToken, DomainUser, DomainUserWithSensitive, UserId } from "@template/domain/user/application/domain-user"

export class PortUserDriven extends Context.Tag("PortUserDriven")<PortUserDriven, {
  create: (user: Omit<DomainUser, "id" | "createdAt" | "updatedAt">) => Effect.Effect<UserId, ErrorUserEmailAlreadyTaken, never>
  delete: (id: UserId) => Effect.Effect<void, ErrorUserNotFound, never>
  readAll: () => Effect.Effect<DomainUser[], never, never>
  readByAccessToken: (accessToken: AccessToken) => Effect.Effect<DomainUser, ErrorUserNotFoundWithAccessToken, never>
  readById: (id: UserId) => Effect.Effect<DomainUser, ErrorUserNotFound, never>
  readByMe: (id: UserId) => Effect.Effect<DomainUserWithSensitive, never, never>
  update: (id: UserId, user: Partial<Omit<DomainUser, "id">>) => Effect.Effect<void, ErrorUserEmailAlreadyTaken | ErrorUserNotFound, never>
}>() {}
