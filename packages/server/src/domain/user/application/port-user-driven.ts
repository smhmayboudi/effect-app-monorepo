import type {
  AccessToken,
  DomainUser,
  DomainUserWithSensitive,
  UserId
} from "@template/domain/user/application/domain-user"
import type { ErrorUserEmailAlreadyTaken } from "@template/domain/user/application/error-user-email-already-taken"
import type { ErrorUserNotFound } from "@template/domain/user/application/error-user-not-found"
import type { ErrorUserNotFoundWithAccessToken } from "@template/domain/user/application/error-user-not-found-with-access-token"
import { Context, type Effect } from "effect"

export class PortUserDriven extends Context.Tag("PortUserDriven")<PortUserDriven, {
  create: (
    user: Omit<DomainUserWithSensitive, "id" | "createdAt" | "updatedAt">
  ) => Effect.Effect<UserId, ErrorUserEmailAlreadyTaken, never>
  delete: (id: UserId) => Effect.Effect<void, ErrorUserNotFound, never>
  readAll: () => Effect.Effect<Array<DomainUser>, never, never>
  readByAccessToken: (accessToken: AccessToken) => Effect.Effect<DomainUser, ErrorUserNotFoundWithAccessToken, never>
  readById: (id: UserId) => Effect.Effect<DomainUser, ErrorUserNotFound, never>
  readByIdWithSensitive: (id: UserId) => Effect.Effect<DomainUserWithSensitive, never, never>
  update: (
    id: UserId,
    user: Partial<Omit<DomainUser, "id">>
  ) => Effect.Effect<void, ErrorUserEmailAlreadyTaken | ErrorUserNotFound, never>
}>() {}
