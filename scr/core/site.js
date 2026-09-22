document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-year]").forEach((node) => {
        node.textContent = new Date().getFullYear();
    });

    const isInternalPage = window.location.pathname.includes("/pgs/");
    const base = isInternalPage ? "../" : "";

    const nav = document.querySelector(".terminal-nav");
    if (nav && !nav.querySelector("[data-nav-map]")) {
        const docsLink = nav.querySelector('a[href*="documentation.html"]');
        const mapLink = '<a data-nav-map href="' + base + 'pgs/network.html"><span>03</span> MAP</a>';
        if (docsLink) docsLink.insertAdjacentHTML("beforebegin", mapLink);
        else nav.insertAdjacentHTML("beforeend", mapLink);
    }

    const mobileNav = document.querySelector("#mobile-nav");
    if (mobileNav && !mobileNav.querySelector("[data-nav-map]")) {
        const mobileDocs = mobileNav.querySelector('a[href*="documentation.html"]');
        const mobileMap = '<a data-nav-map href="' + base + 'pgs/network.html">03 / Map</a>';
        if (mobileDocs) mobileDocs.insertAdjacentHTML("beforebegin", mobileMap);
        else mobileNav.insertAdjacentHTML("beforeend", mobileMap);
    }

    const toggle = document.querySelector(".nav-toggle");
    if (toggle && mobileNav) {
        toggle.addEventListener("click", () => {
            const open = toggle.getAttribute("aria-expanded") === "true";
            toggle.setAttribute("aria-expanded", String(!open));
            mobileNav.classList.toggle("is-open", !open);
        });
    }

    const directoryCounts = document.querySelectorAll("[data-directory-count]");

    const updateDirectoryCounts = (publicWorks) => {
        const directoryFilters = {
            all: () => true,
            visual: (work) => (work.medium || []).some((m) => ["art", "painting", "drawing", "installation", "cgi"].includes(m)),
            sound: (work) => (work.medium || []).includes("audio"),
            voice: (work) => (work.medium || []).includes("vocal"),
            motion: (work) => (work.medium || []).some((m) => ["animation", "video"].includes(m)),
            systems: (work) => (work.medium || []).some((m) => ["software", "interactive"].includes(m)),
            documentation: (work) => {
                const medium = work.medium || [];
                const context = work.context || [];
                return medium.some((m) => ["performance", "exhibition", "documentation"].includes(m)) ||
                    context.some((c) => ["performance", "exhibition", "screening", "lecture", "documentation", "fieldwork", "archive"].includes(c));
            }
        };
        directoryCounts.forEach((node) => {
            const key = node.dataset.directoryCount;
            const filter = directoryFilters[key];
            if (!filter) return;
            const count = publicWorks.filter(filter).length;
            node.textContent = String(count).padStart(3, "0") + " RECORDS →";
        });
    };

    const workCount = document.querySelector("[data-work-count]");
    if (workCount) {
        fetch(base + "data/works.json")
            .then((response) => response.json())
            .then((manifest) => {
                const publicWorks = manifest.works.filter((work) => work.visibility !== "private");
                workCount.textContent = String(publicWorks.length).padStart(3, "0");
                updateDirectoryCounts(publicWorks);

                const relationUrl = base + "data/relations.json";
                fetch(relationUrl)
                    .then((relationResponse) => relationResponse.ok ? relationResponse.json() : null)
                    .then((graph) => {
                        if (!graph) return;
                        const publicIds = new Set(publicWorks.map((work) => work.id));
                        directoryCounts.forEach((node) => {
                            if (node.dataset.directoryCount === "people") {
                                node.textContent = String(graph.people?.length || 0).padStart(3, "0") + " RECORDS →";
                            }
                            if (node.dataset.directoryCount === "network") {
                                const connected = new Set();
                                (graph.edges || []).forEach((edge) => {
                                    if (publicIds.has(edge.from)) connected.add(edge.from);
                                    if (publicIds.has(edge.to)) connected.add(edge.to);
                                });
                                node.textContent = String(connected.size).padStart(3, "0") + " WORKS →";
                            }
                        });
                    })
                    .catch(() => {});
            })
            .catch(() => {
                workCount.textContent = "--";
            });
    }
});
