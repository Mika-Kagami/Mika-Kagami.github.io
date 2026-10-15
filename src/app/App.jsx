import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "motion/react";
import { navigation } from "../data/content";
import { useActiveSection } from "../hooks/useActiveSection";
import { Atmosphere } from "../components/effects/Atmosphere";
import { FloatingNavigation } from "../components/layout/FloatingNavigation";
import { Hero } from "../components/dashboard/Hero";
import { IdentityOverview } from "../components/dashboard/IdentityOverview";
import { Connect } from "../components/dashboard/Connect";

const INTRO_KEY = "mika-digital-universe-intro-v2";
const CinematicIntro = lazy(() => import("../components/onboarding/CinematicIntro"));

function hasSeenIntro() {
  try { return localStorage.getItem(INTRO_KEY) === "complete"; } catch { return false; }
}

export function App() {
  const reduceMotion = useReducedMotion();
  const [introOpen, setIntroOpen] = useState(() => !hasSeenIntro() && !reduceMotion);
  const [introVersion, setIntroVersion] = useState(0);
  const ids = useMemo(() => navigation.map((item) => item.id), []);
  const activeSection = useActiveSection(ids);

  useEffect(() => {
    if (reduceMotion) setIntroOpen(false);
  }, [reduceMotion]);

  const finishIntro = useCallback(() => {
    try { localStorage.setItem(INTRO_KEY, "complete"); } catch { /* storage is optional */ }
    setIntroOpen(false);
  }, []);

  const replayIntro = useCallback(() => {
    setIntroVersion((value) => value + 1);
    setIntroOpen(true);
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }, [reduceMotion]);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#dashboard">Перейти к содержанию</a>
      <Atmosphere />
      <Suspense fallback={null}>
        {introOpen && <CinematicIntro key={introVersion} onComplete={finishIntro} reduceMotion={reduceMotion} />}
      </Suspense>
      <FloatingNavigation activeSection={activeSection} onReplay={replayIntro} />
      <main>
        <Hero />
        <div className="dashboard-wrap">
          <IdentityOverview />
          <Connect onReplay={replayIntro} />
        </div>
      </main>
    </div>
  );
}
