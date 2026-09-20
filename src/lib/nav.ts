export type NavLink = { href: string; label: string };

/** The five public routes, in header order. */
export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/stays", label: "Stays" },
  { href: "/tours", label: "Tours" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];
