export type EventKind = "context" | "route" | "tool" | "result" | "verify" | "answer";

export interface SimulationEvent {
  id: string;
  kind: EventKind;
  label: string;
  detail: string;
  payload?: string;
  domain?: string;
}

export interface SimulationScenario {
  id: string;
  tab: string;
  title: string;
  prompt: string;
  answer: string;
  events: SimulationEvent[];
}

export const scenarios: SimulationScenario[] = [
  {
    id: "course",
    tab: "Plan a course",
    title: "A lookup the system is willing to leave unresolved",
    prompt: "Can I take CS 400 next semester, and how have people done in it?",
    answer:
      "Flow returns the grade history it can read from the graph and stops short of clearing you for the course, because one requisite clause did not parse. It says which requirement is unresolved instead of resolving it to a yes.",
    events: [
      {
        id: "course-context",
        kind: "context",
        label: "Request split",
        detail: "One eligibility question and one historical-grades question, answered from separate tools.",
        payload: "intents = [eligibility, grade history]",
      },
      {
        id: "course-route",
        kind: "route",
        label: "Sequential route",
        detail: "The model chooses which tools to call. It does not compute the eligibility answer itself.",
        payload: "courses.search → courses.grades → audit.eligibility",
      },
      {
        id: "course-search",
        kind: "tool",
        label: "courses.search",
        detail: "Resolved the course to a node in the typed graph by subject and number.",
        domain: "courses",
        payload: "courses.search { subject: “COMP SCI”, number: 400 }",
      },
      {
        id: "course-grades",
        kind: "tool",
        label: "courses.grades",
        detail: "Read real historical grade distributions for past offerings of that node.",
        domain: "courses",
        payload: "courses.grades { course_id, terms: “all” }",
      },
      {
        id: "course-eligibility",
        kind: "tool",
        label: "audit.eligibility",
        detail: "Pure Python over the student record, with three-valued logic rather than a yes or no.",
        domain: "audit",
        payload: "audit.eligibility { course_id } → unknown (requisite unparsed)",
      },
      {
        id: "course-result",
        kind: "result",
        label: "One answer, one unknown",
        detail: "Grades resolved from stored records. Eligibility returned unknown with the clause that caused it.",
        payload: "grades = ok · eligibility = unknown",
      },
      {
        id: "course-verify",
        kind: "verify",
        label: "Hedge preserved",
        detail: "The unknown is carried into the reply rather than smoothed into a confident yes.",
        payload: "hedge = retained",
      },
    ],
  },
  {
    id: "live",
    tab: "Check what is open",
    title: "Two data sources that decay at completely different rates",
    prompt: "Is the north dining hall still serving, and how busy is College Library right now?",
    answer:
      "Serving periods come from a scheduled feed with a twelve-hour freshness test. Busyness is live, and when that feed is unreachable the answer degrades to live_unavailable instead of quietly serving yesterday's number.",
    events: [
      {
        id: "live-context",
        kind: "context",
        label: "Two cadences identified",
        detail: "Dining hours refresh on a schedule. Occupancy is stale within minutes.",
        payload: "cadence = [scheduled, live]",
      },
      {
        id: "live-route",
        kind: "route",
        label: "Sequential route",
        detail: "Two bounded tool calls, each against its own domain contract.",
        payload: "dining.hours → spaces.busyness",
      },
      {
        id: "live-dining",
        kind: "tool",
        label: "dining.hours",
        detail: "Read serving periods for the hall on today's date.",
        domain: "dining",
        payload: "dining.hours { hall: “north”, date: today }",
      },
      {
        id: "live-busy",
        kind: "tool",
        label: "spaces.busyness",
        detail: "Requested current occupancy from the live campus feed.",
        domain: "spaces",
        payload: "spaces.busyness { building: “college-library” }",
      },
      {
        id: "live-result",
        kind: "result",
        label: "Freshness attached",
        detail: "Each result carries the age of the data it came from, not just the value.",
        payload: "dining age = 2h · busyness age = 40s",
      },
      {
        id: "live-verify",
        kind: "verify",
        label: "Freshness tests run",
        detail: "Dining fails past twelve hours. Building hours are surfaced hedged, as of a date, after eight days.",
        payload: "dining < 12h = pass · live feed reachable = pass",
      },
    ],
  },
  {
    id: "audit",
    tab: "Read a degree audit",
    title: "Extraction with no model in the path, and no document kept",
    prompt: "From my DARS, what requirements do I still have outstanding?",
    answer:
      "The PDF is parsed deterministically with rules and regular expressions, the outstanding requirements are stored, and the document itself is discarded. The model sees the structured result, never the file.",
    events: [
      {
        id: "audit-context",
        kind: "context",
        label: "Upload accepted",
        detail: "A DARS PDF enters the import endpoint, outside the tool surface the model can reach.",
        payload: "source = user upload · path = import endpoint",
      },
      {
        id: "audit-import",
        kind: "tool",
        label: "audit.import",
        detail: "Rules and regular expressions over pdfplumber. There is no model in the extraction path.",
        domain: "audit",
        payload: "audit.import { file } → completed, satisfied, outstanding",
      },
      {
        id: "audit-discard",
        kind: "result",
        label: "Document discarded",
        detail: "The extracted text layer is encrypted under its own key and the upload is thrown away.",
        payload: "raw document = deleted · text layer = separate key",
      },
      {
        id: "audit-remaining",
        kind: "tool",
        label: "audit.remaining",
        detail: "The model asks for the stored structured result, not for the file it came from.",
        domain: "audit",
        payload: "audit.remaining { student } → outstanding[]",
      },
      {
        id: "audit-stale",
        kind: "verify",
        label: "Staleness checked",
        detail: "Past 180 days the answer prompts for a fresh upload, because an old audit is a confidently wrong answer waiting to happen.",
        payload: "age < 180d = pass",
      },
    ],
  },
];

export function clampEventIndex(index: number, eventCount: number) {
  if (eventCount <= 0) return 0;
  return Math.min(Math.max(index, 0), eventCount);
}
