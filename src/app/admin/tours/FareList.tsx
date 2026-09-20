"use client";

import { useState } from "react";

export type FareRow = {
  key: string;
  id?: string;
  pickupName: string;
  priceMin: string;
  priceMax: string;
  note: string;
  published: boolean;
};

/**
 * The repeatable fares list, inside the tour form — PROMPT.md § 5c.
 *
 * Four fields in a row, not a separate screen: most tours have none, and the
 * ones that do have two or three. Making this its own page would mean the owner
 * saves a tour, navigates away, and adds fares somewhere else.
 *
 * Every field posts as a repeated name (`fare-pickupName`, `fare-priceMin`, …)
 * so the server action reads them positionally with `getAll`. Rows are replaced
 * wholesale on save, so removing one here removes it from the website.
 *
 * `priceMax` is deliberately optional: empty means a single fixed fare, which
 * renders without a dash rather than as a range of one.
 */
export function FaresEditor({ initial }: { initial: FareRow[] }) {
  const [rows, setRows] = useState<FareRow[]>(initial);

  function add() {
    setRows([
      ...rows,
      {
        key: `new-${Date.now()}-${Math.random()}`,
        pickupName: "",
        priceMin: "",
        priceMax: "",
        note: "",
        published: true,
      },
    ]);
  }

  function update(key: string, patch: Partial<FareRow>) {
    setRows((list) => list.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  return (
    <div className="admin-section">
      <p className="admin-sub">Published fares</p>

      {rows.length === 0 ? (
        <p className="admin-empty" style={{ textAlign: "left", padding: "10px 0" }}>
          No fares. This tour shows “Fare agreed on WhatsApp”, which is the right
          answer for any route where the price depends on where the guest starts.
        </p>
      ) : null}

      {rows.map((row) => (
        <div className="admin-fare" key={row.key}>
          {row.id ? <input type="hidden" name="fare-id" value={row.id} /> : <input type="hidden" name="fare-id" value="" />}

          <div className="admin-field">
            <label>Pick-up point</label>
            <input
              name="fare-pickupName"
              value={row.pickupName}
              onChange={(e) => update(row.key, { pickupName: e.target.value })}
              placeholder="Kel"
              required
            />
          </div>

          <div className="admin-field">
            <label>From, PKR</label>
            <input
              name="fare-priceMin"
              type="number"
              inputMode="numeric"
              min={1}
              value={row.priceMin}
              onChange={(e) => update(row.key, { priceMin: e.target.value })}
              placeholder="14000"
              required
            />
          </div>

          <div className="admin-field">
            <label>To, PKR</label>
            <input
              name="fare-priceMax"
              type="number"
              inputMode="numeric"
              min={1}
              value={row.priceMax}
              onChange={(e) => update(row.key, { priceMax: e.target.value })}
              placeholder="Leave empty for one price"
            />
          </div>

          <button
            type="button"
            className="admin-btn admin-btn--danger admin-btn--icon"
            onClick={() => setRows((list) => list.filter((r) => r.key !== row.key))}
            aria-label={`Remove the ${row.pickupName || "new"} fare`}
          >
            ×
          </button>

          <div className="admin-field admin-fare__note">
            <label>Why it is a range</label>
            <input
              name="fare-note"
              value={row.note}
              onChange={(e) => update(row.key, { note: e.target.value })}
              placeholder="Varies with season and road condition"
            />
          </div>

          {/* An unchecked checkbox posts nothing, which would shift every later
              row's published flag up by one when the action reads them with
              getAll(). A hidden field always posts, so the columns stay aligned. */}
          <input type="hidden" name="fare-published" value={row.published ? "on" : "off"} />
          <label className="admin-toggle admin-fare__note">
            <input
              type="checkbox"
              checked={row.published}
              onChange={(e) => update(row.key, { published: e.target.checked })}
            />
            <span className="admin-toggle__track" aria-hidden="true">
              <span className="admin-toggle__dot" />
            </span>
            <span className="admin-toggle__text">
              <b>Show this fare</b>
              <small>Off hides this pick-up point while keeping the number.</small>
            </span>
          </label>
        </div>
      ))}

      <button type="button" className="admin-btn admin-btn--ghost" onClick={add}>
        Add pick-up
      </button>
    </div>
  );
}
