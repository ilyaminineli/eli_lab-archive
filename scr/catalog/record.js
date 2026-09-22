document.addEventListener('DOMContentLoaded', async () => {
    const main = document.querySelector('#record-main');
    if (!main) return;

    const id = new URLSearchParams(location.search).get('id');

    try {
        const [worksResponse, relationsResponse, videoResponse, assetResponse, dossierResponse, videoLinksResponse, mediaResponse] = await Promise.all([
            fetch('../data/works.json'),
            fetch('../data/relations.json'),
            fetch('../data/video_context.json'),
            fetch('../data/asset_candidates.json'),
            fetch('../data/dossiers.json'),
            fetch('../data/video_links.json'),
            fetch('../data/media.json')
        ]);

        if (!worksResponse.ok) throw new Error('WORK DATABASE UNAVAILABLE.');

        const manifest = await worksResponse.json();
        const works = manifest.works.filter((work) => work.visibility !== 'private');
        const relations = relationsResponse.ok
            ? await relationsResponse.json()
            : { edges: [], people: [], places: [], groups: [] };
        const videoContext = videoResponse.ok ? await videoResponse.json() : { rows: [] };
        const assetCandidates = assetResponse.ok ? await assetResponse.json() : { works: {} };
        const dossiers = dossierResponse.ok ? await dossierResponse.json() : { works: {} };
        const dossier = dossiers.works?.[id] || null;
        const videoLinks = videoLinksResponse.ok ? await videoLinksResponse.json() : { links: [] };
        const mediaManifest = mediaResponse.ok ? await mediaResponse.json() : { works: {} };

        const work = works.find((item) => item.id === id);

        if (!work) {
            main.innerHTML = '<section class="page-intro u-container"><p class="eyebrow">404 / RECORD NOT FOUND</p><h1>UNKNOWN<br><em>WORK.</em></h1><p class="page-lead">The requested record is not in the public archive.</p></section>';
            return;
        }

        const mediaEntry = mediaManifest.works?.[id] || { folder: work.media_dir || ('media/works/' + id + '/'), items: [] };

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
            return 'entity.html?id=' + encodeURIComponent(entityId);
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

        const mediaDir = work.media_dir || mediaEntry.folder || ('media/works/' + work.id + '/');
        const mediaItems = Array.isArray(mediaEntry.items) ? mediaEntry.items : [];
        const mediaUrl = (path) => {
            const value = String(path || '');
            if (/^https?:\/\//i.test(value)) return value;
            return '../' + value.replace(/^\/+/, '');
        };
        const coverItem = mediaItems.find(item => item.role === 'cover') || mediaItems[0];
        const resolvedThumbnail = coverItem?.path ? mediaUrl(coverItem.path) : (work.thumbnail || '');

        const thumbnail = resolvedThumbnail
            ? '<a class="record-hero-media" target="_blank" rel="noopener" href="' + escapeHTML(resolvedThumbnail) + '">' +
              '<img src="' + escapeHTML(resolvedThumbnail) + '" alt="" loading="eager"><span>OPEN IMAGE ↗</span></a>'
            : '<div class="record-hero-media record-hero-media--empty"><span>NO PREVIEW</span><em>' +
              (mediaItems.length ? 'Selected media listed in data/media.json.' : 'Add selected media paths to data/media.json.') +
              '</em></div>';

        const mediaGalleryHTML = mediaItems.length
            ? '<section class="record-panel record-media-gallery"><div class="panel-title">ARCHIVE MEDIA</div>' +
              '<div class="record-media-grid">' + mediaItems.map((item, index) =>
                  '<figure><a target="_blank" rel="noopener" href="' + escapeHTML(mediaUrl(item.path)) + '">' +
                  '<img src="' + escapeHTML(mediaUrl(item.path)) + '" alt="" loading="lazy"></a>' +
                  '<figcaption><span>' + String(index + 1).padStart(2, '0') + '</span>' +
                  '<strong>' + escapeHTML(item.role || 'image') + '</strong>' +
                  (item.caption ? '<em>' + escapeHTML(item.caption) + '</em>' : '') +
                  '</figcaption></figure>'
              ).join('') + '</div></section>'
            : '<section class="record-panel record-media-plan"><div class="panel-title">ARCHIVE MEDIA / PLAN</div>' +
              '<p class="small-note">Folder is staged and ready for real recovered images. Add selected files to <strong>data/media.json</strong> when they are ready for public display.</p>' +
              '<div class="media-slot-list">' + (dossier?.media_slots || []).map((slot, index) =>
                  '<span><b>' + String(index + 1).padStart(2, '0') + '</b>' + escapeHTML(slot) + '</span>'
              ).join('') + '</div></section>';

        const sourceVideos = (videoContext.rows || [])
            .filter(video => video.canonicalWorkId === work.id)
            .sort((a, b) => String(a.date).localeCompare(String(b.date)));
        const videoDescriptions = sourceVideos.filter(video => String(video.description || '').trim());
        const candidateAssets = assetCandidates.works?.[work.id] || [];
        const candidateAssetHTML = candidateAssets.map((candidate, index) => {
            const sourceUrl = 'https://github.com/ilyaminineli/eli_lab_official/blob/main/' +
                candidate.path.split('/').map(segment => encodeURIComponent(segment)).join('/');
            return '<a class="asset-candidate" target="_blank" rel="noopener" href="' + sourceUrl + '">' +
                '<span>' + String(index + 1).padStart(2, '0') + '</span><strong>' +
                escapeHTML(candidate.path) + '</strong><em>' +
                escapeHTML((candidate.matched || []).join(' / ')) + ' ↗</em></a>';
        }).join('');

        const sourceVideoHTML = sourceVideos.map((video, index) => {
            const sourceLinks = (video.links || []).slice(0, 8).map(link =>
                '<a class="source-video-link" target="_blank" rel="noopener" href="' + escapeHTML(link) + '">' +
                escapeHTML(link.replace(/^https?:\/\//, '')) + ' ↗</a>'
            ).join('');
            const details = video.description
                ? '<details class="source-video-details"><summary>READ SOURCE DESCRIPTION</summary><p>' +
                    escapeHTML(video.description) + '</p>' +
                    (sourceLinks ? '<div class="source-video-links">' + sourceLinks + '</div>' : '') +
                  '</details>'
                : '';
            return '<article class="source-video-row">' +
                '<div class="source-video-index">' + String(index + 1).padStart(2, '0') + '</div>' +
                '<div><h3>' + escapeHTML(video.title) + '</h3>' +
                '<p>' + escapeHTML(video.date ? video.date.slice(0, 10) : '') +
                (video.duration ? ' / ' + escapeHTML(video.duration) : '') + '</p>' + details + '</div>' +
                '<a class="source-video-open" target="_blank" rel="noopener" href="' + escapeHTML(video.url) + '">OPEN ↗</a>' +
                '</article>';
        }).join('');
        const linkedVideos = (videoLinks.links || []).filter(link =>
            sourceVideos.some(video => video.videoId === link.sourceVideoId) || link.sourceCanonicalWorkId === work.id
        );
        const detailSections = [
            ['PROCESS', dossier?.process],
            ['MATERIALS', dossier?.materials],
            ['CHRONOLOGY', dossier?.chronology?.map(item => (item.year ? item.year + ' — ' : '') + item.note)],
            ['EXHIBITIONS', dossier?.exhibitions],
            ['PUBLICATIONS', dossier?.publications],
            ['TECHNICAL NOTES', dossier?.technical_notes],
            ['ARCHIVAL NOTES', dossier?.archival_notes],
            ['SOURCE CONTEXT', dossier?.source_context],
            ['SOURCE LINKS', dossier?.source_links],
            ['SOURCE CREDIT EVIDENCE', dossier?.source_credit_lines]
        ].filter(section => Array.isArray(section[1]) && section[1].length);

        const relatedWorkHTML = (work.related_works || []).map(relatedId => {
            const related = byId[relatedId];
            if (!related) return '';
            return '<a class="related-work-link" href="record.html?id=' + encodeURIComponent(related.id) + '">' +
                '<span>' + escapeHTML(related.year) + '</span><strong>' + escapeHTML(related.title) + '</strong><b>↗</b></a>';
        }).join('');

        const detailHTML = detailSections.map(([title, items]) =>
            '<section class="dossier-detail"><h3>' + escapeHTML(title) + '</h3><div>' +
            items.map(item => '<p>' + escapeHTML(String(item)) + '</p>').join('') +
            '</div></section>'
        ).join('');

        const coverage = [
            ['DESCRIPTION', Boolean(work.description)],
            ['IMAGE', Boolean(resolvedThumbnail)],
            ['SOURCES', Boolean(work.sources?.length)],
            ['EXTERNAL', Boolean(work.external_sources?.length)],
            ['RELATIONS', Boolean(edges.length)],
            ['VIDEOS', Boolean(sourceVideos.length)],
            ['MEDIA FOLDER', true],
            ['MEDIA ITEMS', Boolean(mediaItems.length)],
            ['DOSSIER', Boolean(dossier)]
        ];

        const present = coverage.filter(item => item[1]).map(item => item[0]);
        const missing = coverage.filter(item => !item[1]).map(item => item[0]);

        const expansionText = missing.length
            ? 'This entry can be expanded with ' + missing.map(item => item.toLowerCase()).join(', ') + '. The dossier has reserved fields for process, materials, chronology, exhibitions, publications, technical notes and archival questions.'
            : 'Core metadata is present. The dossier can now be expanded with project-specific process, materials, chronology, exhibitions, technical notes and a fuller media gallery.';

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

            '<section class="record-panel record-video-context"><div class="panel-title">VIDEO / SOURCE CONTEXT</div>' +
            '<p class="small-note">The YouTube export is treated as provenance rather than a second work catalogue. ' +
            escapeHTML(String(sourceVideos.length)) + ' source row(s) are attached to this record; ' +
            escapeHTML(String(videoDescriptions.length)) + ' contain descriptive context.</p>' +
            (sourceVideoHTML || '<p class="small-note">NO VIDEO SOURCE ROWS ARE CURRENTLY MAPPED.</p>') +
            '</section>' +

            (relatedWorkHTML ? '<section class="record-panel record-related"><div class="panel-title">RELATED WORKS</div><div class="related-work-list">' +
                relatedWorkHTML + '</div></section>' : '') +

            (mediaGalleryHTML || '') +
            (candidateAssetHTML ? '<section class="record-panel record-assets"><div class="panel-title">VISUAL ASSET CANDIDATES</div>' +
                '<p class="small-note">These are filename/path matches from the 595-image visual inventory, not yet confirmed as canonical artwork. Review before promotion.</p>' +
                '<div class="asset-candidates">' + candidateAssetHTML + '</div></section>' : '') +

            '<section class="record-panel record-dossier"><div class="panel-title">DOSSIER / WORK FILE</div>' +
            '<div class="dossier-grid">' +

            '<div><span>PROCESS</span><strong>' + String(dossier?.process?.length || 0).padStart(2, '0') + ' NOTES</strong></div>' +
            '<div><span>MATERIALS</span><strong>' + String(dossier?.materials?.length || 0).padStart(2, '0') + ' ITEMS</strong></div>' +
            '<div><span>CHRONOLOGY</span><strong>' + String(dossier?.chronology?.length || 0).padStart(2, '0') + ' EVENTS</strong></div>' +
            '<div><span>EXHIBITIONS</span><strong>' + String(dossier?.exhibitions?.length || 0).padStart(2, '0') + ' ENTRIES</strong></div>' +
            '<div><span>TECHNICAL</span><strong>' + String(dossier?.technical_notes?.length || 0).padStart(2, '0') + ' NOTES</strong></div>' +
            '<div><span>QUESTIONS</span><strong>' + String(dossier?.questions_to_resolve?.length || 0).padStart(2, '0') + ' OPEN</strong></div>' +
            '</div>' +
            (detailHTML || '<p class="small-note dossier-empty">Detailed process notes are not entered yet. The structured dossier is ready for them.</p>') +
            '</section>' +

            (linkedVideos.length ? '<section class="record-panel record-linked-videos"><div class="panel-title">SOURCE LINKS / RELATED VIDEOS</div>' +
                '<div class="linked-video-list">' + linkedVideos.map(link =>
                '<a href="https://www.youtube.com/watch?v=' + encodeURIComponent(link.linkedVideoId) + '" target="_blank" rel="noopener">' +
                '<span>→</span><strong>' + escapeHTML(link.linkedTitle || link.linkedVideoId) + '</strong>' +
                '<em>' + escapeHTML(link.linkedCanonicalWorkId || 'SOURCE') + '</em></a>'
                ).join('') + '</div></section>' : '') +

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

            '<div class="record-actions"><span class="record-media-path">' +
            (work.media_status === 'staged'
                ? 'MEDIA / <a target="_blank" rel="noopener" href="https://github.com/ilyaminineli/eli_lab-archive/tree/main/' + encodeURI(work.media_dir || ('media/works/' + work.id + '/')) + '">' + escapeHTML(work.media_dir || ('media/works/' + work.id + '/')) + ' ↗</a>'
                : 'MEDIA / PLANNED — ' + escapeHTML(work.media_dir || ('media/works/' + work.id + '/'))) +
            '</span>' +
            '<a class="text-link" href="archive.html">← BACK TO WORKS</a>' +
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
