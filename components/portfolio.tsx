"use client";

import { useEffect, useState } from "react";
import { AboutSection } from "./about-section";
import { AmbientBackground } from "./ambient-background";
import { CommandPalette } from "./command-palette";
import { ContactSection } from "./contact-section";
import { FlowCaseStudy } from "./flow-case-study";
import { FocusSection } from "./focus-section";
import { Footer } from "./footer";
import { Hero } from "./hero";
import { Navigation } from "./navigation";
import { PrinciplesSection } from "./principles-section";
import { SystemProgress } from "./system-progress";
import { WorkSection } from "./work-section";

export function Portfolio() {
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.matches("input, textarea, select, [contenteditable='true']");
      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        setCommandOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduceMotion) return;

    let frame = 0;
    let x = window.innerWidth * 0.7;
    let y = window.innerHeight * 0.35;
    const paint = () => {
      frame = 0;
      document.documentElement.style.setProperty("--pointer-x", `${x}px`);
      document.documentElement.style.setProperty("--pointer-y", `${y}px`);
    };
    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(paint);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <AmbientBackground />
      <SystemProgress />
      <Navigation onOpenCommand={() => setCommandOpen(true)} />
      <main id="main-content">
        <Hero />
        <FocusSection />
        <FlowCaseStudy />
        <WorkSection />
        <PrinciplesSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
    </>
  );
}
