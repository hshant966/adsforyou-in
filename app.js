/* adsforyou.in — language toggle, scroll reveals, header behavior */
(function () {
  "use strict";

  var LANG_KEY = "adsforyou-lang";

  /* ---------- language toggle ---------- */
  var toggle = document.getElementById("langToggle");
  var translatable = document.querySelectorAll("[data-en][data-mr]");

  function setLanguage(lang) {
    if (lang !== "en" && lang !== "mr") lang = "en";

    translatable.forEach(function (el) {
      var value = el.getAttribute("data-" + lang);
      if (value !== null) el.innerHTML = value;
    });

    document.documentElement.setAttribute("lang", lang);

    if (toggle) {
      toggle.querySelectorAll(".lang-opt").forEach(function (opt) {
        opt.classList.toggle("is-active", opt.getAttribute("data-lang") === lang);
      });
      toggle.setAttribute(
        "aria-label",
        lang === "en" ? "Switch language to Marathi" : "भाषा इंग्रजीत बदला"
      );
    }

    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (err) {
      /* private mode — preference just won't persist */
    }
  }

  function storedLanguage() {
    try {
      return localStorage.getItem(LANG_KEY);
    } catch (err) {
      return null;
    }
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("lang");
      setLanguage(current === "en" ? "mr" : "en");
    });
  }

  var saved = storedLanguage();
  if (saved && saved !== "en") setLanguage(saved);

  /* ---------- scroll reveals ---------- */
  var revealTargets = document.querySelectorAll(".reveal");
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealTargets.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- hide header on scroll down, show on scroll up ---------- */
  var header = document.querySelector(".site-header");
  var lastY = window.scrollY;
  var HEADER_HIDE_THRESHOLD = 120;
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    if (header) {
      var goingDown = y > lastY && y > HEADER_HIDE_THRESHOLD;
      header.classList.toggle("is-hidden", goingDown);
    }
    lastY = y;
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );
})();
