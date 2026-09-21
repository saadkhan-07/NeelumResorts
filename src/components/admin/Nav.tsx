"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DashboardIcon,
  EnquiryIcon,
  GalleryIcon,
  LogoMark,
  RoomIcon,
  SettingsIcon,
  TourIcon,
} from "./icons";

/**
 * One list of destinations, rendered twice: as a sidebar on desktop and as a
 * bottom tab bar on a phone. The CSS decides which is visible — there is no
 * second source of truth for what the admin can reach.
 *
 * Six items is the most a 360px tab bar can hold and stay tappable, so Settings
 * lives in the phone header rather than the bar. Users (OWNER only) arrives in
 * Phase 6 and belongs under Settings for the same reason.
 */
type AdminLink = {
  href: string;
  label: string;
  Icon: () => React.JSX.Element;
  badge?: boolean;
  exact?: boolean;
};

const LINKS: AdminLink[] = [
  { href: "/admin", label: "Home", Icon: DashboardIcon, exact: true },
  { href: "/admin/enquiries", label: "Enquiries", Icon: EnquiryIcon, badge: true },
  { href: "/admin/rooms", label: "Rooms", Icon: RoomIcon },
  { href: "/admin/tours", label: "Tours", Icon: TourIcon },
  { href: "/admin/gallery", label: "Gallery", Icon: GalleryIcon },
];

/** Desktop-only tail of the sidebar; the phone reaches these from the header. */
const SECONDARY: AdminLink[] = [
  { href: "/admin/hero", label: "Front page", Icon: GalleryIcon },
  { href: "/admin/pages", label: "Page photos", Icon: GalleryIcon },
  { href: "/admin/reviews", label: "Reviews", Icon: EnquiryIcon },
  { href: "/admin/branding", label: "Branding", Icon: GalleryIcon },
  { href: "/admin/settings", label: "Settings", Icon: SettingsIcon },
  { href: "/admin/users", label: "Accounts", Icon: DashboardIcon },
];

function useActive() {
  const pathname = usePathname();
  return (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
}

export function AdminSidebar({
  newEnquiries,
  name,
  email,
}: {
  newEnquiries: number;
  name: string;
  email: string;
}) {
  const isActive = useActive();

  return (
    <nav className="admin-side" aria-label="Admin sections">
      <div className="admin-brand">
        <LogoMark />
        <span>
          <b>Neelum Resort</b>
          <span>Admin</span>
        </span>
      </div>

      {[...LINKS, ...SECONDARY].map(({ href, label, Icon, badge, exact }) => (
        <Link
          key={href}
          href={href}
          className={isActive(href, exact) ? "is-active" : undefined}
          aria-current={isActive(href, exact) ? "page" : undefined}
        >
          <Icon />
          {label}
          {badge && newEnquiries > 0 ? (
            <span className="admin-count">{newEnquiries}</span>
          ) : null}
        </Link>
      ))}

      <div className="admin-side-foot">
        <b>{name}</b>
        <span>{email}</span>
      </div>
    </nav>
  );
}

export function AdminTabs({ newEnquiries }: { newEnquiries: number }) {
  const isActive = useActive();

  return (
    <nav className="admin-tabs" aria-label="Admin sections">
      {LINKS.map(({ href, label, Icon, badge, exact }) => (
        <Link
          key={href}
          href={href}
          className={isActive(href, exact) ? "is-active" : undefined}
          aria-current={isActive(href, exact) ? "page" : undefined}
        >
          <Icon />
          {label}
          {badge && newEnquiries > 0 ? (
            <span className="admin-dot" aria-label={`${newEnquiries} new`}>
              {newEnquiries > 9 ? "9+" : newEnquiries}
            </span>
          ) : null}
        </Link>
      ))}
    </nav>
  );
}
