document.addEventListener('DOMContentLoaded', async () => {
    const list = document.querySelector('#network-list');
    const input = document.querySelector('#network-search');
    const focus = document.querySelector('#network-focus');
    const clear = document.querySelector('#network-clear');
    const count = document.querySelector('#network-count');
    const path = document.querySelector('#network-path');
    const workStat = document.querySelector('[data-network-stat="works"]');
    const peopleStat = document.querySelector('[data-network-stat="people"]');
    const groupStat = document.querySelector('[data-network-stat="groups"]');
    const placeStat = document.querySelector('[data-network-stat="places"]');
    if (!list) return;

    const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[char]));

    const normalize = (value) => String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

    const relationLabel = {
        'created-by': 'CREATED BY',
        'co-created-with': 'CO-CREATED WITH',
        'directed-by': 'DIRECTED BY',
        'produced-by': 'PRODUCED BY',
        'performed-with': 'PERFORMED WITH',
        'features': 'FEATURES',
        'exhibited-at': 'EXHIBITED AT',
        'screened-at': 'SCREENED AT',
        'curated-in': 'CURATED IN',
        'curated-by': 'CURATED BY',
        'part-of-series': 'PART OF SERIES',
        'part-of': 'PART OF',
        'archive-source': 'ARCHIVE SOURCE',
        'documented-by': 'DOCUMENTED BY',
        'released-on': 'RELEASED ON',
        'narrated-by': 'NARRATED BY',
        'dedicated-to': 'DEDICATED TO',
        'special-thanks-to': 'SPECIAL THANKS',
        'programmed-by': 'PROGRAMMED BY',
        'part-of-project': 'PART OF PROJECT',
        'implemented-with': 'IMPLEMENTED WITH',
        'supports': 'SUPPORTS',
        'contains': 'CONTAINS',
        'uses': 'USES',
        'related-to': 'RELATED TO'
    };

    const categoryFor = (relation) => {
        if (/created|co-created|directed|produced|performed|features|narrated/.test(relation)) return 'AUTHORSHIP / PARTICIPATION';
        if (/exhibited|screened|curated|part-of/.test(relation)) return 'CONTEXT / EXHIBITION';
        if (/implemented|supports|contains|uses|programmed/.test(relation)) return 'SYSTEM / PRODUCTION';
        if (/archive|documented|released|dedicated|special-thanks/.test(relation)) return 'PROVENANCE';
        return 'RELATED';
    };

    try {
        const [workResponse, relationResponse] = await Promise.all([
            fetch('../data/works.json'),
            fetch('../data/relations.json')
        ]);
        if (!workResponse.ok || !relationResponse.ok) throw new Error('NETWORK DATABASE UNAVAILABLE.');

        const manifest = await workResponse.json();
        const works = manifest.works.filter((work) => work.visibility !== 'private');
        const graph = await relationResponse.json();

        const entityMap = new Map([
            ...works.map((work) => [work.id, { id: work.id, type: 'work', name: work.title, work }]),
            ...(graph.people || []).map((person) => [person.id, { id: person.id, type: 'person', name: person.name, aliases: person.aliases || [] }]),
            ...(graph.groups || []).map((group) => [group.id, { id: group.id, type: 'group', name: group.name, aliases: group.aliases || [] }]),
            ...(graph.places || []).map((place) => [place.id, { id: place.id, type: 'place', name: place.name, aliases: place.aliases || [] }])
        ]);

        const publicWorkIds = new Set(works.map((work) => work.id));
        const relevantEdges = (graph.edges || []).filter((edge) =>
            publicWorkIds.has(edge.from) || publicWorkIds.has(edge.to)
        );

        const grouped = new Map();
        relevantEdges.forEach((edge) => {
            const workId = publicWorkIds.has(edge.from) ? edge.from : edge.to;
            if (!grouped.has(workId)) grouped.set(workId, []);
            grouped.get(workId).push(edge);
        });

        if (workStat) workStat.textContent = String(grouped.size).padStart(3, '0');
        if (peopleStat) peopleStat.textContent = String(graph.people?.length || 0).padStart(3, '0');
        if (groupStat) groupStat.textContent = String(graph.groups?.length || 0).padStart(3, '0');
        if (placeStat) placeStat.textContent = String(graph.places?.length || 0).padStart(3, '0');

        const entityName = (id) => entityMap.get(id)?.name || id;
        const entitySearchNames = (id) => [
            entityName(id),
            ...(entityMap.get(id)?.aliases || [])
        ].join(' ');
        const entityType = (id) => entityMap.get(id)?.type || 'entity';

        const entityHref = (id) => {
            const entity = entityMap.get(id);
            if (!entity) return 'network.html';
            if (entity.type === 'work') return 'record.html?id=' + encodeURIComponent(id);
            return 'entity.html?id=' + encodeURIComponent(id);
        };

        const renderConnection = (edge, workId) => {
            const outgoing = edge.from === workId;
            const targetId = outgoing ? edge.to : edge.from;
            const label = relationLabel[edge.relation] || edge.relation.replaceAll('-', ' ').toUpperCase();
            const target = entityName(targetId);
            const type = entityType(targetId);
            const arrow = outgoing ? '→' : '←';
            return '<a class="network-connection" href="' + entityHref(targetId) + '">' +
                '<span class="network-connection-arrow">' + arrow + '</span>' +
                '<span class="network-connection-label">' + escapeHTML(label) + '</span>' +
                '<div class="network-connection-main"><strong>' + escapeHTML(target) + '</strong>' +
                (edge.credit ? '<small>' + escapeHTML(edge.credit) + '</small>' : '') +
                '</div>' +
                '<em class="network-entity network-entity--' + escapeHTML(type) + '">' + escapeHTML(type) + '</em>' +
                '</a>';
        };

        const renderCard = (work, edges) => {
            const entityIds = new Set([work.id]);
            edges.forEach((edge) => {
                entityIds.add(edge.from);
                entityIds.add(edge.to);
            });

            const searchBlob = normalize([
                work.title, work.id, work.year, ...(work.medium || []), ...(work.context || []),
                ...edges.flatMap(edge => [
                    edge.relation, entitySearchNames(edge.from), entitySearchNames(edge.to), edge.from, edge.to
                ])
            ].join(' '));

            const byCategory = new Map();
            edges.forEach((edge) => {
                const category = categoryFor(edge.relation);
                if (!byCategory.has(category)) byCategory.set(category, []);
                byCategory.get(category).push(edge);
            });

            const categoryHTML = Array.from(byCategory.entries()).map(([category, categoryEdges]) =>
                '<section class="network-group">' +
                '<h3>' + escapeHTML(category) + '</h3>' +
                '<div class="network-connections">' +
                categoryEdges.map(edge => renderConnection(edge, work.id)).join('') +
                '</div></section>'
            ).join('');

            return '<article class="network-card" data-network-card data-entities="' + escapeHTML(Array.from(entityIds).join('|')) +
                '" data-search="' + escapeHTML(searchBlob) + '">' +
                '<header class="network-card-head">' +
                '<div><p class="network-card-id">' + escapeHTML(work.id) + '</p>' +
                '<h2><a href="record.html?id=' + encodeURIComponent(work.id) + '">' + escapeHTML(work.title) + '</a></h2></div>' +
                '<div class="network-card-meta"><span>' + escapeHTML(work.year) + '</span><span>' +
                escapeHTML((work.medium || []).slice(0, 2).join(' / ')) + '</span><span>' +
                String(edges.length).padStart(2, '0') + ' LINKS</span></div>' +
                '</header>' + categoryHTML + '</article>';
        };

        const entityOptions = [
            ...works.map(work => ({ id: work.id, name: work.title, type: 'work' })),
            ...(graph.people || []).map(person => ({ id: person.id, name: person.name, type: 'person' })),
            ...(graph.groups || []).map(group => ({ id: group.id, name: group.name, type: 'group' })),
            ...(graph.places || []).map(place => ({ id: place.id, name: place.name, type: 'place' }))
        ].sort((a, b) => {
            const typeOrder = { work: 0, person: 1, group: 2, place: 3 };
            return (typeOrder[a.type] - typeOrder[b.type]) || a.name.localeCompare(b.name);
        });

        if (focus) {
            const seenTypes = new Set();
            entityOptions.forEach((entity) => {
                if (!seenTypes.has(entity.type)) {
                    const divider = document.createElement('option');
                    divider.disabled = true;
                    divider.textContent = '— ' + entity.type.toUpperCase() + ' —';
                    focus.appendChild(divider);
                    seenTypes.add(entity.type);
                }
                const option = document.createElement('option');
                option.value = entity.id;
                option.textContent = entity.name;
                focus.appendChild(option);
            });
        }

        const draw = () => {
            const query = normalize(input?.value || '');
            const focusId = focus?.value || '';
            let visible = 0;

            list.querySelectorAll('[data-network-card]').forEach((card) => {
                const entities = (card.dataset.entities || '').split('|');
                const matchesQuery = !query || normalize(card.dataset.search || '').includes(query);
                const matchesFocus = !focusId || entities.includes(focusId);
                const match = matchesQuery && matchesFocus;
                card.classList.toggle('is-hidden', !match);
                if (match) visible += 1;
            });

            if (count) count.textContent = String(visible).padStart(3, '0') + ' / ' +
                String(grouped.size).padStart(3, '0') + ' CONNECTED WORKS';

            const focusEntity = focusId ? entityMap.get(focusId) : null;
            if (path) path.textContent = focusEntity
                ? 'VIEW / CONNECTIONS OF ' + focusEntity.name.toUpperCase()
                : (query ? 'SEARCH / ' + input.value.toUpperCase() : 'VIEW / ALL CONNECTED WORKS');
        };

        list.innerHTML = Array.from(grouped.entries())
            .map(([workId, edges]) => renderCard(entityMap.get(workId).work, edges))
            .join('') || '<p class="small-note">NO PUBLIC RELATIONSHIPS IN CURRENT ARCHIVE.</p>';

        const params = new URLSearchParams(location.search);
        const queryParam = params.get('q') || '';
        const focusParam = params.get('focus') || '';
        if (input) input.value = queryParam;
        if (focus && entityMap.has(focusParam)) focus.value = focusParam;

        const writeUrl = () => {
            const next = new URL(location.href);
            if (input?.value.trim()) next.searchParams.set('q', input.value.trim());
            else next.searchParams.delete('q');
            if (focus?.value) next.searchParams.set('focus', focus.value);
            else next.searchParams.delete('focus');
            history.replaceState(null, '', next);
        };

        input?.addEventListener('input', () => {
            writeUrl();
            draw();
        });

        focus?.addEventListener('change', () => {
            if (focus.value) {
                input.value = '';
            }
            writeUrl();
            draw();
        });

        clear?.addEventListener('click', () => {
            input.value = '';
            if (focus) focus.value = '';
            writeUrl();
            draw();
            input?.focus();
        });

        draw();
    } catch (error) {
        if (count) count.textContent = 'SOURCE ERROR';
        list.innerHTML = '<p class="small-note">RELATION DATA COULD NOT BE READ.</p>';
    }
});
