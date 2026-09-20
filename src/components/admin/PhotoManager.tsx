"use client";

import { useActionState, useState, useTransition } from "react";
import { ReorderList } from "./ReorderList";
import { Uploader, type UploadedFile } from "./Uploader";
import { ConfirmButton, Toast } from "./controls";
import { imageUrl } from "@/lib/cloudinary";
import type { ActionState } from "@/lib/admin-auth";

export type ManagedPhoto = {
  id: string;
  publicId: string;
  alt: string;
  width: number;
  height: number;
};

/**
 * Upload, reorder, set the cover, delete — the photo block shared by the room
 * and tour forms.
 *
 * "Cover" is not a flag on the row: it is simply the first photo, which is what
 * `photos[0]` means everywhere on the public site. So setting a cover *is*
 * reordering, and there is one concept to understand rather than two that can
 * disagree with each other.
 */
export function PhotoManager({
  photos,
  folder,
  ownerId,
  onUpload,
  onReorder,
  onDelete,
}: {
  photos: ManagedPhoto[];
  folder: string;
  ownerId: string;
  /** The caller binds its own owner key (roomId or tourId). */
  onUpload: (input: {
    ownerId: string;
    publicId: string;
    width: number;
    height: number;
    alt: string;
  }) => Promise<ActionState>;
  onReorder: (ownerId: string, ids: string[]) => Promise<ActionState>;
  onDelete: (prev: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [list, setList] = useState(photos);
  const [state, setState] = useState<ActionState>({});
  const [, startTransition] = useTransition();
  const [deleteState, deleteAction] = useActionState<ActionState, FormData>(onDelete, {});

  async function handleUpload(file: UploadedFile) {
    const result = await onUpload({
      ownerId,
      publicId: file.publicId,
      width: file.width,
      height: file.height,
      alt: "",
    });
    setState(result);
    if (result.ok) {
      // Optimistic: the row is on the server, so show it without a full reload.
      setList((current) => [
        ...current,
        {
          id: `tmp-${file.publicId}`,
          publicId: file.publicId,
          alt: "",
          width: file.width,
          height: file.height,
        },
      ]);
    }
  }

  return (
    <div className="admin-section">
      <p className="admin-sub">Photos</p>

      {list.length === 0 ? (
        <p className="admin-empty" style={{ padding: "14px 0", textAlign: "left" }}>
          No photographs yet. The card and the detail page show a neutral block until
          one is uploaded — never a broken image.
        </p>
      ) : (
        <ReorderList
          items={list}
          label="Drag to reorder photos — the first one is the cover"
          onCommit={(ids) =>
            startTransition(async () => {
              setList((current) =>
                ids.map((id) => current.find((p) => p.id === id)!).filter(Boolean),
              );
              setState(await onReorder(ownerId, ids.filter((id) => !id.startsWith("tmp-"))));
            })
          }
          renderItem={(photo, index) => (
            <div className="admin-listline">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="admin-thumb" src={imageUrl(photo.publicId, 160)} alt="" />
              <div className="admin-listline__text">
                <b>{index === 0 ? "Cover photo" : `Photo ${index + 1}`}</b>
                <small>{photo.publicId.split("/").pop()}</small>
              </div>
              <form action={deleteAction} style={{ marginLeft: "auto" }}>
                <input type="hidden" name="photoId" value={photo.id} />
                <ConfirmButton confirmLabel="Sure?">Remove</ConfirmButton>
              </form>
            </div>
          )}
        />
      )}

      <Toast state={state} />
      <Toast state={deleteState} />

      <div style={{ marginTop: 10 }}>
        <Uploader
          folder={folder}
          multiple
          label="Upload photos"
          accept="image/jpeg,image/png,image/webp"
          onUploaded={handleUpload}
        />
      </div>
    </div>
  );
}
