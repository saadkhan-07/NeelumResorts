"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ChipInput, ConfirmButton, SubmitButton, Toast, Toggle } from "@/components/admin/controls";
import { PhotoManager, type ManagedPhoto } from "@/components/admin/PhotoManager";
import type { ActionState } from "@/lib/admin-auth";
import { addRoomPhoto, deleteRoom, deleteRoomPhoto, saveRoom, setRoomPhotoOrder } from "./actions";

export type RoomFormValues = {
  id?: string;
  slug: string;
  name: string;
  tagline: string;
  shortDesc: string;
  longDesc: string;
  guests: string;
  beds: string;
  sizeSqft: string;
  view: string;
  amenities: string[];
  price: number | null;
  showPrice: boolean;
  published: boolean;
};

export function RoomForm({
  room,
  photos,
}: {
  room: RoomFormValues;
  photos: ManagedPhoto[];
}) {
  const [state, action] = useActionState<ActionState, FormData>(saveRoom, {});
  const [deleteState, deleteAction] = useActionState<ActionState, FormData>(deleteRoom, {});

  return (
    <>
      <form action={action} className="admin-form">
        {room.id ? <input type="hidden" name="id" value={room.id} /> : null}

        <div className="admin-field">
          <label htmlFor="name">Room name</label>
          <input id="name" name="name" defaultValue={room.name} required maxLength={120} />
        </div>

        <div className="admin-form__row">
          <div className="admin-field">
            <label htmlFor="slug">Web address</label>
            <input
              id="slug"
              name="slug"
              defaultValue={room.slug}
              required
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              title="Lower-case letters, numbers and hyphens"
            />
          </div>
          <div className="admin-field">
            <label htmlFor="tagline">Card tag</label>
            <input
              id="tagline"
              name="tagline"
              defaultValue={room.tagline}
              maxLength={60}
              placeholder="Most booked"
            />
          </div>
        </div>

        <div className="admin-field">
          <label htmlFor="shortDesc">Card text</label>
          <textarea id="shortDesc" name="shortDesc" defaultValue={room.shortDesc} required rows={2} />
        </div>

        <div className="admin-field">
          <label htmlFor="longDesc">Detail page text</label>
          <textarea id="longDesc" name="longDesc" defaultValue={room.longDesc} required rows={5} />
        </div>

        <div className="admin-form__row">
          <div className="admin-field">
            <label htmlFor="guests">Guests</label>
            <input id="guests" name="guests" defaultValue={room.guests} required placeholder="2 guests" />
          </div>
          <div className="admin-field">
            <label htmlFor="beds">Beds</label>
            <input id="beds" name="beds" defaultValue={room.beds} required placeholder="1 queen bed" />
          </div>
        </div>

        <div className="admin-form__row">
          <div className="admin-field">
            <label htmlFor="sizeSqft">Size</label>
            <input id="sizeSqft" name="sizeSqft" defaultValue={room.sizeSqft} placeholder="220 sq ft" />
          </div>
          <div className="admin-field">
            <label htmlFor="view">View</label>
            <input id="view" name="view" defaultValue={room.view} required placeholder="River-facing" />
          </div>
        </div>

        <ChipInput
          name="amenities"
          label="Amenities"
          initial={room.amenities}
          placeholder="Room heater & extra quilts"
        />

        <div className="admin-section">
          <p className="admin-sub">Rate</p>
          <div className="admin-field">
            <label htmlFor="price">Price per night, PKR</label>
            <input
              id="price"
              name="price"
              type="number"
              inputMode="numeric"
              min={1}
              defaultValue={room.price ?? ""}
              placeholder="Leave empty if you do not want to set one"
            />
          </div>
          <Toggle
            name="showPrice"
            label="Show price on website"
            hint="Off by default. While it is off the card reads “Rates on request”, whatever the price above says."
            defaultChecked={room.showPrice}
          />
        </div>

        <div className="admin-section">
          <p className="admin-sub">Visibility</p>
          <Toggle
            name="published"
            label="Published"
            hint="Turn off to take this room off the website without deleting it."
            defaultChecked={room.published}
          />
        </div>

        <div className="admin-form__actions">
          <SubmitButton>{room.id ? "Save changes" : "Create room"}</SubmitButton>
          <Link href="/admin/rooms" className="admin-btn admin-btn--ghost">
            Back
          </Link>
        </div>
        <Toast state={state} />
      </form>

      {room.id ? (
        <>
          <PhotoManager
            photos={photos}
            folder="neelum/rooms"
            ownerId={room.id}
            onUpload={({ ownerId, ...file }) => addRoomPhoto({ roomId: ownerId, ...file })}
            onReorder={setRoomPhotoOrder}
            onDelete={deleteRoomPhoto}
          />

          <div className="admin-section">
            <p className="admin-sub">Danger zone</p>
            <form action={deleteAction}>
              <input type="hidden" name="id" value={room.id} />
              <ConfirmButton confirmLabel="Sure? Tap again to delete">
                Delete this room
              </ConfirmButton>
            </form>
            <Toast state={deleteState} />
          </div>
        </>
      ) : (
        <p className="admin-empty" style={{ textAlign: "left", paddingLeft: 0 }}>
          Photographs can be added once the room is created.
        </p>
      )}
    </>
  );
}
