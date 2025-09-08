import { createAccessControl } from "better-auth/plugins/access"
import { defaultRoles, defaultStatements } from "better-auth/plugins/admin/access"

export const statements = {
  ...defaultStatements,
  account: ["create", "delete", "readAll", "readById", "update"],
  group: ["create", "delete", "readAll", "readById", "update"],
  person: ["create", "delete", "readAll", "readById", "update"],
  todo: ["create", "delete", "readAll", "readById", "update"],
  user: ["create", "delete", "readAll", "readByAccessToken", "readById", "readByIdWithSensitive", "update"]
} as const

export const ac = createAccessControl(statements)

export const adminAc = ac.newRole({
  ...defaultRoles.admin.statements,
  account: ["create", "delete", "readAll", "readById", "update"],
  group: ["create", "delete", "readAll", "readById", "update"],
  person: ["create", "delete", "readAll", "readById", "update"],
  todo: ["create", "delete", "readAll", "readById", "update"],
  user: ["create", "delete", "readAll", "readByAccessToken", "readById", "readByIdWithSensitive", "update"]
})

export const userAc = ac.newRole({
  ...defaultRoles.user.statements,
  account: ["create", "delete", "readAll", "readById", "update"],
  group: ["create", "delete", "readAll", "readById", "update"],
  person: ["create", "delete", "readAll", "readById", "update"],
  todo: ["create", "delete", "readAll", "readById", "update"],
  user: ["create", "delete", "readAll", "readByAccessToken", "readById", "readByIdWithSensitive", "update"]
})

export const roles = {
  admin: adminAc,
  user: userAc
}
