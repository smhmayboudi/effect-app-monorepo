"use client";

import { useActionState, useState } from "react";
import useAuth from "@/hook/use-auth";
import { change } from "./action";

export default function Client() {
  const { loading, session } = useAuth();
  const [state, action, pending] = useActionState(change, null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  return (
    <div>
      <h2>User Change Password</h2>
      {loading ? <div>LOADING...</div> : <></>}
      {!session ? (
        <p>No user session found. Please log in.</p>
      ) : (
        <form action={action}>
          <input
            autoComplete="username"
            defaultValue={session.user.email}
            hidden={true}
            id="username"
            name="username"
            type="text"
          />
          <div>
            <label htmlFor="currentPassword">Current Password</label>
            <input
              autoComplete="current-password"
              id="currentPassword"
              name="currentPassword"
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current Password"
              required
              type="password"
              value={currentPassword}
            />
          </div>
          {state?.errors?.currentPassword && (
            <div style={{ color: "red" }}>
              {state.errors.currentPassword.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
          <div>
            <label htmlFor="newPassword">New Password</label>
            <input
              autoComplete="new-password"
              id="newPassword"
              name="newPassword"
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              required
              type="password"
              value={newPassword}
            />
          </div>
          {state?.errors?.newPassword && (
            <div style={{ color: "red" }}>
              {state.errors.newPassword.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
          <button aria-disabled={pending} disabled={pending} type="submit">
            {pending ? "Submitting..." : "Submit"}
          </button>
          {state?.message && (
            <p
              aria-live="polite"
              role="status"
              style={{
                color: state.message.includes("successfully") ? "green" : "red",
              }}
            >
              {state.message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
