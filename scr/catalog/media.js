document.addEventListener('DOMContentLoaded', async () => {
    const list=document.querySelector('#media-list');
    const search=document.querySelector('#media-search');
    const state=document.querySelector('#media-state');
    const count=document.querySelector('#media-count');
    if(!list)return;

    const escapeHTML=(value)=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');

    try{
        const [workResponse,mediaResponse]=await Promise.all([
            fetch('../data/works.json'),
            fetch('../data/media.json')
        ]);
        if(!workResponse.ok||!mediaResponse.ok)throw new Error('MEDIA DATABASE UNAVAILABLE.');

        const works=(await workResponse.json()).works.filter(work=>work.visibility!=='private');
        const media=(await mediaResponse.json()).works||{};

        const rows=works.map(work=>{
            const entry=media[work.id]||{folder:'media/works/'+work.id+'/',items:[]};
            return {...work,mediaEntry:entry,selected:Array.isArray(entry.items)?entry.items:[]};
        });

        const params=new URLSearchParams(location.search);
        if(search)search.value=params.get('q')||'';
        if(state&&['empty','selected'].includes(params.get('state')))state.value=params.get('state');

        const draw=()=>{
            const query=(search?.value||'').toLowerCase().trim();
            const filter=state?.value||'all';
            const visible=rows.filter(work=>{
                const hay=[work.id,work.title,work.year,...(work.medium||[]),...(work.context||[])].join(' ').toLowerCase();
                const matchesQuery=!query||hay.includes(query);
                const matchesState=filter==='all'||(filter==='empty'&&!work.selected.length)||(filter==='selected'&&work.selected.length);
                return matchesQuery&&matchesState;
            });

            list.innerHTML=visible.map(work=>{
                const folder=work.mediaEntry.folder||('media/works/'+work.id+'/');
                const itemCount=work.selected.length;
                const stateLabel=itemCount?'SELECTED MEDIA':'EMPTY / READY';
                return '<article class="media-row">'+
                    '<div class="media-row-year">'+escapeHTML(work.year)+'</div>'+
                    '<div class="media-row-main"><div><p class="media-row-id">'+escapeHTML(work.id)+'</p>'+
                    '<h2><a href="record.html?id='+encodeURIComponent(work.id)+'">'+escapeHTML(work.title)+'</a></h2>'+
                    '<p>'+escapeHTML(work.description||'')+'</p></div>'+
                    '<div class="media-row-meta"><span class="'+(itemCount?'has-media':'empty-media')+'">'+stateLabel+'</span>'+
                    '<strong>'+String(itemCount).padStart(2,'0')+'</strong><small>DISPLAY FILES</small></div></div>'+
                    '<div class="media-row-actions"><a href="record.html?id='+encodeURIComponent(work.id)+'">RECORD ↗</a>'+
                    '<a target="_blank" rel="noopener" href="https://github.com/ilyaminineli/eli_lab-archive/tree/main/'+folder+'">FOLDER ↗</a></div>'+
                    '</article>';
            }).join('')||'<p class="small-note">NO MEDIA FOLDERS MATCH THE CURRENT QUERY.</p>';

            if(count)count.textContent=String(visible.length).padStart(3,'0')+' / '+String(rows.length).padStart(3,'0')+' FOLDERS';
        };

        const writeUrl=()=>{
            const next=new URL(location.href);
            if(search?.value.trim())next.searchParams.set('q',search.value.trim());else next.searchParams.delete('q');
            if(state?.value&&state.value!=='all')next.searchParams.set('state',state.value);else next.searchParams.delete('state');
            history.replaceState(null,'',next);
        };
        search?.addEventListener('input',()=>{writeUrl();draw();});
        state?.addEventListener('change',()=>{writeUrl();draw();});
        draw();
    }catch(error){
        if(count)count.textContent='SOURCE ERROR';
        list.innerHTML='<p class="small-note">MEDIA DATA COULD NOT BE READ.</p>';
    }
});
