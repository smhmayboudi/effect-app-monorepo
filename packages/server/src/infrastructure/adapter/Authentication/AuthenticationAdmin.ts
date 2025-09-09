import { createAccessControl } from "better-auth/plugins/access"
import { defaultRoles, defaultStatements } from "better-auth/plugins/admin/access"

export const statements = {
  ...defaultStatements,
  group: ["create", "delete", "readAll", "readById", "update"],
  person: ["create", "delete", "readAll", "readById", "update"],
  todo: ["create", "delete", "readAll", "readById", "update"]
} as const

export const ac = createAccessControl(statements)

export const adminAc = ac.newRole({
  ...defaultRoles.admin.statements,
  group: ["create", "delete", "readAll", "readById", "update"],
  person: ["create", "delete", "readAll", "readById", "update"],
  todo: ["create", "delete", "readAll", "readById", "update"]
})

export const userAc = ac.newRole({
  ...defaultRoles.user.statements,
  group: ["create", "delete", "readAll", "readById", "update"],
  person: ["create", "delete", "readAll", "readById", "update"],
  todo: ["create", "delete", "readAll", "readById", "update"]
})

export const roles = {
  admin: adminAc,
  user: userAc
}
