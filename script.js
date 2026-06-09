(function () {
  "use strict";

  var html = document.documentElement;
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

  // Multi-carousel logic
  const carouselRegistry = {};

  function setupCarousel(carouselId, prevId, nextId) {
    const carousel = document.getElementById(carouselId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);

    if (carousel && prevBtn && nextBtn) {
      // Only add listeners once per button pair
      if (!prevBtn.dataset.hasListener) {
        prevBtn.addEventListener("click", function () {
          const activeCarousel = carouselRegistry[prevId]?.find(c => c.style.display !== 'none');
          if (activeCarousel) {
            activeCarousel.scrollBy({ left: -activeCarousel.offsetWidth, behavior: 'smooth' });
          }
        });
        prevBtn.dataset.hasListener = "true";
      }

      if (!nextBtn.dataset.hasListener) {
        nextBtn.addEventListener("click", function () {
          const activeCarousel = carouselRegistry[nextId]?.find(c => c.style.display !== 'none');
          if (activeCarousel) {
            activeCarousel.scrollBy({ left: activeCarousel.offsetWidth, behavior: 'smooth' });
          }
        });
        nextBtn.dataset.hasListener = "true";
      }

      function toggleArrows() {
        const isVisible = carousel.style.display !== 'none';
        if (!isVisible) return;
        
        prevBtn.style.display = "flex";
        nextBtn.style.display = "flex";
      }

      window.addEventListener("resize", toggleArrows);
      
      // Register
      if (!carouselRegistry[prevId]) carouselRegistry[prevId] = [];
      if (!carouselRegistry[nextId]) carouselRegistry[nextId] = [];
      carouselRegistry[prevId].push(carousel);
      carouselRegistry[nextId].push(carousel);
      
      return toggleArrows;
    }
  }

  const projectArrows = setupCarousel("projectCarousel", "prevProject", "nextProject");
  const mediaProjectArrows = setupCarousel("mediaProjectCarousel", "prevProject", "nextProject");
  const devsArrows = setupCarousel("resumeCarousel", "prevResume", "nextResume");
  const mediaArrows = setupCarousel("mediaCarousel", "prevResume", "nextResume");

  // Initialize arrow visibility
  if (projectArrows) projectArrows();
  if (devsArrows) devsArrows();

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

  // Team Switcher Logic
  var teamSwitcher = document.getElementById('teamSwitcher');
  var tab1 = document.getElementById('tab1');
  var tab2 = document.getElementById('tab2');
  var indicator = document.getElementById('teamIndicator');

  function updateIndicator(activeTab) {
    if (!indicator || !activeTab) return;
    const rect = activeTab.getBoundingClientRect();
    const switcherRect = teamSwitcher.getBoundingClientRect();
    
    indicator.style.width = rect.width + 'px';
    indicator.style.left = (rect.left - switcherRect.left) + 'px';
  }

  window.switchTeam = function(team) {
    if (!teamSwitcher || !tab1 || !tab2) return;

    const devsGroup = document.getElementById('resumeCarousel');
    const mediaGroup = document.getElementById('mediaCarousel');
    const devProjects = document.getElementById('projectCarousel');
    const mediaProjects = document.getElementById('mediaProjectCarousel');
    const teamCountSpan = document.getElementById('teamCount');

    if (team === 'media') {
      tab1.classList.remove('active');
      tab2.classList.add('active');
      updateIndicator(tab2);
      
      if (devsGroup) devsGroup.style.display = 'none';
      if (mediaGroup) mediaGroup.style.display = 'flex';
      if (devProjects) devProjects.style.display = 'none';
      if (mediaProjects) mediaProjects.style.display = 'flex';
      
      if (teamCountSpan && mediaGroup) {
        teamCountSpan.textContent = mediaGroup.querySelectorAll('.project-card').length;
      }
    } else {
      tab2.classList.remove('active');
      tab1.classList.add('active');
      updateIndicator(tab1);
      
      if (devsGroup) devsGroup.style.display = 'flex';
      if (mediaGroup) mediaGroup.style.display = 'none';
      if (devProjects) devProjects.style.display = 'flex';
      if (mediaProjects) mediaProjects.style.display = 'none';

      if (teamCountSpan && devsGroup) {
        teamCountSpan.textContent = devsGroup.querySelectorAll('.project-card').length;
      }

      // Update arrows visibility
      if (projectArrows) projectArrows();
      if (mediaProjectArrows) mediaProjectArrows();
      if (devsArrows) devsArrows();
      if (mediaArrows) mediaArrows();
    }
  };

  if (teamSwitcher) {
    window.addEventListener('load', () => {
      setTimeout(() => updateIndicator(tab1), 100);
    });
    window.addEventListener('resize', () => {
      const active = teamSwitcher.querySelector('.team-tab.active');
      updateIndicator(active);
    });
  }

  var mediaGalleries = {
    "carros-rua": {
      title: "Carros de Rua",
      photos: [
        "images/galeria/carros-de-rua/20260602_170711(1).jpg.jpeg",
        "images/galeria/carros-de-rua/20260602_170739(2).jpg.jpeg",
        "images/galeria/carros-de-rua/20260602_171542(2).jpg.jpeg",
        "images/galeria/carros-de-rua/20260602_171720(0).jpg.jpeg",
        "images/galeria/carros-de-rua/IMG-20260603-WA0012.jpg.jpeg",
        "images/galeria/carros-de-rua/IMG-20260603-WA0013(1).jpg.jpeg",
        "images/galeria/carros-de-rua/IMG-20260603-WA0014.jpg.jpeg",
        "images/galeria/carros-de-rua/IMG-20260603-WA0015.jpg.jpeg",
        "images/galeria/carros-de-rua/WhatsApp Image 2026-06-05 at 13.11.47.jpeg",
        "images/galeria/carros-de-rua/WhatsApp Image 2026-06-05 at 13.11.48.jpeg",
        "images/galeria/carros-de-rua/WhatsApp Imjage 2026-06-05 at 13.11.48.jpeg",
        "images/galeria/carros-de-rua/20260607_150638.jpg.jpeg",
        "images/galeria/carros-de-rua/20260609_134638.jpg.jpeg",
        "images/galeria/carros-de-rua/20260609_135406.jpg.jpeg",
        "images/galeria/carros-de-rua/20260609_135757.jpg.jpeg"
      ]
    },
    "cobertura-eventos": {
      title: "Cobertura em Eventos",
      photos: []
    }
  };

  var photoGalleryEl = document.getElementById("photoGallery");
  var photoGalleryTitle = document.getElementById("photoGalleryTitle");
  var photoGalleryBody = document.getElementById("photoGalleryBody");
  var photoLightboxEl = document.getElementById("photoLightbox");
  var photoLightboxImg = document.getElementById("photoLightboxImg");
  var galleryCloseTrigger = null;
  var lightboxReturnFocus = null;

  function closePhotoLightbox() {
    if (!photoLightboxEl || !photoLightboxImg) return;
    photoLightboxEl.hidden = true;
    photoLightboxEl.setAttribute("aria-hidden", "true");
    photoLightboxImg.removeAttribute("src");
    if (lightboxReturnFocus && typeof lightboxReturnFocus.focus === "function") {
      lightboxReturnFocus.focus();
    }
    lightboxReturnFocus = null;
  }

  function openPhotoLightbox(src, alt, triggerEl) {
    if (!photoLightboxEl || !photoLightboxImg) return;
    lightboxReturnFocus = triggerEl || null;
    photoLightboxImg.src = src;
    photoLightboxImg.alt = alt || "";
    photoLightboxEl.hidden = false;
    photoLightboxEl.setAttribute("aria-hidden", "false");
    photoLightboxEl.querySelector(".photo-lightbox__close").focus();
  }

  function closePhotoGallery() {
    if (!photoGalleryEl) return;
    photoGalleryEl.hidden = true;
    photoGalleryEl.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-gallery-open");
    if (galleryCloseTrigger && typeof galleryCloseTrigger.focus === "function") {
      galleryCloseTrigger.focus();
    }
    galleryCloseTrigger = null;
  }

  function openPhotoGallery(galleryId, triggerEl) {
    if (!photoGalleryEl || !photoGalleryBody || !photoGalleryTitle) return;

    var gallery = mediaGalleries[galleryId];
    if (!gallery) return;

    galleryCloseTrigger = triggerEl || null;
    photoGalleryTitle.textContent = gallery.title;
    photoGalleryBody.innerHTML = "";

    if (!gallery.photos.length) {
      var empty = document.createElement("p");
      empty.className = "photo-gallery__empty";
      empty.textContent = "sem fotos";
      photoGalleryBody.appendChild(empty);
    } else {
      var grid = document.createElement("div");
      grid.className = "photo-gallery__grid";

      gallery.photos.forEach(function (src, index) {
        var item = document.createElement("button");
        item.type = "button";
        item.className = "photo-gallery__item";
        item.setAttribute("aria-label", gallery.title + " — foto " + (index + 1));

        var img = document.createElement("img");
        img.src = encodeURI(src);
        img.alt = gallery.title + " " + (index + 1);
        img.loading = "lazy";

        item.appendChild(img);
        item.addEventListener("click", function () {
          openPhotoLightbox(encodeURI(src), img.alt, item);
        });
        grid.appendChild(item);
      });

      photoGalleryBody.appendChild(grid);
    }

    photoGalleryEl.hidden = false;
    photoGalleryEl.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-gallery-open");
    photoGalleryEl.querySelector(".photo-gallery__close").focus();
  }

  document.querySelectorAll("[data-gallery]").forEach(function (card) {
    card.addEventListener("click", function () {
      openPhotoGallery(card.getAttribute("data-gallery"), card);
    });
  });

  if (photoGalleryEl) {
    photoGalleryEl.querySelectorAll("[data-gallery-close]").forEach(function (el) {
      el.addEventListener("click", closePhotoGallery);
    });
  }

  if (photoLightboxEl) {
    photoLightboxEl.querySelectorAll("[data-lightbox-close]").forEach(function (el) {
      el.addEventListener("click", closePhotoLightbox);
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (photoLightboxEl && !photoLightboxEl.hidden) {
      closePhotoLightbox();
      return;
    }
    if (photoGalleryEl && !photoGalleryEl.hidden) {
      closePhotoGallery();
      return;
    }
    if (resumeModalEl && !resumeModalEl.hidden) {
      closeResumeModal();
    }
  });

  var teamProfiles = {
    taoa: {
      id: "OP-02",
      name: "Taoã Araújo",
      role: "Profissional - Júnior",
      photo: "images/taoa.jpeg",
      dados: [
        { label: "Nome completo", value: "Taoã Augusto Martinelli de Araújo" },
        { label: "Data de nascimento", value: "30/03/2007" },
        { label: "Telefone", value: "(61) 9.9663-3075" },
        { label: "E-mail", value: "tmartinelliaraujo@gmail.com" },
        { label: "Cidade", value: "Cidade Ocidental" },
        { label: "Estado", value: "Goiás" },
        { label: "Estado civil", value: "Solteiro" }
      ],
      details: [
        "A atuação em programação começou de forma recreativa no ensino médio, onde era feito automações, sistemas e até mini games.",
        "Trabalhar na área de programação é uma escolha de todo dia evoluir profissional e pessoal.",
        "Capacidade em liderar de forma prática e empática.",
        "Aprendizado com curva média.",
        "Aprendizado maior em prática."
      ],
      experiences: [
        {
          org: "Automações",
          period: "Atuação recorrente",
          desc: "Criação de fluxos para reduzir tarefas manuais, padronizar processos e aumentar produtividade em rotinas operacionais."
        },
        {
          org: "Engenharia de prompt",
          period: "Aplicação prática",
          desc: "Construção e refinamento de prompts para melhorar qualidade de respostas, consistência e eficiência em soluções com IA."
        },
        {
          org: "Projetos e colaboração",
          period: "Execução em equipe",
          desc: "Condução de entregas com times multidisciplinares, alinhando objetivos, escopo e qualidade técnica."
        },
        {
          org: "Ensinar",
          period: "Compartilhamento contínuo",
          desc: "Mentoria e repasse de conhecimento técnico para acelerar aprendizado de pessoas e fortalecer o time."
        },
        {
          org: "Liderar",
          period: "Atuação em times",
          desc: "Coordenação de pessoas e prioridades para manter foco, ritmo de entrega e qualidade nas execuções."
        },
        {
          org: "Designers",
          period: "Colaboração constante",
          desc: "Trabalho próximo com designers para transformar requisitos em interfaces funcionais, coerentes e com boa experiência."
        },
        {
          org: "Inglês de nível médio",
          period: "Vivência internacional",
          desc: "Desenvolvimento do idioma com experiência prática após morar no exterior por um ano."
        },
        {
          org: "Vibe code",
          period: "Prática contínua",
          desc: "Desenvolvimento acelerado com apoio de IA, iterando rápido de ideia a protótipo funcional."
        }
      ],
      certificates: [
        "Python I 40Hrs - Curso em Vídeo",
        "Python II 40Hrs - Curso em Vídeo",
        "Python III 40Hrs - Curso em Vídeo",
        "Inteligência Artificial I 40Hrs - Curso em Vídeo",
        "HTML I 40Hrs - Curso em Vídeo",
        "CSS I 40Hrs - Curso em Vídeo",
        "Kubernetes 17Hrs - Udemy"
      ],
      skills: [
        "Python III",
        "JavaScript II",
        "TypeScript I",
        "HTML II",
        "CSS II",
        "React II",
        "Node I",
        "Rest II",
        "Testes II",
        "Inglês II"
      ],
      idiomas: ["Português", "Inglês", "Espanhol"],
      tools: [
        "VSCode",
        "Cursor",
        "Antigravity",
        "FlutterFlow",
        "Mulesoft",
        "GitHub",
        "GitLab",
        "Docker",
        "Postman",
        "Figma",
        "N8n",
        "RPA",
        "Kubernetes"
      ]
    }
  };

  var resumeModalEl = document.getElementById("resumeModal");
  var resumeModalId = document.getElementById("resumeModalId");
  var resumeModalTitle = document.getElementById("resumeModalTitle");
  var resumeModalRole = document.getElementById("resumeModalRole");
  var resumeModalPhoto = document.getElementById("resumeModalPhoto");
  var resumeModalBody = document.getElementById("resumeModalBody");
  var resumeCloseTrigger = null;

  function renderResumeSection(title, contentHtml) {
    return (
      '<section class="resume-section">' +
      '<h3 class="resume-section__title">' + title + "</h3>" +
      contentHtml +
      "</section>"
    );
  }

  function renderResumeTags(items) {
    return (
      '<ul class="resume-tags">' +
      items.map(function (item) {
        return '<li class="resume-tags__item">' + item + "</li>";
      }).join("") +
      "</ul>"
    );
  }

  function openResumeModal(profileId, triggerEl) {
    if (!resumeModalEl || !resumeModalBody) return;

    var profile = teamProfiles[profileId];
    if (!profile) return;

    resumeCloseTrigger = triggerEl || null;

    if (resumeModalId) resumeModalId.textContent = profile.id;
    if (resumeModalTitle) resumeModalTitle.textContent = profile.name;
    if (resumeModalRole) resumeModalRole.textContent = profile.role;
    if (resumeModalPhoto) {
      resumeModalPhoto.src = profile.photo;
      resumeModalPhoto.alt = profile.name;
    }

    var dadosHtml =
      '<dl class="resume-dados">' +
      profile.dados.map(function (item) {
        return (
          '<div class="resume-dados__row">' +
          '<dt>' + item.label + "</dt>" +
          '<dd>' + item.value + "</dd>" +
          "</div>"
        );
      }).join("") +
      "</dl>";

    var detailsHtml =
      '<ul class="resume-list">' +
      profile.details.map(function (detail) {
        return '<li class="resume-list__item">' + detail + "</li>";
      }).join("") +
      "</ul>";

    var experiencesHtml =
      '<div class="resume-experiences">' +
      profile.experiences.map(function (exp) {
        return (
          '<article class="resume-experience">' +
          '<h4 class="resume-experience__org">' + exp.org + "</h4>" +
          '<p class="resume-experience__period">' + exp.period + "</p>" +
          '<p class="resume-experience__desc">' + exp.desc + "</p>" +
          "</article>"
        );
      }).join("") +
      "</div>";

    var certificatesHtml =
      '<ul class="resume-list resume-list--certs">' +
      profile.certificates.map(function (cert) {
        return '<li class="resume-list__item">' + cert + "</li>";
      }).join("") +
      "</ul>";

    resumeModalBody.innerHTML =
      renderResumeSection("Dados", dadosHtml) +
      renderResumeSection("Detalhes", detailsHtml) +
      renderResumeSection("Experiências", experiencesHtml) +
      renderResumeSection("Certificados", certificatesHtml) +
      renderResumeSection("Habilidades", renderResumeTags(profile.skills)) +
      renderResumeSection("Idiomas", renderResumeTags(profile.idiomas)) +
      renderResumeSection("Ferramentas", renderResumeTags(profile.tools));

    resumeModalEl.hidden = false;
    resumeModalEl.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-resume-open");
    resumeModalEl.querySelector(".resume-modal__close").focus();
  }

  function closeResumeModal() {
    if (!resumeModalEl) return;
    resumeModalEl.hidden = true;
    resumeModalEl.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-resume-open");
    if (resumeCloseTrigger && typeof resumeCloseTrigger.focus === "function") {
      resumeCloseTrigger.focus();
    }
    resumeCloseTrigger = null;
  }

  document.querySelectorAll("[data-profile]").forEach(function (card) {
    card.addEventListener("click", function () {
      openResumeModal(card.getAttribute("data-profile"), card);
    });

    card.querySelectorAll("[data-profile-link]").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    });

    if (card.getAttribute("role") === "button") {
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openResumeModal(card.getAttribute("data-profile"), card);
        }
      });
    }
  });

  if (resumeModalEl) {
    resumeModalEl.querySelectorAll("[data-resume-close]").forEach(function (el) {
      el.addEventListener("click", closeResumeModal);
    });
  }
})();
