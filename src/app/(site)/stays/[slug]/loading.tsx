/**
 * Shown only while a room page that is not in the static cache yet renders for
 * the first time (a room the owner has just added).
 *
 * Scoped to the [slug] routes on purpose. At the top of (site) it wrapped every
 * page in a Suspense boundary: the prerendered HTML painted this fallback first,
 * with the footer right under it, and the real page then pushed the footer down —
 * a 0.44 layout shift on the homepage. Full-viewport height keeps everything below
 * it off screen, so the swap moves nothing the guest can see.
 */
export default function Loading() {
  return (
    <section className="page-head" aria-busy="true" style={{ minHeight: "100svh" }}>
      <div className="wrap">
        <p className="visually-hidden" role="status">
          Loading…
        </p>
      </div>
    </section>
  );
}
