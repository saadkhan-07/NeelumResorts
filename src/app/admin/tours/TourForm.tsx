"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ChipInput, ConfirmButton, SubmitButton, Toast, Toggle } from "@/components/admin/controls";
import { PhotoManager, type ManagedPhoto } from "@/components/admin/PhotoManager";
import type { ActionState } from "@/lib/admin-auth";
import { FaresEditor, type FareRow } from "./FareList";
import { addTourPhoto, deleteTour, deleteTourPhoto, saveTour, setTourPhotoOrder } from "./actions";

export type TourFormValues = {
  id?: string;
  slug: string;
  name: string;
  tagline: string;
  shortDesc: string;
  longDesc: string;
  season: string;
  difficulty: string;
  travelNote: string;
  highlights: string[];
  includes: string[];
  showPrice: boolean;
  published: boolean;
};

export function TourForm({
  tour,
  fares,
  photos,
}: {
  tour: TourFormValues;
  fares: FareRow[];
  photos: ManagedPhoto[];
}) {
  const [state, action] = useActionState<ActionState, FormData>(saveTour, {});
  const [deleteState, deleteAction] = useActionState<ActionState, FormData>(deleteTour, {});

  return (
    <>
      <form action={action} className="admin-form">
        {tour.id ? <input type="hidden" name="id" value={tour.id} /> : null}

        <div className="admin-field">
          <label htmlFor="name">Destination</label>
          <input id="name" name="name" defaultValue={tour.name} required maxLength={120} />
        </div>

        <div className="admin-form__row">
          <div className="admin-field">
            <label htmlFor="slug">Web address</label>
            <input
              id="slug"
              name="slug"
              defaultValue={tour.slug}
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
              defaultValue={tour.tagline}
              maxLength={60}
              placeholder="Most popular"
            />
          </div>
        </div>

        <div className="admin-field">
          <label htmlFor="shortDesc">Card text</label>
          <textarea id="shortDesc" name="shortDesc" defaultValue={tour.shortDesc} required rows={2} />
        </div>

        <div className="admin-field">
          <label htmlFor="longDesc">Detail page text</label>
          <textarea id="longDesc" name="longDesc" defaultValue={tour.longDesc} required rows={5} />
        </div>

        <div className="admin-field">
          <label htmlFor="season">Season</label>
          <input
            id="season"
            name="season"
            defaultValue={tour.season}
            placeholder="Open June to September"
          />
        </div>

        <div className="admin-field">
          <label htmlFor="difficulty">What the going is like</label>
          <input
            id="difficulty"
            name="difficulty"
            defaultValue={tour.difficulty}
            placeholder="Jeep track, then a 45-min walk"
          />
        </div>

        <div className="admin-field">
          <label htmlFor="travelNote">How long it takes</label>
          <input
            id="travelNote"
            name="travelNote"
            defaultValue={tour.travelNote}
            placeholder="About 3 hrs from Kel"
          />
        </div>

        <ChipInput
          name="highlights"
          label="What you see"
          initial={tour.highlights}
          placeholder="Chairlift across the Neelum"
        />
        <ChipInput
          name="includes"
          label="What the fare covers"
          initial={tour.includes}
          placeholder="Fuel and driver included"
        />

        <div className="admin-section">
          <p className="admin-sub">Fares</p>
          {/* The master switch sits above the list, so it reads as governing it. */}
          <Toggle
            name="showPrice"
            label="Show fares on website"
            hint="Off hides every fare for this tour and the card falls back to the WhatsApp line — one toggle when fuel prices jump."
            defaultChecked={tour.showPrice}
          />
        </div>

        <FaresEditor initial={fares} />

        <div className="admin-section">
          <p className="admin-sub">Visibility</p>
          <Toggle
            name="published"
            label="Published"
            hint="Turn off out of season — the pass closes and the tour comes off the website without being deleted."
            defaultChecked={tour.published}
          />
        </div>

        <div className="admin-form__actions">
          <SubmitButton>{tour.id ? "Save changes" : "Create tour"}</SubmitButton>
          <Link href="/admin/tours" className="admin-btn admin-btn--ghost">
            Back
          </Link>
        </div>
        <Toast state={state} />
      </form>

      {tour.id ? (
        <>
          <PhotoManager
            photos={photos}
            folder="neelum/tours"
            ownerId={tour.id}
            onUpload={({ ownerId, ...file }) => addTourPhoto({ tourId: ownerId, ...file })}
            onReorder={setTourPhotoOrder}
            onDelete={deleteTourPhoto}
          />

          <div className="admin-section">
            <p className="admin-sub">Danger zone</p>
            <form action={deleteAction}>
              <input type="hidden" name="id" value={tour.id} />
              <ConfirmButton confirmLabel="Sure? Tap again to delete">
                Delete this tour
              </ConfirmButton>
            </form>
            <Toast state={deleteState} />
          </div>
        </>
      ) : (
        <p className="admin-empty" style={{ textAlign: "left", paddingLeft: 0 }}>
          Photographs can be added once the tour is created.
        </p>
      )}
    </>
  );
}
