document.addEventListener("DOMContentLoaded", () => {
    const isInternalPage = window.location.pathname.includes("/pgs/");
    const base = isInternalPage ? "../" : "";

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

    const setText = (selector, value) => {
        document.querySelectorAll(selector).forEach((node) => {
            node.textContent = value;
        });
    };

    const directoryCounts = document.querySelectorAll("[data-directory-count]");

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

    const updateDirectoryCounts = (publicWorks, graph) => {
        directoryCounts.forEach((node) => {
            const key = node.dataset.directoryCount;

            if (key === "people") {
                node.textContent = String(graph?.people?.length || 0).padStart(3, "0") + " RECORDS →";
                return;
            }

            if (key === "network") {
                const publicIds = new Set(publicWorks.map((work) => work.id));
                const connected = new Set();
                (graph?.edges || []).forEach((edge) => {
                    if (publicIds.has(edge.from)) connected.add(edge.from);
                    if (publicIds.has(edge.to)) connected.add(edge.to);
                });
                node.textContent = String(connected.size).padStart(3, "0") + " WORKS →";
                return;
            }

            const filter = directoryFilters[key];
            if (!filter) return;
            node.textContent = String(publicWorks.filter(filter).length).padStart(3, "0") + " RECORDS →";
        });
    };

    const updateSystemUI = (status) => {
        const state = String(status.state || "ONLINE").toUpperCase();
        const year = String(status.updated || new Date().getFullYear()).slice(0, 4);

        const terminal = document.querySelector(".terminal-status");
        if (terminal) {
            terminal.dataset.state = state;
            terminal.innerHTML =
                '<span class="status-led" aria-hidden="true"></span>' +
                '<span data-status-state>' + state + '</span><span class="status-divider">/</span>' +
                '<span data-status-system>ARCHIVE</span><span class="status-divider">/</span>' +
                '<span data-status-year>' + year + '</span>';
        }

        setText("[data-status-state]", state);
        setText("[data-status-system]", "ARCHIVE");
        setText("[data-status-year]", year);
        setText("[data-status-version]", String(status.version || "01"));
        setText("[data-status-public]", String(status.records?.public ?? "—"));
        setText("[data-status-total]", String(status.records?.total ?? "—"));
        setText("[data-status-private]", String(status.records?.private ?? "—"));
        setText("[data-status-relations]", String(status.network?.relations ?? "—"));
        setText("[data-status-people]", String(status.network?.people ?? "—"));
        setText("[data-status-groups]", String(status.network?.groups ?? "—"));
        setText("[data-status-places]", String(status.network?.places ?? "—"));
        setText("[data-status-sources]", String(status.sources ?? "—"));
        setText("[data-status-repositories]", String(status.repositories ?? "—"));
        setText("[data-status-assets]", String(status.visual_assets ?? "—"));
        setText("[data-status-video]", String(status.video_source_rows ?? "—"));
        setText("[data-status-sync]", String(status.updated || "—"));
    };

    const statusUrl = base + "data/site_status.json";
    const worksUrl = base + "data/works.json";
    const relationsUrl = base + "data/relations.json";

    Promise.all([
        fetch(statusUrl).then((response) => response.ok ? response.json() : null),
        fetch(worksUrl).then((response) => response.ok ? response.json() : null),
        fetch(relationsUrl).then((response) => response.ok ? response.json() : null)
    ]).then(([status, manifest, graph]) => {
        if (status) updateSystemUI(status);

        if (manifest) {
            const publicWorks = manifest.works.filter((work) => work.visibility !== "private");
            const workCount = document.querySelector("[data-work-count]");
            if (workCount) workCount.textContent = String(publicWorks.length).padStart(3, "0");
            updateDirectoryCounts(publicWorks, graph || {});
        }
    }).catch(() => {
        setText("[data-status-state]", "OFFLINE");
    });
});
