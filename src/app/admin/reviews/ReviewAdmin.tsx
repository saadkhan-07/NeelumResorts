"use client";

import { useActionState, useState, useTransition } from "react";
import { ReorderList } from "@/components/admin/ReorderList";
import { ConfirmButton, SubmitButton, Toast, Toggle } from "@/components/admin/controls";
import type { ActionState } from "@/lib/admin-auth";
import { deleteReview, reorderReviews, saveReview } from "./actions";

export type ReviewItem = {
  id: string;
  author: string;
  body: string;
  rating: number;
  whenText: string;
  source: string;
  published: boolean;
};

function ReviewFields({ review }: { review?: ReviewItem }) {
  return (
    <>
      <div className="admin-form__row">
        <div className="admin-field">
          <label htmlFor={`author-${review?.id ?? "new"}`}>Reviewer&apos;s name</label>
          <input
            id={`author-${review?.id ?? "new"}`}
            name="author"
            defaultValue={review?.author}
            required
            maxLength={120}
            placeholder="As it appears on Google"
          />
        </div>
        <div className="admin-field">
          <label htmlFor={`when-${review?.id ?? "new"}`}>When</label>
          <input
            id={`when-${review?.id ?? "new"}`}
            name="whenText"
            defaultValue={review?.whenText}
            maxLength={60}
            placeholder="2 weeks ago"
          />
        </div>
      </div>

      <div className="admin-field">
        <label htmlFor={`body-${review?.id ?? "new"}`}>What they wrote</label>
        <textarea
          id={`body-${review?.id ?? "new"}`}
          name="body"
          defaultValue={review?.body}
          required
          rows={4}
          maxLength={2000}
          placeholder="Copy the review across exactly as they wrote it."
        />
      </div>

      <div className="admin-form__row">
        <div className="admin-field">
          <label htmlFor={`rating-${review?.id ?? "new"}`}>Stars</label>
          <select
            id={`rating-${review?.id ?? "new"}`}
            name="rating"
            defaultValue={String(review?.rating ?? 5)}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {"★".repeat(n)} {n}
              </option>
            ))}
          </select>
        </div>
        <div className="admin-field">
          <label htmlFor={`source-${review?.id ?? "new"}`}>Where it came from</label>
          <input
            id={`source-${review?.id ?? "new"}`}
            name="source"
            defaultValue={review?.source ?? "Google"}
            maxLength={40}
          />
        </div>
      </div>

      <Toggle
        name="published"
        label="Show on the website"
        defaultChecked={review ? review.published : true}
      />
    </>
  );
}

function ReviewRow({ review }: { review: ReviewItem }) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState<ActionState, FormData>(saveReview, {});
  const [deleteState, deleteAction] = useActionState<ActionState, FormData>(deleteReview, {});

  return (
    <div>
      <button
        type="button"
        className="admin-listline"
        onClick={() => setOpen((v) => !v)}
        style={{ width: "100%", background: "none", border: 0, textAlign: "left", cursor: "pointer" }}
        aria-expanded={open}
      >
        <span className="admin-listline__text">
          <b>
            {review.author}{" "}
            <span style={{ color: "var(--a-brass)" }}>{"★".repeat(review.rating)}</span>
          </b>
          <small>
            {review.published ? "Shown" : "Hidden"}
            {review.whenText ? ` · ${review.whenText}` : ""}
            {` · ${review.body.slice(0, 60)}${review.body.length > 60 ? "…" : ""}`}
          </small>
        </span>
      </button>

      {open ? (
        <>
          <form action={action} className="admin-form" style={{ marginTop: 10 }}>
            <input type="hidden" name="id" value={review.id} />
            <ReviewFields review={review} />
            <div className="admin-form__actions">
              <SubmitButton>Save</SubmitButton>
            </div>
            <Toast state={state} />
          </form>

          <form action={deleteAction} style={{ marginTop: 8 }}>
            <input type="hidden" name="id" value={review.id} />
            <ConfirmButton confirmLabel="Sure? Tap again to remove">Remove</ConfirmButton>
            <Toast state={deleteState} />
          </form>
        </>
      ) : null}
    </div>
  );
}

export function ReviewAdmin({ reviews }: { reviews: ReviewItem[] }) {
  const [orderState, setOrderState] = useState<ActionState>({});
  const [, startTransition] = useTransition();
  const [addState, addAction] = useActionState<ActionState, FormData>(saveReview, {});

  return (
    <>
      {reviews.length === 0 ? (
        <div className="admin-card">
          <p className="admin-empty">
            No reviews yet. The homepage shows the rating box on its own until you add
            one — which is better than showing something nobody wrote.
          </p>
        </div>
      ) : (
        <>
          <ReorderList
            items={reviews}
            label="Drag to reorder reviews"
            onCommit={(ids) =>
              startTransition(async () => setOrderState(await reorderReviews(ids)))
            }
            renderItem={(review) => <ReviewRow review={review} />}
          />
          <Toast state={orderState} />
        </>
      )}

      <div className="admin-section">
        <p className="admin-sub">Add a review</p>
        <form action={addAction} className="admin-form">
          <ReviewFields />
          <div className="admin-form__actions">
            <SubmitButton>Add review</SubmitButton>
          </div>
          <Toast state={addState} />
        </form>
      </div>
    </>
  );
}
