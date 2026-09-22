document.addEventListener('DOMContentLoaded', async () => {
    const archiveTable = document.querySelector('[data-archive-table]');
    const filters = document.querySelectorAll('[data-filter]');
    const count = document.querySelector('[data-count]');
    const search = document.querySelector('#work-search');
    if (!archiveTable) return;

    const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[char]));

    try {
        const response = await fetch('../data/works.json');
        if (!response.ok) throw new Error('WORK DATABASE UNAVAILABLE.');

        const manifest = await response.json();
        const publicWorks = manifest.works.filter((work) => work.visibility !== 'private');

        const rows = publicWorks.map((work) => {
            const searchText = [
                work.title,
                work.description,
                ...(work.medium || []),
                ...(work.context || [])
            ].join(' ').toLowerCase();

            return '<a class="archive-row" data-work data-medium="' +
                escapeHTML([...(work.medium || []), ...(work.context || [])].join(' ')) +
                '" data-search="' + escapeHTML(searchText) +
                '" href="record.html?id=' + encodeURIComponent(work.id) + '">' +
                '<span>' + escapeHTML(work.year) + '</span>' +
                '<strong>' + escapeHTML(work.title) + '</strong>' +
                '<span>' + escapeHTML((work.medium?.[0] || 'archive').toUpperCase()) + '</span>' +
                '<span>' + escapeHTML(work.description || '') + '</span>' +
                '<span>↗</span></a>';
        }).join('');

        archiveTable.innerHTML = rows;

        const update = () => {
            const filter = document.querySelector('[data-filter].is-active')?.dataset.filter || 'all';
            const query = (search?.value || '').trim().toLowerCase();
            const allRows = archiveTable.querySelectorAll('[data-work]');
            let visible = 0;

            allRows.forEach((row) => {
                const media = row.dataset.medium || '';
                const hay = row.dataset.search || '';
                const matchFilter = filter === 'all' || media.split(' ').includes(filter) ||
                    (filter === 'documentation' && /(performance|exhibition|screening|lecture|documentation|fieldwork)/.test(media));
                const matchSearch = !query || hay.includes(query);
                const match = matchFilter && matchSearch;
                row.classList.toggle('is-hidden', !match);
                if (match) visible += 1;
            });

            if (count) count.textContent = String(visible).padStart(3, '0') + ' records';
        };

        filters.forEach((button) => {
            button.addEventListener('click', () => {
                filters.forEach((item) => item.classList.remove('is-active'));
                button.classList.add('is-active');
                update();
            });
        });

        search?.addEventListener('input', update);
        update();
    } catch (error) {
        console.error(error);
        archiveTable.innerHTML = '<p class="small-note" style="padding:1rem">WORK DATABASE COULD NOT BE READ.</p>';
    }
});
