const root = document.documentElement;
const siteRoot = "/";
const storedTheme = localStorage.getItem("portfolio-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

const navbarTemplate = `
<nav class="navbar navbar-expand-lg fixed-top portfolio-nav">
  <div class="container">
    <a class="navbar-brand fw-black" href="${siteRoot}index.html#inicio">Miguel Vergara</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#mainNav" aria-controls="mainNav" aria-label="Abrir navegación">
      <i class="bi bi-list"></i>
    </button>
    <div class="offcanvas-lg offcanvas-end nav-offcanvas" tabindex="-1" id="mainNav" aria-labelledby="mainNavLabel">
      <div class="offcanvas-header">
        <h2 class="offcanvas-title" id="mainNavLabel">Miguel Vergara</h2>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#mainNav" aria-label="Cerrar navegación"></button>
      </div>
      <div class="offcanvas-body">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
          <li class="nav-item"><a class="nav-link" href="${siteRoot}index.html#sobre-mi">Sobre mí</a></li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="${siteRoot}index.html#proyectos" id="projectsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">Proyectos</a>
            <ul class="dropdown-menu portfolio-dropdown" aria-labelledby="projectsDropdown">
              <li><a class="dropdown-item" href="${siteRoot}index.html#proyectos"><i class="bi bi-grid-1x2-fill"></i> Todos los proyectos</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="${siteRoot}proyectos/redisenio-sitio-corporativo.html"><i class="bi bi-window-sidebar"></i> Sitio corporativo</a></li>
              <li><a class="dropdown-item" href="${siteRoot}proyectos/lanzamiento-producto-ia.html"><i class="bi bi-stars"></i> Producto IA</a></li>
              <li><a class="dropdown-item" href="${siteRoot}proyectos/tienda-seraphia.html"><i class="bi bi-bag-check-fill"></i> Tienda Seraphia</a></li>
              <li><a class="dropdown-item" href="${siteRoot}proyectos/contenido-visual-freelance.html"><i class="bi bi-camera-reels-fill"></i> Contenido visual</a></li>
            </ul>
          </li>
          <li class="nav-item"><a class="nav-link" href="${siteRoot}index.html#certificaciones">Certificaciones</a></li>
          <li class="nav-item"><a class="nav-link" href="${siteRoot}index.html#enlaces">Enlaces</a></li>
          <li class="nav-item"><a class="nav-link" href="${siteRoot}index.html#contacto">Contacto</a></li>
        </ul>
        <button class="theme-toggle ms-lg-3" id="themeToggle" type="button" aria-label="Cambiar modo de color">
          <i class="bi bi-sun-fill"></i>
          <span>Claro</span>
        </button>
      </div>
    </div>
  </div>
</nav>`;

function getThemeToggle() {
  return document.querySelector("#themeToggle");
}

function applyTheme(theme) {
  root.setAttribute("data-bs-theme", theme);
  const themeToggle = getThemeToggle();
  if (!themeToggle) return;

  const isDark = theme === "dark";
  themeToggle.innerHTML = isDark
    ? '<i class="bi bi-moon-stars-fill"></i><span>Oscuro</span>'
    : '<i class="bi bi-sun-fill"></i><span>Claro</span>';
}

function initThemeToggle() {
  const themeToggle = getThemeToggle();
  applyTheme(root.getAttribute("data-bs-theme") || storedTheme || (prefersDark ? "dark" : "light"));

  themeToggle?.addEventListener("click", () => {
    const nextTheme = root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    localStorage.setItem("portfolio-theme", nextTheme);
    applyTheme(nextTheme);
  });
}

function initNavbarInteractions() {
  document.querySelectorAll(".navbar-nav a[href]").forEach((link) => {
    link.addEventListener("click", () => {
      if (link.classList.contains("dropdown-toggle")) return;

      const nav = document.querySelector("#mainNav");
      if (!nav || !window.bootstrap) return;

      const offcanvas = bootstrap.Offcanvas.getInstance(nav);
      offcanvas?.hide();
    });
  });
}

function ensureGalleryModal() {
  let modal = document.querySelector("#galleryModal");
  if (modal) return modal;

  document.body.insertAdjacentHTML(
    "beforeend",
    `<div class="modal fade gallery-modal" id="galleryModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title fs-5" id="galleryModalTitle">Imagen del proyecto</h2>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body">
            <img class="gallery-modal-image" id="galleryModalImage" src="" alt="">
            <div class="gallery-modal-placeholder d-none" id="galleryModalPlaceholder">
              <i class="bi bi-image"></i>
              <span>Imagen pendiente</span>
            </div>
          </div>
        </div>
      </div>
    </div>`
  );

  return document.querySelector("#galleryModal");
}

function initProjectGallery() {
  const galleryItems = document.querySelectorAll(".gallery-item");
  if (!galleryItems.length) return;

  galleryItems.forEach((item) => {
    const image = item.querySelector("img");

    image?.addEventListener("error", () => {
      item.classList.add("is-empty");
      image.remove();
    });

    if (image?.complete && image.naturalWidth === 0) {
      item.classList.add("is-empty");
      image.remove();
    }

    item.addEventListener("click", () => {
      const fullImage = item.dataset.galleryFull;
      const title = item.dataset.galleryTitle || "Imagen del proyecto";
      const modal = ensureGalleryModal();
      const modalTitle = modal.querySelector("#galleryModalTitle");
      const modalImage = modal.querySelector("#galleryModalImage");
      const modalPlaceholder = modal.querySelector("#galleryModalPlaceholder");

      modalTitle.textContent = title;
      modalImage.alt = title;
      modalImage.classList.remove("d-none");
      modalPlaceholder.classList.add("d-none");

      modalImage.onerror = () => {
        modalImage.classList.add("d-none");
        modalPlaceholder.classList.remove("d-none");
      };

      modalImage.src = fullImage;

      if (!window.bootstrap) return;
      bootstrap.Modal.getOrCreateInstance(modal).show();
    });
  });
}

function loadNavbar() {
  const slots = document.querySelectorAll("[data-navbar]");
  if (!slots.length) return;

  slots.forEach((slot) => {
    slot.innerHTML = navbarTemplate;
  });
}

applyTheme(storedTheme || (prefersDark ? "dark" : "light"));

loadNavbar();
initThemeToggle();
initNavbarInteractions();

initProjectGallery();
