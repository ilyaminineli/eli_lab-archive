document.addEventListener('DOMContentLoaded', async () => {
    const list = document.querySelector('#network-list');
    const input = document.querySelector('#network-search');
    const count = document.querySelector('#network-count');
    if (!list) return;

    const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[char]));

    try {
        const [workResponse, relationResponse] = await Promise.all([
            fetch('../data/works.json'),
            fetch('../data/relations.json')
        ]);
        if (!workResponse.ok || !relationResponse.ok) throw new Error('NETWORK DATABASE UNAVAILABLE.');

        const works = (await workResponse.json()).works.filter((work) => work.visibility !== 'private');
        const graph = await relationResponse.json();

        const entityName = new Map([
            ...works.map((work) => [work.id, work.title]),
            ...(graph.people || []).map((person) => [person.id, person.name]),
            ...(graph.places || []).map((place) => [place.id, place.name]),
            ...(graph.groups || []).map((group) => [group.id, group.name])
        ]);

        const workIds = new Set(works.map((work) => work.id));

        const draw = () => {
            const query = (input?.value || '').trim().toLowerCase();
            const edges = (graph.edges || []).filter((edge) => {
                const text = (
                    (entityName.get(edge.from) || edge.from) + ' ' +
                    edge.relation + ' ' +
                    (entityName.get(edge.to) || edge.to)
                ).toLowerCase();
                return !query || text.includes(query);
            });

            if (count) count.textContent = String(edges.length).padStart(3, '0') + ' / ' + String(graph.edges.length).padStart(3, '0') + ' relations';

            list.innerHTML = edges.map((edge) => {
                const sourceWork = workIds.has(edge.from);
                const targetWork = workIds.has(edge.to);
                const sourceHref = sourceWork
                    ? 'record.html?id=' + encodeURIComponent(edge.from)
                    : 'network.html?q=' + encodeURIComponent(entityName.get(edge.from) || edge.from);
                const targetHref = targetWork
                    ? 'record.html?id=' + encodeURIComponent(edge.to)
                    : 'network.html?q=' + encodeURIComponent(entityName.get(edge.to) || edge.to);

                return '<div class="network-row">' +
                    '<a href="' + sourceHref + '"><span>' + escapeHTML(entityName.get(edge.from) || edge.from) + '</span></a>' +
                    '<b>' + escapeHTML(edge.relation) + '</b>' +
                    '<a href="' + targetHref + '"><span>' + escapeHTML(entityName.get(edge.to) || edge.to) + '</span></a>' +
                    '</div>';
            }).join('') || '<p class="small-note">NO MATCHING RELATIONS.</p>';
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
