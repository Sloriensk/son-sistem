/* =========================
   MOBILE MENU
========================= */

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

if (menuBtn && navMenu) {

  menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("open");

    menuBtn.textContent =
      navMenu.classList.contains("open")
        ? "✕"
        : "☰";
  });


  navMenu.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

      navMenu.classList.remove("open");

      menuBtn.textContent = "☰";

    });

  });

}


/* =========================
   CURRENT YEAR
========================= */

const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}


/* =========================
   INSPIRATION SEARCH
========================= */

const searchBtn = document.getElementById("searchBtn");
const inspirationQuery = document.getElementById("inspirationQuery");

function searchInspiration() {

  const query = inspirationQuery.value.trim();

  if (!query) {

    inspirationQuery.focus();

    return;
  }

  const searchText =
    `${query} web design inspiration`;

  const url =
    `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(searchText)}`;

  window.open(url, "_blank");

}


if (searchBtn) {

  searchBtn.addEventListener(
    "click",
    searchInspiration
  );

}


if (inspirationQuery) {

  inspirationQuery.addEventListener(
    "keydown",
    event => {

      if (event.key === "Enter") {

        event.preventDefault();

        searchInspiration();

      }

    }
  );

}


/* =========================
   SCROLL REVEAL
========================= */

const revealElements = document.querySelectorAll(
  ".service-card, .project-card, .opportunity-card, .roadmap-item, .process-item"
);


const observer = new IntersectionObserver(
  entries => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";

        observer.unobserve(entry.target);

      }

    });

  },
  {
    threshold: 0.08
  }
);


revealElements.forEach(element => {

  element.style.opacity = "0";
  element.style.transform = "translateY(20px)";
  element.style.transition =
    "opacity .6s ease, transform .6s ease";

  observer.observe(element);

});


/* =========================
   SMOOTH NAVIGATION
========================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {

  link.addEventListener("click", event => {

    const targetId =
      link.getAttribute("href");

    const target =
      document.querySelector(targetId);

    if (!target) return;

    event.preventDefault();

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  });

});
