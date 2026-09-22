document.addEventListener("DOMContentLoaded", async () => {
    const archiveTable = document.querySelector("[data-archive-table]");
    const filters = document.querySelectorAll("[data-filter]");
    const count = document.querySelector("[data-count]");
    if (!archiveTable) return;

    try {
        const response = await fetch("../data/works.json");
        if (!response.ok) throw new Error("Could not load works manifest.");
        const manifest = await response.json();
        const rows = manifest.works.map((work) => `
            <a class="archive-row" data-work data-medium="${(work.medium || []).join(" ")}" href="record.html?id=${encodeURIComponent(work.id)}">
                <span>${escapeHTML(work.year)}</span>
                <strong>${escapeHTML(work.title)}</strong>
                <span>${escapeHTML((work.medium?.[0] || "archive").toUpperCase())}</span>
                <span>${escapeHTML(work.description || "")}</span>
                <span>↗</span>
            </a>
        `).join("");
        archiveTable.innerHTML = rows;

        const update = (filter) => {
            const allRows = archiveTable.querySelectorAll("[data-work]");
            let visible = 0;
            allRows.forEach((row) => {
                const match = filter === "all" || (row.dataset.medium || "").split(" ").includes(filter);
                row.classList.toggle("is-hidden", !match);
                if (match) visible += 1;
            });
            if (count) count.textContent = String(visible).padStart(3, "0") + " records";
        };

        filters.forEach((button) => {
            button.addEventListener("click", () => {
                filters.forEach((item) => item.classList.remove("is-active"));
                button.classList.add("is-active");
                update(button.dataset.filter);
            });
        });
        update("all");
    } catch (error) {
        console.error(error);
        archiveTable.innerHTML = '<p class="small-note" style="padding:1rem">WORK DATABASE COULD NOT BE READ.</p>';
    }

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, (char) => ({
            "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
        }[char]));
    }
});
