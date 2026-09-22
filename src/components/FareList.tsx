import { formatFare } from "@/lib/fares";
import type { TourWithFares } from "@/lib/queries";

/**
 * A tour's published fares — PROMPT.md § 5c.
 *
 * `getTours()` has already applied the `showPrice` master switch, so an empty
 * `fares` array here means "quote on WhatsApp" whether that is because the owner
 * switched fares off or because this route has never had a published one. Both
 * render the same deliberate line, never an empty space.
 *
 * Two rules the markup enforces:
 *
 * - **Per jeep, never per person.** Jeep hire is quoted per vehicle; showing a
 *   per-jeep figure as per-person makes the resort look absurd.
 * - **A range always carries its reason.** A bare "14,000–16,000" reads as "we
 *   charge what we think you'll pay"; with the note beside it, it reads as honesty.
 */


/** Collects the distinct reasons on a tour's fares, so a range never stands alone. */
function notesOf(fares: TourWithFares["fares"]) {
  return [...new Set(fares.map((f) => f.note).filter((n): n is string => Boolean(n)))];
}

/**
 * Card variant — up to two fares, then "+n more pick-up points".
 * Sits inside `.room__foot--stack` on a tour card.
 */
export function FareListCard({ tour }: { tour: TourWithFares }) {
  if (tour.fares.length === 0) {
    return (
      <div className="tour__wa">
        Fare agreed on WhatsApp
        <br />
        Pick-up from anywhere in the valley
      </div>
    );
  }

  const shown = tour.fares.slice(0, 2);
  const extra = tour.fares.length - shown.length;
  const notes = notesOf(shown);

  return (
    <div className="tour__fares">
      {shown.map((fare) => (
        <span key={fare.id}>
          <i>{fare.pickupName}</i>
          <b>{formatFare(fare.priceMin, fare.priceMax)}</b>
        </span>
      ))}
      <small>
        Per jeep, up to 6
        {notes.length > 0 ? ` · ${notes.join(" · ")}` : null}
        {extra > 0 ? ` · +${extra} more pick-up point${extra > 1 ? "s" : ""}` : null}
      </small>
    </div>
  );
}

/**
 * Detail variant — the full table, then the reason, the "last updated" line and
 * the invitation to ask from anywhere else.
 */
export function FareListDetail({
  tour,
  ratesUpdated,
}: {
  tour: TourWithFares;
  ratesUpdated: string;
}) {
  if (tour.fares.length === 0) {
    return (
      <p className="rates-note" style={{ fontSize: ".92rem", opacity: 1, marginTop: "18px" }}>
        The fare depends on where we pick you up, so we quote this one directly. Tell us
        your starting point and date and we&apos;ll come back the same day.
      </p>
    );
  }

  const notes = notesOf(tour.fares);

  return (
    <>
      <div className="fare-panel">
        <p className="fare-panel__title">Jeep fares</p>
        <table className="fare-table">
          <thead>
            <tr>
              <th>Pick-up from</th>
              <th style={{ textAlign: "right" }}>Per jeep, up to 6</th>
            </tr>
          </thead>
          <tbody>
            {tour.fares.map((fare) => (
              <tr key={fare.id}>
                <td>{fare.pickupName}</td>
                <td>{formatFare(fare.priceMin, fare.priceMax)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="rates-note">
        {notes.join(" · ")}
        {notes.length > 0 && ratesUpdated ? " · " : null}
        {ratesUpdated ? `Fares last updated ${ratesUpdated}.` : null}
        <br />
        Starting somewhere else? Tell us where you are and we&apos;ll quote you.
      </p>
    </>
  );
}
