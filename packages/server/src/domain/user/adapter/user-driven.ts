import { Effect, HashMap, Layer, Ref } from "effect";
import { PortUserDriven } from "../application/port-user-driven.js";
import { ErrorUserEmailAlreadyTaken } from "@template/domain/user/application/error-user-email-already-taken"
import { DomainUser, UserId } from "@template/domain/user/application/domain-user"

export const UserDriven = Layer.effect(
  PortUserDriven,
  Effect.gen(function* () {
    const users = yield* Ref.make(HashMap.empty<UserId, DomainUser>())

    const signup = (user: DomainUser): Effect.Effect<void, ErrorUserEmailAlreadyTaken, never> =>
      Ref.get(users).pipe(
        Effect.flatMap((map) =>
          HashMap.some(map, (newUser) => newUser.email === user.email) ?
            Effect.fail(new ErrorUserEmailAlreadyTaken({ email: user.email })) :
            Ref.update(users, (map) => HashMap.set(map, user.id, user))
        )
      )

    return {
      signup
    }
  })
)
