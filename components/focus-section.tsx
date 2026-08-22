import { focusAreas } from "@/data/profile";
import { Reveal } from "./reveal";

export function FocusSection() {
  return (
    <section className="focus-section section-shell" aria-labelledby="focus-title">
      <Reveal className="section-index">
        <span>01</span>
        <p>OPERATING FOCUS</p>
      </Reveal>
      <div className="focus-section__layout">
        <Reveal>
          <h2 id="focus-title">Intelligence is only useful when the surrounding system earns trust.</h2>
        </Reveal>
        <div className="focus-list">
          {focusAreas.map((area, index) => (
            <Reveal className="focus-item" delay={index * 0.07} key={area.title}>
              <span>{area.index}</span>
              <div><h3>{area.title}</h3><p>{area.text}</p></div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
