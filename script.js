(function () {
  "use strict";

  var loader = document.getElementById("pageLoader");
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");
  var hero = document.querySelector(".hero");

  function hideLoader() {
    if (!loader) return;
    loader.classList.add("is-done");
    function removeNode() {
      loader.remove();
    }
    loader.addEventListener("transitionend", removeNode, { once: true });
    setTimeout(removeNode, 600);
  }

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

  var header = document.querySelector(".site-header");
  var headerHeight = header ? header.offsetHeight : 72;

  function updateHeroParallax() {
    if (!hero) return;
    var heroHeight = hero.offsetHeight;
    if (heroHeight <= 0) return;
    var scrollTop = window.scrollY || window.pageYOffset || 0;
    var progress = Math.max(0, Math.min(scrollTop / heroHeight, 1));
    var shift = Math.round(progress * 40);
    document.documentElement.style.setProperty("--hero-shift", shift + "px");
  }

  updateHeroParallax();
  window.addEventListener("scroll", updateHeroParallax, { passive: true });
  window.addEventListener("resize", updateHeroParallax);

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

  var profileButtons = document.querySelectorAll("[data-profile]");
  var profilePanels = document.querySelectorAll("[data-profile-panel]");

  function selectProfile(profileId) {
    profileButtons.forEach(function (btn) {
      var isActive = btn.getAttribute("data-profile") === profileId;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", String(isActive));
      btn.setAttribute("tabindex", isActive ? "0" : "-1");
    });

    profilePanels.forEach(function (panel) {
      var isActive = panel.getAttribute("data-profile-panel") === profileId;
      panel.classList.toggle("is-active", isActive);
      if (isActive) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "");
      }
    });
  }

  profileButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      selectProfile(btn.getAttribute("data-profile"));
    });

    btn.addEventListener("keydown", function (e) {
      var keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
      if (keys.indexOf(e.key) === -1) return;

      e.preventDefault();
      var buttons = Array.prototype.slice.call(profileButtons);
      var index = buttons.indexOf(btn);
      var nextIndex = index;

      if (e.key === "ArrowRight") nextIndex = (index + 1) % buttons.length;
      if (e.key === "ArrowLeft") nextIndex = (index - 1 + buttons.length) % buttons.length;
      if (e.key === "Home") nextIndex = 0;
      if (e.key === "End") nextIndex = buttons.length - 1;

      buttons[nextIndex].focus();
      selectProfile(buttons[nextIndex].getAttribute("data-profile"));
    });
  });

  if (profileButtons.length) {
    selectProfile("media");
  }
})();
