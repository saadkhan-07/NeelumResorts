import Link from "next/link";
import { CldImage } from "./CldImage";
import type { MediaRow } from "@/lib/queries";

/**
 * The `.page-head` band. With no photograph it keeps its height and falls back to
 * the solid `--ink` the stylesheet already gives it, so the heading stays legible
 * and nothing shifts.
 */
export function PageHead({
  media,
  crumb,
  title,
  lede,
}: {
  media?: MediaRow | null;
  crumb: string;
  title: string;
  lede: string;
}) {
  return (
    <section className="page-head">
      {/* The page's largest paint on a phone. It sits under a dark gradient, so a
          lighter file (q_auto:low, and 80vw rather than full width on a phone)
          looks the same and reaches the screen sooner on mobile data. */}
      {media ? (
        <CldImage media={media} priority quality={40} sizes="(max-width: 600px) 80vw, 100vw" />
      ) : null}
      <div className="wrap">
        <p className="crumb">
          <Link href="/">Home</Link>
          &nbsp;/&nbsp; {crumb}
        </p>
        <h1>{title}</h1>
        <p>{lede}</p>
      </div>
    </section>
  );
}
