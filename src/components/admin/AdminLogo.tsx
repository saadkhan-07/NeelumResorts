import { logoUrl } from "@/lib/cloudinary";
import type { Brand } from "@/lib/queries";
import { LogoMark } from "./icons";

/**
 * The resort's uploaded logo in the admin: `on="dark"` for the pine sidebar,
 * `on="light"` for the white sign-in card. Either upload stands in for the
 * other, as on the public site.
 *
 * The inline mark stays as a fallback only here: this is where the owner
 * uploads the logo, so the admin must still look finished before they have.
 */
export function AdminLogo({ brand, on, height }: { brand: Brand; on: "dark" | "light"; height: number }) {
  const logo =
    on === "dark"
      ? (brand["logo-light"] ?? brand["logo-dark"])
      : (brand["logo-dark"] ?? brand["logo-light"]);

  if (!logo) {
    return (
      <span style={{ width: height, height, display: "block", flex: "none" }}>
        <LogoMark />
      </span>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      className="admin-logo"
      src={logoUrl(logo.publicId, 160)}
      alt="Neelum Resort Taobat"
      // The upload's own proportions, so the box is right before it loads.
      width={Math.round((height * logo.width) / logo.height)}
      height={height}
      style={{ height }}
    />
  );
}
