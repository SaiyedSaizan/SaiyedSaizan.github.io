export type ProjectStatus = "active" | "exploring" | "shipped";

export interface Project {
  slug: string;
  title: string;
  eyebrow: string;
  status: ProjectStatus;
  summary: string;
  role: string;
  technologies: string[];
  highlights: string[];
  href?: string;
}

export const profile = {
  name: "Saiyed Saizan Shahnawaz",
  shortName: "Saiyed Saizan",
  location: "Madison, Wisconsin",
  email: "shahnawaz@wisc.edu",
  github: "https://github.com/SaiyedSaizan",
  linkedin: "https://www.linkedin.com/in/saiyed-saizan-shahnawaz",
  resume: "/Saiyed-Saizan-Shahnawaz-Resume.pdf",
  availability: "Looking for Summer 2027 software engineering and AI internships",
  education: {
    school: "University of Wisconsin–Madison",
    degree: "B.S. Computer Science",
    graduation: "Expected May 2028",
  },
  intro:
    "Computer Science student at UW–Madison. I build AI systems, developer tools, and robotics software, and I care most about the parts that hold up when the model is wrong.",
  about:
    "The thread through most of my work is systems you can check, not trust. A policy layer that decides outside the model. Retrieval that returns real records instead of a similarity score. A tutor that re-verifies its own citations before showing them. Where a system cannot know something, I would rather it say so than guess well.",
  ambition:
    "Long term, I want to build AI products that are dependable enough to be boring, and eventually a company working on trustworthy autonomous systems.",
} as const;

export const focusAreas = [
  {
    index: "01",
    title: "Governed agents",
    text: "Models that can call tools need enforcement in code, not a prompt asking them nicely. Deterministic policy, and a record that survives the runtime that wrote it.",
  },
  {
    index: "02",
    title: "Grounded retrieval",
    text: "Exact queries over typed, structured data, so an answer can cite a real record and admit when there is nothing to cite.",
  },
  {
    index: "03",
    title: "Physical AI",
    text: "Hardware bring-up, calibration, and simulation for robot learning, where the failure modes are quiet and the debugging is unglamorous.",
  },
] as const;

export const principles = [
  {
    number: "01",
    title: "Decide outside the model",
    text: "Tools expose narrow contracts. The model chooses what to request; deterministic code decides what is allowed to run.",
    signal: "CONTROL",
  },
  {
    number: "02",
    title: "Make the record checkable",
    text: "A log is worth something only if a stranger can re-derive it without trusting the process that produced it, or the person with write access.",
    signal: "EVIDENCE",
  },
  {
    number: "03",
    title: "Prefer unknown to wrong",
    text: "Unparsed requisites, stale feeds, and partially watched material resolve to unknown. An assistant that guesses about your degree is worse than one that admits it does not know.",
    signal: "CLARITY",
  },
] as const;

export const projects: Project[] = [
  {
    slug: "agent-governance",
    title: "Agent Governance Runtime",
    eyebrow: "Policy and audit layer",
    status: "active",
    summary:
      "Evaluates every agent tool call against deterministic policy before it runs, and appends the decision to a hash-linked log an offline verifier can re-derive without trusting the runtime.",
    role: "Systems design · policy engine · audit chain",
    technologies: ["TypeScript", "Hono", "SQLite", "Node.js", "Vitest"],
    highlights: [
      "217 tests",
      "15 forgery tests",
      "7 acyclic modules",
      "0 LLM or network imports",
    ],
    href: "/projects/agent-governance-runtime.html",
  },
  {
    slug: "flow",
    title: "Flow",
    eyebrow: "Campus assistant · Summer AI Lab",
    status: "shipped",
    summary:
      "A campus assistant where the model chooses what to look up but never decides the answer. Retrieval is exact SQL over a typed knowledge graph, with no vector database anywhere in it.",
    role: "Summer research intern · tool layer and degree-audit parser",
    technologies: ["Python", "FastAPI", "Postgres", "Firestore", "pdfplumber"],
    highlights: [
      "58 tools, 11 packs",
      "0 vector databases",
      "5,800+ course listings",
      "1,100+ student orgs",
    ],
    href: "/projects/flow.html",
  },
  {
    slug: "ai-watch",
    title: "AI Watch: Watch-Aware Tutor",
    eyebrow: "Chrome extension",
    status: "active",
    summary:
      "Tutors on the video you are watching and cites only the parts you have actually reached. The hard problem turned out to be identity across await boundaries, not prompting.",
    role: "Concurrency · state machine · trust boundaries",
    technologies: ["TypeScript", "Chrome MV3", "Express", "Vitest"],
    highlights: [
      "149 tests, 11 eval cases",
      "5 await boundaries guarded",
      "4 trust boundaries",
      "3 caption formats parsed",
    ],
    href: "/projects/ai-watch.html",
  },
  {
    slug: "physical-ai",
    title: "Physical AI Robot Learning",
    eyebrow: "Hardware and simulation",
    status: "active",
    summary:
      "Bring-up for a robot-learning bench: SO-101 leader and follower arms, an Orbbec depth camera, and Isaac Sim running in Docker on a remote GPU machine with no local display.",
    role: "Assembly · calibration · containerized simulation",
    technologies: ["Python", "LeRobot", "Isaac Sim", "Orbbec SDK", "Docker"],
    highlights: [
      "SO-101 leader and follower",
      "Orbbec Astra 2 Pro RGB-D",
      "Isaac Sim 6.0.1 on DGX Spark",
      "Domain randomization configured",
    ],
    href: "/projects/physical-ai.html",
  },
];

export const experience = [
  {
    title: "Summer Research Intern",
    organization: "UW–Madison Summer AI Lab",
    text: "Built the tool-calling layer and the deterministic degree-audit parser for Flow on a team of three, and shipped it as a hardened service behind a TLS edge with scheduled data jobs and a regression gate.",
  },
  {
    title: "Robot Delivery Coordinator",
    organization: "Autonomous delivery operations",
    text: "Monitored live customer orders, coordinated dispatch and routing, and resolved delivery issues in real time. An operational view of autonomy meeting the physical world.",
  },
  {
    title: "Digital Marketing & Business Development Associate",
    organization: "Settelo Realty Private Limited",
    text: "Supported digital campaigns, lead generation, market analysis, and cross-functional execution while learning how products earn attention and trust.",
  },
  {
    title: "Co-Founder",
    organization: "Badger Cricket Club",
    text: "Helped form a student community and organize practices and matches at UW–Madison.",
  },
] as const;

export const skills = {
  languages: ["TypeScript", "Python", "Java", "C", "SQL"],
  systems: [
    "Agent tool layers",
    "Policy and audit design",
    "Typed knowledge graphs",
    "Concurrency and locking",
    "REST APIs",
  ],
  tools: ["Git", "Docker", "Postgres", "SQLite", "FastAPI", "Hono", "Vitest", "pytest"],
} as const;
