"use client";

import { useActionState, useState } from "react";
import { Uploader, type UploadedFile } from "@/components/admin/Uploader";
import { ConfirmButton, Toast } from "@/components/admin/controls";
import { faviconUrl, logoUrl, ogImageUrl } from "@/lib/cloudinary";
import type { ActionState } from "@/lib/admin-auth";
import { clearBrandAsset, saveBrandAsset } from "./actions";
import type { BrandKey } from "./keys";

export type BrandSlotProps = {
  brandKey: BrandKey;
  title: string;
  used: string;
  recommended: string;
  publicId: string | null;
  version?: number;
};

function previewUrl(brandKey: BrandKey, publicId: string, version?: number) {
  if (brandKey === "favicon") return faviconUrl(publicId, 96, version);
  if (brandKey === "og-image") return ogImageUrl(publicId);
  return logoUrl(publicId, 120);
}

/**
 * One brand slot, previewed on a dark strip and a light one.
 *
 * Both strips matter: `logo-light` is for the header over the hero and the
 * footer, `logo-dark` for the solid header. Showing each upload on both
 * backgrounds is how the client sees *immediately* that they uploaded the wrong
 * variant — a dark mark on a dark strip is invisible, and that is the point.
 */
export function BrandSlot({
  brandKey,
  title,
  used,
  recommended,
  publicId,
  version,
}: BrandSlotProps) {
  const [current, setCurrent] = useState(publicId);
  const [state, setState] = useState<ActionState>({});
  const [clearState, clearAction] = useActionState<ActionState, FormData>(clearBrandAsset, {});

  async function onUploaded(file: UploadedFile) {
    const result = await saveBrandAsset({
      brandKey,
      publicId: file.publicId,
      width: file.width,
      height: file.height,
      alt: title,
    });
    setState(result);
    if (result.ok) setCurrent(file.publicId);
  }

  const src = current ? previewUrl(brandKey, current, version) : null;

  return (
    <div className="admin-slot">
      <h2>{title}</h2>
      <p>
        {used}
        <br />
        <strong>{recommended}</strong>
      </p>

      <div className="admin-slot__previews">
        <div className="admin-slot__strip admin-slot__strip--dark">
          {src ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={src} alt={`${title} on a dark background`} />
          ) : (
            <span>Not set</span>
          )}
        </div>
        <div className="admin-slot__strip admin-slot__strip--light">
          {src ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={src} alt={`${title} on a light background`} />
          ) : (
            <span>Built-in mark</span>
          )}
        </div>
      </div>

      <Uploader
        folder="neelum/brand"
        label={current ? "Replace" : "Upload"}
        /* SVG is accepted here and only here — it is delivered with fl_sanitize
           because an SVG is executable markup from a non-technical uploader. */
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        onUploaded={onUploaded}
      />
      <Toast state={state} />

      {current ? (
        <form action={clearAction} style={{ marginTop: 8 }}>
          <input type="hidden" name="brandKey" value={brandKey} />
          <ConfirmButton confirmLabel="Sure? Tap again">Remove</ConfirmButton>
        </form>
      ) : null}
      <Toast state={clearState} />
    </div>
  );
}
