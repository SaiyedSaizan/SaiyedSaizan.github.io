"use client";

import {
  Check,
  ChevronRight,
  CirclePause,
  CirclePlay,
  RotateCcw,
  StepForward,
  TerminalSquare,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { clampEventIndex, scenarios } from "@/data/scenarios";

const kindLabel = {
  context: "CTX",
  route: "RTE",
  tool: "CALL",
  result: "DATA",
  verify: "PASS",
  answer: "OUT",
} as const;

export function FlowLab() {
  const reduceMotion = useReducedMotion() ?? false;
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const scenario = useMemo(
    () => scenarios.find((item) => item.id === scenarioId) ?? scenarios[0],
    [scenarioId],
  );
  const complete = step >= scenario.events.length;
  const isPlaying = playing && !complete;

  useEffect(() => {
    if (!isPlaying || reduceMotion) return;
    const timer = window.setTimeout(() => {
      setStep((value) => clampEventIndex(value + 1, scenario.events.length));
    }, 820);
    return () => window.clearTimeout(timer);
  }, [isPlaying, reduceMotion, step, scenario.events.length]);

  const selectScenario = (id: string) => {
    setScenarioId(id);
    setStep(0);
    setPlaying(false);
  };

  const onTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % scenarios.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + scenarios.length) % scenarios.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = scenarios.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    const next = scenarios[nextIndex];
    selectScenario(next.id);
    window.requestAnimationFrame(() => document.getElementById(`scenario-tab-${next.id}`)?.focus());
  };

  const replay = () => {
    setStep(0);
    setPlaying(!reduceMotion);
  };

  return (
    <section className="flow-lab" id="flow-lab" aria-labelledby="lab-title">
      <div className="flow-lab__header">
        <div>
          <p className="eyebrow">INTERACTIVE / TOOL TRACE</p>
          <h3 id="lab-title">Follow one request through the tool boundary.</h3>
        </div>
        <div className="demo-badge"><span /> Deterministic walkthrough, not a live session</div>
      </div>

      <div className="scenario-tabs" role="tablist" aria-label="Flow simulation scenarios">
        {scenarios.map((item, index) => (
          <button
            key={item.id}
            id={`scenario-tab-${item.id}`}
            type="button"
            role="tab"
            aria-selected={scenario.id === item.id}
            aria-controls="scenario-panel"
            tabIndex={scenario.id === item.id ? 0 : -1}
            className={scenario.id === item.id ? "is-active" : ""}
            onClick={() => selectScenario(item.id)}
            onKeyDown={(event) => onTabKeyDown(event, index)}
          >
            <span>0{index + 1}</span>{item.tab}
          </button>
        ))}
      </div>

      <div
        className="simulator"
        id="scenario-panel"
        role="tabpanel"
        aria-labelledby={`scenario-tab-${scenario.id}`}
      >
        <div className="simulator__topbar">
          <div className="window-dots" aria-hidden="true"><i /><i /><i /></div>
          <span>flow / trace_{scenario.id}.jsonl</span>
          <span className="simulator__secure"><Check size={12} /> typed envelopes</span>
        </div>

        <div className="simulator__body">
          <div className="simulator__request">
            <div className="terminal-prompt"><TerminalSquare size={16} aria-hidden="true" /> USER_REQUEST</div>
            <blockquote>“{scenario.prompt}”</blockquote>
            <p>{scenario.title}</p>
          </div>

          <div className="trace" aria-live="polite">
            <div className="trace__rail" aria-hidden="true"><span style={{ height: `${Math.min(100, (step / scenario.events.length) * 100)}%` }} /></div>
            {scenario.events.map((event, index) => {
              const visible = index < step;
              return (
                <AnimatePresence key={event.id} initial={false}>
                  {visible && (
                    <motion.div
                      className={`trace-event trace-event--${event.kind}`}
                      initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="trace-event__kind">{kindLabel[event.kind]}</span>
                      <div>
                        <div className="trace-event__title">
                          <strong>{event.label}</strong>
                          {event.domain && <small>{event.domain}</small>}
                        </div>
                        <p>{event.detail}</p>
                        {event.payload && <code>{event.payload}</code>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              );
            })}
            {!step && (
              <div className="trace__ready">
                <span className="pulse-ring" aria-hidden="true" />
                <p>Trace ready. Run or step through the request.</p>
              </div>
            )}
          </div>

          <div className={`simulator__answer${complete ? " is-visible" : ""}`} aria-live="polite">
            <span>GROUNDED_RESPONSE</span>
            {complete ? <p>{scenario.answer}</p> : <p>Awaiting tool results…</p>}
          </div>
        </div>

        <div className="simulator__controls">
          <div
            className="simulator__progress"
            role="progressbar"
            aria-label="Simulation progress"
            aria-valuemin={0}
            aria-valuemax={scenario.events.length}
            aria-valuenow={step}
            aria-valuetext={`Step ${step} of ${scenario.events.length}`}
          >
            {scenario.events.map((event, index) => (
              <i key={event.id} className={index < step ? "is-complete" : ""} />
            ))}
          </div>
          <div>
            <button type="button" onClick={replay} aria-label="Replay simulation">
              <RotateCcw size={16} aria-hidden="true" /> <span>Replay</span>
            </button>
            <button
              type="button"
              disabled={complete}
              onClick={() => {
                if (reduceMotion) {
                  setStep(scenario.events.length);
                  setPlaying(false);
                } else {
                  setPlaying((value) => !value);
                }
              }}
              aria-label={isPlaying ? "Pause simulation" : "Play simulation"}
            >
              {isPlaying ? <CirclePause size={17} aria-hidden="true" /> : <CirclePlay size={17} aria-hidden="true" />}
              <span>{isPlaying ? "Pause" : "Run"}</span>
            </button>
            <button
              className="control-primary"
              type="button"
              disabled={complete}
              onClick={() => {
                setPlaying(false);
                setStep((value) => clampEventIndex(value + 1, scenario.events.length));
              }}
            >
              <StepForward size={16} aria-hidden="true" /> Step <ChevronRight size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
