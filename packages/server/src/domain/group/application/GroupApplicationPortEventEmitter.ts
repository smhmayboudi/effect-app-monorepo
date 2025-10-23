import type { Group, GroupId } from "@template/domain/group/application/GroupApplicationDomain"
import type { GroupErrorNotFound } from "@template/domain/group/application/GroupApplicationErrorNotFound"
import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import type * as Exit from "effect/Exit"
import { PortEventEmitter } from "../../../infrastructure/application/PortEventEmitter.js"

type GroupEvents = {
  GroupUseCaseCreate: {
    in: { group: Omit<Group, "createdAt" | "updatedAt" | "deletedAt"> }
    out: Exit.Exit<GroupId>
  }
  GroupUseCaseDelete: { in: { id: GroupId }; out: Exit.Exit<GroupId, GroupErrorNotFound> }
  GroupUseCaseReadAll: {
    in: { urlParams: URLParams<Group> }
    out: Exit.Exit<SuccessArray<Group, never, never>>
  }
  GroupUseCaseReadById: { in: { id: GroupId }; out: Exit.Exit<Group, GroupErrorNotFound> }
  GroupUseCaseUpdate: {
    in: { id: GroupId; group: Partial<Omit<Group, "id" | "createdAt" | "updatedAt" | "deletedAt">> }
    out: Exit.Exit<GroupId, GroupErrorNotFound>
  }
}

export const GroupPortEventEmitter = PortEventEmitter<GroupEvents>()
