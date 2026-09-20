"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ReorderList } from "@/components/admin/ReorderList";
import { Toast } from "@/components/admin/controls";
import { imageUrl } from "@/lib/cloudinary";
import type { ActionState } from "@/lib/admin-auth";
import { reorderTours } from "./actions";

export type TourListRow = {
  id: string;
  name: string;
  published: boolean;
  showPrice: boolean;
  fareCount: number;
  cover: string | null;
};

export function TourList({ tours }: { tours: TourListRow[] }) {
  const [state, setState] = useState<ActionState>({});
  const [, startTransition] = useTransition();

  return (
    <>
      <ReorderList
        items={tours}
        label="Drag to reorder tours"
        onCommit={(ids) => startTransition(async () => setState(await reorderTours(ids)))}
        renderItem={(tour) => (
          <Link href={`/admin/tours/${tour.id}`} className="admin-listline">
            {tour.cover ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img className="admin-thumb" src={imageUrl(tour.cover, 160)} alt="" />
            ) : (
              <span className="admin-thumb" aria-hidden="true" />
            )}
            <span className="admin-listline__text">
              <b>{tour.name}</b>
              <small>
                {tour.published ? "Published" : "Hidden"}
                {" · "}
                {tour.showPrice && tour.fareCount > 0
                  ? `${tour.fareCount} fare${tour.fareCount === 1 ? "" : "s"} shown`
                  : "Fare agreed on WhatsApp"}
              </small>
            </span>
          </Link>
        )}
      />
      <Toast state={state} />
    </>
  );
}
