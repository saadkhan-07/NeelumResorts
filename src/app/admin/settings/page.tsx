import { SettingsForm } from "./SettingsForm";
import { requireAdmin } from "@/lib/admin-auth";
import { getSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await requireAdmin();
  const settings = await getSettings();

  return (
    <>
      <div className="admin-head">
        <h1>Settings</h1>
        <p>Everything here appears on the website as soon as you save.</p>
      </div>
      <SettingsForm settings={settings} />
    </>
  );
}
