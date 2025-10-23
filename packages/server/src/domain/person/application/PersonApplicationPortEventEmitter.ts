import type { Person, PersonId } from "@template/domain/person/application/PersonApplicationDomain"
import type { PersonErrorNotFound } from "@template/domain/person/application/PersonApplicationErrorNotFound"
import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import type * as Exit from "effect/Exit"
import { PortEventEmitter } from "../../../infrastructure/application/PortEventEmitter.js"

type PersonEvents = {
  PersonUseCaseCreate: {
    in: { person: Omit<Person, "createdAt" | "updatedAt" | "deletedAt"> }
    out: Exit.Exit<PersonId>
  }
  PersonUseCaseDelete: { in: { id: PersonId }; out: Exit.Exit<PersonId, PersonErrorNotFound> }
  PersonUseCaseReadAll: {
    in: { urlParams: URLParams<Person> }
    out: Exit.Exit<SuccessArray<Person, never, never>>
  }
  PersonUseCaseReadById: { in: { id: PersonId }; out: Exit.Exit<Person, PersonErrorNotFound> }
  PersonUseCaseUpdate: {
    in: { id: PersonId; person: Partial<Omit<Person, "id" | "createdAt" | "updatedAt" | "deletedAt">> }
    out: Exit.Exit<PersonId, PersonErrorNotFound>
  }
}

export const PersonPortEventEmitter = PortEventEmitter<PersonEvents>()
