import Link from "next/link";
import { auth } from "@/auth";
import { ChevronIcon, UploadIcon } from "@/components/admin/icons";
import { getDashboardStats, getRecentEnquiries, type EnquiryCard } from "@/lib/admin-queries";

export const dynamic = "force-dynamic";

/** "3 Sep, 14:20" — short enough for a 360px row. */
function when(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function dates(enquiry: EnquiryCard) {
  if (!enquiry.checkIn) return null;
  const fmt = (d: Date) =>
    new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(d);
  return enquiry.checkOut
    ? `${fmt(enquiry.checkIn)} – ${fmt(enquiry.checkOut)}`
    : fmt(enquiry.checkIn);
}

function EnquiryRow({ enquiry }: { enquiry: EnquiryCard }) {
  const subject = enquiry.tour?.name ?? enquiry.room?.name;
  const stay = dates(enquiry);

  return (
    <Link href={`/admin/enquiries/${enquiry.id}`} className="admin-row">
      <div className="admin-row-top">
        {enquiry.status === "NEW" ? <span className="admin-tag admin-tag--new">New</span> : null}
        <b>{enquiry.name}</b>
        <time dateTime={enquiry.createdAt.toISOString()}>{when(enquiry.createdAt)}</time>
      </div>
      <div className="admin-row-meta">
        <span>{enquiry.phone}</span>
        {subject ? (
          <span className={enquiry.kind === "TOUR" ? "admin-tag admin-tag--tour" : "admin-tag"}>
            {subject}
          </span>
        ) : null}
        {stay ? <span>{stay}</span> : null}
        {enquiry.guests ? <span>{enquiry.guests}</span> : null}
        {enquiry.pickupPoint ? <span>from {enquiry.pickupPoint}</span> : null}
      </div>
      {enquiry.message ? <p className="admin-row-msg">{enquiry.message}</p> : null}
    </Link>
  );
}

export default async function AdminDashboard() {
  const [session, stats, recent] = await Promise.all([
    auth(),
    getDashboardStats(),
    getRecentEnquiries(5),
  ]);

  const firstName = (session?.user?.name ?? "there").split(" ")[0];

  return (
    <>
      <div className="admin-head">
        <h1>Assalam o Alaikum, {firstName}</h1>
        <p>
          {stats.newEnquiries > 0
            ? `${stats.newEnquiries} ${stats.newEnquiries === 1 ? "enquiry needs" : "enquiries need"} a reply.`
            : "Nothing waiting for a reply."}
        </p>
      </div>

      <div className="admin-stats">
        <div className={stats.newEnquiries > 0 ? "admin-stat admin-stat--alert" : "admin-stat"}>
          <b>{stats.newEnquiries}</b>
          <span>New enquiries</span>
        </div>
        <div className="admin-stat">
          <b>{stats.totalEnquiries}</b>
          <span>All time</span>
        </div>
        <div className="admin-stat">
          <b>{stats.stayEnquiries}</b>
          <span>Stays</span>
        </div>
        <div className="admin-stat">
          <b>{stats.tourEnquiries}</b>
          <span>Tours</span>
        </div>
      </div>

      {/* The quick upload button. Photos are the thing the owner changes most
          often, so it sits above the fold on every screen size. The upload screen
          itself is Phase 6; Cloudinary is Phase 4. */}
      <p className="admin-sub">Quick action</p>
      <Link href="/admin/gallery" className="admin-btn admin-btn--block">
        <UploadIcon />
        Upload photos
      </Link>

      <p className="admin-sub">Latest enquiries</p>
      <div className="admin-card">
        {recent.length === 0 ? (
          <p className="admin-empty">
            No enquiries yet. They appear here the moment a guest sends one from the
            website.
          </p>
        ) : (
          recent.map((enquiry) => <EnquiryRow key={enquiry.id} enquiry={enquiry} />)
        )}
      </div>

      {recent.length > 0 ? (
        <p style={{ marginTop: 12 }}>
          <Link href="/admin/enquiries" className="admin-btn admin-btn--ghost admin-btn--block">
            See all enquiries
            <ChevronIcon />
          </Link>
        </p>
      ) : null}
    </>
  );
}
