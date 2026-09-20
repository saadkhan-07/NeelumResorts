"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ReorderList } from "@/components/admin/ReorderList";
import { Toast } from "@/components/admin/controls";
import { imageUrl } from "@/lib/cloudinary";
import type { ActionState } from "@/lib/admin-auth";
import { reorderRooms } from "./actions";

export type RoomRow = {
  id: string;
  name: string;
  slug: string;
  published: boolean;
  showPrice: boolean;
  price: number | null;
  cover: string | null;
};

export function RoomList({ rooms }: { rooms: RoomRow[] }) {
  const [state, setState] = useState<ActionState>({});
  const [, startTransition] = useTransition();

  return (
    <>
      <ReorderList
        items={rooms}
        label="Drag to reorder rooms"
        onCommit={(ids) =>
          startTransition(async () => setState(await reorderRooms(ids)))
        }
        renderItem={(room) => (
          <Link href={`/admin/rooms/${room.id}`} className="admin-listline">
            {room.cover ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img className="admin-thumb" src={imageUrl(room.cover, 160)} alt="" />
            ) : (
              <span className="admin-thumb" aria-hidden="true" />
            )}
            <span className="admin-listline__text">
              <b>{room.name}</b>
              <small>
                {room.published ? "Published" : "Hidden"}
                {" · "}
                {room.showPrice && room.price
                  ? `PKR ${room.price.toLocaleString("en-PK")}`
                  : "Rates on request"}
                {room.cover ? "" : " · no photo"}
              </small>
            </span>
          </Link>
        )}
      />
      <Toast state={state} />
    </>
  );
}
