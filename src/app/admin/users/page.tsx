import { UserAdmin } from "./UserAdmin";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const DAY = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default async function UsersPage() {
  const me = await requireAdmin();

  if (me.role !== "OWNER") {
    return (
      <>
        <div className="admin-head">
          <h1>Accounts</h1>
          <p>Only the owner can manage accounts.</p>
        </div>
        <div className="admin-card">
          <p className="admin-empty">
            Ask the owner if you need another login added or a password changed.
          </p>
        </div>
      </>
    );
  }

  const users = await prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <>
      <div className="admin-head">
        <h1>Accounts</h1>
        <p>Who can sign in to this panel.</p>
      </div>
      <UserAdmin
        users={users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          createdAt: DAY.format(u.createdAt),
          isYou: u.id === me.id,
        }))}
      />
    </>
  );
}
