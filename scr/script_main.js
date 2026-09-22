document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-year]").forEach((node) => {
        node.textContent = new Date().getFullYear();
    });

    const workCount = document.querySelector("[data-work-count]");
    if (workCount) {
        fetch("data/works.json")
            .then((response) => response.json())
            .then((manifest) => {
                workCount.textContent = String(manifest.works.length).padStart(2, "0");
            })
            .catch(() => {
                workCount.textContent = "--";
            });
    }

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
    const archiveTable = document.querySelector("[data-archive-table]");
    const staticRows = document.querySelectorAll("[data-work]");
    const count = document.querySelector("[data-count]");

    const renderArchive = async () => {
        if (!archiveTable) return null;

        try {
            const response = await fetch("../data/works.json");
            if (!response.ok) throw new Error("Could not load works manifest.");
            const manifest = await response.json();

            const pageByMedium = {
                art: "art.html", animation: "animation.html", cgi: "cgi.html",
                audio: "audio.html", video: "video.html", vocal: "vocal.html",
                interactive: "interactive.html", software: "software.html",
                games: "games.html", installation: "art.html", performance: "documentation.html"
            };

            archiveTable.innerHTML = manifest.works.map((work) => {
                const medium = work.medium[0] || "archive";
                const page = pageByMedium[medium] || "documentation.html";
                const hash = work.id ? "#" + work.id : "";
                const displayMedium = (work.medium[0] || "archive").replace(/^./, (letter) => letter.toUpperCase());
                return `<a class="archive-row" data-work data-medium="${work.medium.join(" ")}" href="${page}${hash}">
                    <span>${work.year}</span>
                    <strong>${work.title}</strong>
                    <span>${displayMedium}</span>
                    <span>${work.description}</span>
                    <span>↗</span>
                </a>`;
            }).join("");

            return archiveTable.querySelectorAll("[data-work]");
        } catch (error) {
            console.warn(error);
            return staticRows;
        }
    };

    const applyArchiveFilter = (filter, rows) => {
        let visible = 0;
        rows.forEach((row) => {
            const media = row.dataset.medium || "";
            const match = filter === "all" || media.split(" ").includes(filter);
            row.classList.toggle("is-hidden", !match);
            if (match) visible += 1;
        });
        if (count) count.textContent = String(visible).padStart(2, "0") + " works";
    };

    const initArchive = async () => {
        const rows = await renderArchive();
        if (!rows || !rows.length) return;

        applyArchiveFilter("all", rows);

        filters.forEach((button) => {
            button.addEventListener("click", () => {
                filters.forEach((item) => item.classList.remove("is-active"));
                button.classList.add("is-active");
                applyArchiveFilter(button.dataset.filter, rows);
            });
        });
    };

    initArchive();
});
