import Image from "next/image";
import type { MediaRow } from "@/lib/queries";

/**
 * Every photograph on the public site. Bytes come from res.cloudinary.com with
 * `f_auto,q_auto`, sized by the custom loader.
 *
 * Two modes, for the same reason `RefImage` had them in Phase 3: `fill` where the
 * stylesheet sizes the container, explicit width/height where the reference put
 * the aspect ratio on the `img` itself.
 */
export function CldImage({
  media,
  sizes = "100vw",
  priority,
  intrinsic,
  className,
}: {
  media: Pick<MediaRow, "publicId" | "alt" | "width" | "height">;
  sizes?: string;
  priority?: boolean;
  /** Render at the media's own dimensions instead of filling the parent. */
  intrinsic?: boolean;
  className?: string;
}) {
  if (intrinsic) {
    return (
      <Image
        src={media.publicId}
        alt={media.alt}
        width={media.width}
        height={media.height}
        sizes={sizes}
        priority={priority}
        className={className}
        // The stylesheet sets width:100% + aspect-ratio; without height:auto the
        // HTML height attribute stays definite and the aspect-ratio is ignored.
        style={{ height: "auto" }}
      />
    );
  }

  return (
    <Image
      src={media.publicId}
      alt={media.alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      style={{ objectFit: "cover" }}
    />
  );
}

/**
 * The empty state for a photo slot — PROMPT.md's rule that a room or tour with
 * no photograph shows a neutral block, never a broken image and never a
 * collapsed layout. It fills its container exactly as `CldImage` would.
 */
export function MediaPlaceholder({ label }: { label?: string }) {
  return (
    <div
      aria-hidden={!label}
      role={label ? "img" : undefined}
      aria-label={label}
      style={{
        position: "absolute",
        inset: 0,
        background: "var(--sand)",
        display: "grid",
        placeItems: "center",
      }}
    >
      {/* A faint mark rather than nothing, so the slot reads as "photo to come"
          instead of a rendering failure. */}
      <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="var(--brass)"
        strokeWidth="1.1" opacity=".38" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8.5" cy="10" r="1.4" />
        <path d="M21 16l-5-4.5L7 19" />
      </svg>
    </div>
  );
}
