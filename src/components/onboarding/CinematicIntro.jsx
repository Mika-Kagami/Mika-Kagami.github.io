import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowDownRight } from "lucide-react";
import { ease } from "../../animations/tokens";

gsap.registerPlugin(useGSAP);

export default function CinematicIntro({ onComplete, reduceMotion }) {
  const root = useRef(null);

  useGSAP(() => {
    if (reduceMotion) {
      onComplete();
      return undefined;
    }

    const timeline = gsap.timeline({ onComplete });
    timeline
      .set(".intro-mark__line, .intro-word, .intro-caption, .intro-overline, .intro-corner, .intro-horizon", { opacity: 0 })
      .fromTo(".intro-moon", { opacity: 0, scale: 0.72 }, { opacity: 1, scale: 1, duration: 0.7, ease: ease.reveal })
      .to(".intro-mark__line", { opacity: 1, scaleX: 1, duration: 0.5, stagger: 0.08 }, 0.18)
      .to(".intro-overline", { opacity: 1, y: 0, duration: 0.42 }, 0.24)
      .to(".intro-word", { opacity: 1, y: 0, duration: 0.68, stagger: 0.11, ease: ease.reveal }, 0.34)
      .to(".intro-caption, .intro-corner", { opacity: 1, y: 0, duration: 0.45, stagger: 0.06 }, 0.78)
      .to(".intro-horizon", { opacity: 1, scaleY: 1, duration: 0.65, ease: ease.cinematic }, 0.55)
      .to(".intro-scene", { scale: 1.035, duration: 1.25, ease: "sine.inOut" }, 0.85)
      .to(".intro-content", { y: -18, opacity: 0, duration: 0.4, ease: "power2.in" }, 1.72)
      .to(root.current, { opacity: 0, duration: 0.55, ease: ease.cinematic }, 1.82);

    return () => timeline.kill();
  }, { scope: root, dependencies: [reduceMotion, onComplete] });

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape" || event.key === "Enter") onComplete();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onComplete]);

  return (
    <div ref={root} className="intro-overlay" role="dialog" aria-modal="true" aria-label="Вступление Mika Kagami">
      <div className="intro-scene">
        <div className="intro-moon" />
        <div className="intro-horizon" />
      </div>
      <div className="intro-content">
        <div className="intro-identity">
          <div className="intro-mark" aria-hidden="true">
            <i className="intro-mark__line" />
            <i className="intro-mark__line" />
          </div>
          <p className="intro-overline">MIKA KAGAMI / ЛИЧНАЯ СТРАНИЦА</p>
        </div>
        <div className="intro-title" aria-label="Mika Kagami">
          <span className="intro-word">MIKA</span>
          <span className="intro-word intro-word--serif">KAGAMI</span>
        </div>
        <p className="intro-caption">Добро пожаловать</p>
      </div>
      <p className="intro-corner">Здесь я собираю свои идеи,<br />3D и дизайн.</p>
      <button className="intro-skip" type="button" onClick={onComplete} autoFocus>
        Пропустить <ArrowDownRight size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
