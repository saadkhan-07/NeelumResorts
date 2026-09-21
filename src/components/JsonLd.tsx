/**
 * Structured data for Google. Server-rendered into the HTML, no JavaScript.
 *
 * `<` is escaped so a value containing "</script>" — an owner typing it into a
 * tour description, say — can never close the tag early and inject markup.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }}
    />
  );
}
