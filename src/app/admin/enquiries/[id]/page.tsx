import { notFound } from "next/navigation";
import { EnquiryActions } from "../EnquiryDetail";
import { getEnquiry } from "@/lib/admin-queries";

export const dynamic = "force-dynamic";

const LONG = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const DAY = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default async function EnquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const e = await getEnquiry(id);
  if (!e) notFound();

  const subject = e.tour?.name ?? e.room?.name;

  // Quote their own details back so the guest knows which enquiry this answers —
  // they may have messaged three resorts the same evening.
  const reply = [
    `Assalam o Alaikum ${e.name},`,
    "",
    `Thank you for your enquiry about ${subject ?? "Neelum Resort Taobat"}.`,
    ...(e.checkIn
      ? [`Dates: ${DAY.format(e.checkIn)}${e.checkOut ? ` – ${DAY.format(e.checkOut)}` : ""}`]
      : []),
    ...(e.guests ? [`Guests: ${e.guests}`] : []),
    ...(e.pickupPoint ? [`Pick-up from: ${e.pickupPoint}`] : []),
    "",
  ].join("\n");

  const rows: [string, React.ReactNode][] = [
    ["Received", LONG.format(e.createdAt)],
    ["Phone", e.phone],
    ["Kind", e.kind === "TOUR" ? "Jeep tour" : "Stay"],
    ...(subject ? ([[e.kind === "TOUR" ? "Tour" : "Room", subject]] as [string, React.ReactNode][]) : []),
    ...(e.pickupPoint ? ([["Pick-up point", e.pickupPoint]] as [string, React.ReactNode][]) : []),
    ...(e.checkIn ? ([["Check in", DAY.format(e.checkIn)]] as [string, React.ReactNode][]) : []),
    ...(e.checkOut ? ([["Check out", DAY.format(e.checkOut)]] as [string, React.ReactNode][]) : []),
    ...(e.guests ? ([["Guests", e.guests]] as [string, React.ReactNode][]) : []),
    ["Came from", e.source],
  ];

  return (
    <>
      <div className="admin-head">
        <h1>{e.name}</h1>
        <p>{e.status === "NEW" ? "Not replied to yet." : e.status === "REPLIED" ? "Replied." : "Closed."}</p>
      </div>

      <div className="admin-detail">
        <div className="admin-card admin-detail__main">
          <dl className="admin-dl">
            {rows.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          {e.message ? (
            <div className="admin-detail__message">
              <h2>Message</h2>
              <p>{e.message}</p>
            </div>
          ) : null}
        </div>

        <EnquiryActions
          id={e.id}
          status={e.status}
          guestPhone={e.phone}
          waMessage={reply}
        />
      </div>
    </>
  );
}
