"use client";

import { useActionState } from "react";
import { SubmitButton, Toast } from "@/components/admin/controls";
import type { ActionState } from "@/lib/admin-auth";
import type { Settings } from "@/lib/queries";
import { saveSettings } from "./actions";

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, action] = useActionState<ActionState, FormData>(saveSettings, {});

  return (
    <form action={action} className="admin-form">
      <p className="admin-sub">Contact</p>

      <div className="admin-field">
        <label htmlFor="whatsapp">WhatsApp number</label>
        <input
          id="whatsapp"
          name="whatsapp"
          defaultValue={settings.whatsapp}
          inputMode="numeric"
          required
          placeholder="923556804073"
        />
        <small style={{ color: "var(--a-muted)", fontSize: ".78rem" }}>
          Country code first, no plus sign and no spaces. Every enquiry button on the
          website goes to this number.
        </small>
      </div>

      <div className="admin-form__row">
        <div className="admin-field">
          <label htmlFor="phone">Phone, for calling</label>
          <input id="phone" name="phone" defaultValue={settings.phone} required placeholder="+923556804073" />
        </div>
        <div className="admin-field">
          <label htmlFor="phoneDisplay">Phone, as written</label>
          <input
            id="phoneDisplay"
            name="phoneDisplay"
            defaultValue={settings.phoneDisplay}
            required
            placeholder="+92 355 6804073"
          />
        </div>
      </div>

      <div className="admin-field">
        <label htmlFor="address">Address</label>
        <textarea id="address" name="address" defaultValue={settings.address} required rows={2} />
      </div>

      <div className="admin-field">
        <label htmlFor="googleMapsUrl">Google Maps link</label>
        <input id="googleMapsUrl" name="googleMapsUrl" defaultValue={settings.googleMapsUrl} required />
      </div>

      <p className="admin-sub">Front page</p>

      <div className="admin-field">
        <label htmlFor="heroHeadline">Headline</label>
        <input id="heroHeadline" name="heroHeadline" defaultValue={settings.heroHeadline} required />
        <small style={{ color: "var(--a-muted)", fontSize: ".78rem" }}>
          Put *asterisks* around one word to show it in gold italic — for example,
          Where the valley *ends*, and the quiet begins.
        </small>
      </div>

      <div className="admin-field">
        <label htmlFor="heroSub">Line underneath</label>
        <textarea id="heroSub" name="heroSub" defaultValue={settings.heroSub} required rows={3} />
      </div>

      <div className="admin-field">
        <label htmlFor="seasonBanner">Season banner</label>
        <input
          id="seasonBanner"
          name="seasonBanner"
          defaultValue={settings.seasonBanner}
          placeholder="Road closed for winter — reopening May"
        />
        <small style={{ color: "var(--a-muted)", fontSize: ".78rem" }}>
          Leave empty for nothing. Anything typed here shows as a strip across the top
          of every page on the website.
        </small>
      </div>

      <p className="admin-sub">Jeep tours</p>

      <div className="admin-field">
        <label htmlFor="pickupPoints">Pick-up points</label>
        <textarea
          id="pickupPoints"
          name="pickupPoints"
          defaultValue={settings.pickupPoints}
          rows={5}
          placeholder={"Muzaffarabad\nSharda\nKel\nTaobat"}
        />
        <small style={{ color: "var(--a-muted)", fontSize: ".78rem" }}>
          One place per line. These fill the “Where should we pick you up?” list on every
          tour. Somewhere else is added automatically.
        </small>
      </div>

      <div className="admin-field">
        <label htmlFor="ratesUpdated">Fares last updated</label>
        <input
          id="ratesUpdated"
          name="ratesUpdated"
          defaultValue={settings.ratesUpdated}
          placeholder="September 2026"
        />
        <small style={{ color: "var(--a-muted)", fontSize: ".78rem" }}>
          Shown as a quiet line under every fare list. It protects you from being held
          to a stale number when fuel prices move.
        </small>
      </div>

      <p className="admin-sub">Google rating</p>

      <div className="admin-form__row">
        <div className="admin-field">
          <label htmlFor="ratingScore">Stars</label>
          <input id="ratingScore" name="ratingScore" defaultValue={settings.ratingScore} placeholder="4.9" />
        </div>
        <div className="admin-field">
          <label htmlFor="ratingCount">Number of reviews</label>
          <input id="ratingCount" name="ratingCount" defaultValue={settings.ratingCount} placeholder="704" />
        </div>
      </div>
      <small style={{ color: "var(--a-muted)", fontSize: ".78rem" }}>
        These appear in three places on the front page. Check your Google listing now
        and then and keep them honest.
      </small>

      <p className="admin-sub">Social links</p>

      <div className="admin-field">
        <label htmlFor="instagram">Instagram</label>
        <input id="instagram" name="instagram" defaultValue={settings.instagram} placeholder="https://instagram.com/…" />
      </div>
      <div className="admin-field">
        <label htmlFor="facebook">Facebook</label>
        <input id="facebook" name="facebook" defaultValue={settings.facebook} placeholder="https://facebook.com/…" />
      </div>
      <div className="admin-field">
        <label htmlFor="tiktok">TikTok</label>
        <input id="tiktok" name="tiktok" defaultValue={settings.tiktok} placeholder="https://tiktok.com/@…" />
      </div>
      <small style={{ color: "var(--a-muted)", fontSize: ".78rem" }}>
        An empty box hides that icon in the footer rather than linking nowhere.
      </small>

      <div className="admin-form__actions">
        <SubmitButton>Save settings</SubmitButton>
      </div>
      <Toast state={state} />
    </form>
  );
}
