"use client";

import { useActionState, useState } from "react";
import { Uploader, type UploadedFile } from "@/components/admin/Uploader";
import { ConfirmButton, SubmitButton, Toast } from "@/components/admin/controls";
import { imageUrl } from "@/lib/cloudinary";
import type { ActionState } from "@/lib/admin-auth";
import type { PageKey } from "@/lib/page-keys";
import { clearPageHeader, savePageHeader, savePageHeaderAlt } from "./actions";

/**
 * One page's header photo, previewed the way the site shows it: cropped wide,
 * under the same dark wash, with the page title on top. That is how the owner
 * sees whether the heading still reads over their photo before a guest does.
 */
export function PageHeaderSlot({
  pageKey,
  title,
  used,
  publicId,
  alt,
}: {
  pageKey: PageKey;
  title: string;
  used: string;
  publicId: string | null;
  alt: string;
}) {
  const [current, setCurrent] = useState(publicId);
  const [state, setState] = useState<ActionState>({});
  const [altState, altAction] = useActionState<ActionState, FormData>(savePageHeaderAlt, {});
  const [clearState, clearAction] = useActionState<ActionState, FormData>(clearPageHeader, {});

  async function onUploaded(file: UploadedFile) {
    const result = await savePageHeader({
      pageKey,
      publicId: file.publicId,
      width: file.width,
      height: file.height,
    });
    setState(result);
    if (result.ok) setCurrent(file.publicId);
  }

  return (
    <div className="admin-slot">
      <h2>{title}</h2>
      <p>{used}</p>

      <div className="admin-pagehead">
        {current ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={imageUrl(current, 640)} alt="" />
        ) : null}
        <span>{title}</span>
      </div>

      <Uploader
        folder="neelum/misc"
        label={current ? "Replace photo" : "Upload photo"}
        accept="image/jpeg,image/png,image/webp"
        onUploaded={onUploaded}
      />
      <Toast state={state} />

      {current ? (
        <>
          <form action={altAction} style={{ marginTop: 10 }}>
            <input type="hidden" name="pageKey" value={pageKey} />
            <div className="admin-field">
              <label htmlFor={`alt-${pageKey}`}>Description</label>
              <input
                id={`alt-${pageKey}`}
                name="alt"
                defaultValue={alt}
                placeholder="The river below the resort at dusk"
                maxLength={300}
              />
            </div>
            <SubmitButton>Save</SubmitButton>
            <Toast state={altState} />
          </form>

          <form action={clearAction} style={{ marginTop: 8 }}>
            <input type="hidden" name="pageKey" value={pageKey} />
            <ConfirmButton confirmLabel="Sure? Tap again to remove">Remove</ConfirmButton>
          </form>
          <Toast state={clearState} />
        </>
      ) : null}
    </div>
  );
}
