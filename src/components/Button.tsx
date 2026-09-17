import Link from "next/link";
import { waLink } from "@/lib/site";

type Variant = "primary" | "dark" | "ghost" | "light" | "wa";

type ButtonProps = {
  children: React.ReactNode;
  variant?: Variant;
  /** The reference's `.btn--sm`. */
  small?: boolean;
  /** Internal route or plain URL. */
  href?: string;
  /** A WhatsApp message — renders a wa.me link and ignores `href`. */
  wa?: string;
  type?: "button" | "submit";
  onClick?: React.MouseEventHandler;
  className?: string;
  "aria-label"?: string;
};

function classes(variant: Variant, small?: boolean, extra?: string) {
  return ["btn", `btn--${variant}`, small ? "btn--sm" : "", extra ?? ""]
    .filter(Boolean)
    .join(" ");
}

export function Button({
  children,
  variant = "primary",
  small,
  href,
  wa,
  type = "button",
  onClick,
  className,
  ...rest
}: ButtonProps) {
  const cn = classes(variant, small, className);

  if (wa) {
    return (
      <a
        className={cn}
        href={waLink(wa)}
        target="_blank"
        rel="noopener"
        onClick={onClick}
        {...rest}
      >
        {children}
      </a>
    );
  }

  if (href) {
    const external = /^(https?:|tel:|mailto:)/.test(href);
    if (external) {
      return (
        <a className={cn} href={href} onClick={onClick} {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link className={cn} href={href} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cn} type={type} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
