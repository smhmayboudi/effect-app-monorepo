import type { Account, AccountId } from "@template/domain/account/application/AccountApplicationDomain"
import type { AccountErrorNotFound } from "@template/domain/account/application/AccountApplicationErrorNotFound"
import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import type { Exit } from "effect"
import { PortEventEmitter } from "../../../infrastructure/application/PortEventEmitter.js"

type AccountEvents = {
  AccountUseCaseCreate: {
    in: { account: Omit<Account, "id" | "createdAt" | "updatedAt"> }
    out: Exit.Exit<AccountId>
  }
  AccountUseCaseDelete: { in: { id: AccountId }; out: Exit.Exit<AccountId, AccountErrorNotFound> }
  AccountUseCaseReadAll: {
    in: { urlParams: URLParams<Account> }
    out: Exit.Exit<SuccessArray<Account, never, never>>
  }
  AccountUseCaseReadById: { in: { id: AccountId }; out: Exit.Exit<Account, AccountErrorNotFound> }
  AccountUseCaseUpdate: {
    in: { id: AccountId; account: Partial<Omit<Account, "id" | "createdAt" | "updatedAt">> }
    out: Exit.Exit<AccountId, AccountErrorNotFound>
  }
}

export const AccountPortEventEmitter = PortEventEmitter<AccountEvents>()
