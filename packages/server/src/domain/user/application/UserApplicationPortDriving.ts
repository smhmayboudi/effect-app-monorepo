import type { ActorAuthorized } from "@template/domain/Actor"
import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import type {
  AccessToken,
  User,
  UserId,
  UserWithSensitive
} from "@template/domain/user/application/UserApplicationDomain"
import type { UserErrorEmailAlreadyTaken } from "@template/domain/user/application/UserApplicationErrorEmailAlreadyTaken"
import type { UserErrorNotFound } from "@template/domain/user/application/UserApplicationErrorNotFound"
import type { UserErrorNotFoundWithAccessToken } from "@template/domain/user/application/UserApplicationErrorNotFoundWithAccessToken"
import { Context, type Effect } from "effect"

export class UserPortDriving extends Context.Tag("UserPortDriving")<UserPortDriving, {
  create: (
    user: Omit<User, "id" | "ownerId" | "createdAt" | "updatedAt">
  ) => Effect.Effect<
    UserWithSensitive,
    UserErrorEmailAlreadyTaken,
    | ActorAuthorized<"Account", "create">
    | ActorAuthorized<"User", "create">
    | ActorAuthorized<"User", "readByIdWithSensitive">
  >
  delete: (id: UserId) => Effect.Effect<UserId, UserErrorNotFound, ActorAuthorized<"User", "delete">>
  readAll: (
    urlParams: URLParams<User>
  ) => Effect.Effect<SuccessArray<User, never, never>, never, ActorAuthorized<"User", "readAll">>
  readByAccessToken: (
    accessToken: AccessToken
  ) => Effect.Effect<User, UserErrorNotFoundWithAccessToken, ActorAuthorized<"User", "readByAccessToken">>
  readById: (id: UserId) => Effect.Effect<User, UserErrorNotFound, ActorAuthorized<"User", "readById">>
  readByIdWithSensitive: (
    id: UserId
  ) => Effect.Effect<UserWithSensitive, never, ActorAuthorized<"User", "readByIdWithSensitive">>
  update: (
    id: UserId,
    user: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
  ) => Effect.Effect<UserId, UserErrorEmailAlreadyTaken | UserErrorNotFound, ActorAuthorized<"User", "update">>
}>() {}
