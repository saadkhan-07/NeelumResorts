import { WhatsAppIcon } from "./icons";
import { WA_ENQUIRY, waLink } from "@/lib/site";

/** The fixed green bubble, bottom-right on every public page. */
export function WhatsAppFloat({ message = WA_ENQUIRY }: { message?: string }) {
  return (
    <a
      className="wa-float"
      href={waLink(message)}
      target="_blank"
      rel="noopener"
      aria-label="Chat on WhatsApp"
    >
      <WhatsAppIcon />
    </a>
  );
}
