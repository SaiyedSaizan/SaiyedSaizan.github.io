import { describe, expect, it } from "vitest";
import { clampEventIndex, scenarios } from "@/data/scenarios";

describe("Flow simulation data", () => {
  it("keeps event indexes inside the scenario boundary", () => {
    expect(clampEventIndex(-4, 6)).toBe(0);
    expect(clampEventIndex(3, 6)).toBe(3);
    expect(clampEventIndex(9, 6)).toBe(6);
    expect(clampEventIndex(4, 0)).toBe(0);
  });

  it("gives every scenario a complete deterministic trace", () => {
    expect(scenarios).toHaveLength(3);
    for (const scenario of scenarios) {
      expect(scenario.prompt.length).toBeGreaterThan(20);
      expect(scenario.events.length).toBeGreaterThanOrEqual(5);
      expect(scenario.events.at(-1)?.kind).toBe("verify");
      expect(new Set(scenario.events.map((event) => event.id)).size).toBe(scenario.events.length);
    }
  });

  it("only demonstrates command names implemented by Flow", () => {
    const commands = new Set([
      "courses.search",
      "courses.grades",
      "audit.eligibility",
      "dining.hours",
      "spaces.busyness",
      "audit.import",
      "audit.remaining",
    ]);
    const demonstrated = scenarios.flatMap((scenario) =>
      scenario.events.filter((event) => event.kind === "tool").map((event) => event.label),
    );
    expect(demonstrated.every((command) => commands.has(command))).toBe(true);
  });
});
