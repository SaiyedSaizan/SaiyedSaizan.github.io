import { ArrowDownRight, Boxes, Braces, Database, GraduationCap } from "lucide-react";
import { FlowArchitecture } from "./flow-architecture";
import { FlowLab } from "./flow-lab";
import { Reveal } from "./reveal";

const metrics = [
  { value: "11", label: "tool packs", note: "orgs to dining to library", icon: Boxes },
  { value: "58", label: "typed tools", note: "one contract per lookup", icon: Braces },
  { value: "5,800+", label: "course listings", note: "with historical grades", icon: GraduationCap },
  { value: "0", label: "vector databases", note: "retrieval is exact SQL", icon: Database },
] as const;

export function FlowCaseStudy() {
  return (
    <section className="flow-section" id="flow" aria-labelledby="flow-title">
      <div className="section-shell flow-intro">
        <Reveal className="flow-intro__meta">
          <p className="eyebrow">FEATURED SYSTEM / SUMMER AI LAB</p>
          <span className="flow-version">FLOW · WEB APP AND CLI · UW–MADISON</span>
        </Reveal>
        <div className="flow-intro__layout">
          <Reveal>
            <h2 id="flow-title">Flow lets the model choose the lookup. It never lets the model decide the answer.</h2>
          </Reveal>
          <Reveal className="flow-intro__copy" delay={0.08}>
            <p>
              A UW–Madison assistant for student organizations, events, the course catalog with real
              historical grade distributions, dining menus, building hours, and live library and gym
              busyness. The model narrates. The tools read from a typed Postgres property graph, live
              feeds, and per-user documents, and when a lookup returns nothing the instruction is to
              say so rather than fill the gap.
            </p>
            <a href="#flow-lab">Run the system trace <ArrowDownRight size={17} aria-hidden="true" /></a>
          </Reveal>
        </div>

        <div className="metrics-grid" aria-label="Flow project metrics">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Reveal className="metric" delay={index * 0.06} key={metric.label}>
                <div className="metric__top"><Icon size={18} aria-hidden="true" /><span>0{index + 1}</span></div>
                <strong>{metric.value}</strong>
                <p>{metric.label}</p>
                <small>{metric.note}</small>
              </Reveal>
            );
          })}
        </div>
        <p className="metrics-note">Every figure here comes from Flow’s own engineering audit: tool and pack counts from the registry, catalog and organization counts from the loaded graph.</p>
      </div>

      <FlowArchitecture />

      <div className="section-shell">
        <FlowLab />
      </div>
    </section>
  );
}
