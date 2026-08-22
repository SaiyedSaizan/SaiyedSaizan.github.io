"use client";

import { Command, Download, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { profile } from "@/data/profile";

interface NavigationProps {
  onOpenCommand: () => void;
}

const links = [
  { href: "#flow", label: "Flow" },
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function Navigation({ onOpenCommand }: NavigationProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, [open]);

  return (
    <header className={`nav-shell${scrolled ? " nav-shell--scrolled" : ""}`}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <nav className="nav" aria-label="Primary navigation">
        <a className="monogram" href="#top" aria-label="Saiyed Saizan, home">
          <span>SS</span>
          <i aria-hidden="true" />
        </a>

        <div className="nav__links" aria-label="Page sections">
          {links.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </div>

        <div className="nav__actions">
          <button className="command-trigger" onClick={onOpenCommand} type="button">
            <Command size={14} aria-hidden="true" />
            <span>Command</span>
            <kbd>/</kbd>
          </button>
          <a
            className="nav__resume"
            href={profile.resume}
            target="_blank"
            rel="noreferrer"
          >
            <Download size={14} aria-hidden="true" />
            Résumé
          </a>
          <button
            className="nav__menu"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="mobile-menu" id="mobile-menu">
          {links.map((link, index) => (
            <a href={link.href} key={link.href} onClick={() => setOpen(false)}>
              <span>0{index + 1}</span>
              {link.label}
            </a>
          ))}
          <a href={profile.resume} target="_blank" rel="noreferrer">
            <span>05</span>
            Open résumé
          </a>
        </div>
      )}
    </header>
  );
}
