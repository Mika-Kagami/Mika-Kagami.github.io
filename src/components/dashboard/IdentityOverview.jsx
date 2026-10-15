import { motion, useReducedMotion } from "motion/react";
import { identity } from "../../data/content";
import { SectionHeading } from "../ui/SectionHeading";
import avatar from "../../../mika.jpg";

export function IdentityOverview() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className="dashboard-section identity-section"
      id="identity"
      initial={{ y: reduceMotion ? 0 : 54 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
    >
      <SectionHeading
        index="01"
        eyebrow="Обо мне"
        title="Немного обо мне"
        text="Коротко о том, что мне интересно и чем я люблю заниматься."
      />
      <div className="identity-grid">
        <motion.article className="identity-portrait glass-panel" whileHover={{ y: -4 }}>
          <img src={avatar} alt="Аватар Mika Kagami" width="640" height="640" loading="lazy" />
          <div className="identity-portrait__shade" aria-hidden="true" />
          <div className="identity-portrait__label">
            <span>MK</span>
            <p>{identity.eyebrow}</p>
          </div>
        </motion.article>
        <article className="identity-story">
          <div>
            <p className="kicker">Мои интересы</p>
            <h3>{identity.name}</h3>
            <p className="identity-story__lead">{identity.intro}</p>
          </div>
          <blockquote>“{identity.statement}”</blockquote>
          <div className="identity-tags" aria-label="Творческие интересы">
            {identity.details.map((detail, index) => (
              <span key={detail}><i>0{index + 1}</i>{detail}</span>
            ))}
          </div>
        </article>
      </div>
    </motion.section>
  );
}
