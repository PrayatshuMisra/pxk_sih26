/** Community Wayfinding: this prototype uses a clearly labelled browser-local demo session, not an external account login. */
import { LanguageSelector } from "@/components/LanguageSelector";
import { PillNav } from "@/components/PillNav";
import type { Language } from "@/data/mockData";
import { SITE_TEXT } from "@/data/siteI18n";
import { LogIn, LogOut, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

const DEMO_SESSION_KEY = "pxk-demo-session-v1";

function scrollToId(id: string, navigate: (path: string) => void, location: string) {
  if (location !== "/") {
    navigate("/");
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Header({ language, setLanguage }: { language: Language; setLanguage: (language: Language) => void }) {
  const [location, navigate] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [demoSignedIn, setDemoSignedIn] = useState(() => typeof window !== "undefined" && window.localStorage.getItem(DEMO_SESSION_KEY) === "active");
  const text = SITE_TEXT[language];

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const setDemoSession = (active: boolean) => {
    if (typeof window !== "undefined") {
      if (active) window.localStorage.setItem(DEMO_SESSION_KEY, "active");
      else window.localStorage.removeItem(DEMO_SESSION_KEY);
    }
    setDemoSignedIn(active);
  };

  const nav = [
    { href: "/", label: text.home },
    { href: "/how-it-works", label: text.how },
    { href: "/patient", label: text.health },
    { href: "/analytics", label: text.analytics },
    { href: "/doctor", label: text.provider },
  ];

  return <header className={`site-header site-header--pill ${scrolled ? "site-header--scrolled" : ""}`}>
    <div className="container pill-nav-wrap">
      <PillNav items={nav} activeHref={location} />
      <div className="header-route-actions">
        <LanguageSelector value={language} onChange={setLanguage} className="language-select--pill" />
        {demoSignedIn ? <div className="account-actions">
          <Link className="profile-link" href="/history" title="Open demo screening history" aria-label="Open demo screening history">
            <span className="profile-avatar" aria-hidden="true">D</span><UserRound /><span className="profile-link-label">Demo history</span>
          </Link>
          <button className="account-button" title="End demo session" aria-label="End demo session" onClick={() => setDemoSession(false)}>
            <LogOut /><span>End demo</span>
          </button>
        </div> : <button className="account-button account-button--signin" onClick={() => setDemoSession(true)} title="Start a local prototype session">
          <LogIn /><span>Demo sign in</span>
        </button>}
        <button className="btn btn-primary btn-small" onClick={() => scrollToId("demo", navigate, location)}>{text.start}</button>
      </div>
    </div>
  </header>;
}
