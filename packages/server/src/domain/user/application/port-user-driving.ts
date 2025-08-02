import type { ActorAuthorized } from "@template/domain/actor"
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

export class PortUserDriving extends Context.Tag("PortUserDriving")<PortUserDriving, {
  create: (
    user: Omit<DomainUser, "id" | "ownerId" | "createdAt" | "updatedAt">
  ) => Effect.Effect<
    DomainUserWithSensitive,
    ErrorUserEmailAlreadyTaken,
    | ActorAuthorized<"Account", "create">
    | ActorAuthorized<"User", "create">
    | ActorAuthorized<"User", "readByIdWithSensitive">
  >
  delete: (id: UserId) => Effect.Effect<UserId, ErrorUserNotFound, ActorAuthorized<"User", "delete">>
  readAll: () => Effect.Effect<Array<DomainUser>, never, ActorAuthorized<"User", "readAll">>
  readByAccessToken: (accessToken: AccessToken) => Effect.Effect<DomainUser, ErrorUserNotFoundWithAccessToken, never>
  readById: (id: UserId) => Effect.Effect<DomainUser, ErrorUserNotFound, ActorAuthorized<"User", "readById">>
  readByIdWithSensitive: (
    id: UserId
  ) => Effect.Effect<DomainUserWithSensitive, never, ActorAuthorized<"User", "readByIdWithSensitive">>
  update: (
    id: UserId,
    user: Partial<Omit<DomainUser, "id">>
  ) => Effect.Effect<UserId, ErrorUserEmailAlreadyTaken | ErrorUserNotFound, ActorAuthorized<"User", "update">>
}>() {}
