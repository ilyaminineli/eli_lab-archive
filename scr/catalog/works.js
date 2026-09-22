document.addEventListener('DOMContentLoaded', async () => {
    const archiveTable = document.querySelector('[data-archive-table]');
    const filters = document.querySelectorAll('[data-filter]');
    const count = document.querySelector('[data-count]');
    const search = document.querySelector('#work-search');
    const directoryLabel = document.querySelector('[data-active-directory]');
    if (!archiveTable) return;

    const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[char]));

    try {
        const [workResponse, relationResponse, videoResponse] = await Promise.all([
            fetch('../data/works.json'),
            fetch('../data/relations.json'),
            fetch('../data/video_context.json')
        ]);
        if (!workResponse.ok) throw new Error('WORK DATABASE UNAVAILABLE.');

        const manifest = await workResponse.json();
        const graph = relationResponse.ok ? await relationResponse.json() : { edges: [], people: [], groups: [], places: [] };
        const videoContext = videoResponse.ok ? await videoResponse.json() : { rows: [] };
        const publicWorks = manifest.works.filter((work) => work.visibility !== 'private');
        const workById = new Map(publicWorks.map((work) => [work.id, work]));
        const entityNames = new Map([
            ...(graph.people || []).map((item) => [item.id, item.name]),
            ...(graph.groups || []).map((item) => [item.id, item.name]),
            ...(graph.places || []).map((item) => [item.id, item.name]),
            ...publicWorks.map((item) => [item.id, item.title])
        ]);
        const relationNames = new Map();
        (graph.edges || []).forEach((edge) => {
            const workId = workById.has(edge.from) ? edge.from : workById.has(edge.to) ? edge.to : null;
            if (!workId) return;
            const targetId = edge.from === workId ? edge.to : edge.from;
            if (!relationNames.has(workId)) relationNames.set(workId, []);
            relationNames.get(workId).push(entityNames.get(targetId) || targetId);
        });

        const directoryFilters = {
            visual: (work) => (work.medium || []).some((m) => ['art', 'painting', 'drawing', 'installation', 'cgi'].includes(m)),
            sound: (work) => (work.medium || []).includes('audio'),
            voice: (work) => (work.medium || []).includes('vocal'),
            motion: (work) => (work.medium || []).some((m) => ['animation', 'video'].includes(m)),
            systems: (work) => (work.medium || []).some((m) => ['software', 'interactive'].includes(m)),
            games: (work) => (work.medium || []).includes('games'),
            documentation: (work) => {
                const medium = work.medium || [];
                const context = work.context || [];
                return medium.some((m) => ['performance', 'exhibition', 'documentation'].includes(m)) ||
                    context.some((c) => ['performance', 'exhibition', 'screening', 'lecture', 'documentation', 'fieldwork', 'archive'].includes(c));
            }
        };

        const directoryNames = {
            visual: 'VISUAL',
            sound: 'SOUND',
            voice: 'VOICE',
            motion: 'MOTION',
            systems: 'SYSTEMS',
            games: 'GAMES',
            documentation: 'DOCUMENTS'
        };

        const params = new URLSearchParams(location.search);
        let activePreset = params.get('medium');
        if (!directoryFilters[activePreset]) activePreset = null;

        const updateDirectoryLabel = () => {
            if (!directoryLabel) return;
            directoryLabel.textContent = activePreset ? directoryNames[activePreset] + ' / DIRECTORY' : 'ALL / WORKS';
        };

        const videoSearchText = new Map();
        (videoContext.rows || []).forEach((video) => {
            if (!video.canonicalWorkId) return;
            if (!videoSearchText.has(video.canonicalWorkId)) videoSearchText.set(video.canonicalWorkId, []);
            videoSearchText.get(video.canonicalWorkId).push(video.title, video.description, ...(video.links || []), ...(video.creditLines || []));
        });

        const rows = publicWorks.map((work) => {
            const searchText = [
                work.title,
                work.description,
                ...(work.medium || []),
                ...(work.context || []),
                ...(work.sources || []),
                ...(work.external_sources || []),
                ...(relationNames.get(work.id) || []),
                ...(videoSearchText.get(work.id) || [])
            ].join(' ').toLowerCase();

            return '<a class="archive-row" data-work data-work-id="' + escapeHTML(work.id) + '" data-medium="' +
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
                const work = workById.get(row.dataset.workId);
                const media = row.dataset.medium || '';
                const hay = row.dataset.search || '';
                const matchFilter = activePreset
                    ? directoryFilters[activePreset](work || {})
                    : filter === 'all' || media.split(' ').includes(filter) ||
                        (filter === 'documentation' && /(performance|exhibition|screening|lecture|documentation|fieldwork|archive)/.test(media));
                const matchSearch = !query || hay.includes(query);
                const match = matchFilter && matchSearch;
                row.classList.toggle('is-hidden', !match);
                if (match) visible += 1;
            });

            updateDirectoryLabel();
            if (count) count.textContent = String(visible).padStart(3, '0') + ' records';
        };

        filters.forEach((button) => {
            button.addEventListener('click', () => {
                filters.forEach((item) => item.classList.remove('is-active'));
                button.classList.add('is-active');
                activePreset = directoryFilters[button.dataset.filter] ? button.dataset.filter : null;
                const next = new URL(location.href);
                if (activePreset) next.searchParams.set('medium', activePreset);
                else next.searchParams.delete('medium');
                history.replaceState(null, '', next);
                update();
            });
        });

        const activeButton = activePreset
            ? document.querySelector('[data-filter="' + activePreset + '"]')
            : document.querySelector('[data-filter="all"]');
        if (activeButton) {
            filters.forEach((item) => item.classList.remove('is-active'));
            activeButton.classList.add('is-active');
        }

        search?.addEventListener('input', update);
        update();
    } catch (error) {
        console.error(error);
        archiveTable.innerHTML = '<p class="small-note" style="padding:1rem">WORK DATABASE COULD NOT BE READ.</p>';
    }
});
