"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import type { Project } from "@/data/profile";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const element = ref.current;
    if (!element || event.pointerType === "touch") return;
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    element.style.setProperty("--card-x", `${x * 100}%`);
    element.style.setProperty("--card-y", `${y * 100}%`);
    element.style.setProperty("--card-rx", `${(0.5 - y) * 2.2}deg`);
    element.style.setProperty("--card-ry", `${(x - 0.5) * 2.2}deg`);
  };

  const reset = () => {
    const element = ref.current;
    if (!element) return;
    element.style.setProperty("--card-rx", "0deg");
    element.style.setProperty("--card-ry", "0deg");
  };

  const content = (
    <>
      <div className="project-card__head">
        <span>0{index + 1} / {project.eyebrow}</span>
        <i className={`status status--${project.status}`}>{project.status}</i>
      </div>
      <div className="project-card__title">
        <h3>{project.title}</h3>
        {project.href?.startsWith("#") ? <ArrowDownRight aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}
      </div>
      <p>{project.summary}</p>
      <small>{project.role}</small>
      <div className="project-card__highlights">
        {project.highlights.map((highlight) => <span key={highlight}>{highlight}</span>)}
      </div>
      <div className="project-card__tech">
        {project.technologies.map((technology) => <span key={technology}>{technology}</span>)}
      </div>
    </>
  );

  return (
    <article
      className={`project-card project-card--${project.slug}`}
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      <div className="project-card__glow" aria-hidden="true" />
      {project.href ? <a href={project.href}>{content}</a> : <div>{content}</div>}
    </article>
  );
}
