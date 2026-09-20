import { ReviewAdmin } from "./ReviewAdmin";
import { requireAdmin } from "@/lib/admin-auth";
import { getSettings } from "@/lib/queries";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  await requireAdmin();

  const [reviews, settings] = await Promise.all([
    prisma.review.findMany({ orderBy: { order: "asc" } }),
    getSettings(),
  ]);

  return (
    <>
      <div className="admin-head">
        <h1>Guest reviews</h1>
        <p>
          Copy your favourites across from your Google listing. Keep the reviewer&apos;s
          name and their exact words — the website shows both, and says where they came
          from.
        </p>
      </div>

      <p className="admin-empty" style={{ textAlign: "left", padding: "0 0 14px" }}>
        Your listing currently reads {settings.ratingScore} stars from{" "}
        {settings.ratingCount} reviews. Those two numbers are in{" "}
        <a href="/admin/settings" style={{ textDecoration: "underline" }}>
          Settings
        </a>{" "}
        — update them when they drift.
      </p>

      <ReviewAdmin
        reviews={reviews.map((r) => ({
          id: r.id,
          author: r.author,
          body: r.body,
          rating: r.rating,
          whenText: r.whenText,
          source: r.source,
          published: r.published,
        }))}
      />
    </>
  );
}
