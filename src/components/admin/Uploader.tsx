"use client";

import { useRef, useState } from "react";
import { UploadIcon } from "./icons";

/**
 * Direct-to-Cloudinary upload with per-file progress — PROMPT.md § 5.
 *
 * `XMLHttpRequest` rather than `fetch`, because fetch still cannot report upload
 * progress. On a valley connection a 15 MB photo takes minutes, and a button
 * that just sits there looks broken — the owner will tap it again and upload it
 * twice.
 *
 * The file never touches our server: we ask `/api/cloudinary/sign` for a
 * signature, then POST straight to Cloudinary. Afterwards the server action
 * records the row.
 */

export type UploadedFile = {
  publicId: string;
  width: number;
  height: number;
  format: string;
  resourceType: string;
  originalFilename: string;
};

type Job = {
  id: string;
  name: string;
  progress: number;
  status: "uploading" | "done" | "error";
  error?: string;
};

const IMAGE_MAX = 25 * 1024 * 1024;
const VIDEO_MAX = 200 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp,video/mp4,video/quicktime";

export function Uploader({
  folder,
  multiple = false,
  label = "Upload photos",
  accept = ACCEPT,
  onUploaded,
}: {
  folder: string;
  multiple?: boolean;
  label?: string;
  accept?: string;
  /** Called per file as it finishes, so rows appear one at a time. */
  onUploaded: (file: UploadedFile) => void | Promise<void>;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [jobs, setJobs] = useState<Job[]>([]);

  function update(id: string, patch: Partial<Job>) {
    setJobs((list) => list.map((j) => (j.id === id ? { ...j, ...patch } : j)));
  }

  async function uploadOne(file: File) {
    const id = `${file.name}-${Date.now()}-${Math.random()}`;
    const isVideo = file.type.startsWith("video/");

    setJobs((list) => [...list, { id, name: file.name, progress: 0, status: "uploading" }]);

    // Size is checked here, before a single byte goes up — telling someone their
    // 60 MB photo is too big after it has uploaded is the worst possible order.
    const limit = isVideo ? VIDEO_MAX : IMAGE_MAX;
    if (file.size > limit) {
      update(id, {
        status: "error",
        error: `Too large — ${(file.size / 1024 / 1024).toFixed(0)} MB, limit is ${limit / 1024 / 1024} MB`,
      });
      return;
    }

    try {
      const signRes = await fetch("/api/cloudinary/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder, resourceType: isVideo ? "video" : "image" }),
      });
      if (!signRes.ok) throw new Error((await signRes.json()).error ?? "Could not start upload");
      const sign = await signRes.json();

      const body = new FormData();
      body.append("file", file);
      body.append("api_key", sign.apiKey);
      body.append("timestamp", String(sign.timestamp));
      body.append("signature", sign.signature);
      body.append("folder", sign.folder);
      body.append("unique_filename", String(sign.uniqueFilename));
      body.append("overwrite", String(sign.overwrite));

      const result = await new Promise<UploadedFile>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", sign.uploadUrl);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) update(id, { progress: Math.round((e.loaded / e.total) * 100) });
        };
        xhr.onload = () => {
          if (xhr.status < 200 || xhr.status >= 300) {
            return reject(new Error(`Cloudinary refused the file (${xhr.status})`));
          }
          const r = JSON.parse(xhr.responseText);
          resolve({
            publicId: r.public_id,
            width: r.width ?? 0,
            height: r.height ?? 0,
            format: r.format ?? "",
            resourceType: r.resource_type ?? "image",
            originalFilename: file.name,
          });
        };
        xhr.onerror = () => reject(new Error("Upload failed — check the connection"));
        xhr.send(body);
      });

      update(id, { progress: 100, status: "done" });
      await onUploaded(result);

      // Clear finished rows after a moment so the list does not grow forever.
      setTimeout(() => setJobs((list) => list.filter((j) => j.id !== id)), 2500);
    } catch (error) {
      update(id, { status: "error", error: (error as Error).message });
    }
  }

  async function onPick(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (input.current) input.current.value = "";
    // Sequential, not parallel: six photos at once on a weak uplink makes every
    // one of them slow and the progress bars meaningless.
    for (const file of files) await uploadOne(file);
  }

  return (
    <div className="admin-upload">
      <input
        ref={input}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={onPick}
        hidden
        id={`upload-${folder}`}
      />
      <button
        type="button"
        className="admin-btn admin-btn--block"
        onClick={() => input.current?.click()}
      >
        <UploadIcon />
        {label}
      </button>

      {jobs.length > 0 ? (
        <ul className="admin-upload__jobs">
          {jobs.map((job) => (
            <li key={job.id} className={job.status === "error" ? "is-error" : undefined}>
              <span className="admin-upload__name">{job.name}</span>
              {job.status === "error" ? (
                <span className="admin-upload__err">{job.error}</span>
              ) : (
                <span
                  className="admin-upload__bar"
                  role="progressbar"
                  aria-valuenow={job.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Uploading ${job.name}`}
                >
                  <span style={{ width: `${job.progress}%` }} />
                </span>
              )}
              {job.status !== "error" ? (
                <span className="admin-upload__pct">{job.progress}%</span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
