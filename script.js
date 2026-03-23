document.body.classList.add("js-ready");

const sections = [...document.querySelectorAll("[data-section]")];
const navLinks = [...document.querySelectorAll(".site-nav a")];
const revealTargets = [...document.querySelectorAll(".reveal")];

const navById = new Map(
  navLinks
    .filter((link) => link.getAttribute("href")?.startsWith("#"))
    .map((link) => [link.getAttribute("href").slice(1), link]),
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
    rootMargin: "0px 0px -8% 0px",
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
    rootMargin: "-15% 0px -55% 0px",
  },
);

sections.forEach((section) => sectionObserver.observe(section));
