import { Play, Send } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { links } from "../../data/content";

export function Connect({ onReplay }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.footer
      className="connect-section"
      id="connect"
      initial={{ y: reduceMotion ? 0 : 48 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="connect-section__orbit" aria-hidden="true"><i /><i /></div>
      <div className="connect-head">
        <a className="connect-brand" href="#dashboard" aria-label="Вернуться наверх">
          <span className="brand__sigil" aria-hidden="true"><i /><i /></span>
          <span>MIKA KAGAMI</span>
        </a>
        <span>КОНТАКТЫ / 02</span>
      </div>
      <div className="connect-copy">
        <p className="kicker">Контакты</p>
        <h2>Написать <em>мне.</em></h2>
        <p>Быстрее всего я отвечаю в Telegram.</p>
      </div>
      <div className="connect-links" aria-label="Контакты">
        {links.map((link) => (
          <a href={link.href} key={link.href} target="_blank" rel="noreferrer">
            <span><Send size={18} />{link.label}</span>
            <strong>{link.handle}</strong>
            <i aria-hidden="true">↗</i>
          </a>
        ))}
      </div>
      <div className="connect-footer">
        <span>© {new Date().getFullYear()} MIKA KAGAMI</span>
        <button type="button" onClick={onReplay}><Play size={13} /> Повторить вступление</button>
        <span>ЛИЧНАЯ СТРАНИЦА</span>
      </div>
    </motion.footer>
  );
}
