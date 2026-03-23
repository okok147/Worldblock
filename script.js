document.body.classList.add("js-ready");

const root = document.documentElement;
const header = document.querySelector(".site-header");
const hero = document.querySelector(".hero");
const sections = [...document.querySelectorAll("[data-section]")];
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const revealTargets = [...document.querySelectorAll(".reveal")];

const navById = new Map(
  navLinks.map((link) => [link.getAttribute("href").slice(1), link]),
);

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -10% 0px",
  },
);

revealTargets.forEach((target) => revealObserver.observe(target));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach((link) => link.classList.remove("is-active"));
    navById.get(visible.target.dataset.section)?.classList.add("is-active");
  },
  {
    threshold: [0.2, 0.45, 0.7],
    rootMargin: "-20% 0px -45% 0px",
  },
);

sections.forEach((section) => sectionObserver.observe(section));

let isTicking = false;

const syncScrollState = () => {
  const heroHeight = hero?.offsetHeight ?? window.innerHeight;
  const progress = Math.min(window.scrollY / (heroHeight * 0.85), 1);

  root.style.setProperty("--hero-progress", progress.toFixed(3));
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
  isTicking = false;
};

const requestSync = () => {
  if (isTicking) return;
  isTicking = true;
  window.requestAnimationFrame(syncScrollState);
};

window.addEventListener("scroll", requestSync, { passive: true });
window.addEventListener("resize", requestSync);

syncScrollState();
