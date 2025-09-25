import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  fetchOptions: {
    credentials: "include",
  },
  basePath: "/auth/00000000-0000-0000-0000-000000000000",
  baseURL: "http://127.0.0.1:3001",
});

export type Session = typeof authClient.$Infer.Session;

export const {
  changePassword,
  forgetPassword,
  getSession,
  signIn: { email: signInEmail },
  signOut,
  signUp: { email: signUpEmail },
  updateUser,
} = authClient;
