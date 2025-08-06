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

export class UserPortDriven extends Context.Tag("UserPortDriven")<UserPortDriven, {
  create: (
    user: Omit<UserWithSensitive, "id" | "createdAt" | "updatedAt">
  ) => Effect.Effect<UserId, UserErrorEmailAlreadyTaken, never>
  delete: (id: UserId) => Effect.Effect<UserId, UserErrorNotFound, never>
  readAll: () => Effect.Effect<Array<User>, never, never>
  readByAccessToken: (accessToken: AccessToken) => Effect.Effect<User, UserErrorNotFoundWithAccessToken, never>
  readById: (id: UserId) => Effect.Effect<User, UserErrorNotFound, never>
  readByIdWithSensitive: (id: UserId) => Effect.Effect<UserWithSensitive, never, never>
  update: (
    id: UserId,
    user: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
  ) => Effect.Effect<UserId, UserErrorEmailAlreadyTaken | UserErrorNotFound, never>
}>() {}
