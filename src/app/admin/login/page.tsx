import { AdminLogo } from "@/components/admin/AdminLogo";
import { getBrand } from "@/lib/queries";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sign in — Neelum Resort Admin",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const [{ callbackUrl }, brand] = await Promise.all([searchParams, getBrand()]);

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, color: "#1D352D" }}>
          <AdminLogo brand={brand} on="light" height={44} />
          <b style={{ fontSize: ".82rem", letterSpacing: ".14em", textTransform: "uppercase" }}>
            Neelum Resort
          </b>
        </div>

        <h1>Sign in</h1>
        <p className="admin-login-sub">Manage rooms, tours, photos and enquiries.</p>

        <LoginForm callbackUrl={callbackUrl ?? "/admin"} />
      </div>
    </div>
  );
}
