document.addEventListener('DOMContentLoaded', async () => {
    const input = document.querySelector('#global-search');
    const type = document.querySelector('#global-type');
    const clear = document.querySelector('#global-clear');
    const count = document.querySelector('#global-count');
    const results = document.querySelector('#global-results');
    if (!results) return;

    const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[char]));

    const normalize = (value) => String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

    try {
        const [workResponse, relationResponse] = await Promise.all([
            fetch('../data/works.json'),
            fetch('../data/relations.json')
        ]);
        if (!workResponse.ok) throw new Error('SEARCH DATABASE UNAVAILABLE.');

        const works = (await workResponse.json()).works.filter(work => work.visibility !== 'private');
        const graph = relationResponse.ok ? await relationResponse.json() : { edges: [], people: [], groups: [], places: [] };
        const workById = new Map(works.map(work => [work.id, work]));
        const names = new Map([
            ...works.map(work => [work.id, work.title]),
            ...(graph.people || []).flatMap(item => [[item.id, item.name], ...((item.aliases || []).map(alias => [item.id + '|alias|' + alias, alias]))]),
            ...(graph.groups || []).flatMap(item => [[item.id, item.name], ...((item.aliases || []).map(alias => [item.id + '|alias|' + alias, alias]))]),
            ...(graph.places || []).map(item => [item.id, item.name])
        ]);

        const relationMap = new Map();
        (graph.edges || []).forEach(edge => {
            const workId = workById.has(edge.from) ? edge.from : workById.has(edge.to) ? edge.to : null;
            if (!workId) return;
            const target = edge.from === workId ? edge.to : edge.from;
            if (!relationMap.has(workId)) relationMap.set(workId, []);
            relationMap.get(workId).push(names.get(target) || target);
        });

        const entities = [
            ...works.map(work => ({
                id: work.id, name: work.title, entityType: 'work',
                description: work.description,
                meta: [...(work.medium || []), ...(work.context || [])].join(' / '),
                search: [work.id, work.title, work.description, work.year, ...(work.medium || []), ...(work.context || []), ...(work.sources || []), ...(work.external_sources || []), ...(relationMap.get(work.id) || [])].join(' ')
            })),
            ...(graph.people || []).map(person => ({
                id: person.id, name: person.name, entityType: 'person', description: person.type,
                meta: 'person / ' + person.type,
                search: [person.id, person.name, ...(person.aliases || []), person.type, ...works.filter(w => (relationMap.get(w.id) || []).includes(person.name)).map(w => w.title)].join(' ')
            })),
            ...(graph.groups || []).map(group => ({
                id: group.id, name: group.name, entityType: 'group', description: group.type,
                meta: 'group / ' + group.type,
                search: [group.id, group.name, ...(group.aliases || []), group.type].join(' ')
            })),
            ...(graph.places || []).map(place => ({
                id: place.id, name: place.name, entityType: 'place', description: place.type,
                meta: 'place / ' + place.type,
                search: [place.id, place.name, place.type].join(' ')
            }))
        ];

        const entityHref = (entity) =>
            entity.entityType === 'work'
                ? 'record.html?id=' + encodeURIComponent(entity.id)
                : 'network.html?focus=' + encodeURIComponent(entity.id);

        const params = new URLSearchParams(location.search);
        if (input) input.value = params.get('q') || '';

        const draw = () => {
            const query = normalize(input?.value || '');
            const typeFilter = type?.value || 'all';

            const matches = entities.filter(entity => {
                const typeMatch = typeFilter === 'all' || entity.entityType === typeFilter;
                return typeMatch && (!query || normalize(entity.search).includes(query));
            });

            results.innerHTML = matches.map(entity =>
                '<a class="search-result" href="' + entityHref(entity) + '">' +
                '<span class="search-result-type">' + escapeHTML(entity.entityType) + '</span>' +
                '<div><h2>' + escapeHTML(entity.name) + '</h2><p>' + escapeHTML(entity.description || '') + '</p></div>' +
                '<em>' + escapeHTML(entity.meta || '') + '</em><b>↗</b></a>'
            ).join('') || '<p class="small-note">NO MATCHES IN CURRENT PUBLIC ARCHIVE.</p>';

            if (count) count.textContent = String(matches.length).padStart(3, '0') + ' RESULTS / ' + String(entities.length).padStart(3, '0') + ' INDEXED';
        };

        const writeUrl = () => {
            const next = new URL(location.href);
            if (input?.value.trim()) next.searchParams.set('q', input.value.trim());
            else next.searchParams.delete('q');
            history.replaceState(null, '', next);
        };

        input?.addEventListener('input', () => { writeUrl(); draw(); });
        type?.addEventListener('change', draw);
        clear?.addEventListener('click', () => {
            input.value = '';
            type.value = 'all';
            writeUrl();
            draw();
            input.focus();
        });

        draw();
    } catch (error) {
        if (count) count.textContent = 'SOURCE ERROR';
        results.innerHTML = '<p class="small-note">SEARCH DATA COULD NOT BE READ.</p>';
    }
});
