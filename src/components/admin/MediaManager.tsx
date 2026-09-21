"use client";

import { useActionState, useState, useTransition } from "react";
import { ReorderList } from "./ReorderList";
import { Uploader, type UploadedFile } from "./Uploader";
import { ConfirmButton, SubmitButton, Toast } from "./controls";
import { imageUrl } from "@/lib/cloudinary";
import type { ActionState } from "@/lib/admin-auth";
import { addMedia, deleteMedia, reorderMedia, updateMedia } from "@/app/admin/media-actions";

/** Mirrors the allow-list in media-actions.ts, which validates it again server-side. */
export type ManagedPlacement = "HERO" | "GALLERY" | "STORY" | "DINING" | "CTA";

export type ManagedMedia = {
  id: string;
  publicId: string;
  alt: string;
  tile: string;
};

/**
 * Upload, reorder, describe and delete the photos for one placement.
 *
 * Shared by the hero and the gallery, because the job is identical: the only
 * differences are which placement the rows belong to, whether the grid-tile
 * selector is relevant, and the wording.
 */
function Row({ media, showTile }: { media: ManagedMedia; showTile: boolean }) {
  const [state, action] = useActionState<ActionState, FormData>(updateMedia, {});
  const [deleteState, deleteAction] = useActionState<ActionState, FormData>(deleteMedia, {});

  return (
    <div>
      <div className="admin-listline">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="admin-thumb" src={imageUrl(media.publicId, 200)} alt="" />
        <span className="admin-listline__text">
          <b>{media.alt || "No description yet"}</b>
          <small>{media.publicId.split("/").pop()}</small>
        </span>
      </div>

      <form action={action} className="admin-form__row" style={{ marginTop: 8 }}>
        <input type="hidden" name="id" value={media.id} />
        <div className="admin-field">
          <label htmlFor={`alt-${media.id}`}>Description</label>
          <input
            id={`alt-${media.id}`}
            name="alt"
            defaultValue={media.alt}
            placeholder="Dawn over the ridge"
            maxLength={300}
          />
        </div>

        {showTile ? (
          <div className="admin-field">
            <label htmlFor={`tile-${media.id}`}>Size in the grid</label>
            <select id={`tile-${media.id}`} name="tile" defaultValue={media.tile}>
              <option value="">Normal</option>
              <option value="tall">Tall</option>
              <option value="wide">Wide</option>
            </select>
          </div>
        ) : (
          <input type="hidden" name="tile" value={media.tile} />
        )}

        <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8 }}>
          <SubmitButton>Save</SubmitButton>
        </div>
        <Toast state={state} />
      </form>

      <form action={deleteAction} style={{ marginTop: 6 }}>
        <input type="hidden" name="id" value={media.id} />
        <ConfirmButton confirmLabel="Sure? Tap again to remove">Remove</ConfirmButton>
      </form>
      <Toast state={deleteState} />
    </div>
  );
}

export function MediaManager({
  placement,
  photos,
  folder,
  uploadLabel = "Upload photos",
  emptyText,
  reorderLabel,
  showTile = false,
}: {
  placement: ManagedPlacement;
  photos: ManagedMedia[];
  folder: string;
  uploadLabel?: string;
  emptyText: string;
  reorderLabel: string;
  showTile?: boolean;
}) {
  const [list, setList] = useState(photos);
  const [state, setState] = useState<ActionState>({});
  const [, startTransition] = useTransition();

  async function onUploaded(file: UploadedFile) {
    const result = await addMedia({
      placement,
      publicId: file.publicId,
      width: file.width,
      height: file.height,
      alt: "",
    });
    setState(result);
    if (result.ok) {
      setList((current) => [
        ...current,
        { id: `tmp-${file.publicId}`, publicId: file.publicId, alt: "", tile: "" },
      ]);
    }
  }

  return (
    <>
      <Uploader
        folder={folder}
        multiple
        label={uploadLabel}
        accept="image/jpeg,image/png,image/webp"
        onUploaded={onUploaded}
      />
      <Toast state={state} />

      <div style={{ marginTop: 16 }}>
        {list.length === 0 ? (
          <div className="admin-card">
            <p className="admin-empty">{emptyText}</p>
          </div>
        ) : (
          <ReorderList
            items={list}
            label={reorderLabel}
            onCommit={(ids) =>
              startTransition(async () => {
                setList((current) =>
                  ids.map((id) => current.find((p) => p.id === id)!).filter(Boolean),
                );
                setState(
                  await reorderMedia(placement, ids.filter((id) => !id.startsWith("tmp-"))),
                );
              })
            }
            renderItem={(media) => <Row media={media} showTile={showTile} />}
          />
        )}
      </div>
    </>
  );
}
