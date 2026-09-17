type EyebrowProps = {
  children: React.ReactNode;
  /** Centres the rule and text — the reference's `.eyebrow--center`. */
  center?: boolean;
};

export function Eyebrow({ children, center }: EyebrowProps) {
  return (
    <p className={center ? "eyebrow eyebrow--center" : "eyebrow"}>{children}</p>
  );
}
