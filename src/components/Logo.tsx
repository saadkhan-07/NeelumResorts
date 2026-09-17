import Link from "next/link";

/**
 * The wordmark. The inline SVG below is the fallback mark — from Phase 4 the
 * uploaded Cloudinary logo takes its place and this stays as the fallback for
 * an empty brand slot. Nothing is loaded from /public.
 */
export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link className="logo" href={href}>
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1" opacity=".45" />
        <path d="M8 26l6.5-9.5 4 5.5 3.5-5 9.5 9z" fill="#BE9247" />
        <path d="M8 26h23.5" stroke="currentColor" strokeWidth="1.1" opacity=".6" />
        <circle cx="27" cy="12.5" r="2.4" fill="currentColor" opacity=".8" />
      </svg>
      <span style={{ display: "block" }}>
        <b>Neelum Resort</b>
        <span>Taobat · Neelum Valley</span>
      </span>
    </Link>
  );
}
