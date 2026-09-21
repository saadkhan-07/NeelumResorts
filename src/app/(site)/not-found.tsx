import { StatusPage } from "@/components/StatusPage";

export const metadata = { title: "Page not found", robots: { index: false } };

/** A room or tour that is unpublished or never existed, inside the site shell. */
export default function NotFound() {
  return (
    <StatusPage
      crumb="Not found"
      title="This page isn't here"
      lede="It may have moved, or the room or trip may no longer be offered. Everything we do is one of the links below."
    />
  );
}
