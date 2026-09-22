document.addEventListener('DOMContentLoaded', async () => {
    const list = document.querySelector('#network-list');
    const input = document.querySelector('#network-search');
    const count = document.querySelector('#network-count');
    const workStat = document.querySelector('[data-network-stat="works"]');
    const peopleStat = document.querySelector('[data-network-stat="people"]');
    const groupStat = document.querySelector('[data-network-stat="groups"]');
    const placeStat = document.querySelector('[data-network-stat="places"]');
    if (!list) return;

    const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[char]));

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
        'implemented-with': 'IMPLEMENTED WITH',
        'supports': 'SUPPORTS',
        'contains': 'CONTAINS',
        'uses': 'USES',
        'related-to': 'RELATED TO'
    };

    const categoryFor = (relation) => {
        if (/created|co-created|directed|produced|performed|features/.test(relation)) return 'AUTHORSHIP / PARTICIPATION';
        if (/exhibited|screened|curated|part-of/.test(relation)) return 'CONTEXT / EXHIBITION';
        if (/implemented|supports|contains|uses/.test(relation)) return 'SYSTEM / PRODUCTION';
        if (/archive|documented|released/.test(relation)) return 'PROVENANCE';
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
            ...(graph.people || []).map((person) => [person.id, { id: person.id, type: 'person', name: person.name }]),
            ...(graph.groups || []).map((group) => [group.id, { id: group.id, type: 'group', name: group.name }]),
            ...(graph.places || []).map((place) => [place.id, { id: place.id, type: 'place', name: place.name }])
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

        const entityHref = (id) => {
            const entity = entityMap.get(id);
            if (!entity) return '#';
            if (entity.type === 'work') return 'record.html?id=' + encodeURIComponent(id);
            return 'network.html?q=' + encodeURIComponent(entity.name);
        };

        const entityName = (id) => entityMap.get(id)?.name || id;
        const entityType = (id) => entityMap.get(id)?.type || 'entity';

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
                '<strong>' + escapeHTML(target) + '</strong>' +
                '<em class="network-entity network-entity--' + escapeHTML(type) + '">' + escapeHTML(type) + '</em>' +
                '</a>';
        };

        const renderCard = (work, edges) => {
            const searchBlob = [
                work.title, work.year, ...(work.medium || []), ...(work.context || []),
                ...edges.flatMap(edge => [edge.relation, entityName(edge.from), entityName(edge.to)])
            ].join(' ').toLowerCase();

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

            return '<article class="network-card" data-network-card data-search="' + escapeHTML(searchBlob) + '">' +
                '<header class="network-card-head">' +
                '<div><p class="network-card-id">' + escapeHTML(work.id) + '</p>' +
                '<h2><a href="record.html?id=' + encodeURIComponent(work.id) + '">' + escapeHTML(work.title) + '</a></h2></div>' +
                '<div class="network-card-meta"><span>' + escapeHTML(work.year) + '</span><span>' +
                escapeHTML((work.medium || []).slice(0, 2).join(' / ')) + '</span><span>' +
                String(edges.length).padStart(2, '0') + ' LINKS</span></div>' +
                '</header>' + categoryHTML + '</article>';
        };

        const draw = () => {
            const query = (input?.value || '').trim().toLowerCase();
            const cards = works
                .filter(work => grouped.has(work.id))
                .sort((a, b) => String(b.year).localeCompare(String(a.year)) || a.title.localeCompare(b.title))
                .map(work => renderCard(work, grouped.get(work.id)));

            list.innerHTML = cards.join('') || '<p class="small-note">NO PUBLIC RELATIONSHIPS IN CURRENT ARCHIVE.</p>';

            let visible = 0;
            list.querySelectorAll('[data-network-card]').forEach((card) => {
                const match = !query || (card.dataset.search || '').includes(query);
                card.classList.toggle('is-hidden', !match);
                if (match) visible += 1;
            });

            if (count) count.textContent = String(visible).padStart(3, '0') + ' WORKS / ' +
                String(grouped.size).padStart(3, '0') + ' CONNECTED';
        };

        const params = new URLSearchParams(location.search);
        if (input && params.get('q')) input.value = params.get('q');

        input?.addEventListener('input', draw);
        draw();
    } catch (error) {
        if (count) count.textContent = 'SOURCE ERROR';
        list.innerHTML = '<p class="small-note">RELATION DATA COULD NOT BE READ.</p>';
    }
});
