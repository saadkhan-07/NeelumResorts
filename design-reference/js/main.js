/* =========================================================
   Neelum Resort Taobat — site script
   ========================================================= */

/* ---------------------------------------------------------
   1. SETTINGS  —  edit these two lines and nothing else
   --------------------------------------------------------- */

// WhatsApp number in international format, no + and no spaces
const WHATSAPP = "923556804073";

// Phone number for the tel: links
const PHONE = "+923556804073";

/* --------------------------------------------------------- */

/* ---------- header: solid on scroll ---------- */
const header = document.querySelector(".site-header");
const onScroll = () => {
  if (!header) return;
  const trigger = header.dataset.solid === "always" ? -1 : window.innerHeight * 0.55;
  header.classList.toggle("is-solid", window.scrollY > trigger);
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- mobile nav ---------- */
const mob = document.querySelector(".mobile-nav");
document.querySelector(".burger")?.addEventListener("click", () => mob?.classList.add("is-open"));
mob?.querySelector(".close")?.addEventListener("click", () => mob.classList.remove("is-open"));
mob?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => mob.classList.remove("is-open")));

/* ---------- hero slider ---------- */
const slides = [...document.querySelectorAll(".hero__slide")];
if (slides.length > 1) {
  const dotWrap = document.querySelector(".hero__dots");
  let i = 0, timer;
  slides.forEach((_, n) => {
    const b = document.createElement("button");
    b.setAttribute("aria-label", "Slide " + (n + 1));
    b.addEventListener("click", () => go(n));
    dotWrap?.appendChild(b);
  });
  const dots = [...(dotWrap?.children || [])];
  function go(n) {
    slides[i].classList.remove("is-active");
    dots[i]?.classList.remove("is-active");
    i = (n + slides.length) % slides.length;
    slides[i].classList.add("is-active");
    dots[i]?.classList.add("is-active");
    const img = slides[i].querySelector("img");
    if (img) { img.style.animation = "none"; void img.offsetWidth; img.style.animation = ""; }
    clearInterval(timer);
    timer = setInterval(() => go(i + 1), 6500);
  }
  go(0);
}

/* ---------- WhatsApp booking ---------- */
function waLink(message) {
  return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(message);
}

// every [data-wa] element opens WhatsApp with its own message
document.querySelectorAll("[data-wa]").forEach(el => {
  el.setAttribute("href", waLink(el.dataset.wa));
  el.setAttribute("target", "_blank");
  el.setAttribute("rel", "noopener");
});

document.querySelectorAll('[data-tel]').forEach(el => el.setAttribute("href", "tel:" + PHONE));

// the availability bar builds a message from the fields
const bookForm = document.getElementById("bookbar");
if (bookForm) {
  const fmt = d => d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";
  bookForm.addEventListener("submit", e => {
    e.preventDefault();
    const f = new FormData(bookForm);
    const msg =
      "Assalam o Alaikum! I'd like to check availability at Neelum Resort Taobat.\n\n" +
      "Check-in: " + fmt(f.get("checkin")) + "\n" +
      "Check-out: " + fmt(f.get("checkout")) + "\n" +
      "Guests: " + f.get("guests") + "\n" +
      "Stay: " + f.get("room") + "\n\n" +
      "Could you share the rates and availability? Thank you.";
    window.open(waLink(msg), "_blank", "noopener");
  });

  // sensible default dates: tomorrow → day after
  const iso = d => d.toISOString().split("T")[0];
  const t = new Date(Date.now() + 864e5), t2 = new Date(Date.now() + 1728e5);
  const ci = bookForm.querySelector('[name="checkin"]'), co = bookForm.querySelector('[name="checkout"]');
  if (ci && !ci.value) { ci.value = iso(t); ci.min = iso(new Date()); }
  if (co && !co.value) { co.value = iso(t2); co.min = iso(t); }
}

/* ---------- contact form -> WhatsApp ---------- */
const contactForm = document.getElementById("contact-form");
contactForm?.addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(contactForm);
  const msg =
    "Assalam o Alaikum! Enquiry from the Neelum Resort website.\n\n" +
    "Name: " + f.get("name") + "\n" +
    "Phone: " + f.get("phone") + "\n" +
    "Dates: " + (f.get("dates") || "—") + "\n" +
    "Guests: " + (f.get("guests") || "—") + "\n\n" +
    f.get("message");
  window.open(waLink(msg), "_blank", "noopener");
});

/* ---------- gallery lightbox ---------- */
const lb = document.querySelector(".lightbox");
if (lb) {
  const imgs = [...document.querySelectorAll("[data-lb]")];
  const view = lb.querySelector("img");
  let cur = 0;
  const show = n => { cur = (n + imgs.length) % imgs.length; view.src = imgs[cur].dataset.lb; };
  imgs.forEach((a, n) => a.addEventListener("click", e => {
    e.preventDefault(); show(n); lb.classList.add("is-open"); document.body.style.overflow = "hidden";
  }));
  const close = () => { lb.classList.remove("is-open"); document.body.style.overflow = ""; };
  lb.querySelector(".lb-close").addEventListener("click", close);
  lb.querySelector(".lb-prev").addEventListener("click", () => show(cur - 1));
  lb.querySelector(".lb-next").addEventListener("click", () => show(cur + 1));
  lb.addEventListener("click", e => { if (e.target === lb) close(); });
  document.addEventListener("keydown", e => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") show(cur + 1);
    if (e.key === "ArrowLeft") show(cur - 1);
  });
}

/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
}, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));
