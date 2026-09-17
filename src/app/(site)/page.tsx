import { Button } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/SectionHead";
import { WhatsAppIcon } from "@/components/icons";

/**
 * Phase 1 shell only — the real homepage lands in Phase 2. The dark band gives
 * the transparent header something to sit over, exactly as the hero will.
 */
export default function Home() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <p className="crumb">Phase 1</p>
          <h1>Design system and layout shell</h1>
          <p>
            Header, mobile nav, footer and the shared components are in place.
            The homepage sections arrive in Phase 2.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead
            center
            eyebrow="Shell check"
            title="Everything below is the ported stylesheet"
            lede="Scroll and the header turns solid. Narrow the window past 900px and the burger takes over."
          />
          <Reveal>
            <div className="hero__btns" style={{ justifyContent: "center" }}>
              <Button wa="Assalam o Alaikum! I'd like to check availability at Neelum Resort Taobat.">
                <WhatsAppIcon />
                Check availability
              </Button>
              <Button variant="ghost" href="/stays">
                View our stays
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
