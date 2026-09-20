"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ConfirmButton, Toast } from "@/components/admin/controls";
import { WhatsAppIcon } from "@/components/icons";
import type { ActionState } from "@/lib/admin-auth";
import { deleteEnquiry, setEnquiryStatus } from "./actions";

/**
 * The status control and the reply button.
 *
 * "Reply on WhatsApp" is the point of this whole screen: it opens a chat with
 * *that guest's* number, with their name and dates already quoted back, so the
 * owner is not retyping a phone number off a screen into another app.
 *
 * Marking it replied is a separate, deliberate tap. Opening WhatsApp does not
 * set the status automatically — the owner often opens a chat to read it before
 * deciding to answer, and a status that changes itself is a status nobody trusts.
 */
export function EnquiryActions({
  id,
  status,
  guestPhone,
  waMessage,
}: {
  id: string;
  status: "NEW" | "REPLIED" | "CLOSED";
  guestPhone: string;
  waMessage: string;
}) {
  const [statusState, statusAction] = useActionState<ActionState, FormData>(
    setEnquiryStatus,
    {},
  );
  const [deleteState, deleteAction] = useActionState<ActionState, FormData>(deleteEnquiry, {});

  // A Pakistani mobile typed as 03xx… needs the country code to reach wa.me.
  const digits = guestPhone.replace(/[^\d]/g, "");
  const international = digits.startsWith("0")
    ? `92${digits.slice(1)}`
    : digits.startsWith("92")
      ? digits
      : digits;

  return (
    <div className="admin-detail__actions">
      <a
        className="admin-btn admin-btn--wa admin-btn--block"
        href={`https://wa.me/${international}?text=${encodeURIComponent(waMessage)}`}
        target="_blank"
        rel="noopener"
      >
        <WhatsAppIcon />
        Reply on WhatsApp
      </a>

      <form action={statusAction} className="admin-status">
        <input type="hidden" name="id" value={id} />
        <label htmlFor={`status-${id}`}>Status</label>
        <select
          id={`status-${id}`}
          name="status"
          defaultValue={status}
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
        >
          <option value="NEW">New</option>
          <option value="REPLIED">Replied</option>
          <option value="CLOSED">Closed</option>
        </select>
        <noscript>
          <button type="submit" className="admin-btn admin-btn--ghost">
            Save status
          </button>
        </noscript>
      </form>
      <Toast state={statusState} />

      <form action={deleteAction} className="admin-detail__delete">
        <input type="hidden" name="id" value={id} />
        <ConfirmButton>Delete enquiry</ConfirmButton>
      </form>
      <Toast state={deleteState} />

      <Link href="/admin/enquiries" className="admin-btn admin-btn--ghost admin-btn--block">
        Back to all enquiries
      </Link>
    </div>
  );
}
