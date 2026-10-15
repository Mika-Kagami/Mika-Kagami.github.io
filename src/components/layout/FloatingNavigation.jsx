import { useEffect, useState } from "react";
import { Menu, Play, Send, X } from "lucide-react";
import { motion } from "motion/react";
import { navigation } from "../../data/content";

export function FloatingNavigation({ activeSection, onReplay }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  return (
    <header className="floating-header">
      <nav className="nav-capsule" aria-label="Основная навигация">
        <a className="brand" href="#dashboard" onClick={() => setOpen(false)} aria-label="Mika Kagami — на главную">
          <span className="brand__sigil" aria-hidden="true"><i /><i /></span>
          <span><strong>MIKA KAGAMI</strong><small>Личная страница</small></span>
        </a>
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="main-navigation"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
        <div className={open ? "nav-links is-open" : "nav-links"} id="main-navigation">
          {navigation.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activeSection === item.id ? "is-active" : undefined}
              onClick={() => setOpen(false)}
            >
              {activeSection === item.id && <motion.i layoutId="active-nav" transition={{ duration: 0.28 }} />}
              <span>{item.label}</span>
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <button type="button" onClick={onReplay} aria-label="Повторить вступление" title="Повторить вступление">
            <Play size={15} />
          </button>
          <a href="https://t.me/MikaKagami_XIX" target="_blank" rel="noreferrer" aria-label="Telegram">
            <Send size={16} />
          </a>
        </div>
      </nav>
    </header>
  );
}
