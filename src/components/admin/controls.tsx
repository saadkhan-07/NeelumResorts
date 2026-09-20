"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

/**
 * The small interactive pieces every admin form needs. Kept in one file because
 * they are a handful of lines each and always travel together.
 */

/** Submit with a saving state — every form shows one, on every save. */
export function SubmitButton({
  children = "Save",
  saving = "Saving…",
  block,
  variant = "primary",
}: {
  children?: React.ReactNode;
  saving?: string;
  block?: boolean;
  variant?: "primary" | "ghost";
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={[
        "admin-btn",
        variant === "ghost" ? "admin-btn--ghost" : "",
        block ? "admin-btn--block" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-busy={pending}
    >
      {pending ? saving : children}
    </button>
  );
}

/**
 * A destructive submit that asks first.
 *
 * Two taps rather than a modal: the owner is on a phone, and a native
 * `confirm()` is easy to dismiss by accident on a small screen. The button
 * becomes "Sure? Delete" for four seconds and reverts on its own, so a stray tap
 * costs nothing.
 */
export function ConfirmButton({
  children = "Delete",
  confirmLabel = "Sure? Tap again",
  saving = "Deleting…",
}: {
  children?: React.ReactNode;
  confirmLabel?: string;
  saving?: string;
}) {
  const { pending } = useFormStatus();
  const [armed, setArmed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function onClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (!armed) {
      event.preventDefault();
      setArmed(true);
      timer.current = setTimeout(() => setArmed(false), 4000);
    }
  }

  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={pending}
      className="admin-btn admin-btn--danger"
      aria-busy={pending}
    >
      {pending ? saving : armed ? confirmLabel : children}
    </button>
  );
}

/**
 * A success toast. Server actions return `{ ok, message }`; this shows it and
 * fades, so a save on a slow connection has a visible end.
 */
export function Toast({ state }: { state: { ok?: boolean; message?: string; error?: string } }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!state.ok && !state.error) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), 3500);
    return () => clearTimeout(t);
  }, [state]);

  if (!show) return null;

  return (
    <p
      className={state.error ? "admin-toast admin-toast--error" : "admin-toast"}
      role="status"
      aria-live="polite"
    >
      {state.error ?? state.message ?? "Saved"}
    </p>
  );
}

/**
 * Add-and-remove chips — amenities, highlights, what a fare includes.
 *
 * The values post as repeated `name` fields so the server action reads them with
 * `formData.getAll(name)` and never has to parse a delimiter out of free text.
 * An amenity containing a comma would otherwise split into two.
 */
export function ChipInput({
  name,
  label,
  initial = [],
  placeholder = "Add and press Enter",
}: {
  name: string;
  label: string;
  initial?: string[];
  placeholder?: string;
}) {
  const [items, setItems] = useState<string[]>(initial);
  const [draft, setDraft] = useState("");

  function add() {
    const value = draft.trim();
    if (!value || items.includes(value)) return setDraft("");
    setItems([...items, value]);
    setDraft("");
  }

  return (
    <div className="admin-field">
      <label htmlFor={`${name}-input`}>{label}</label>

      <ul className="admin-chips">
        {items.map((item) => (
          <li key={item}>
            <span>{item}</span>
            <button
              type="button"
              onClick={() => setItems(items.filter((i) => i !== item))}
              aria-label={`Remove ${item}`}
            >
              ×
            </button>
            <input type="hidden" name={name} value={item} />
          </li>
        ))}
        {items.length === 0 ? <li className="admin-chips__empty">None yet</li> : null}
      </ul>

      <div className="admin-chips__add">
        <input
          id={`${name}-input`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
        />
        <button type="button" className="admin-btn admin-btn--ghost" onClick={add}>
          Add
        </button>
      </div>
    </div>
  );
}

/** A labelled on/off switch that posts "on" / absent like a checkbox. */
export function Toggle({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="admin-toggle">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} />
      <span className="admin-toggle__track" aria-hidden="true">
        <span className="admin-toggle__dot" />
      </span>
      <span className="admin-toggle__text">
        <b>{label}</b>
        {hint ? <small>{hint}</small> : null}
      </span>
    </label>
  );
}
