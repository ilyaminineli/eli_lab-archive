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

        const resolveEntity = (entityId) => {
            if (byId[entityId]) return byId[entityId].title;
            if (people[entityId]) return people[entityId].name;
            if (places[entityId]) return places[entityId].name;
            if (groups[entityId]) return groups[entityId].name;
            return entityId;
        };

        const entityLink = (entityId) => {
            if (byId[entityId]) return 'record.html?id=' + encodeURIComponent(entityId);
            return 'network.html?focus=' + encodeURIComponent(entityId);
        };

        const relationLabel = (relation) =>
            relation.replaceAll('-', ' ').replace(/^\w/, (char) => char.toUpperCase());

        const relationRows = edges.map((edge) => {
            const outgoing = edge.from === work.id;
            const targetId = outgoing ? edge.to : edge.from;
            const label = outgoing ? relationLabel(edge.relation) : '← ' + relationLabel(edge.relation);
            return '<a class="relation-row" href="' + entityLink(targetId) + '"><span>' +
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

        const thumbnail = work.thumbnail
            ? '<a class="record-hero-media" target="_blank" rel="noopener" href="' + escapeHTML(work.thumbnail) + '">' +
              '<img src="' + escapeHTML(work.thumbnail) + '" alt="" loading="eager"><span>OPEN IMAGE ↗</span></a>'
            : '<div class="record-hero-media record-hero-media--empty"><span>NO PREVIEW</span><em>Asset mapping pending</em></div>';

        const coverage = [
            ['DESCRIPTION', Boolean(work.description)],
            ['IMAGE', Boolean(work.thumbnail)],
            ['SOURCES', Boolean(work.sources?.length)],
            ['EXTERNAL', Boolean(work.external_sources?.length)],
            ['RELATIONS', Boolean(edges.length)],
            ['RELATED WORKS', Boolean(work.related_works?.length)]
        ];

        const present = coverage.filter(item => item[1]).map(item => item[0]);
        const missing = coverage.filter(item => !item[1]).map(item => item[0]);

        const expansionText = missing.length
            ? 'This entry can be expanded with ' + missing.map(item => item.toLowerCase()).join(', ') + '. The next useful dossier layer is project-specific process, materials, credits, chronology or a media gallery.'
            : 'Core metadata is present. The next useful dossier layer is project-specific process, materials, chronology and a fuller media gallery.';

        main.innerHTML =
            '<section class="record-page u-container">' +
            '<div class="record-head">' +
            thumbnail +
            '<div class="record-hero-copy">' +
            '<p class="eyebrow">WORK RECORD / ' + escapeHTML(work.id) + '</p>' +
            '<h1>' + escapeHTML(work.title) + '</h1>' +
            '<p class="record-description">' + escapeHTML(work.description || 'No description in current manifest.') + '</p>' +
            '</div><div class="record-plate">' +
            '<span>YEAR</span><strong>' + escapeHTML(work.year) + '</strong>' +
            '<span>STATUS</span><strong>' + escapeHTML((work.status || '—').toUpperCase()) + '</strong>' +
            '<span>DEPTH</span><strong>' + String(present.length).padStart(2, '0') + ' / 06</strong>' +
            '</div></div>' +

            '<div class="record-grid">' +
            '<section class="record-panel"><div class="panel-title">CLASSIFICATION</div><dl class="record-specs">' +
            '<div><dt>MEDIUM</dt><dd>' + (work.medium || []).map(escapeHTML).join(' / ') + '</dd></div>' +
            '<div><dt>CONTEXT</dt><dd>' + (work.context || []).map(escapeHTML).join(' / ') + '</dd></div>' +
            '<div><dt>SOURCES</dt><dd>' + (sourceRows || '—') + '</dd></div>' +
            '<div><dt>EXTERNAL</dt><dd>' + (externalRows || '—') + '</dd></div>' +
            '</dl></section>' +

            '<section class="record-panel"><div class="panel-title">RELATIONS</div><div class="record-relations">' +
            (relationRows || '<p class="small-note">NO EXPLICIT RELATIONS RECORDED.</p>') +
            '</div></section>' +
            '</div>' +

            '<section class="record-panel record-expansion"><div class="panel-title">ARCHIVE EXPANSION</div>' +
            '<p>' + escapeHTML(expansionText) + '</p>' +
            '<div class="coverage-grid">' +
            coverage.map(item => '<span class="' + (item[1] ? 'is-present' : 'is-missing') + '">' +
                (item[1] ? '● ' : '○ ') + escapeHTML(item[0]) + '</span>').join('') +
            '</div></section>' +

            '<section class="record-panel record-sources"><div class="panel-title">PROVENANCE</div>' +
            '<p class="small-note">Verification: <strong>' + escapeHTML(work.status || 'unspecified') +
            '</strong>. This is a living archive; uncertainty and source hierarchy are intentionally preserved.</p>' +
            '</section>' +

            '<div class="record-actions"><a class="text-link" href="archive.html">← BACK TO WORKS</a>' +
            '<a class="text-link" href="network.html?focus=' + encodeURIComponent(work.id) + '">OPEN IN NETWORK →</a></div>' +
            '</section>';
    } catch (error) {
        main.innerHTML =
            '<section class="page-intro u-container"><h1>READ<br><em>ERROR.</em></h1><p class="page-lead">' +
            escapeHTML(String(error && error.message ? error.message : error)) + '</p></section>';
    }

    function escapeHTML(value) {
        return String(value ?? '').replace(/[&<>"']/g, (char) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[char]));
    }
});
