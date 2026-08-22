import { principles } from "@/data/profile";
import { Reveal } from "./reveal";

export function PrinciplesSection() {
  return (
    <section className="principles-section" aria-labelledby="principles-title">
      <div className="principles-section__signal" aria-hidden="true">
        <span>TRUSTWORTHY AUTONOMY</span><span>TRUSTWORTHY AUTONOMY</span><span>TRUSTWORTHY AUTONOMY</span>
      </div>
      <div className="section-shell">
        <Reveal className="section-index">
          <span>03</span>
          <p>ENGINEERING PRINCIPLES</p>
        </Reveal>
        <Reveal className="principles-heading">
          <p className="eyebrow">THE STANDARD</p>
          <h2 id="principles-title">Autonomy should feel capable. Its boundaries should feel obvious.</h2>
        </Reveal>
        <div className="principles-grid">
          {principles.map((principle, index) => (
            <Reveal className="principle-card" delay={index * 0.08} key={principle.number}>
              <div className="principle-card__top"><span>{principle.number}</span><i>{principle.signal}</i></div>
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
              <div className="principle-card__line" aria-hidden="true"><span /></div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
