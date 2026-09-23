document.addEventListener('DOMContentLoaded', async () => {
    const list = document.querySelector('#people-list');
    const input = document.querySelector('#people-search');
    const count = document.querySelector('#people-count');
    const type = document.querySelector('#people-type');
    if (!list) return;

    const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[char]));

    const relationLabel = {
        'created-by': 'CREATOR',
        'co-created-with': 'CO-CREATOR',
        'directed-by': 'DIRECTOR',
        'produced-by': 'PRODUCER',
        'performed-with': 'PERFORMER',
        'features': 'FEATURE',
        'curated-by': 'CURATOR',
        'documented-by': 'DOCUMENTATION'
    };

    try {
        const [workResponse, relationResponse, observationResponse] = await Promise.all([
            fetch('../data/works.json'),
            fetch('../data/relations.json'),
            fetch('../data/csv_entities.json')
        ]);
        if (!workResponse.ok || !relationResponse.ok) throw new Error('PEOPLE DATABASE UNAVAILABLE.');

        const works = (await workResponse.json()).works.filter(work => work.visibility !== 'private');
        const graph = await relationResponse.json();
        const observations = observationResponse.ok ? await observationResponse.json() : { entities: [] };
        const observationById = new Map((observations.entities || []).map(entity => [entity.canonical_id, entity]));
        const workById = new Map(works.map(work => [work.id, work]));

        const people = (graph.people || []).map(person => {
            const related = (graph.edges || [])
                .filter(edge => workById.has(edge.from) || workById.has(edge.to))
                .filter(edge => edge.from === person.id || edge.to === person.id)
                .map(edge => {
                    const workId = workById.has(edge.from) ? edge.from : edge.to;
                    const relation = edge.from === person.id ? '← ' + (relationLabel[edge.relation] || edge.relation.replaceAll('-', ' ').toUpperCase())
                        : relationLabel[edge.relation] || edge.relation.replaceAll('-', ' ').toUpperCase();
                    return { work: workById.get(workId), relation };
                })
                .filter(row => row.work);

            const unique = new Map();
            related.forEach(row => {
                if (!unique.has(row.work.id)) unique.set(row.work.id, []);
                unique.get(row.work.id).push(row.relation);
            });

            return { ...person, projects: Array.from(unique.entries()).map(([id, roles]) => ({
                work: workById.get(id),
                roles: roles.filter((role, index, arr) => arr.indexOf(role) === index)
            }))};
        }).filter(person => person.projects.length || person.type === 'artist')
          .sort((a, b) => {
              if (a.id === 'ilya-minin') return -1;
              if (b.id === 'ilya-minin') return 1;
              return b.projects.length - a.projects.length || a.name.localeCompare(b.name);
          });

        const types = [...new Set(people.map(person => person.type).filter(Boolean))].sort();
        types.forEach(value => {
            if (!type) return;
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value.toUpperCase();
            type.appendChild(option);
        });

        const params = new URLSearchParams(location.search);
        if (input) input.value = params.get('q') || '';
        if (type && types.includes(params.get('type'))) type.value = params.get('type');

        const draw = () => {
            const query = (input?.value || '').trim().toLowerCase();
            const typeFilter = type?.value || 'all';
            let visible = 0;

            list.innerHTML = people.map(person => {
                const projectNames = person.projects.map(item => item.work.title).join(' ');
                const observation = observationById.get(person.id);
                const blob = [
                    person.name, ...(person.aliases || []), person.type, projectNames,
                    ...person.projects.flatMap(item => item.roles),
                    ...(observation?.source_forms || []),
                    ...(observation?.roles_observed || []),
                    observation?.persona_notes || ''
                ].join(' ').toLowerCase();
                const matchType = typeFilter === 'all' || person.type === typeFilter;
                const match = matchType && (!query || blob.includes(query));
                if (match) visible += 1;

                const projectsHTML = person.projects
                    .sort((a, b) => String(b.work.year).localeCompare(String(a.work.year)) || a.work.title.localeCompare(b.work.title))
                    .map(item =>
                        '<a class="person-project" href="record.html?id=' + encodeURIComponent(item.work.id) + '">' +
                        '<span>' + escapeHTML(item.work.year) + '</span><strong>' + escapeHTML(item.work.title) + '</strong>' +
                        '<em>' + escapeHTML(item.roles.join(' / ')) + '</em><b>↗</b></a>'
                    ).join('') || '<p class="small-note">No public project relations recorded.</p>';

                const observedRoles = observation?.roles_observed || [];
                const personaNote = observation?.persona_notes || '';
                return '<article class="person-card' + (match ? '' : ' is-hidden') + '" data-person>' +
                    '<header class="person-head">' +
                    '<div><p class="person-id">' + escapeHTML(person.id) + '</p><h2><a href="entity.html?id=' + encodeURIComponent(person.id) + '">' + escapeHTML(person.name) + '</a></h2>' +
                    ((person.aliases || observation?.source_forms || []).length ? '<p class="person-aliases">SOURCE NAMES / ' + escapeHTML(Array.from(new Set([...(person.aliases || []), ...(observation?.source_forms || [])])).join(' · ')) + '</p>' : '') +
                    (observedRoles.length ? '<p class="person-roles">OBSERVED / ' + escapeHTML(observedRoles.join(' · ')) + '</p>' : '') +
                    (personaNote ? '<p class="person-persona">' + escapeHTML(personaNote) + '</p>' : '') +
                    '</div>' +
                    '<div class="person-meta"><span>' + escapeHTML(person.type) + '</span><strong>' + String(person.projects.length).padStart(2, '0') + '</strong><small>PROJECTS</small></div>' +
                    '</header><div class="person-projects">' + projectsHTML + '</div></article>';
            }).join('') || '<p class="small-note">NO PUBLIC PEOPLE IN CURRENT NETWORK.</p>';

            if (count) count.textContent = String(visible).padStart(3, '0') + ' PEOPLE / ' + String(people.length).padStart(3, '0') + ' INDEXED';
        };

        const writeUrl = () => {
            const next = new URL(location.href);
            if (input?.value.trim()) next.searchParams.set('q', input.value.trim());
            else next.searchParams.delete('q');
            if (type?.value && type.value !== 'all') next.searchParams.set('type', type.value);
            else next.searchParams.delete('type');
            history.replaceState(null, '', next);
        };

        input?.addEventListener('input', () => { writeUrl(); draw(); });
        type?.addEventListener('change', () => { writeUrl(); draw(); });
        draw();
    } catch (error) {
        if (count) count.textContent = 'SOURCE ERROR';
        list.innerHTML = '<p class="small-note">PEOPLE DATA COULD NOT BE READ.</p>';
    }
});
