"use client";

import { useEffect } from "react";
import { StatusPage } from "@/components/StatusPage";

/**
 * A render that threw. The database helpers already turn failed queries into
 * empty sections, so reaching this means something unexpected — the guest still
 * gets the header, the way back, and a retry.
 */
export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[site] render failed", error.digest ?? error.message);
  }, [error]);

  return (
    <StatusPage
      crumb="Error"
      title="Something went wrong on our side"
      lede="The page didn't load properly. Try again — and if it keeps happening, the WhatsApp button reaches us directly."
    >
      <button className="btn btn--primary" type="button" onClick={reset}>
        Try again
      </button>
    </StatusPage>
  );
}
