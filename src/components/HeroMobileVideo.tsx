"use client";

import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { heroVideoUrl, posterUrl } from "@/lib/cloudinary";

const MOBILE = "(max-width: 900px)";
/** A 1x1 transparent GIF: the desktop <source> points here so desktops never fetch the poster. */
const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

/**
 * The phone hero: a muted 9:16 loop in place of the photo slider, which the
 * stylesheet hides at ≤900px. Desktop keeps the slider and downloads neither.
 *
 * The poster is a plain <img> rendered on the server, so it paints before any
 * script runs and is the phone's LCP element. The <video> is only mounted after
 * hydration, on a phone, and never under reduced motion or Save-Data — and it
 * sits on top of the poster rather than replacing it, so a video that fails to
 * load or is refused autoplay leaves the photograph showing, not a black box.
 */
export function HeroMobileVideo({ publicId = "herovid" }: { publicId?: string }) {
  const poster = posterUrl(publicId, 720);
  const [play, setPlay] = useState(false);
  const video = useRef<HTMLVideoElement>(null);

  preload(poster, { as: "image", media: MOBILE, fetchPriority: "high" });

  useEffect(() => {
    const mq = window.matchMedia(MOBILE);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection?.saveData;
    if (reduced || saveData) return;
    const update = () => setPlay(mq.matches);
    // The MP4 is ten times the poster. Starting it only after `load` keeps it
    // off the critical path — the poster, fonts and CSS get the bandwidth first.
    const start = () => {
      update();
      mq.addEventListener("change", update);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      mq.removeEventListener("change", update);
    };
  }, []);

  // React does not always put `muted` on the element before the browser decides
  // whether it may autoplay, and iOS refuses sound-capable autoplay. Set it by
  // hand and ask once; a refusal just leaves the poster frame in place.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, [play]);

  return (
    <div className="hero__video" aria-hidden="true">
      <picture>
        <source media="(min-width: 901px)" srcSet={BLANK} />
        <img src={poster} alt="" width={720} height={1280} fetchPriority="high" />
      </picture>
      {play ? (
        <video
          ref={video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          aria-hidden="true"
          onError={() => setPlay(false)}
        >
          <source
            src={heroVideoUrl(publicId)}
            type="video/mp4"
            onError={() => setPlay(false)}
          />
        </video>
      ) : null}
    </div>
  );
}
