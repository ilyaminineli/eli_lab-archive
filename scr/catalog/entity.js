document.addEventListener('DOMContentLoaded', async () => {
    const main = document.querySelector('#entity-main');
    if (!main) return;

    const id = new URLSearchParams(location.search).get('id');
    const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
    }[char]));

    try {
        const [worksResponse, relationResponse, observationResponse] = await Promise.all([
            fetch('../data/works.json'),
            fetch('../data/relations.json'),
            fetch('../data/csv_entities.json')
        ]);
        if (!worksResponse.ok || !relationResponse.ok) throw new Error('ENTITY DATABASE UNAVAILABLE.');

        const works = (await worksResponse.json()).works.filter(w => w.visibility !== 'private');
        const graph = await relationResponse.json();
        const observations = observationResponse.ok ? await observationResponse.json() : { entities: [] };
        const observationById = new Map((observations.entities || []).map(item => [item.canonical_id, item]));
        const workById = new Map(works.map(w => [w.id, w]));
        const entities = new Map([
            ...(graph.people || []).map(e => [e.id, {...e,type:'person'}]),
            ...(graph.groups || []).map(e => [e.id, {...e,type:'group'}]),
            ...(graph.places || []).map(e => [e.id, {...e,type:'place'}])
        ]);
        const entity = entities.get(id);
        const observation = observationById.get(id);

        if (!entity) {
            main.innerHTML='<section class="page-intro u-container"><p class="eyebrow">404 / ENTITY NOT FOUND</p><h1>UNKNOWN<br><em>ENTITY.</em></h1><p class="page-lead">The requested network entity is not in the current archive graph.</p></section>';
            return;
        }

        document.title='eli_lab — '+entity.name;

        const entityMap = new Map([
            ...entities,
            ...works.map(w => [w.id,{id:w.id,type:'work',name:w.title,work:w}])
        ]);
        const edges=(graph.edges||[]).filter(e=>e.from===id||e.to===id);
        const projects=edges.map(edge=>{
            const targetId=edge.from===id?edge.to:edge.from;
            const target=entityMap.get(targetId);
            if(!target || target.type!=='work' || !target.work) return null;
            return {work:target.work,relation:edge.relation,direction:edge.from===id?'out':'in'};
        }).filter(Boolean);
        const unique=new Map();
        projects.forEach(item=>{
            if(!unique.has(item.work.id)) unique.set(item.work.id,{work:item.work,relations:[]});
            unique.get(item.work.id).relations.push((item.direction==='in'?'← ':'→ ')+item.relation.replaceAll('-',' '));
        });

        const aliases=(entity.aliases||[]).filter(a=>a && a!==entity.name);
        const cards=[...unique.values()]
            .sort((a,b)=>String(b.work.year).localeCompare(String(a.work.year))||a.work.title.localeCompare(b.work.title))
            .map(item=>'<a class="entity-project" href="record.html?id='+encodeURIComponent(item.work.id)+'">'+
                '<span>'+escapeHTML(item.work.year)+'</span><div><h2>'+escapeHTML(item.work.title)+'</h2>'+
                '<p>'+escapeHTML(item.work.description||'')+'</p></div>'+
                '<em>'+escapeHTML(item.relations.join(' / '))+'</em><b>↗</b></a>').join('');

        const relatedEntities=[...new Set(edges.flatMap(edge=>[edge.from,edge.to]).filter(x=>x!==id && entities.has(x)))]
            .map(otherId=>entities.get(otherId))
            .sort((a,b)=>a.name.localeCompare(b.name))
            .map(other=>'<a class="entity-related" href="entity.html?id='+encodeURIComponent(other.id)+'">'+
                '<span>'+escapeHTML(other.type)+'</span><strong>'+escapeHTML(other.name)+'</strong><b>↗</b></a>').join('');

        const mediaNote=entity.type==='person'
            ? 'This is a source-derived collaborator index, not a biographical or personality profile. Roles below reflect explicit archive relations and published credits.'
            : 'This entity record is a structured network index. It describes its documented relationship to works and other entities without filling gaps with unsupported biography.';
        const sourceForms = Array.from(new Set([...(entity.aliases || []), ...(observation?.source_forms || [])])).filter(name => name && name !== entity.name);
        const observedRoles = observation?.roles_observed || [];
        const personaNote = observation?.persona_notes || '';
        const observationNotes = observation?.notes || '';

        main.innerHTML='<section class="entity-page u-container">'+
            '<header class="entity-head">'+
                '<div><p class="eyebrow">'+escapeHTML(entity.type)+' / ENTITY RECORD</p>'+
                '<h1>'+escapeHTML(entity.name)+'</h1>'+
                '<p class="entity-intro">'+escapeHTML(mediaNote)+'</p></div>'+
                '<div class="entity-plate"><span>TYPE</span><strong>'+escapeHTML(entity.type.toUpperCase())+'</strong>'+
                '<span>PROJECTS</span><strong>'+String(unique.size).padStart(2,'0')+'</strong></div>'+
            '</header>'+
            '<section class="entity-panel"><div class="panel-title">SOURCE NAMES / ROLES</div>'+
            (sourceForms.length?'<div class="entity-aliases">'+sourceForms.map(a=>'<span>'+escapeHTML(a)+'</span>').join('')+'</div>':'<p class="small-note">No alternate names recorded.</p>')+
            (observedRoles.length?'<div class="entity-observed"><span>OBSERVED ROLES</span><p>'+escapeHTML(observedRoles.join(' · '))+'</p></div>':'')+
            (personaNote?'<div class="entity-observed"><span>PERSONA NOTE</span><p>'+escapeHTML(personaNote)+'</p></div>':'')+
            (observationNotes?'<div class="entity-observed"><span>SOURCE NOTE</span><p>'+escapeHTML(observationNotes)+'</p></div>':'')+
            '</section>'+
            '<section class="entity-panel"><div class="panel-title">DOCUMENTED PROJECTS</div>'+
            (cards||'<p class="small-note">No public project relations recorded.</p>')+
            '</section>'+
            '<section class="entity-panel"><div class="panel-title">RELATED ENTITIES</div>'+
            (relatedEntities||'<p class="small-note">No related non-work entities recorded.</p>')+
            '</section>'+
            '<div class="entity-actions"><a class="text-link" href="network.html?focus='+encodeURIComponent(id)+'">OPEN NETWORK FOCUS →</a>'+
            '<a class="text-link" href="collaborations.html">← PEOPLE INDEX</a></div>'+
        '</section>';
    } catch(error) {
        main.innerHTML='<section class="page-intro u-container"><p class="eyebrow">SOURCE ERROR</p><h1>ENTITY<br><em>UNAVAILABLE.</em></h1><p class="page-lead">'+escapeHTML(error.message||error)+'</p></section>';
    }
});
