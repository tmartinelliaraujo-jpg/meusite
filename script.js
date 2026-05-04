(function () {
  "use strict";

  var THEME_KEY = "tm-portfolio-theme";
  var html = document.documentElement;
  var loader = document.getElementById("pageLoader");
  var themeToggle = document.getElementById("themeToggle");
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");
  var yearEl = document.getElementById("year");

  function applyTheme(theme) {
    if (theme !== "light" && theme !== "dark") return;
    html.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}
  }

  function initTheme() {
    var stored = null;
    try {
      stored = localStorage.getItem(THEME_KEY);
    } catch (e) {}
    if (stored === "light" || stored === "dark") {
      applyTheme(stored);
    }
  }

  function hideLoader() {
    if (!loader) return;
    loader.classList.add("is-done");
    function removeNode() {
      loader.remove();
    }
    loader.addEventListener("transitionend", removeNode, { once: true });
    setTimeout(removeNode, 600);
  }

  initTheme();

  if (document.readyState === "complete") {
    requestAnimationFrame(function () {
      setTimeout(hideLoader, 320);
    });
  } else {
    window.addEventListener("load", function () {
      requestAnimationFrame(function () {
        setTimeout(hideLoader, 320);
      });
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next =
        html.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      navToggle.setAttribute(
        "aria-label",
        open ? "Abrir menu" : "Fechar menu"
      );
      navMenu.classList.toggle("is-open", !open);
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Abrir menu");
        navMenu.classList.remove("is-open");
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Abrir menu");
        navMenu.classList.remove("is-open");
      }
    });
  }

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var header = document.querySelector(".site-header");
  var headerHeight = header ? header.offsetHeight : 72;

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        12;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });
})();
