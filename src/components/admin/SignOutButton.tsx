import { signOut } from "@/auth";
import { SignOutIcon } from "./icons";

/**
 * Sign out is a POST through a server action, not a link: a GET that ends a
 * session can be triggered by a prefetch or an image tag.
 */
export function SignOutButton({ compact }: { compact?: boolean }) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/admin/login" });
      }}
    >
      <button
        type="submit"
        className="admin-btn admin-btn--ghost"
        style={compact ? { minHeight: 38, padding: "0 10px" } : undefined}
        aria-label="Sign out"
      >
        <SignOutIcon />
        {compact ? null : "Sign out"}
      </button>
    </form>
  );
}
