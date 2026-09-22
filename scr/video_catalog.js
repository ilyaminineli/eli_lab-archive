document.addEventListener("DOMContentLoaded", () => {
    const list = document.querySelector("#video-list");
    const search = document.querySelector("#video-search");
    const yearSelect = document.querySelector("#video-year");
    const count = document.querySelector("#video-count");
    if (!list || !search || !yearSelect || !count) return;

    const parseCSV = (text) => {
        const rows = [];
        let row = [], field = "", quoted = false;
        for (let i = 0; i < text.length; i += 1) {
            const c = text[i], n = text[i + 1];
            if (quoted) {
                if (c === '"' && n === '"') { field += '"'; i += 1; }
                else if (c === '"') quoted = false;
                else field += c;
            } else if (c === '"') quoted = true;
            else if (c === ',') { row.push(field); field = ""; }
            else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
            else if (c !== "\r") field += c;
        }
        if (field !== "" || row.length) { row.push(field); rows.push(row); }
        return rows;
    };

    const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
        "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[char]));

    const tagFor = (row) => {
        const title = row.title.toLowerCase();
        const desc = row.description.toLowerCase();
        if (title.includes("showreel")) return "SHOWREEL";
        if (title.includes("performance") || title.includes("live")) return "PERFORMANCE";
        if (title.includes("official video") || title.includes("cover")) return "MUSIC VIDEO";
        if (desc.includes("original utau") || desc.includes("#utau")) return "UTAU";
        if (title.includes("experimental") || desc.includes("experimental")) return "EXPERIMENTAL";
        return "VIDEO";
    };

    const cleanDescription = (value) => escapeHTML(value).replace(/\n/g, "<br>");

    fetch("../Ilya-Minin-Eli.csv")
        .then((response) => {
            if (!response.ok) throw new Error("CSV unavailable");
            return response.text();
        })
        .then((csv) => {
            const rows = parseCSV(csv);
            const header = rows.shift();
            const index = Object.fromEntries(header.map((name, i) => [name, i]));
            const records = rows
                .filter((r) => r.length >= header.length)
                .map((r) => ({
                    position: r[index.Position],
                    title: r[index["Video Title"]],
                    url: r[index["Video URL"]],
                    id: r[index["Video ID"]],
                    date: r[index["Publish Date"]]?.slice(0, 10),
                    duration: r[index.Duration],
                    views: r[index.Views],
                    description: r[index.Description] || "",
                    thumbnail: r[index["Thumbnail URL"]] || "",
                }));

            [...new Set(records.map((r) => r.date?.slice(0, 4)).filter(Boolean))]
                .sort((a,b) => Number(b)-Number(a))
                .forEach((year) => yearSelect.insertAdjacentHTML("beforeend", `<option value="${year}">${year}</option>`));

            const render = () => {
                const query = search.value.trim().toLowerCase();
                const year = yearSelect.value;
                const visible = records.filter((item) => {
                    const hay = `${item.title} ${item.description} ${item.id}`.toLowerCase();
                    return (year === "all" || item.date?.startsWith(year)) && (!query || hay.includes(query));
                });

                count.textContent = `${String(visible.length).padStart(3,"0")} / ${records.length} records`;
                list.innerHTML = visible.map((item) => `
                    <details class="video-record">
                        <summary>
                            <span>${escapeHTML(item.date)}</span>
                            <strong>${escapeHTML(item.title)}</strong>
                            <span>${escapeHTML(item.duration)}</span>
                            <span>${escapeHTML(item.id)}</span>
                            <span class="record-open">+</span>
                        </summary>
                        <div class="video-record-body">
                            <div class="video-record-preview">
                                <img src="${escapeHTML(item.thumbnail)}" alt="" loading="lazy">
                                <a class="text-link" href="${escapeHTML(item.url)}" target="_blank" rel="noopener">OPEN YOUTUBE →</a>
                            </div>
                            <div class="video-record-copy">
                                <div class="record-meta"><span>${tagFor(item)}</span><span>POSITION ${escapeHTML(item.position)}</span><span>VIEWS ${escapeHTML(item.views)}</span></div>
                                <p>${cleanDescription(item.description) || "No description supplied in source export."}</p>
                            </div>
                        </div>
                    </details>`).join("") || '<p class="small-note" style="padding:1rem">No matching records.</p>';
            };

            search.addEventListener("input", render);
            yearSelect.addEventListener("change", render);
            render();
        })
        .catch((error) => {
            console.error(error);
            count.textContent = "SOURCE ERROR";
            list.innerHTML = '<p class="small-note" style="padding:1rem">The CSV source could not be loaded. Open the source CSV below.</p>';
        });
});
