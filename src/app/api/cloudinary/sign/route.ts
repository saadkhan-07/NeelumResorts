import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";

/**
 * Returns a signed upload payload so the browser can upload STRAIGHT to
 * Cloudinary — PROMPT.md § 5.
 *
 * Why the file never passes through this server: a 200 MB video would time out
 * a serverless function and, on Render, would tie up a request worker for
 * minutes while the owner's phone trickles it up on valley signal.
 *
 * `CLOUDINARY_API_SECRET` is read here and never leaves: what goes back is a
 * timestamp and a hex signature over the exact parameters the upload is allowed
 * to use. A caller cannot widen the folder or change the preset without
 * invalidating the signature.
 */

const ALLOWED_FOLDERS = [
  "neelum/rooms",
  "neelum/tours",
  "neelum/gallery",
  "neelum/brand",
  "neelum/hero",
  "neelum/misc",
] as const;

const schema = z.object({
  folder: z.enum(ALLOWED_FOLDERS),
  resourceType: z.enum(["image", "video"]).default("image"),
});

export async function POST(request: Request) {
  // Uploading is an admin action. Phase 5 protects the /admin pages; this is an
  // API route, so it checks the session itself rather than trusting middleware.
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

  if (!apiKey || !apiSecret || !cloudName) {
    return NextResponse.json(
      { error: "Cloudinary is not configured on the server" },
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Bad upload request" }, { status: 400 });
  }

  const { folder, resourceType } = parsed.data;
  const timestamp = Math.round(Date.now() / 1000);

  // Cloudinary signs the parameters sorted by key, joined as k=v&k=v, with the
  // API secret appended. Every parameter the browser sends must appear here or
  // the upload is rejected.
  const params: Record<string, string | number | boolean> = {
    folder,
    timestamp,
    unique_filename: true,
    overwrite: false,
  };

  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  const signature = createHash("sha1").update(toSign + apiSecret).digest("hex");

  return NextResponse.json({
    cloudName,
    apiKey,
    timestamp,
    signature,
    folder,
    resourceType,
    uniqueFilename: true,
    overwrite: false,
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    // Client-side limits, sent with the payload so there is one source of truth.
    accept: "image/jpeg,image/png,image/webp,video/mp4,video/quicktime",
    maxImageBytes: 25 * 1024 * 1024,
    maxVideoBytes: 200 * 1024 * 1024,
  });
}
