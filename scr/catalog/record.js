document.addEventListener('DOMContentLoaded', async () => {
    const main = document.querySelector('#record-main');
    if (!main) return;

    const id = new URLSearchParams(location.search).get('id');

    try {
        const [worksResponse, relationsResponse] = await Promise.all([
            fetch('../data/works.json'),
            fetch('../data/relations.json')
        ]);

        if (!worksResponse.ok) throw new Error('WORK DATABASE UNAVAILABLE.');

        const manifest = await worksResponse.json();
        const works = manifest.works.filter((work) => work.visibility !== 'private');
        const relations = relationsResponse.ok
            ? await relationsResponse.json()
            : { edges: [], people: [], places: [], groups: [] };

        const work = works.find((item) => item.id === id);

        if (!work) {
            main.innerHTML = '<section class="page-intro u-container"><p class="eyebrow">404 / RECORD NOT FOUND</p><h1>UNKNOWN<br><em>WORK.</em></h1><p class="page-lead">The requested record is not in the public archive.</p></section>';
            return;
        }

        document.title = 'eli_lab — ' + work.title;

        const people = Object.fromEntries((relations.people || []).map((item) => [item.id, item]));
        const places = Object.fromEntries((relations.places || []).map((item) => [item.id, item]));
        const groups = Object.fromEntries((relations.groups || []).map((item) => [item.id, item]));
        const byId = Object.fromEntries(works.map((item) => [item.id, item]));

        const edges = (relations.edges || []).filter((edge) => edge.from === work.id || edge.to === work.id);

        const resolveEntity = (id) => {
            if (byId[id]) return byId[id].title;
            if (people[id]) return people[id].name;
            if (places[id]) return places[id].name;
            if (groups[id]) return groups[id].name;
            return id;
        };

        const relationRows = edges.map((edge) => {
            const outgoing = edge.from === work.id;
            const targetId = outgoing ? edge.to : edge.from;
            const label = outgoing ? edge.relation : '← ' + edge.relation;
            const targetIsWork = Boolean(byId[targetId]);
            const href = targetIsWork
                ? 'record.html?id=' + encodeURIComponent(targetId)
                : '#';
            return '<a class="relation-row" href="' + href + '"><span>' +
                escapeHTML(label) + '</span><strong>' +
                escapeHTML(resolveEntity(targetId)) + '</strong><em>→</em></a>';
        }).join('');

        const sourceRows = (work.sources || []).map((source) =>
            '<a class="text-link" target="_blank" rel="noopener" href="' +
            escapeHTML(source) + '">' + escapeHTML(source.replace(/^https?:\/\//, '')) + ' ↗</a>'
        ).join('');

        const externalRows = (work.external_sources || []).map((source) =>
            '<a class="text-link" target="_blank" rel="noopener" href="' +
            escapeHTML(source) + '">' + escapeHTML(source.replace(/^https?:\/\//, '')) + ' ↗</a>'
        ).join('');

        main.innerHTML =
            '<section class="record-page u-container">' +
            '<div class="record-head"><div>' +
            '<p class="eyebrow">WORK RECORD / ' + escapeHTML(work.id) + '</p>' +
            '<h1>' + escapeHTML(work.title) + '</h1>' +
            '<p class="record-description">' + escapeHTML(work.description || 'No description in current manifest.') + '</p>' +
            '</div><div class="record-plate">' +
            '<span>YEAR</span><strong>' + escapeHTML(work.year) + '</strong>' +
            '<span>STATUS</span><strong>' + escapeHTML((work.status || '—').toUpperCase()) + '</strong>' +
            '</div></div>' +

            '<div class="record-grid">' +
            '<section class="record-panel"><div class="panel-title">CLASSIFICATION</div><dl class="record-specs">' +
            '<div><dt>MEDIUM</dt><dd>' + work.medium.map(escapeHTML).join(' / ') + '</dd></div>' +
            '<div><dt>CONTEXT</dt><dd>' + (work.context || []).map(escapeHTML).join(' / ') + '</dd></div>' +
            '<div><dt>SOURCES</dt><dd>' + (sourceRows || '—') + '</dd></div>' +
            '<div><dt>EXTERNAL</dt><dd>' + (externalRows || '—') + '</dd></div>' +
            '</dl></section>' +

            '<section class="record-panel"><div class="panel-title">RELATIONS</div><div class="record-relations">' +
            (relationRows || '<p class="small-note">NO EXPLICIT RELATIONS RECORDED.</p>') +
            '</div></section>' +
            '</div>' +

            '<section class="record-panel record-sources"><div class="panel-title">PROVENANCE</div>' +
            '<p class="small-note">Verification: <strong>' + escapeHTML(work.status || 'unspecified') +
            '</strong>. This is a living archive; uncertainty and source hierarchy are intentionally preserved.</p>' +
            '</section>' +

            '<div class="record-actions"><a class="text-link" href="archive.html">← BACK TO WORKS</a>' +
            '<a class="text-link" href="../pgs/network.html">OPEN NETWORK MAP →</a></div>' +
            '</section>';

        function escapeHTML(value) {
            return String(value ?? '').replace(/[&<>"']/g, (char) => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            }[char]));
        }
    } catch (error) {
        main.innerHTML =
            '<section class="page-intro u-container"><h1>READ<br><em>ERROR.</em></h1><p class="page-lead">' +
            escapeMessage(error) + '</p></section>';
    }

    function escapeMessage(error) {
        return String(error && error.message ? error.message : error);
    }
});
