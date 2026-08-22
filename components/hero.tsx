"use client";

import dynamic from "next/dynamic";
import { ArrowDownRight, ArrowUpRight, Cpu, MapPin } from "lucide-react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Component, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { profile } from "@/data/profile";

const AgentCoreCanvas = dynamic(() => import("./agent-core-canvas"), {
  ssr: false,
  loading: () => null,
});

const coreNodes = [
  { name: "Observe", code: "01", className: "core-label--observe" },
  { name: "Reason", code: "02", className: "core-label--reason" },
  { name: "Act", code: "03", className: "core-label--act" },
  { name: "Verify", code: "04", className: "core-label--verify" },
];

const canvasMediaQuery = "(min-width: 621px) and (pointer: fine)";

function subscribeToCanvasCapability(callback: () => void) {
  const media = window.matchMedia(canvasMediaQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getCanvasCapability() {
  return window.matchMedia(canvasMediaQuery).matches;
}

function getServerCanvasCapability() {
  return false;
}

class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    // The semantic/CSS agent core remains visible if WebGL cannot initialize.
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function Hero() {
  const visualRef = useRef<HTMLDivElement>(null);
  const inView = useInView(visualRef, { amount: 0.15 });
  const reduceMotion = useReducedMotion() ?? false;
  const [pageVisible, setPageVisible] = useState(true);
  const allowCanvas = useSyncExternalStore(
    subscribeToCanvasCapability,
    getCanvasCapability,
    getServerCanvasCapability,
  );

  useEffect(() => {
    const update = () => setPageVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__status">
        <span className="live-dot" aria-hidden="true" />
        <span>{profile.availability}</span>
        <span className="hero__location"><MapPin size={13} aria-hidden="true" /> {profile.location}</span>
      </div>

      <div className="hero__layout">
        <motion.div
          className="hero__copy"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow"><span>AI SYSTEMS</span> / DEVELOPER TOOLS / ROBOTICS</p>
          <h1 id="hero-title">
            I build AI systems you can <em>check</em>, not systems you have to trust.
          </h1>
          <p className="hero__intro">{profile.intro}</p>
          <div className="hero__actions">
            <a className="button button--primary" href="#flow">
              Inspect Flow <ArrowDownRight size={18} aria-hidden="true" />
            </a>
            <a className="button button--ghost" href={`mailto:${profile.email}`}>
              Start a conversation <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
          <div className="hero__proof" aria-label="Profile summary">
            <div><strong>UW–Madison</strong><span>Computer Science · May 2028</span></div>
            <div><strong>Summer AI Lab</strong><span>Flow campus assistant</span></div>
            <div><strong>Focus</strong><span>Agents · Retrieval · Robotics</span></div>
          </div>
        </motion.div>

        <motion.div
          ref={visualRef}
          className="hero-core"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduceMotion ? 0 : 1.1, delay: reduceMotion ? 0 : 0.15, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Agent loop: observe, reason, act, and verify"
        >
          <div className="hero-core__frame" aria-hidden="true">
            <span className="corner corner--tl" />
            <span className="corner corner--tr" />
            <span className="corner corner--bl" />
            <span className="corner corner--br" />
          </div>
          <div className="hero-core__canvas" aria-hidden="true">
            {allowCanvas && (
              <CanvasBoundary>
                <AgentCoreCanvas active={inView && pageVisible} reducedMotion={reduceMotion} />
              </CanvasBoundary>
            )}
          </div>
          <div className="hero-core__fallback" aria-hidden="true">
            <div className="fallback-orbit"><Cpu size={34} /></div>
          </div>
          {coreNodes.map((node) => (
            <div className={`core-label ${node.className}`} key={node.name}>
              <span>{node.code}</span>
              <strong>{node.name}</strong>
            </div>
          ))}
          <div className="core-telemetry" aria-hidden="true">
            <span>SYSTEM / FLOW</span>
            <span>STATE <b>READY</b></span>
            <span>PACKS 11</span>
          </div>
          <span className="sr-only">Observe. Reason. Act. Verify.</span>
        </motion.div>
      </div>

      <a className="scroll-cue" href="#flow" aria-label="Scroll to Flow case study">
        <span>Explore the system</span>
        <i aria-hidden="true" />
      </a>
    </section>
  );
}
