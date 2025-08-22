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
import type { Exit } from "effect"
import { PortEventEmitter } from "../../../infrastructure/application/PortEventEmitter.js"

type UserEvents = {
  UserUseCaseCreate: {
    in: { user: Omit<User, "createdAt" | "updatedAt" | "deletedAt"> }
    out: Exit.Exit<UserWithSensitive, UserErrorEmailAlreadyTaken>
  }
  UserUseCaseDelete: { in: { id: UserId }; out: Exit.Exit<UserId, UserErrorNotFound> }
  UserUseCaseReadAll: {
    in: { urlParams: URLParams<User> }
    out: Exit.Exit<SuccessArray<User, never, never>>
  }
  UserUseCaseReadByAccessToken: {
    in: { accessToken: AccessToken }
    out: Exit.Exit<User, UserErrorNotFoundWithAccessToken>
  }
  UserUseCaseReadById: { in: { id: UserId }; out: Exit.Exit<User, UserErrorNotFound> }
  UserUseCaseReadByIdWithSensitive: { in: { id: UserId }; out: Exit.Exit<UserWithSensitive> }
  UserUseCaseUpdate: {
    in: { id: UserId; user: Partial<Omit<User, "id" | "createdAt" | "updatedAt" | "deletedAt">> }
    out: Exit.Exit<UserId, UserErrorNotFound | UserErrorEmailAlreadyTaken>
  }
}

export const UserPortEventEmitter = PortEventEmitter<UserEvents>()
