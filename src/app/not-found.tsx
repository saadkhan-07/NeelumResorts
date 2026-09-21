import SiteLayout from "./(site)/layout";
import NotFound from "./(site)/not-found";

export { metadata } from "./(site)/not-found";

/**
 * URLs that match no route at all land here, outside the (site) group — so wrap
 * the same page in the public shell, or a mistyped link shows a bare page with no
 * header, footer or WhatsApp button.
 */
export default function RootNotFound() {
  return (
    <SiteLayout>
      <NotFound />
    </SiteLayout>
  );
}
