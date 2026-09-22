document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-year]").forEach((node) => {
        node.textContent = new Date().getFullYear();
    });

    const toggle = document.querySelector(".nav-toggle");
    const mobileNav = document.querySelector("#mobile-nav");

    if (toggle && mobileNav) {
        toggle.addEventListener("click", () => {
            const open = toggle.getAttribute("aria-expanded") === "true";
            toggle.setAttribute("aria-expanded", String(!open));
            mobileNav.classList.toggle("is-open", !open);
        });
    }

    const workCount = document.querySelector("[data-work-count]");
    if (workCount) {
        fetch("data/works.json")
            .then((response) => response.json())
            .then((manifest) => {
                workCount.textContent = String(manifest.works.length).padStart(3, "0");
            })
            .catch(() => {
                workCount.textContent = "--";
            });
    }
});
