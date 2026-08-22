import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="footer section-shell">
      <a className="monogram" href="#top" aria-label="Back to top"><span>SS</span><i /></a>
      <p>Designed & engineered by {profile.shortName}.</p>
      <div><span>SYSTEM / ONLINE</span><a href="#top">Back to top ↑</a></div>
    </footer>
  );
}
