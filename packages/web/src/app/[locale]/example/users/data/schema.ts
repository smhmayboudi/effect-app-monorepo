import * as Schema from "effect/Schema";

const userStatusSchema = Schema.Literal(
  "active",
  "inactive",
  "invited",
  "suspended",
);
export type UserStatus = typeof userStatusSchema.Type;

const userRoleSchema = Schema.Literal(
  "superadmin",
  "admin",
  "cashier",
  "manager",
);
export type UserRole = typeof userRoleSchema.Type;

const userSchema = Schema.Struct({
  createdAt: Schema.ValidDateFromSelf,
  email: Schema.String,
  firstName: Schema.String,
  id: Schema.String,
  lastName: Schema.String,
  phoneNumber: Schema.String,
  role: userRoleSchema,
  status: userStatusSchema,
  updatedAt: Schema.ValidDateFromSelf,
  username: Schema.String,
});
export type User = typeof userSchema.Type;
export const userListSchema = Schema.Array(userSchema);
