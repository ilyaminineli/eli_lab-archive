document.addEventListener('DOMContentLoaded', async () => {
    const catalogs = document.querySelectorAll('[data-medium-catalog], [data-catalog-context]');
    if (!catalogs.length) return;

    const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[char]));

    const imageFor = (work) => work.thumbnail || '';

    try {
        const response = await fetch('../data/works.json');
        if (!response.ok) throw new Error('WORK DATABASE UNAVAILABLE.');
        const manifest = await response.json();
        const works = manifest.works.filter((work) => work.visibility !== 'private');

        const matchesCatalog = (work, catalog) => {
            const medium = work.medium || [];
            const context = work.context || [];
            const requestedMedium = catalog.dataset.mediumCatalog;
            const requestedContext = catalog.dataset.catalogContext;

            if (requestedContext) {
                if (requestedContext === 'collaboration') {
                    return context.includes('collaboration') || context.includes('commission');
                }
                if (requestedContext === 'documentation') {
                    return medium.some((m) => ['performance', 'exhibition'].includes(m)) ||
                        context.some((c) => ['performance', 'exhibition', 'screening', 'lecture', 'documentation', 'fieldwork', 'archive'].includes(c));
                }
            }

            if (requestedMedium === 'art') {
                return medium.some((m) => ['art', 'painting', 'drawing', 'installation', 'exhibition'].includes(m));
            }
            return medium.includes(requestedMedium);
        };

        catalogs.forEach((catalog) => {
            const selected = works
                .filter((work) => matchesCatalog(work, catalog))
                .sort((a, b) => String(b.year).localeCompare(String(a.year)));

            catalog.innerHTML = selected.map((work, index) => {
                const classes = 'archive-work archive-work--dynamic';
                const thumbnail = imageFor(work);
                const media = thumbnail
                    ? '<img src="' + escapeHTML(thumbnail) + '" alt="" loading="lazy">'
                    : '<div class="catalog-placeholder" aria-hidden="true"><span>' +
                        escapeHTML(String(index + 1).padStart(2, '0')) + '</span></div>';

                return '<article class="' + classes + '" id="' + escapeHTML(work.id) + '">' +
                    '<a href="record.html?id=' + encodeURIComponent(work.id) + '" class="archive-work-media ' + (thumbnail ? 'archive-work-media--image' : '') + '">' +
                    media +
                    '<span>' + escapeHTML(work.year) + '</span></a>' +
                    '<div class="archive-work-info"><div><h2>' + escapeHTML(work.title) +
                    '</h2><p>' + escapeHTML((work.medium || []).join(' / ')) +
                    (work.status ? ' / ' + escapeHTML(work.status) : '') +
                    '</p></div><span>↗</span></div></article>';
            }).join('') || '<p class="small-note">NO PUBLIC RECORDS IN THIS DIRECTORY.</p>';
        });
    } catch (error) {
        console.error(error);
        catalogs.forEach((catalog) => {
            catalog.innerHTML = '<p class="small-note" style="padding:1rem">DIRECTORY COULD NOT BE READ.</p>';
        });
    }
});
