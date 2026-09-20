/**
 * Every inline SVG in `design-reference/`, copied path-for-path.
 *
 * The reference repeats the same markup dozens of times; these are the 22 unique
 * shapes. Nothing is loaded from `/public` and no icon library is installed.
 */

type IconProps = { className?: string };

const stroke = (width: string) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: width,
  "aria-hidden": true as const,
});

const solid = { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true as const };

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg {...solid} className={className}>
      <path d="M17.5 14.4c-.3-.2-1.8-.9-2-1s-.5-.1-.7.1-.8 1-.9 1.2-.3.2-.6.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.5-.6.3-.5v-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4A3.5 3.5 0 0 0 5.9 9c0 1.5 1.1 3 1.3 3.2s2.2 3.3 5.3 4.6a17 17 0 0 0 1.8.7 4.2 4.2 0 0 0 2 .1 3.2 3.2 0 0 0 2.1-1.5 2.6 2.6 0 0 0 .2-1.5c-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.3a8.3 8.3 0 0 1-4.2-1.2l-.3-.2-3 .8.8-3-.2-.3A8.3 8.3 0 1 1 12 20.3z" />
    </svg>
  );
}

/** The amenity / highlight tick — the most-used mark in the reference. */
export function CheckIcon() {
  return (
    <svg {...stroke("1.6")}>
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}

export function ArrowIcon() {
  return (
    <svg {...stroke("1.6")}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function GuestsIcon() {
  return (
    <svg {...stroke("1.4")}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

export function BedIcon() {
  return (
    <svg {...stroke("1.4")}>
      <path d="M2 17v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5M2 17h20M2 17v3M22 17v3M6 10V7a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3" />
    </svg>
  );
}

export function SizeIcon() {
  return (
    <svg {...stroke("1.4")}>
      <rect x="3" y="3" width="18" height="18" rx="1" />
      <path d="M8 3v4M3 8h4M16 21v-4M21 16h-4" />
    </svg>
  );
}

export function MountainIcon() {
  return (
    <svg {...stroke("1.4")}>
      <path d="M2 20l6.5-10 4 6 3-4.5L22 20z" />
      <circle cx="17" cy="6" r="2.2" />
    </svg>
  );
}

export function ClockIcon() {
  return (
    <svg {...stroke("1.4")}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.4l3.4 2" />
    </svg>
  );
}

export function LeafIcon() {
  return (
    <svg {...stroke("1.3")}>
      <path d="M20 4C9 4 4 9.5 4 16c0 2 .6 3.4.6 3.4S8 12 20 4z" />
      <path d="M4.6 19.4C8 16 12 13.5 18 12" />
    </svg>
  );
}

export function JeepIcon() {
  return (
    <svg {...stroke("1.3")}>
      <path d="M3 15v-3l2-5h14l2 5v3" />
      <path d="M3 15h18v3h-3v-3M6 18H3v-3" />
      <circle cx="7" cy="15.5" r="1.4" />
      <circle cx="17" cy="15.5" r="1.4" />
    </svg>
  );
}

export function PinIcon() {
  return (
    <svg {...stroke("1.4")}>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

export function PhoneIcon() {
  return (
    <svg {...stroke("1.4")}>
      <path d="M4 4.5h4l1.6 4-2.2 1.6a12 12 0 0 0 6.5 6.5l1.6-2.2 4 1.6v4A1.6 1.6 0 0 1 18 21.5C10.3 21.5 2.5 13.7 2.5 6A1.6 1.6 0 0 1 4 4.5z" />
    </svg>
  );
}

export function FlameIcon() {
  return (
    <svg {...stroke("1.3")}>
      <path d="M12 2s5 4.5 5 9a5 5 0 0 1-10 0c0-1.6.6-3 1.4-4.2C9 8.6 10 10 11 10c0-3 1-6 1-8z" />
      <path d="M8.5 15a3.5 3.5 0 0 0 7 0" />
    </svg>
  );
}

export function TeapotIcon() {
  return (
    <svg {...stroke("1.3")}>
      <path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" />
      <path d="M17 9.5h1.5a2.5 2.5 0 0 1 0 5H17" />
      <path d="M7 2.5c-.8 1.2-.8 2 0 3M11 2.5c-.8 1.2-.8 2 0 3" />
    </svg>
  );
}

export function MoonIcon() {
  return (
    <svg {...stroke("1.3")}>
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />
    </svg>
  );
}

export function SignalIcon() {
  return (
    <svg {...stroke("1.3")}>
      <path d="M2.5 8.5a15 15 0 0 1 19 0M5.5 12a11 11 0 0 1 13 0M8.5 15.5a6.5 6.5 0 0 1 7 0" />
      <circle cx="12" cy="19" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function StarIcon() {
  return (
    <svg {...stroke("1.3")}>
      <path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6L3.4 9.4l6-.8z" />
    </svg>
  );
}

export function DirectionsIcon() {
  return (
    <svg {...stroke("1.4")}>
      <path d="M9 4L3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5z" />
      <path d="M9 4v13M15 6.5v13" />
    </svg>
  );
}

export function InstagramIcon() {
  return (
    <svg {...stroke("1.5")}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon() {
  return (
    <svg {...solid}>
      <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.9.3-1.6 1.6-1.6h1.6V4.2A21 21 0 0 0 14.4 4c-2.4 0-4 1.5-4 4.2v2.6H7.7V14h2.7v8z" />
    </svg>
  );
}

export function TikTokIcon() {
  return (
    <svg {...solid}>
      <path d="M16.5 2h-3v13.2a2.6 2.6 0 1 1-2.1-2.6V9.5a5.9 5.9 0 1 0 5.1 5.8V8.9a6.6 6.6 0 0 0 3.9 1.3V7.1a3.8 3.8 0 0 1-3.9-3.7z" />
    </svg>
  );
}

export function LogoMark() {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1" opacity=".45" />
      <path d="M8 26l6.5-9.5 4 5.5 3.5-5 9.5 9z" fill="#BE9247" />
      <path d="M8 26h23.5" stroke="currentColor" strokeWidth="1.1" opacity=".6" />
      <circle cx="27" cy="12.5" r="2.4" fill="currentColor" opacity=".8" />
    </svg>
  );
}

/** Lets `copy.ts` name an icon with a string. */
export const ICONS = {
  flame: FlameIcon,
  teapot: TeapotIcon,
  leaf: LeafIcon,
  mountain: MountainIcon,
  moon: MoonIcon,
  jeep: JeepIcon,
  signal: SignalIcon,
  star: StarIcon,
  pin: PinIcon,
  clock: ClockIcon,
} as const;

export type IconName = keyof typeof ICONS;
