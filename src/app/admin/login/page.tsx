import { LogoMark } from "@/components/admin/icons";
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
  const { callbackUrl } = await searchParams;

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, color: "#1D352D" }}>
          <span style={{ width: 30, height: 30, display: "block" }}>
            <LogoMark />
          </span>
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
