/**
 * The resort's contact numbers as configured in the environment.
 *
 * The live values are `Setting` rows the owner edits at /admin/settings. These are
 * only the starting point: `prisma/seed.ts` writes them into a fresh database, and
 * `getSettings()` falls back to them if the rows are missing or the database is
 * unreachable. Nothing else reads them, and no number is written into the code.
 *
 * Server-only on purpose (no NEXT_PUBLIC_ prefix): pages receive the number from
 * `getSettings()` like every other setting.
 */

export type ContactEnv = {
  whatsapp: string;
  phone: string;
  phoneDisplay: string;
};

export function contactFromEnv(env: NodeJS.ProcessEnv = process.env): ContactEnv {
  // wa.me takes digits only, so strip the +, spaces and dashes a person will type.
  const whatsapp = (env.RESORT_WHATSAPP ?? "").replace(/\D/g, "");
  const phone = (env.RESORT_PHONE ?? "").trim() || (whatsapp ? `+${whatsapp}` : "");
  const phoneDisplay = (env.RESORT_PHONE_DISPLAY ?? "").trim() || phone;

  if (whatsapp && (whatsapp.length < 10 || whatsapp.length > 15)) {
    throw new Error(
      "RESORT_WHATSAPP must be 10–15 digits, country code first (e.g. 92 then the mobile number).",
    );
  }

  return { whatsapp, phone, phoneDisplay };
}
