import { Effect, Layer } from "effect";
import { PortUserDriving } from "./port-user-driving.js";
import { PortUserDriven } from "./port-user-driven.js";
import { ErrorUserEmailAlreadyTaken } from "@template/domain/user/application/error-user-email-already-taken"
import { DomainUser, UserId } from "@template/domain/user/application/domain-user"

export const UserUseCase = Layer.effect(
  PortUserDriving,
  Effect.gen(function* () {
    const driven = yield* PortUserDriven

    const signup = (user: Omit<DomainUser, "id">): Effect.Effect<UserId, ErrorUserEmailAlreadyTaken, never> => {
      const id = UserId.make("0")
      driven.signup(DomainUser.make({ id, ...user }))
      return Effect.succeed(UserId.make(id))
    }

    return {
      signup,
    }
  })
)
