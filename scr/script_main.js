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

    const filters = document.querySelectorAll("[data-filter]");
    const rows = document.querySelectorAll("[data-work]");
    const count = document.querySelector("[data-count]");

    const updateArchive = (filter) => {
        let visible = 0;
        rows.forEach((row) => {
            const match = filter === "all" || row.dataset.medium === filter;
            row.classList.toggle("is-hidden", !match);
            if (match) visible += 1;
        });
        if (count) count.textContent = String(visible).padStart(2, "0") + " works";
    };

    if (filters.length && rows.length) {
        updateArchive("all");
        filters.forEach((button) => {
            button.addEventListener("click", () => {
                filters.forEach((item) => item.classList.remove("is-active"));
                button.classList.add("is-active");
                updateArchive(button.dataset.filter);
            });
        });
    }
});
