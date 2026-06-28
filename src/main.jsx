import React from "react";
import { createRoot } from "react-dom/client";
import {
  Home,
  UserRound,
  PanelsTopLeft,
  Sparkles,
  Star,
  Mail,
  Send,
  Menu,
  X,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import "./styles.css";

const REVIEWS_KEY = "mika-portfolio-reviews";

const navItems = [
  { href: "#home", label: "Главная", icon: Home },
  { href: "#about", label: "Обо мне", icon: UserRound },
  { href: "#works", label: "Проекты", icon: PanelsTopLeft },
  { href: "#services", label: "Услуги", icon: Sparkles },
  { href: "#reviews", label: "Отзывы", icon: Star },
  { href: "#contact", label: "Контакты", icon: Mail },
];

const focusAreas = [
  {
    number: "01",
    title: "3D дома",
    text: "Визуальная подача идей, планировок и настроения будущего пространства.",
  },
  {
    number: "02",
    title: "3D комнаты",
    text: "Комнаты, кухни и интерьерные сцены для портфолио, презентации или клиента.",
  },
  {
    number: "03",
    title: "Другое",
    text: "Обложки, шаблоны, сайты и аккуратный визуал для красивой публикации работ.",
  },
];

const galleries = [
  {
    id: "rooms",
    number: "01",
    title: "3D комнаты",
    text: "Интерьерные сцены, комнаты, кухни и визуализации пространства.",
    tag: "interior",
  },
  {
    id: "homes",
    number: "02",
    title: "3D дома",
    text: "Идеи домов, планировок и общей атмосферы будущего пространства.",
    tag: "architecture",
  },
  {
    id: "visuals",
    number: "03",
    title: "Другое",
    text: "Шаблоны, визуальные материалы, сайты и дополнительные работы.",
    tag: "digital",
  },
];

const services = [
  {
    tag: "rooms",
    title: "3D комнаты",
    text: "Атмосферная визуализация интерьера для публикации, презентации или личного проекта.",
  },
  {
    tag: "homes",
    title: "3D дома",
    text: "Визуальное оформление идеи дома, комнаты или отдельной зоны в красивой подаче.",
  },
  {
    tag: "other",
    title: "Другое",
    text: "Дополнительные визуальные работы: шаблоны, обложки, сайты и оформление публикаций.",
  },
];

const getStoredReviews = () => {
  try {
    return JSON.parse(localStorage.getItem(REVIEWS_KEY) || "[]");
  } catch {
    return [];
  }
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("home");
  const [activeGallery, setActiveGallery] = React.useState(null);
  const [reviews, setReviews] = React.useState(() => getStoredReviews());
  const [rating, setRating] = React.useState(5);
  const [status, setStatus] = React.useState("");

  React.useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector(item.href))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: "-35% 0px -45%", threshold: [0.1, 0.25, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  }, [reviews]);

  React.useEffect(() => {
    document.body.classList.toggle("menu-lock", isMenuOpen);
    return () => document.body.classList.remove("menu-lock");
  }, [isMenuOpen]);

  const openGallery = (gallery) => {
    setActiveGallery(gallery);
    requestAnimationFrame(() => {
      document.querySelector("#works")?.scrollIntoView({ behavior: "smooth" });
    });
  };

  const closeMenu = () => setIsMenuOpen(false);

  const submitReview = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const review = {
      name: String(data.get("name") || "").trim(),
      role: String(data.get("role") || "").trim(),
      rating,
      message: String(data.get("message") || "").trim(),
      createdAt: new Date().toISOString(),
    };

    if (!review.name || !review.role || !review.message) {
      setStatus("Заполните имя, проект или роль и отзыв.");
      return;
    }

    setReviews((current) => [review, ...current].slice(0, 12));
    form.reset();
    setRating(5);
    setStatus("Спасибо! Отзыв добавлен.");
  };

  return (
    <>
      <Background />
      <Header
        activeSection={activeSection}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        closeMenu={closeMenu}
      />
      <main>
        <Hero />
        <Intro />
        <Works
          activeGallery={activeGallery}
          openGallery={openGallery}
          closeGallery={() => setActiveGallery(null)}
        />
        <Services />
        <Reviews
          reviews={reviews}
          rating={rating}
          setRating={setRating}
          status={status}
          submitReview={submitReview}
        />
        <Contact />
      </main>
    </>
  );
}

function Background() {
  return (
    <>
      <div className="star-field" aria-hidden="true" />
      <div className="shooting-stars" aria-hidden="true" />
      <div className="cosmic-bg" aria-hidden="true" />
      <div className="noise-layer" aria-hidden="true" />
    </>
  );
}

function Header({ activeSection, isMenuOpen, setIsMenuOpen, closeMenu }) {
  return (
    <header className="site-header">
      <div className="nav-shell">
        <a className="nav-logo" href="#home" aria-label="Mika на главную" onClick={closeMenu}>
          <span className="nav-logo__spark" aria-hidden="true" />
          <span>MIKA</span>
          <i aria-hidden="true" />
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((value) => !value)}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={isMenuOpen ? "site-nav is-open" : "site-nav"} aria-label="Основная навигация">
          {navItems.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className={activeSection === href.slice(1) ? "is-active" : undefined}
              onClick={closeMenu}
            >
              <Icon size={16} aria-hidden="true" />
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <div className="nav-socials" aria-label="Социальные ссылки">
          <a href="https://t.me/MikaKagami_XIX" aria-label="Telegram">
            <Send size={18} />
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-copy">
        <p className="eyebrow">Hi, I'm</p>
        <h1>Mika</h1>
        <h2>Дизайнер домов, 3D комнат и визуальных проектов</h2>
        <p className="hero-description">
          Создаю атмосферные пространства и аккуратные digital-работы: от интерьеров и домов до визуальных
          идей для публикаций. Каждый проект оформляю так, чтобы он выглядел чисто, дорого и запоминался с
          первого взгляда.
        </p>
        <div className="hero-actions">
          <a className="button primary" href="#works">
            Смотреть работы
            <ArrowRight size={18} />
          </a>
          <a className="button ghost" href="#contact">
            Связаться
          </a>
        </div>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section className="section intro-strip" id="about" aria-label="Обо мне">
      {focusAreas.map((item) => (
        <article key={item.number}>
          <span>{item.number}</span>
          <strong>{item.title}</strong>
          <p>{item.text}</p>
        </article>
      ))}
    </section>
  );
}

function Works({ activeGallery, openGallery, closeGallery }) {
  return (
    <section className="section works" id="works">
      <div className="section-heading">
        <p className="eyebrow">gallery</p>
        <h2>{activeGallery ? activeGallery.title : "Галереи работ"}</h2>
        <p>
          {activeGallery
            ? "Галерея пока готовится. Здесь появятся опубликованные работы, когда они будут добавлены."
            : "Выберите направление, чтобы перейти в нужную галерею."}
        </p>
      </div>

      {activeGallery ? (
        <div className="empty-gallery">
          <div className="empty-gallery__orb" aria-hidden="true" />
          <p className="eyebrow">{activeGallery.tag}</p>
          <h3>{activeGallery.title}</h3>
          <p>Работы будут добавлены позже. Раздел уже оформлен в общем стиле сайта.</p>
          <button className="button ghost" type="button" onClick={closeGallery}>
            <ArrowLeft size={18} />
            Вернуться к галереям
          </button>
        </div>
      ) : (
        <div className="work-grid">
          {galleries.map((gallery) => (
            <button className="work-card work-tile" key={gallery.id} type="button" onClick={() => openGallery(gallery)}>
              <span>{gallery.number}</span>
              <small>{gallery.tag}</small>
              <h3>{gallery.title}</h3>
              <p>{gallery.text}</p>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function Services() {
  return (
    <section className="section services" id="services">
      <div className="section-heading">
        <p className="eyebrow">services</p>
        <h2>Что можно заказать</h2>
      </div>

      <div className="service-grid">
        {services.map((service) => (
          <article className="service-card" key={service.tag}>
            <span>{service.tag}</span>
            <h3>{service.title}</h3>
            <p>{service.text}</p>
            <strong>по договоренности</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function Reviews({ reviews, rating, setRating, status, submitReview }) {
  return (
    <section className="section reviews" id="reviews">
      <div className="section-heading">
        <p className="eyebrow">guestbook</p>
        <h2>Отзывы</h2>
        <p>Можно оставить короткий отзыв о работе, стиле или проекте.</p>
      </div>

      <div className="reviews-grid" aria-live="polite">
        {reviews.length === 0 ? (
          <p className="reviews-empty">Пока отзывов нет. Можно оставить первый.</p>
        ) : (
          reviews.map((review) => <ReviewCard key={`${review.createdAt}-${review.name}`} review={review} />)
        )}
      </div>

      <form className="review-form" onSubmit={submitReview}>
        <h3>Оставьте свой отзыв</h3>
        <div className="review-fields">
          <label>
            <span>Имя</span>
            <input type="text" name="name" maxLength="40" autoComplete="name" required />
          </label>
          <label>
            <span>Проект или роль</span>
            <input type="text" name="role" maxLength="60" placeholder="Например: владелец магазина" required />
          </label>
          <fieldset className="rating-field">
            <legend>Оценка</legend>
            <div className="rating-stars" role="radiogroup" aria-label="Оценка">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  className={value <= rating ? "rating-star is-active" : "rating-star"}
                  type="button"
                  aria-label={`${value} ${value === 1 ? "звезда" : "звезд"}`}
                  aria-checked={value === rating}
                  role="radio"
                  onClick={() => setRating(value)}
                >
                  <Star size={22} fill="currentColor" />
                </button>
              ))}
            </div>
          </fieldset>
          <label className="review-message">
            <span>Отзыв</span>
            <textarea name="message" rows="4" maxLength="360" required />
          </label>
        </div>
        <div className="review-submit-row">
          <button className="button primary" type="submit">
            Отправить отзыв
            <ArrowRight size={18} />
          </button>
          <p className="review-status">{status}</p>
        </div>
      </form>
    </section>
  );
}

function ReviewCard({ review }) {
  const date = new Date(review.createdAt).toLocaleDateString("ru-RU");
  const initial = review.name.trim().charAt(0).toUpperCase();

  return (
    <article className="review-card">
      <div className="review-avatar">{initial}</div>
      <div>
        <p>{review.message}</p>
        <b>{review.name}</b>
        <small>
          {review.role} · {date}
        </small>
      </div>
      <span className="review-stars" aria-label={`Оценка ${review.rating} из 5`}>
        {"★".repeat(Number(review.rating))}
      </span>
    </article>
  );
}

function Contact() {
  return (
    <section className="contact" id="contact">
      <div>
        <p className="eyebrow">contact</p>
        <h2>Хотите оформить новую работу?</h2>
        <p>Напишите Mika, чтобы обсудить стиль, детали и формат будущего проекта.</p>
      </div>
      <div className="contact-actions">
        <a className="button primary" href="https://t.me/MikaKagami_XIX">
          Telegram
          <Send size={18} />
        </a>
      </div>
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
