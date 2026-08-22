import { projects } from "@/data/profile";
import { ProjectCard } from "./project-card";
import { Reveal } from "./reveal";

export function WorkSection() {
  return (
    <section className="work-section section-shell" id="work" aria-labelledby="work-title">
      <Reveal className="section-index">
        <span>02</span>
        <p>WORK / TRAJECTORY</p>
      </Reveal>
      <div className="section-heading section-heading--split">
        <Reveal><h2 id="work-title">Four systems, and the parts of each I would not claim.</h2></Reveal>
        <Reveal delay={0.08}>
          <p>
            A governance layer, a campus assistant built on a research team, a browser extension, and a
            robotics bench. Each one has a limitation I will name before you find it: no policy engine
            replaces review, general chat has no automated answer verifier, the extension has never been
            tested in a real browser, and no robot policy was trained to convergence.
          </p>
        </Reveal>
      </div>
      <div className="project-grid">
        {projects.map((project, index) => <ProjectCard project={project} index={index} key={project.slug} />)}
      </div>
    </section>
  );
}
