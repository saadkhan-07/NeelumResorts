import { PageHeaderSlot } from "./PageHeaderSlot";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { PAGE_KEYS, type PageKey } from "@/lib/page-keys";

export const dynamic = "force-dynamic";

const SLOTS: Record<PageKey, { title: string; used: string }> = {
  stays: {
    title: "Stays",
    used: "Top of the Stays page, and of every room's own page.",
  },
  tours: {
    title: "Jeep Tours",
    used: "Top of the Jeep Tours page, and of every tour's own page.",
  },
  gallery: {
    title: "Gallery",
    used: "Top of the Gallery page.",
  },
  contact: {
    title: "Contact",
    used: "Top of the Contact page. Also shown beside the map in the “Finding us” section of the home page.",
  },
};

export default async function PageHeadersPage() {
  await requireAdmin();

  const rows = await prisma.media.findMany({
    where: { placement: "PAGE_HEADER", pageKey: { not: null } },
  });
  const byKey = new Map(rows.map((r) => [r.pageKey ?? "", r]));

  return (
    <>
      <div className="admin-head">
        <h1>Page photos</h1>
        <p>
          The wide photograph at the top of each inner page, behind the page title. One
          per page — uploading a new one replaces the old. A page with none shows a plain
          dark band and the title still reads.
        </p>
      </div>

      <div className="admin-slots">
        {PAGE_KEYS.map((key) => {
          const row = byKey.get(key);
          return (
            <PageHeaderSlot
              key={key}
              pageKey={key}
              title={SLOTS[key].title}
              used={SLOTS[key].used}
              publicId={row?.publicId ?? null}
              alt={row?.alt ?? ""}
            />
          );
        })}
      </div>

      <p className="admin-sub">A note on these</p>
      <p style={{ color: "var(--a-muted)", fontSize: ".85rem", maxWidth: 620 }}>
        Landscape photographs work best. They are shown full width and cropped to about
        half the screen’s height, so the middle of the photo is what survives — keep the
        subject there, and avoid bright sky behind where the white title sits.
      </p>
    </>
  );
}
