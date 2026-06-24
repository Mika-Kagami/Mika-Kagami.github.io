const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll(".site-nav a")];

const setMenuOpen = (isOpen) => {
  siteNav?.classList.toggle("is-open", isOpen);
  menuToggle?.classList.toggle("is-open", isOpen);
  menuToggle?.setAttribute("aria-expanded", String(isOpen));
  menuToggle?.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
};

menuToggle?.addEventListener("click", () => {
  setMenuOpen(!siteNav?.classList.contains("is-open"));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

const sectionByLink = navLinks
  .map((link) => {
    const id = link.getAttribute("href");
    return id?.startsWith("#") ? [link, document.querySelector(id)] : null;
  })
  .filter(Boolean);

const activeObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) {
      return;
    }

    sectionByLink.forEach(([link, section]) => {
      link.classList.toggle("is-active", section === visible.target);
    });
  },
  {
    rootMargin: "-35% 0px -45%",
    threshold: [0.1, 0.25, 0.5]
  }
);

sectionByLink.forEach(([, section]) => activeObserver.observe(section));

const REVIEWS_KEY = "mika-portfolio-reviews";
const reviewsList = document.querySelector("#reviews-list");
const reviewForm = document.querySelector("#review-form");
const reviewStatus = document.querySelector("#review-status");
const ratingInput = reviewForm?.querySelector("input[name='rating']");
const ratingStars = [...document.querySelectorAll(".rating-star")];

const setRating = (rating) => {
  if (ratingInput) {
    ratingInput.value = String(rating);
  }

  ratingStars.forEach((star) => {
    const starRating = Number(star.dataset.rating);
    const isActive = starRating <= rating;
    star.classList.toggle("is-active", isActive);
    star.setAttribute("aria-checked", String(starRating === rating));
  });
};

ratingStars.forEach((star) => {
  star.addEventListener("click", () => setRating(Number(star.dataset.rating)));
  star.addEventListener("mouseenter", () => {
    const previewRating = Number(star.dataset.rating);
    ratingStars.forEach((item) => {
      item.classList.toggle("is-preview", Number(item.dataset.rating) <= previewRating);
    });
  });
});

document.querySelector(".rating-stars")?.addEventListener("mouseleave", () => {
  ratingStars.forEach((star) => star.classList.remove("is-preview"));
});

setRating(Number(ratingInput?.value || 5));

const getReviews = () => {
  try {
    return JSON.parse(localStorage.getItem(REVIEWS_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveReviews = (reviews) => {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
};

const createReviewCard = ({ name, role, rating, message, createdAt }) => {
  const card = document.createElement("article");
  card.className = "review-card";

  const avatar = document.createElement("div");
  avatar.className = "review-avatar";
  avatar.textContent = name.trim().charAt(0).toUpperCase();

  const content = document.createElement("div");
  const text = document.createElement("p");
  text.textContent = message;
  const author = document.createElement("b");
  author.textContent = name;
  const meta = document.createElement("small");
  const date = new Date(createdAt).toLocaleDateString("ru-RU");
  meta.textContent = role ? `${role} · ${date}` : date;
  content.append(text, author, meta);

  const stars = document.createElement("span");
  stars.className = "review-stars";
  stars.textContent = "★".repeat(Number(rating));

  card.append(avatar, content, stars);
  return card;
};

const renderReviews = () => {
  if (!reviewsList) {
    return;
  }

  reviewsList.replaceChildren(...getReviews().map(createReviewCard));
};

renderReviews();

reviewForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(reviewForm);
  const review = {
    name: String(formData.get("name") || "").trim(),
    role: String(formData.get("role") || "").trim(),
    rating: Number(formData.get("rating") || 5),
    message: String(formData.get("message") || "").trim(),
    createdAt: new Date().toISOString()
  };

  if (!review.name || !review.role || !review.message) {
    if (reviewStatus) {
      reviewStatus.textContent = "Заполните имя, проект или роль и отзыв.";
    }
    return;
  }

  const reviews = [review, ...getReviews()].slice(0, 12);
  saveReviews(reviews);
  renderReviews();
  reviewForm.reset();
  setRating(5);

  if (reviewStatus) {
    reviewStatus.textContent = "Спасибо! Отзыв добавлен.";
  }
});
