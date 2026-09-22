document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-year]").forEach((node) => {
        node.textContent = new Date().getFullYear();
    });

    const isInternalPage = window.location.pathname.includes("/pgs/");
    const base = isInternalPage ? "../" : "";

    const nav = document.querySelector(".terminal-nav");
    if (nav && !nav.querySelector("[data-nav-map]")) {
        nav.insertAdjacentHTML("beforeend",
            '<a data-nav-map href="' + base + 'pgs/network.html"><span>03</span> MAP</a>'
        );
    }

    const mobileNav = document.querySelector("#mobile-nav");
    if (mobileNav && !mobileNav.querySelector("[data-nav-map]")) {
        mobileNav.insertAdjacentHTML("beforeend",
            '<a data-nav-map href="' + base + 'pgs/network.html">03 / Map</a>'
        );
    }

    const toggle = document.querySelector(".nav-toggle");
    if (toggle && mobileNav) {
        toggle.addEventListener("click", () => {
            const open = toggle.getAttribute("aria-expanded") === "true";
            toggle.setAttribute("aria-expanded", String(!open));
            mobileNav.classList.toggle("is-open", !open);
        });
    }

    const workCount = document.querySelector("[data-work-count]");
    if (workCount) {
        fetch(base + "data/works.json")
            .then((response) => response.json())
            .then((manifest) => {
                const publicWorks = manifest.works.filter((work) => work.visibility !== "private");
                workCount.textContent = String(publicWorks.length).padStart(3, "0");
            })
            .catch(() => {
                workCount.textContent = "--";
            });
    }
});
