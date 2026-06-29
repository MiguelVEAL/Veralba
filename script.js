const root = document.documentElement;
const currentScript = document.currentScript;
const siteRoot = new URL(".", currentScript?.src || window.location.href);
const storedTheme = localStorage.getItem("portfolio-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

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

async function loadNavbar() {
  const slots = document.querySelectorAll("[data-navbar]");
  if (!slots.length) return;

  try {
    const response = await fetch(new URL("components/navbar.html", siteRoot));
    if (!response.ok) throw new Error(`Navbar request failed: ${response.status}`);
    const navbarHtml = (await response.text()).replaceAll("__ROOT__", siteRoot.href);
    slots.forEach((slot) => {
      slot.innerHTML = navbarHtml;
    });
  } catch (error) {
    console.error(error);
  }
}

applyTheme(storedTheme || (prefersDark ? "dark" : "light"));

loadNavbar().then(() => {
  initThemeToggle();
  initNavbarInteractions();
});

initProjectGallery();
