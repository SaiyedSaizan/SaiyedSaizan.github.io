import { ArrowUpRight, BookOpen, GraduationCap } from "lucide-react";
import { experience, profile, skills } from "@/data/profile";
import { Reveal } from "./reveal";

export function AboutSection() {
  return (
    <section className="about-section section-shell" id="about" aria-labelledby="about-title">
      <Reveal className="section-index">
        <span>04</span>
        <p>ABOUT / SIGNAL</p>
      </Reveal>

      <div className="about-lead">
        <Reveal>
          <p className="eyebrow">CURRENT STATE</p>
          <h2 id="about-title">A student, systems builder, and product thinker in the same loop.</h2>
        </Reveal>
        <Reveal className="about-lead__copy" delay={0.08}>
          <p>{profile.about}</p>
          <p>{profile.ambition}</p>
        </Reveal>
      </div>

      <div className="about-grid">
        <Reveal className="education-card">
          <div className="education-card__seal"><GraduationCap aria-hidden="true" /></div>
          <p className="eyebrow">EDUCATION</p>
          <h3>{profile.education.school}</h3>
          <p>{profile.education.degree}</p>
          <span>{profile.education.graduation}</span>
          <div className="education-card__footer"><BookOpen size={16} /> Madison, Wisconsin</div>
        </Reveal>

        <div className="experience-list">
          {experience.map((item, index) => (
            <Reveal className="experience-item" delay={index * 0.06} key={item.title}>
              <span>0{index + 1}</span>
              <div><small>{item.organization}</small><h3>{item.title}</h3><p>{item.text}</p></div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="skills-panel">
        <Reveal className="skills-panel__intro">
          <p className="eyebrow">WORKING TOOLKIT</p>
          <h3>Foundations first. The stack can change.</h3>
          <a href={profile.github} target="_blank" rel="noreferrer">Inspect GitHub <ArrowUpRight size={16} /></a>
        </Reveal>
        <div className="skills-groups">
          {Object.entries(skills).map(([group, items], index) => (
            <Reveal className="skill-group" delay={index * 0.05} key={group}>
              <span>0{index + 1} / {group}</span>
              <div>{items.map((item) => <i key={item}>{item}</i>)}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
