import Link from "next/link";
import { getEnquiries, getEnquiryCounts, type EnquiryCard } from "@/lib/admin-queries";

export const dynamic = "force-dynamic";

const STATUSES = [
  { key: "", label: "All" },
  { key: "NEW", label: "New" },
  { key: "REPLIED", label: "Replied" },
  { key: "CLOSED", label: "Closed" },
] as const;

const KINDS = [
  { key: "", label: "Both" },
  { key: "STAY", label: "Stays" },
  { key: "TOUR", label: "Tours" },
] as const;

function when(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function dates(e: EnquiryCard) {
  if (!e.checkIn) return null;
  const f = (d: Date) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(d);
  return e.checkOut ? `${f(e.checkIn)} – ${f(e.checkOut)}` : f(e.checkIn);
}

function chipHref(status: string, kind: string) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (kind) params.set("kind", kind);
  const q = params.toString();
  return q ? `/admin/enquiries?${q}` : "/admin/enquiries";
}

export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; kind?: string }>;
}) {
  const sp = await searchParams;
  const status = (["NEW", "REPLIED", "CLOSED"] as const).find((s) => s === sp.status);
  const kind = (["STAY", "TOUR"] as const).find((k) => k === sp.kind);

  const [list, counts] = await Promise.all([
    getEnquiries({ status, kind }),
    getEnquiryCounts(),
  ]);

  return (
    <>
      <div className="admin-head">
        <h1>Enquiries</h1>
        <p>
          {counts.NEW > 0
            ? `${counts.NEW} waiting for a reply · ${counts.all} in total`
            : `Nothing waiting · ${counts.all} in total`}
        </p>
      </div>

      {/* Two independent filters. Stays and tours are different businesses, so
          the owner can work one queue without the other in the way. */}
      <div className="admin-filters">
        <div className="admin-filters__row" role="group" aria-label="Filter by status">
          {STATUSES.map((s) => (
            <Link
              key={s.key}
              href={chipHref(s.key, kind ?? "")}
              className={(sp.status ?? "") === s.key ? "admin-chip is-on" : "admin-chip"}
            >
              {s.label}
              <b>{s.key === "" ? counts.all : counts[s.key as "NEW" | "REPLIED" | "CLOSED"]}</b>
            </Link>
          ))}
        </div>
        <div className="admin-filters__row" role="group" aria-label="Filter by kind">
          {KINDS.map((k) => (
            <Link
              key={k.key}
              href={chipHref(status ?? "", k.key)}
              className={(sp.kind ?? "") === k.key ? "admin-chip is-on" : "admin-chip"}
            >
              {k.label}
              <b>{k.key === "" ? counts.all : counts[k.key as "STAY" | "TOUR"]}</b>
            </Link>
          ))}
        </div>
      </div>

      <div className="admin-card">
        {list.length === 0 ? (
          <p className="admin-empty">
            {counts.all === 0
              ? "No enquiries yet. They appear the moment a guest sends one from the website."
              : "Nothing matches this filter."}
          </p>
        ) : (
          list.map((e) => {
            const subject = e.tour?.name ?? e.room?.name;
            const stay = dates(e);
            return (
              <Link key={e.id} href={`/admin/enquiries/${e.id}`} className="admin-row">
                <div className="admin-row-top">
                  {e.status === "NEW" ? <span className="admin-tag admin-tag--new">New</span> : null}
                  <b>{e.name}</b>
                  <time dateTime={e.createdAt.toISOString()}>{when(e.createdAt)}</time>
                </div>
                <div className="admin-row-meta">
                  <span>{e.phone}</span>
                  {subject ? (
                    <span className={e.kind === "TOUR" ? "admin-tag admin-tag--tour" : "admin-tag"}>
                      {subject}
                    </span>
                  ) : null}
                  {stay ? <span>{stay}</span> : null}
                  {e.guests ? <span>{e.guests}</span> : null}
                  {e.pickupPoint ? <span>from {e.pickupPoint}</span> : null}
                </div>
                {e.message ? <p className="admin-row-msg">{e.message}</p> : null}
              </Link>
            );
          })
        )}
      </div>
    </>
  );
}
