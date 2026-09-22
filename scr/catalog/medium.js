document.addEventListener('DOMContentLoaded', async () => {
    const catalogs = document.querySelectorAll('[data-medium-catalog], [data-catalog-context]');
    if (!catalogs.length) return;

    const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[char]));

    const imageFor = (work) => work.thumbnail || '';

    const pageLabels = {
        art: 'VISUAL',
        audio: 'SOUND',
        vocal: 'VOICE',
        animation: 'ANIMATION',
        motion: 'MOTION',
        video: 'VIDEO',
        cgi: 'CGI / 3D',
        interactive: 'INTERACTIVE',
        software: 'SYSTEMS',
        games: 'GAMES'
    };

    try {
        const [workResponse, relationResponse] = await Promise.all([
            fetch('../data/works.json'),
            fetch('../data/relations.json')
        ]);
        if (!workResponse.ok) throw new Error('WORK DATABASE UNAVAILABLE.');

        const manifest = await workResponse.json();
        const graph = relationResponse.ok ? await relationResponse.json() : { edges: [], people: [], groups: [], places: [] };
        const works = manifest.works.filter((work) => work.visibility !== 'private');
        const entityNames = new Map([
            ...(graph.people || []).map((item) => [item.id, item.name]),
            ...(graph.groups || []).map((item) => [item.id, item.name]),
            ...(graph.places || []).map((item) => [item.id, item.name]),
            ...works.map((item) => [item.id, item.title])
        ]);
        const relationNames = new Map();
        (graph.edges || []).forEach((edge) => {
            const workId = works.some(item => item.id === edge.from) ? edge.from : works.some(item => item.id === edge.to) ? edge.to : null;
            if (!workId) return;
            const targetId = edge.from === workId ? edge.to : edge.from;
            if (!relationNames.has(workId)) relationNames.set(workId, []);
            relationNames.get(workId).push(entityNames.get(targetId) || targetId);
        });

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
                    return medium.some((m) => ['performance', 'exhibition', 'documentation'].includes(m)) ||
                        context.some((c) => ['performance', 'exhibition', 'screening', 'lecture', 'documentation', 'fieldwork', 'archive'].includes(c));
                }
            }

            if (requestedMedium === 'art') {
                return medium.some((m) => ['art', 'painting', 'drawing', 'installation', 'cgi'].includes(m));
            }
            if (requestedMedium === 'motion') {
                return medium.some((m) => ['animation', 'video'].includes(m));
            }
            if (requestedMedium === 'systems') {
                return medium.some((m) => ['software', 'interactive'].includes(m));
            }
            return medium.includes(requestedMedium);
        };

        catalogs.forEach((catalog) => {
            const requestedMedium = catalog.dataset.mediumCatalog;
            const selected = works
                .filter((work) => matchesCatalog(work, catalog))
                .sort((a, b) => String(b.year).localeCompare(String(a.year)) || a.title.localeCompare(b.title));

            const header = document.createElement('div');
            header.className = 'medium-catalog-head';

            const label = catalog.dataset.catalogContext === 'documentation'
                ? 'DOCUMENTS'
                : catalog.dataset.catalogContext === 'collaboration'
                    ? 'PEOPLE / PROJECTS'
                    : pageLabels[requestedMedium] || 'DIRECTORY';

            header.innerHTML =
                '<div class="medium-catalog-title"><span class="medium-catalog-kicker">CANONICAL PUBLIC WORKS</span>' +
                '<strong>' + escapeHTML(label) + '</strong></div>' +
                '<div class="medium-catalog-tools">' +
                '<label class="terminal-field">SEARCH <input class="medium-catalog-search" type="search" autocomplete="off" placeholder="title / description / keyword"></label>' +
                '<span class="medium-catalog-count">' + String(selected.length).padStart(3, '0') + ' RECORDS</span>' +
                '<a href="archive.html">ALL WORKS ↗</a></div>';

            catalog.before(header);

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
                    '</h2><p class="archive-work-meta">' + escapeHTML((work.medium || []).join(' / ')) +
                    (work.status ? ' / ' + escapeHTML(work.status) : '') +
                    '</p><p class="archive-work-description">' + escapeHTML(work.description || '') +
                    '</p></div><span>↗</span></div></article>';
            }).join('') || '<p class="small-note">NO PUBLIC RECORDS IN THIS DIRECTORY.</p>';

            catalog.querySelectorAll('.archive-work--dynamic').forEach((card) => {
                const workId = card.id;
                const work = selected.find(item => item.id === workId);
                card.dataset.mediumWork = workId;
                card.dataset.search = [
                    work?.title, work?.description, work?.year,
                    ...(work?.medium || []), ...(work?.context || []),
                    ...(work?.sources || []), ...(work?.external_sources || []),
                    ...(relationNames.get(workId) || [])
                ].join(' ').toLowerCase();
            });


            const searchInput = header.querySelector('.medium-catalog-search');
            const countNode = header.querySelector('.medium-catalog-count');
            const searchParams = new URLSearchParams(location.search);
            const queryParam = searchParams.get('q') || '';
            if (searchInput) searchInput.value = queryParam;

            const update = () => {
                const query = (searchInput?.value || '').trim().toLowerCase();
                let visible = 0;
                catalog.querySelectorAll('[data-medium-work]').forEach((card) => {
                    const haystack = card.dataset.search || '';
                    const match = !query || haystack.includes(query);
                    card.classList.toggle('is-hidden', !match);
                    if (match) visible += 1;
                });
                if (countNode) countNode.textContent = String(visible).padStart(3, '0') + ' / ' + String(selected.length).padStart(3, '0') + ' RECORDS';
            };

            searchInput?.addEventListener('input', () => {
                const next = new URL(location.href);
                if (searchInput.value.trim()) next.searchParams.set('q', searchInput.value.trim());
                else next.searchParams.delete('q');
                history.replaceState(null, '', next);
                update();
            });

            update();
        });
    } catch (error) {
        console.error(error);
        catalogs.forEach((catalog) => {
            catalog.innerHTML = '<p class="small-note" style="padding:1rem">DIRECTORY COULD NOT BE READ.</p>';
        });
    }
});
