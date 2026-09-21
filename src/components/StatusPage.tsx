import Link from "next/link";

/**
 * The shared body of the not-found and error pages: the reference's own
 * `.page-head` band with no photograph (so it sits on --ink, as every page head
 * does before its image loads), then the way back. No new layout.
 */
export function StatusPage({
  crumb,
  title,
  lede,
  children,
}: {
  crumb: string;
  title: string;
  lede: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <p className="crumb">
            <Link href="/">Home</Link>
            &nbsp;/&nbsp; {crumb}
          </p>
          <h1>{title}</h1>
          <p>{lede}</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {children}
          <Link className="btn btn--dark" href="/stays">
            View our stays
          </Link>
          <Link className="btn btn--ghost" href="/tours">
            See the jeep tours
          </Link>
          <Link className="btn btn--ghost" href="/contact">
            Contact us
          </Link>
        </div>
      </section>
    </>
  );
}
