"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Drag-to-reorder that works with a thumb.
 *
 * Built on Pointer Events rather than a library (none is allowed here, and none
 * is needed). Pointer Events cover mouse, touch and pen with one code path, which
 * is the whole reason they exist.
 *
 * The two things that make touch dragging actually work on a phone:
 *
 * 1. `touch-action: none` on the handle — without it the browser claims the
 *    gesture for scrolling and the drag never starts. It is set on the handle
 *    only, so the page still scrolls normally everywhere else.
 * 2. `setPointerCapture` — the finger will wander outside the row it started on,
 *    and without capture the element stops receiving events mid-drag.
 *
 * Reordering happens optimistically in local state; the new order is sent once,
 * on drop, rather than on every swap. The owner is on weak signal and a drag
 * across six photos should not be six round trips.
 *
 * Up/down buttons do the same job for keyboard and screen-reader users, and are
 * genuinely quicker on a small list.
 */

export type ReorderItem = { id: string };

export function ReorderList<T extends ReorderItem>({
  items,
  onCommit,
  renderItem,
  className = "admin-reorder",
  itemClassName = "admin-reorder__item",
  label = "Drag to reorder",
}: {
  items: T[];
  /** Called once, on drop, with the ids in their new order. */
  onCommit: (ids: string[]) => void | Promise<void>;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  itemClassName?: string;
  label?: string;
}) {
  const [order, setOrder] = useState<T[]>(items);
  const [dragId, setDragId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [announce, setAnnounce] = useState("");

  const rowRefs = useRef(new Map<string, HTMLLIElement>());
  const committed = useRef<string[]>(items.map((i) => i.id));

  // Keep in step when the server sends a new list (after a delete, say).
  useEffect(() => {
    setOrder(items);
    committed.current = items.map((i) => i.id);
  }, [items]);

  const commit = useCallback(
    async (next: T[]) => {
      const ids = next.map((i) => i.id);
      if (ids.join() === committed.current.join()) return;
      committed.current = ids;
      setSaving(true);
      try {
        await onCommit(ids);
      } finally {
        setSaving(false);
      }
    },
    [onCommit],
  );

  function move(from: number, to: number) {
    if (to < 0 || to >= order.length || from === to) return order;
    const next = [...order];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return next;
  }

  function onPointerDown(event: React.PointerEvent<HTMLButtonElement>, id: string) {
    // Ignore right-click and secondary buttons.
    if (event.button !== 0 && event.pointerType === "mouse") return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragId(id);
  }

  function onPointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    if (!dragId) return;
    event.preventDefault();

    const from = order.findIndex((i) => i.id === dragId);
    if (from < 0) return;

    const y = event.clientY;

    // Find the row whose midpoint the pointer has crossed.
    let to = from;
    order.forEach((item, index) => {
      const el = rowRefs.current.get(item.id);
      if (!el) return;
      const box = el.getBoundingClientRect();
      const middle = box.top + box.height / 2;
      if (index < from && y < middle) to = Math.min(to, index);
      if (index > from && y > middle) to = Math.max(to, index);
    });

    if (to !== from) setOrder(move(from, to));
  }

  function onPointerUp(event: React.PointerEvent<HTMLButtonElement>) {
    if (!dragId) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    setDragId(null);
    void commit(order);
  }

  function nudge(index: number, delta: number) {
    const next = move(index, index + delta);
    if (next === order) return;
    setOrder(next);
    setAnnounce(`Moved to position ${index + delta + 1} of ${order.length}`);
    void commit(next);
  }

  return (
    <>
      <ul className={className} aria-label={label}>
        {order.map((item, index) => (
          <li
            key={item.id}
            ref={(el) => {
              if (el) rowRefs.current.set(item.id, el);
              else rowRefs.current.delete(item.id);
            }}
            className={dragId === item.id ? `${itemClassName} is-dragging` : itemClassName}
          >
            <button
              type="button"
              className="admin-grip"
              aria-label={`Reorder — item ${index + 1} of ${order.length}`}
              onPointerDown={(e) => onPointerDown(e, item.id)}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18">
                <circle cx="9" cy="6" r="1.6" fill="currentColor" />
                <circle cx="15" cy="6" r="1.6" fill="currentColor" />
                <circle cx="9" cy="12" r="1.6" fill="currentColor" />
                <circle cx="15" cy="12" r="1.6" fill="currentColor" />
                <circle cx="9" cy="18" r="1.6" fill="currentColor" />
                <circle cx="15" cy="18" r="1.6" fill="currentColor" />
              </svg>
            </button>

            <div className="admin-reorder__body">{renderItem(item, index)}</div>

            <div className="admin-reorder__nudge">
              <button
                type="button"
                className="admin-btn admin-btn--ghost admin-btn--icon"
                onClick={() => nudge(index, -1)}
                disabled={index === 0}
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--ghost admin-btn--icon"
                onClick={() => nudge(index, 1)}
                disabled={index === order.length - 1}
                aria-label="Move down"
              >
                ↓
              </button>
            </div>
          </li>
        ))}
      </ul>

      <p className="admin-reorder__status" role="status" aria-live="polite">
        {saving ? "Saving order…" : announce}
      </p>
    </>
  );
}
