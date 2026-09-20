import { BrandSlot } from "./BrandSlot";
import { BRAND_KEYS } from "./keys";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const SLOTS = {
  "logo-light": {
    title: "Logo — light",
    used: "Header over the hero, and the footer. Both are dark backgrounds.",
    recommended: "PNG or SVG, transparent, white or light mark",
  },
  "logo-dark": {
    title: "Logo — dark",
    used: "Header once it turns solid on scroll, and any light background.",
    recommended: "PNG or SVG, transparent, dark mark",
  },
  favicon: {
    title: "Favicon",
    used: "Browser tab and phone home screen.",
    recommended: "Square PNG, 512 × 512, transparent",
  },
  "og-image": {
    title: "Link preview",
    used: "The picture that shows when the site is shared on WhatsApp or Facebook.",
    recommended: "JPG or PNG, 1200 × 630",
  },
} as const;

export default async function BrandingPage() {
  await requireAdmin();

  const rows = await prisma.media.findMany({ where: { placement: "BRAND" } });
  const byKey = new Map(rows.map((r) => [r.brandKey ?? "", r]));

  return (
    <>
      <div className="admin-head">
        <h1>Branding</h1>
        <p>
          Two logo files, not one — the header flips from light to dark as you scroll,
          so it needs both. Any slot left empty falls back to the built-in mark.
        </p>
      </div>

      <div className="admin-slots">
        {BRAND_KEYS.map((key) => {
          const row = byKey.get(key);
          return (
            <BrandSlot
              key={key}
              brandKey={key}
              title={SLOTS[key].title}
              used={SLOTS[key].used}
              recommended={SLOTS[key].recommended}
              publicId={row?.publicId ?? null}
              version={row ? row.createdAt.getTime() : undefined}
            />
          );
        })}
      </div>
    </>
  );
}
