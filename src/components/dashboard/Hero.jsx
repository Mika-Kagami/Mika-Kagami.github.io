import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import cosmicImage from "../../../assets/mika-cosmic-bg.png";

export function Hero() {
  const root = useRef(null);
  const raf = useRef();

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const onPointerMove = (event) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const rect = root.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      root.current.style.setProperty("--parallax-x", `${x * -18}px`);
      root.current.style.setProperty("--parallax-y", `${y * -12}px`);
    });
  };

  return (
    <section ref={root} className="hero" id="dashboard" onPointerMove={onPointerMove}>
      <div className="hero__art" aria-hidden="true">
        <img src={cosmicImage} alt="" width="1536" height="1024" fetchPriority="high" />
        <div className="hero__veil" />
        <div className="hero__orbit hero__orbit--one" />
        <div className="hero__orbit hero__orbit--two" />
      </div>
      <div className="hero__copy">
        <div className="hero__heading hero-reveal">
          <p className="kicker"><span>00</span> Личная страница</p>
          <h1>
            <span>MIKA</span>
            <span>KAGAMI</span>
          </h1>
          <p className="hero__signature">3D · Интерьеры · Дизайн</p>
        </div>
        <div className="hero__intro hero-reveal">
          <p>Здесь я собираю свои работы и идеи: 3D, интерьеры и дизайн.</p>
          <span className="hero__signal" aria-hidden="true"><i /><b>ЛИСТАТЬ ДАЛЬШЕ</b></span>
        </div>
      </div>
      <div className="hero__coordinates hero-reveal" aria-hidden="true">
        <span>MK / 19</span><span>ЛИЧНАЯ СТРАНИЦА</span>
      </div>
      <a className="hero__scroll" href="#identity" aria-label="Прокрутить к разделу обо мне">
        <span>Дальше</span><i><ArrowDown size={15} /></i>
      </a>
    </section>
  );
}
