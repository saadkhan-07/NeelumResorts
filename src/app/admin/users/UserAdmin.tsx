"use client";

import { useActionState } from "react";
import { ConfirmButton, SubmitButton, Toast } from "@/components/admin/controls";
import type { ActionState } from "@/lib/admin-auth";
import { createUser, deleteUser, resetPassword } from "./actions";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "STAFF";
  createdAt: string;
  isYou: boolean;
};

function UserCard({ user }: { user: UserRow }) {
  const [resetState, resetAction] = useActionState<ActionState, FormData>(resetPassword, {});
  const [deleteState, deleteAction] = useActionState<ActionState, FormData>(deleteUser, {});

  return (
    <div className="admin-row" style={{ display: "block" }}>
      <div className="admin-row-top">
        <b>{user.name}</b>
        <span className={user.role === "OWNER" ? "admin-tag admin-tag--new" : "admin-tag"}>
          {user.role === "OWNER" ? "Owner" : "Staff"}
        </span>
        {user.isYou ? <span className="admin-tag">You</span> : null}
        <time>{user.createdAt}</time>
      </div>
      <div className="admin-row-meta">
        <span>{user.email}</span>
      </div>

      <details style={{ marginTop: 10 }}>
        <summary style={{ cursor: "pointer", fontSize: ".85rem", color: "var(--a-muted)" }}>
          Change password
        </summary>
        <form action={resetAction} style={{ marginTop: 8 }}>
          <input type="hidden" name="id" value={user.id} />
          <div className="admin-field">
            <label htmlFor={`pw-${user.id}`}>New password</label>
            <input
              id={`pw-${user.id}`}
              name="password"
              type="password"
              minLength={10}
              required
              autoComplete="new-password"
            />
          </div>
          <SubmitButton>Change password</SubmitButton>
          <Toast state={resetState} />
        </form>
      </details>

      {user.isYou ? null : (
        <form action={deleteAction} style={{ marginTop: 10 }}>
          <input type="hidden" name="id" value={user.id} />
          <ConfirmButton confirmLabel="Sure? Tap again to remove">Remove account</ConfirmButton>
          <Toast state={deleteState} />
        </form>
      )}
    </div>
  );
}

export function UserAdmin({ users }: { users: UserRow[] }) {
  const [state, action] = useActionState<ActionState, FormData>(createUser, {});

  return (
    <>
      <div className="admin-card">
        {users.map((u) => (
          <UserCard key={u.id} user={u} />
        ))}
      </div>

      <div className="admin-section">
        <p className="admin-sub">Add someone</p>
        <form action={action} className="admin-form">
          <div className="admin-form__row">
            <div className="admin-field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" required maxLength={80} />
            </div>
            <div className="admin-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoCapitalize="none"
                autoCorrect="off"
              />
            </div>
          </div>

          <div className="admin-form__row">
            <div className="admin-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                minLength={10}
                required
                autoComplete="new-password"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="role">Role</label>
              <select id="role" name="role" defaultValue="STAFF">
                <option value="STAFF">Staff — everything except accounts</option>
                <option value="OWNER">Owner — can add and remove accounts</option>
              </select>
            </div>
          </div>

          <div className="admin-form__actions">
            <SubmitButton>Create account</SubmitButton>
          </div>
          <Toast state={state} />
        </form>
      </div>
    </>
  );
}
