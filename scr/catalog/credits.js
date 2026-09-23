document.addEventListener('DOMContentLoaded', async () => {
    const list=document.querySelector('#credit-list');
    const search=document.querySelector('#credit-search');
    const kind=document.querySelector('#credit-kind');
    const count=document.querySelector('#credit-count');
    if(!list)return;
    const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
    const normalize=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();

    try{
        const [response, relationResponse]=await Promise.all([
            fetch('../data/csv_entities.json'),
            fetch('../data/relations.json')
        ]);
        if(!response.ok)throw new Error('CREDIT DATA UNAVAILABLE.');
        const data=await response.json();
        const graph=relationResponse.ok?await relationResponse.json():{people:[],groups:[],places:[]};
        const canonicalEntityIds=new Set([
            ...(graph.people||[]).map(entity=>entity.id),
            ...(graph.groups||[]).map(entity=>entity.id),
            ...(graph.places||[]).map(entity=>entity.id)
        ]);
        const entities=data.entities||[];
        const kinds=[...new Set(entities.map(e=>e.kind).filter(Boolean))].sort();
        kinds.forEach(value=>{
            const option=document.createElement('option');
            option.value=value;option.textContent=value.toUpperCase();kind.appendChild(option);
        });
        const params=new URLSearchParams(location.search);
        if(search)search.value=params.get('q')||'';
        if(kind&&kinds.includes(params.get('kind')))kind.value=params.get('kind');

        const draw=()=>{
            const query=normalize(search?.value||'');
            const kindFilter=kind?.value||'all';
            const visible=entities.filter(entity=>{
                const hay=normalize([entity.canonical_id,entity.kind, ...(entity.source_forms||[]), ...(entity.roles_observed||[]),entity.notes,entity.persona_notes].join(' '));
                return (kindFilter==='all'||entity.kind===kindFilter)&&(!query||hay.includes(query));
            });
            list.innerHTML=visible.map(entity=>{
                const target=entity.canonical_id && canonicalEntityIds.has(entity.canonical_id)
                    ? 'entity.html?id='+encodeURIComponent(entity.canonical_id)
                    : 'video.html?q='+encodeURIComponent(entity.source_forms?.[0]||entity.canonical_id);
                return '<article class="credit-card">'+
                    '<header><div><span class="credit-id">'+escapeHTML(entity.canonical_id||'source')</span><h2>'+escapeHTML(entity.source_forms?.[0]||entity.canonical_id)+'</h2></div>'+
                    '<span class="credit-kind">'+escapeHTML(entity.kind||'source')+'</span></header>'+
                    '<div class="credit-row"><span>SOURCE FORMS</span><p>'+escapeHTML((entity.source_forms||[]).join(' · ')||'—')+'</p></div>'+
                    '<div class="credit-row"><span>ROLES OBSERVED</span><p>'+escapeHTML((entity.roles_observed||[]).join(' · ')||'—')+'</p></div>'+
                    (entity.persona_notes?'<div class="credit-row"><span>PERSONA NOTE</span><p>'+escapeHTML(entity.persona_notes)+'</p></div>':'')+
                    (entity.notes?'<div class="credit-row"><span>NOTE</span><p>'+escapeHTML(entity.notes)+'</p></div>':'')+
                    '<a class="credit-open" href="'+target+'">OPEN RELATED INDEX ↗</a></article>';
            }).join('')||'<p class="small-note">NO SOURCE OBSERVATIONS MATCH.</p>';
            if(count)count.textContent=String(visible.length).padStart(3,'0')+' / '+String(entities.length).padStart(3,'0')+' SOURCE ENTITIES';
        };
        const writeUrl=()=>{
            const next=new URL(location.href);
            if(search?.value.trim())next.searchParams.set('q',search.value.trim());else next.searchParams.delete('q');
            if(kind?.value&&kind.value!=='all')next.searchParams.set('kind',kind.value);else next.searchParams.delete('kind');
            history.replaceState(null,'',next);
        };
        search?.addEventListener('input',()=>{writeUrl();draw();});
        kind?.addEventListener('change',()=>{writeUrl();draw();});
        draw();
    }catch(error){
        count&&(count.textContent='SOURCE ERROR');
        list.innerHTML='<p class="small-note">CREDIT DATA COULD NOT BE READ.</p>';
    }
});
