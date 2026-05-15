const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle?.addEventListener("click", () => {
  navLinks.classList.toggle("is-open");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.14 }
);

const revealItem = (item) => {
  item.classList.add("reveal");
  observer.observe(item);
};

document.querySelectorAll(".profile-card, .card, .work, .steps-line div, .review-card").forEach(revealItem);

const SUPABASE_URL = "https://akwbnkotzhwssqsqxkbd.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_CULoasPGqBU64DEt8HBQ9g_arnP4hqf";
const SUPABASE_REVIEWS_TABLE = "reviews";
const REVIEW_TIMEOUT_MS = 15 * 60 * 1000;
const REVIEW_TIMER_KEY = "mika-review-last-submit";

const reviewForm = document.querySelector("#review-form");
const reviewStatus = document.querySelector("#review-status");
const reviewsList = document.querySelector("#reviews-list");
const ratingInput = reviewForm?.querySelector("input[name='rating']");
const ratingStars = [...document.querySelectorAll(".rating-star")];

const setReviewStatus = (message) => {
  if (reviewStatus) {
    reviewStatus.textContent = message;
  }
};

const getWaitTime = () => {
  const lastSubmit = Number(localStorage.getItem(REVIEW_TIMER_KEY) || 0);
  return Math.max(0, REVIEW_TIMEOUT_MS - (Date.now() - lastSubmit));
};

const formatWaitTime = (ms) => {
  const minutes = Math.ceil(ms / 60000);
  return `${minutes} мин.`;
};

const createReviewCard = ({ name, role, rating, message }) => {
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
  const position = document.createElement("small");
  position.textContent = role;
  content.append(text, author, position);

  const stars = document.createElement("span");
  stars.className = "stars";
  stars.textContent = "★★★★★".slice(0, Number(rating));

  card.append(avatar, content, stars);
  return card;
};

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
  star.addEventListener("click", () => {
    setRating(Number(star.dataset.rating));
  });

  star.addEventListener("mouseenter", () => {
    const previewRating = Number(star.dataset.rating);
    ratingStars.forEach((item) => {
      item.classList.toggle("is-preview", Number(item.dataset.rating) <= previewRating);
    });
  });
});

document.querySelector(".rating-stars")?.addEventListener("mouseleave", () => {
  ratingStars.forEach((star) => {
    star.classList.remove("is-preview");
  });
});

setRating(Number(ratingInput?.value || 5));

const sendReviewToSupabase = async (review) => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase не настроен: добавьте SUPABASE_URL и SUPABASE_ANON_KEY в script.js.");
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_REVIEWS_TABLE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: "return=minimal"
    },
    body: JSON.stringify(review)
  });

  if (!response.ok) {
    throw new Error("Не удалось отправить отзыв. Попробуйте позже.");
  }
};

reviewForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const waitTime = getWaitTime();
  if (waitTime > 0) {
    setReviewStatus(`Следующий отзыв можно отправить через ${formatWaitTime(waitTime)}.`);
    return;
  }

  const formData = new FormData(reviewForm);
  const review = {
    name: String(formData.get("name") || "").trim(),
    role: String(formData.get("role") || "").trim(),
    rating: Number(formData.get("rating") || 5),
    message: String(formData.get("message") || "").trim(),
    created_at: new Date().toISOString()
  };

  if (!review.name || !review.role || !review.message) {
    setReviewStatus("Заполните все поля отзыва.");
    return;
  }

  const submitButton = reviewForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  setReviewStatus("Отправляю отзыв...");

  try {
    await sendReviewToSupabase(review);
    localStorage.setItem(REVIEW_TIMER_KEY, String(Date.now()));

    const card = createReviewCard(review);
    reviewsList?.classList.remove("is-empty");
    reviewsList?.querySelector(".reviews-empty")?.remove();
    reviewsList?.prepend(card);
    revealItem(card);

    reviewForm.reset();
    setReviewStatus("Спасибо! Отзыв отправлен.");
  } catch (error) {
    setReviewStatus(error.message);
  } finally {
    submitButton.disabled = false;
  }
});
