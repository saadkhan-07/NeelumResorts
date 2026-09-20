import { WhatsAppIcon } from "./icons";
import { waGeneral, waLink } from "@/lib/wa";

/** The fixed green bubble, bottom-right on every public page. */
export function WhatsAppFloat({
  whatsapp,
  message = waGeneral,
}: {
  whatsapp: string;
  message?: string;
}) {
  return (
    <a
      className="wa-float"
      href={waLink(whatsapp, message)}
      target="_blank"
      rel="noopener"
      aria-label="Chat on WhatsApp"
    >
      <WhatsAppIcon />
    </a>
  );
}
