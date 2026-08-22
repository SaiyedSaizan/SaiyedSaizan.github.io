"use client";

import {
  ArrowDown,
  ArrowUp,
  CornerDownLeft,
  Download,
  FileText,
  Code2,
  ContactRound,
  Mail,
  Network,
  Search,
  UserRound,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { profile } from "@/data/profile";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

interface CommandItem {
  label: string;
  hint: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
}

const commands: CommandItem[] = [
  { label: "Inspect Flow", hint: "Summer AI Lab campus assistant", href: "#flow", icon: Network },
  { label: "Explore work", hint: "Four built systems", href: "#work", icon: FileText },
  { label: "About Saiyed", hint: "Education and experience", href: "#about", icon: UserRound },
  { label: "Send an email", hint: profile.email, href: `mailto:${profile.email}`, icon: Mail },
  { label: "Read: Agent Governance Runtime", hint: "Policy and audit case study", href: "/projects/agent-governance-runtime.html", icon: FileText, external: true },
  { label: "Read: Flow", hint: "Campus assistant case study", href: "/projects/flow.html", icon: FileText, external: true },
  { label: "Read: AI Watch", hint: "Watch-aware tutor case study", href: "/projects/ai-watch.html", icon: FileText, external: true },
  { label: "Read: Physical AI", hint: "Robot learning case study", href: "/projects/physical-ai.html", icon: FileText, external: true },
  { label: "Open résumé", hint: "PDF", href: profile.resume, icon: Download, external: true },
  { label: "Open GitHub", hint: "SaiyedSaizan", href: profile.github, icon: Code2, external: true },
  { label: "Open LinkedIn", hint: "Connect", href: profile.linkedin, icon: ContactRound, external: true },
];

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return commands;
    return commands.filter(
      (command) =>
        command.label.toLowerCase().includes(normalized) ||
        command.hint.toLowerCase().includes(normalized),
    );
  }, [query]);

  useEffect(() => {
    if (open) {
      previousFocus.current = document.activeElement as HTMLElement;
      window.setTimeout(() => {
        setQuery("");
        setActive(0);
        inputRef.current?.focus();
      }, 30);
      document.body.classList.add("dialog-open");
    } else {
      document.body.classList.remove("dialog-open");
    }

    return () => document.body.classList.remove("dialog-open");
  }, [open]);

  const close = () => {
    onClose();
    window.setTimeout(() => previousFocus.current?.focus(), 0);
  };

  const run = (index: number) => {
    const command = filtered[index];
    if (!command) return;
    close();
    if (command.external) {
      window.open(command.href, "_blank", "noopener,noreferrer");
    } else if (command.href.startsWith("mailto:")) {
      window.open(command.href, "_self");
    } else {
      window.setTimeout(() => {
        document.querySelector(command.href)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      }, 40);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((value) => (filtered.length ? (value + 1) % filtered.length : 0));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((value) => (filtered.length ? (value - 1 + filtered.length) % filtered.length : 0));
    }
    if (event.key === "Enter") {
      event.preventDefault();
      run(active);
    }
    if (event.key === "Tab") {
      const focusable = paletteRef.current
        ? [...paletteRef.current.querySelectorAll<HTMLElement>(
            'input, button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
          )]
        : [];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="palette-backdrop"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <motion.div
            ref={paletteRef}
            className="palette"
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            initial={reduceMotion ? false : { opacity: 0, y: -18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            onKeyDown={onKeyDown}
          >
            <div className="palette__search">
              <Search aria-hidden="true" size={20} />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                placeholder="Navigate or run a command…"
                aria-label="Search commands"
                aria-activedescendant={filtered[active] ? `command-${active}` : undefined}
                autoComplete="off"
              />
              <button type="button" onClick={close} aria-label="Close command menu">
                <X size={17} aria-hidden="true" />
              </button>
            </div>
            <div className="palette__label">Available commands</div>
            <div className="palette__list" role="listbox">
              {filtered.length ? (
                filtered.map((command, index) => {
                  const Icon = command.icon;
                  return (
                    <button
                      id={`command-${index}`}
                      type="button"
                      role="option"
                      aria-selected={active === index}
                      className={active === index ? "is-active" : ""}
                      key={command.label}
                      onMouseMove={() => setActive(index)}
                      onClick={() => run(index)}
                    >
                      <span className="palette__icon"><Icon size={18} aria-hidden="true" /></span>
                      <span>{command.label}<small>{command.hint}</small></span>
                      {active === index && <CornerDownLeft size={15} aria-hidden="true" />}
                    </button>
                  );
                })
              ) : (
                <p className="palette__empty">No command matches “{query}”.</p>
              )}
            </div>
            <div className="palette__footer">
              <span><ArrowUp size={12} /><ArrowDown size={12} /> navigate</span>
              <span><CornerDownLeft size={12} /> select</span>
              <span><kbd>esc</kbd> close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
