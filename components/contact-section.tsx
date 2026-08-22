import { ArrowUpRight, Code2, ContactRound, Download, Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { Reveal } from "./reveal";

export function ContactSection() {
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="contact-section__orbit" aria-hidden="true"><i /><i /><i /></div>
      <div className="section-shell contact-section__content">
        <Reveal>
          <p className="eyebrow"><span className="live-dot" /> OPEN CHANNEL</p>
          <h2 id="contact-title">Let’s build something that has to work outside the demo.</h2>
          <p>
            I am looking for Summer 2027 software engineering and AI internships, and for problems where
            being right matters more than being fast to demo.
          </p>
        </Reveal>

        <Reveal className="contact-actions" delay={0.08}>
          <a className="contact-primary" href={`mailto:${profile.email}`}>
            <span><Mail aria-hidden="true" /> Email me</span>
            <strong>{profile.email}</strong>
            <ArrowUpRight aria-hidden="true" />
          </a>
          <div className="contact-links">
            <a href={profile.linkedin} target="_blank" rel="noreferrer"><ContactRound size={18} /> LinkedIn <ArrowUpRight size={15} /></a>
            <a href={profile.github} target="_blank" rel="noreferrer"><Code2 size={18} /> GitHub <ArrowUpRight size={15} /></a>
            <a href={profile.resume} target="_blank" rel="noreferrer"><Download size={18} /> Résumé <ArrowUpRight size={15} /></a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
