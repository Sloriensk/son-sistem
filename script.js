/* =========================
   VIOLET STUDIO
   ========================= */


/* MOBILE MENU */

const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");

if (menuButton && mobileMenu) {

    menuButton.addEventListener("click", () => {
        mobileMenu.classList.toggle("open");

        menuButton.textContent =
            mobileMenu.classList.contains("open") ? "×" : "☰";
    });

    document.querySelectorAll(".mobile-menu a").forEach(link => {

        link.addEventListener("click", () => {

            mobileMenu.classList.remove("open");
            menuButton.textContent = "☰";

        });

    });
}


/* NAVBAR */

const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 30) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

});


/* CURSOR GLOW */

const cursorGlow = document.querySelector(".cursor-glow");

if (cursorGlow && window.innerWidth > 800) {

    document.addEventListener("mousemove", event => {

        cursorGlow.style.left = event.clientX + "px";
        cursorGlow.style.top = event.clientY + "px";

    });

}


/* SCROLL REVEAL */

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                revealObserver.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.12
    }
);

revealElements.forEach(element => {
    revealObserver.observe(element);
});


/* INSPIRATION SEARCH */

const inspirationInput =
    document.getElementById("inspirationInput");

const searchButton =
    document.getElementById("searchButton");

function searchInternet(query) {

    const cleanQuery = query.trim();

    if (!cleanQuery) {

        showToast("Önce ne aramak istediğini yaz.");

        inspirationInput.focus();

        return;
    }

    const googleUrl =
        "https://www.google.com/search?q=" +
        encodeURIComponent(cleanQuery + " design inspiration");

    window.open(googleUrl, "_blank", "noopener,noreferrer");

}


if (searchButton) {

    searchButton.addEventListener("click", () => {

        searchInternet(inspirationInput.value);

    });

}


if (inspirationInput) {

    inspirationInput.addEventListener("keydown", event => {

        if (event.key === "Enter") {

            event.preventDefault();

            searchInternet(inspirationInput.value);

        }

    });

}


/* QUICK SEARCH */

document.querySelectorAll(".quick-searches button")
    .forEach(button => {

        button.addEventListener("click", () => {

            searchInternet(button.dataset.search);

        });

    });


/* FORM */

const projectForm =
    document.getElementById("projectForm");

const formStatus =
    document.getElementById("formStatus");

if (projectForm) {

    projectForm.addEventListener("submit", async event => {

        event.preventDefault();

        const submitButton =
            projectForm.querySelector(".form-submit");

        const originalText =
            submitButton.innerHTML;

        submitButton.disabled = true;

        submitButton.innerHTML =
            "Gönderiliyor...";

        formStatus.textContent = "";

        try {

            const response = await fetch(
                projectForm.action,
                {
                    method: "POST",
                    body: new FormData(projectForm),
                    headers: {
                        "Accept": "application/json"
                    }
                }
            );

            if (response.ok) {

                projectForm.reset();

                formStatus.textContent =
                    "Proje talebin başarıyla gönderildi. ✓";

                showToast(
                    "Proje talebin başarıyla gönderildi."
                );

            } else {

                let data = {};

                try {
                    data = await response.json();
                } catch (error) {}

                if (data.errors) {

                    formStatus.textContent =
                        data.errors
                            .map(error => error.message)
                            .join(", ");

                } else {

                    formStatus.textContent =
                        "Gönderim sırasında bir sorun oluştu.";

                }

            }

        } catch (error) {

            formStatus.textContent =
                "İnternet bağlantısını kontrol edip tekrar dene.";

        } finally {

            submitButton.disabled = false;

            submitButton.innerHTML =
                originalText;

        }

    });

}


/* TOAST */

const toast =
    document.getElementById("toast");

let toastTimeout;

function showToast(message) {

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {

        toast.classList.remove("show");

    }, 3500);

}


/* CURRENT YEAR */

const year =
    document.getElementById("year");

if (year) {

    year.textContent =
        new Date().getFullYear();

}


/* SERVICE CARDS MICRO EFFECT */

document.querySelectorAll(".service-card")
    .forEach(card => {

        card.addEventListener("mousemove", event => {

            const rect =
                card.getBoundingClientRect();

            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;

            const rotateX =
                ((y / rect.height) - 0.5) * -4;

            const rotateY =
                ((x / rect.width) - 0.5) * 4;

            card.style.transform =
                `perspective(700px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateY(-5px)`;

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform = "";

        });

    });
