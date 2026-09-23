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

    const normalize = (value) => String(value ?? '')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

    try {
        const [workResponse, relationResponse, videoResponse, dossierResponse] = await Promise.all([
            fetch('../data/works.json'),
            fetch('../data/relations.json'),
            fetch('../data/video_context.json'),
            fetch('../data/dossiers.json')
        ]);
        if (!workResponse.ok) throw new Error('WORK DATABASE UNAVAILABLE.');

        const manifest = await workResponse.json();
        const graph = relationResponse.ok ? await relationResponse.json() : { edges: [], people: [], groups: [], places: [] };
        const videoContext = videoResponse.ok ? await videoResponse.json() : { rows: [] };
        const dossierData = dossierResponse.ok ? await dossierResponse.json() : { works: {} };
        const publicWorks = manifest.works.filter((work) => work.visibility !== 'private');
        const workById = new Map(publicWorks.map((work) => [work.id, work]));
        const entityNames = new Map([
            ...(graph.people || []).map((item) => [item.id, item.name]),
            ...(graph.groups || []).map((item) => [item.id, item.name]),
            ...(graph.places || []).map((item) => [item.id, item.name]),
            ...publicWorks.map((item) => [item.id, item.title])
        ]);

        const relationNames = new Map();
        const relationAliases = new Map();
        [...(graph.people || []), ...(graph.groups || []), ...(graph.places || [])].forEach((entity) => {
            relationAliases.set(entity.id, entity.aliases || []);
        });

        (graph.edges || []).forEach((edge) => {
            const workId = workById.has(edge.from) ? edge.from : workById.has(edge.to) ? edge.to : null;
            if (!workId) return;
            const targetId = edge.from === workId ? edge.to : edge.from;
            if (!relationNames.has(workId)) relationNames.set(workId, []);
            relationNames.get(workId).push(
                entityNames.get(targetId) || targetId,
                ...(relationAliases.get(targetId) || [])
            );
        });

        const filterFunctions = {
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

        const directMediumFilters = new Set(['art','painting','drawing','installation','animation','cgi','audio','video','vocal','interactive','software','games','performance','exhibition','documentation']);
        const recognizedFilters = new Set([...Object.keys(filterFunctions), ...directMediumFilters]);

        const directoryNames = {
            visual: 'VISUAL', sound: 'SOUND', voice: 'VOICE', motion: 'MOTION', systems: 'SYSTEMS', games: 'GAMES',
            documentation: 'DOCUMENTS', art: 'ART', painting: 'PAINTING', drawing: 'DRAWING', installation: 'INSTALLATION',
            animation: 'ANIMATION', cgi: 'CGI / 3D', audio: 'AUDIO', video: 'VIDEO', vocal: 'VOCAL SYNTH',
            interactive: 'INTERACTIVE', software: 'SOFTWARE', performance: 'PERFORMANCE', exhibition: 'EXHIBITION'
        };

        const params = new URLSearchParams(location.search);
        let activeFilter = params.get('medium');
        if (!recognizedFilters.has(activeFilter)) activeFilter = null;
        if (search) search.value = params.get('q') || '';

        const videoSearchText = new Map();
        (videoContext.rows || []).forEach((video) => {
            if (!video.canonicalWorkId) return;
            if (!videoSearchText.has(video.canonicalWorkId)) videoSearchText.set(video.canonicalWorkId, []);
            videoSearchText.get(video.canonicalWorkId).push(video.title, video.description, ...(video.links || []), ...(video.creditLines || []));
        });

        const displayDescription = (work) => {
            const dossier = dossierData.works?.[work.id];
            return work.description || dossier?.source_context?.[0] || dossier?.summary || '';
        };

        const rows = publicWorks.map((work) => {
            const searchText = [
                work.id, work.title, work.description, work.year,
                ...(work.medium || []), ...(work.context || []),
                ...(work.sources || []), ...(work.external_sources || []),
                ...(relationNames.get(work.id) || []),
                ...(videoSearchText.get(work.id) || [])
            ].join(' ');

            return '<a class="archive-row" data-work data-work-id="' + escapeHTML(work.id) + '" data-medium="' +
                escapeHTML([...(work.medium || []), ...(work.context || [])].join(' ')) +
                '" data-search="' + escapeHTML(normalize(searchText)) +
                '" href="record.html?id=' + encodeURIComponent(work.id) + '">' +
                '<span>' + escapeHTML(work.year) + '</span>' +
                '<strong>' + escapeHTML(work.title) + '</strong>' +
                '<span>' + escapeHTML((work.medium?.[0] || 'archive').toUpperCase()) + '</span>' +
                '<span>' + escapeHTML(displayDescription(work)) + '</span><span>↗</span></a>';
        }).join('');

        archiveTable.innerHTML = rows;

        const matchesFilter = (work, filter) => {
            if (!filter) return true;
            if (filterFunctions[filter]) return filterFunctions[filter](work);
            return (work.medium || []).map(normalize).includes(normalize(filter)) ||
                (work.context || []).map(normalize).includes(normalize(filter));
        };

        const update = () => {
            const query = normalize(search?.value || '');
            let visible = 0;
            const allRows = archiveTable.querySelectorAll('[data-work]');

            allRows.forEach((row) => {
                const work = workById.get(row.dataset.workId);
                const match = matchesFilter(work || {}, activeFilter) &&
                    (!query || (row.dataset.search || '').includes(query));
                row.classList.toggle('is-hidden', !match);
                if (match) visible += 1;
            });

            if (directoryLabel) {
                directoryLabel.textContent = activeFilter ? directoryNames[activeFilter] + ' / DIRECTORY' : 'ALL / WORKS';
            }
            if (count) count.textContent = String(visible).padStart(3, '0') + ' RECORDS';

            filters.forEach(button => button.classList.toggle('is-active', button.dataset.filter === (activeFilter || 'all')));
        };

        filters.forEach((button) => {
            button.addEventListener('click', () => {
                const selected = button.dataset.filter;
                activeFilter = selected === 'all' ? null : (recognizedFilters.has(selected) ? selected : null);

                const next = new URL(location.href);
                if (activeFilter) next.searchParams.set('medium', activeFilter);
                else next.searchParams.delete('medium');
                if (search?.value.trim()) next.searchParams.set('q', search.value.trim());
                else next.searchParams.delete('q');
                history.replaceState(null, '', next);
                update();
            });
        });

        search?.addEventListener('input', () => {
            const next = new URL(location.href);
            if (search.value.trim()) next.searchParams.set('q', search.value.trim());
            else next.searchParams.delete('q');
            if (activeFilter) next.searchParams.set('medium', activeFilter);
            else next.searchParams.delete('medium');
            history.replaceState(null, '', next);
            update();
        });

        update();
    } catch (error) {
        console.error(error);
        archiveTable.innerHTML = '<p class="small-note" style="padding:1rem">WORK DATABASE COULD NOT BE READ.</p>';
    }
});
