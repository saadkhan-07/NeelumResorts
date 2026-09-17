import { Eyebrow } from "./Eyebrow";

type SectionHeadProps = {
  eyebrow?: string;
  title: React.ReactNode;
  /** Optional standfirst paragraph — the reference's `.lede`. */
  lede?: React.ReactNode;
  center?: boolean;
  id?: string;
};

export function SectionHead({
  eyebrow,
  title,
  lede,
  center,
  id,
}: SectionHeadProps) {
  return (
    <div className={center ? "head head--center" : "head"}>
      {eyebrow ? <Eyebrow center={center}>{eyebrow}</Eyebrow> : null}
      <h2 id={id}>{title}</h2>
      {lede ? <p className="lede">{lede}</p> : null}
    </div>
  );
}
