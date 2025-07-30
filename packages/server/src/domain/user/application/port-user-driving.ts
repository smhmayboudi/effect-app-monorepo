import { Context, Effect } from "effect"
import { ErrorUserEmailAlreadyTaken } from "@template/domain/user/application/error-user-email-already-taken"
import { ErrorUserNotFound } from "@template/domain/user/application/error-user-not-found"
import { ErrorUserNotFoundWithAccessToken } from "@template/domain/user/application/error-user-not-found-with-access-token"
import { AccessToken, DomainUser, DomainUserWithSensitive, UserId } from "@template/domain/user/application/domain-user"
import { ActorAuthorized } from "@template/domain/actor"

export class PortUserDriving extends Context.Tag("PortUserDriving")<PortUserDriving, {
  create: (user: Omit<DomainUser, "id" | "ownerId" | "createdAt" | "updatedAt">) => Effect.Effect<UserId, ErrorUserEmailAlreadyTaken, ActorAuthorized<"User", "create"> | ActorAuthorized<"Account", "create">>
  delete: (id: UserId) => Effect.Effect<UserId, ErrorUserNotFound, ActorAuthorized<"User", "delete">>
  readAll: () => Effect.Effect<DomainUser[], never, ActorAuthorized<"User", "readAll">>
  readByAccessToken: (accessToken: AccessToken) => Effect.Effect<DomainUser, ErrorUserNotFoundWithAccessToken, never>
  readById: (id: UserId) => Effect.Effect<DomainUser, ErrorUserNotFound, ActorAuthorized<"User", "readById">>
  readByMe: (id: UserId) => Effect.Effect<DomainUserWithSensitive, never, ActorAuthorized<"User", "readByMe">>
  update: (id: UserId, user: Partial<Omit<DomainUser, "id">>) => Effect.Effect<UserId, ErrorUserEmailAlreadyTaken | ErrorUserNotFound, ActorAuthorized<"User", "update">>
}>() {}
