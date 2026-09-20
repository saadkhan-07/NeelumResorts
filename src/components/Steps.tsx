import { TOUR_STEPS } from "@/lib/copy";

/** The three-step strip — PROMPT.md § 5c. */
export function Steps() {
  return (
    <div className="steps">
      {TOUR_STEPS.map((step) => (
        <div className="step" key={step.n}>
          <b>{step.n}</b>
          <h4>{step.title}</h4>
          <p>{step.body}</p>
        </div>
      ))}
    </div>
  );
}
