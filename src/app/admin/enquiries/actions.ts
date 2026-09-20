"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin, type ActionState } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

const statusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["NEW", "REPLIED", "CLOSED"]),
});

export async function setEnquiryStatus(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = statusSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });
  if (!parsed.success) return { error: "That status is not one we recognise." };

  try {
    await prisma.enquiry.update({
      where: { id: parsed.data.id },
      data: { status: parsed.data.status },
    });
  } catch {
    return { error: "Could not save — the enquiry may have been deleted." };
  }

  // Enquiries are admin-only, so no public route needs purging.
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
  revalidatePath(`/admin/enquiries/${parsed.data.id}`);

  const said = { NEW: "Marked as new", REPLIED: "Marked as replied", CLOSED: "Closed" };
  return { ok: true, message: said[parsed.data.status] };
}

export async function deleteEnquiry(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Nothing to delete." };

  try {
    await prisma.enquiry.delete({ where: { id } });
  } catch {
    return { error: "Could not delete — it may already be gone." };
  }

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
  return { ok: true, message: "Enquiry deleted" };
}
