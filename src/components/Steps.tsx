import { TOUR_STEPS } from "@/lib/copy";

/**
 * The three-step strip — PROMPT.md § 5c.
 *
 * `level` keeps the outline valid wherever it sits: under the homepage's
 * "Jeep tours" h2 the steps are h3; on /tours they come straight after the h1, so
 * they are h2. The stylesheet styles both the same.
 */
export function Steps({ level = 3 }: { level?: 2 | 3 }) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <div className="steps">
      {TOUR_STEPS.map((step) => (
        <div className="step" key={step.n}>
          <b>{step.n}</b>
          <Heading>{step.title}</Heading>
          <p>{step.body}</p>
        </div>
      ))}
    </div>
  );
}
