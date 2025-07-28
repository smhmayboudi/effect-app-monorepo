import { Effect, Layer } from "effect";
import { PortUserDriving } from "./port-user-driving.js";
import { PortUserDriven } from "./port-user-driven.js";
import { ErrorUserEmailAlreadyTaken } from "@template/domain/user/application/error-user-email-already-taken"
import { DomainUser, UserId } from "@template/domain/user/application/domain-user"
import { PortUUID } from "../../../infrastructure/application/port/UUID.js";

export const UserUseCase = Layer.effect(
  PortUserDriving,
  Effect.gen(function* () {
    const driven = yield* PortUserDriven
    const uuid = yield* PortUUID

    const signup = (user: Omit<DomainUser, "id">): Effect.Effect<UserId, ErrorUserEmailAlreadyTaken, never> => 
      Effect.gen(function* () {
        const v7 = yield* uuid.v7()
        const id = UserId.make(v7)
        yield* driven.signup(DomainUser.make({ id, ...user }))

        return id
      })

    return {
      signup,
    } as const
  })
)
