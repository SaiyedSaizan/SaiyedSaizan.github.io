"use client";

import { Braces, CheckCircle2, Database, MessageSquareText, Route, Wrench } from "lucide-react";
import { useLayoutEffect, useRef } from "react";

const architecture = [
  { label: "Prompt", detail: "Web app or CLI request", icon: MessageSquareText },
  { label: "Tool router", detail: "Model picks the lookup", icon: Route },
  { label: "Tool contract", detail: "58 tools, 11 packs", icon: Braces },
  { label: "Domain service", detail: "Three-valued logic", icon: Wrench },
  { label: "Knowledge graph", detail: "Exact SQL, 25 predicates", icon: Database },
  { label: "Grounded answer", detail: "Written from records", icon: CheckCircle2 },
] as const;

export function FlowArchitecture() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    if (!section || !sticky) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 901px)").matches;
    if (reduced || !desktop) return;

    let cleanup = () => {};

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      gsap.registerPlugin(ScrollTrigger);

      const context = gsap.context(() => {
        gsap.set(".architecture-node", { opacity: 0.22, y: 20 });
        gsap.set(".architecture-link__signal", { scaleX: 0, transformOrigin: "left center" });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.55,
          },
        });

        architecture.forEach((_, index) => {
          timeline.to(
            `.architecture-node[data-index="${index}"]`,
            { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" },
          );
          if (index < architecture.length - 1) {
            timeline.to(
              `.architecture-link[data-index="${index}"] .architecture-link__signal`,
              { scaleX: 1, duration: 0.35, ease: "none" },
              "-=0.2",
            );
          }
        });
      }, sticky);

      cleanup = () => context.revert();
    })();

    return () => cleanup();
  }, []);

  return (
    <section className="architecture-story" ref={sectionRef} aria-labelledby="architecture-title">
      <div className="architecture-sticky" ref={stickyRef}>
        <div className="architecture-head">
          <p className="eyebrow">SYSTEM / ARCHITECTURE</p>
          <div>
            <h3 id="architecture-title">Keep intelligence flexible. Keep execution explicit.</h3>
            <p>
              Flow separates what the model chooses from what the system returns. Typed tool contracts
              read a structured graph, so an answer can point at a record rather than a similarity score.
            </p>
          </div>
        </div>

        <div className="architecture-map" role="img" aria-label="Flow request architecture from prompt to grounded answer">
          {architecture.map((item, index) => {
            const Icon = item.icon;
            return (
              <div className="architecture-pair" key={item.label}>
                <div className="architecture-node" data-index={index}>
                  <span className="architecture-node__index">0{index + 1}</span>
                  <Icon aria-hidden="true" />
                  <strong>{item.label}</strong>
                  <small>{item.detail}</small>
                </div>
                {index < architecture.length - 1 && (
                  <div className="architecture-link" data-index={index} aria-hidden="true">
                    <span className="architecture-link__base" />
                    <span className="architecture-link__signal" />
                    <i>›</i>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="architecture-model-note">
          <span className="live-dot" aria-hidden="true" />
          <div><strong>Deployment</strong><small>Hardened service behind a TLS edge, with scheduled data jobs</small></div>
          <code>GOLDEN_EVAL / REGRESSION GATE</code>
        </div>
      </div>
    </section>
  );
}
