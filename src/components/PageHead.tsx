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
  media?: MediaRow;
  crumb: string;
  title: string;
  lede: string;
}) {
  return (
    <section className="page-head">
      {media ? <CldImage media={media} priority sizes="100vw" /> : null}
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
