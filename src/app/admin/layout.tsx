import type { Metadata } from "next";
import Link from "next/link";
import "@/styles/admin.css";
import { auth } from "@/auth";
import { AdminSidebar, AdminTabs } from "@/components/admin/Nav";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { SettingsIcon } from "@/components/admin/icons";
import { countNewEnquiries } from "@/lib/admin-queries";

export const metadata: Metadata = {
  title: "Admin — Neelum Resort Taobat",
  robots: { index: false, follow: false },
};

/** Every admin screen is per-request and per-session — never statically rendered. */
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  // /admin/login renders inside this layout too, before there is a session. It
  // brings its own full-screen markup, so the shell steps out of the way.
  if (!session?.user) {
    return <div className="admin">{children}</div>;
  }

  const newEnquiries = await countNewEnquiries();
  const name = session.user.name ?? "Admin";
  const email = session.user.email ?? "";

  return (
    <div className="admin">
      <div className="admin-shell">
        <AdminSidebar newEnquiries={newEnquiries} name={name} email={email} />

        <div>
          <header className="admin-topbar">
            <b>Neelum Resort</b>
            <div className="admin-topbar-right">
              <Link
                href="/admin/settings"
                className="admin-btn admin-btn--ghost"
                style={{
                  minHeight: 38,
                  padding: "0 10px",
                  color: "#fff",
                  borderColor: "rgba(255,255,255,.25)",
                }}
                aria-label="Settings"
              >
                <SettingsIcon />
              </Link>
              <SignOutButton compact />
            </div>
          </header>

          <main className="admin-main">{children}</main>
        </div>
      </div>

      <AdminTabs newEnquiries={newEnquiries} />
    </div>
  );
}
