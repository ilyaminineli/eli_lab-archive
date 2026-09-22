document.addEventListener('DOMContentLoaded', async () => {
    const list = document.querySelector('#source-list');
    const input = document.querySelector('#source-search');
    const type = document.querySelector('#source-type');
    const count = document.querySelector('#source-count');
    if (!list) return;

    const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[char]));

    try {
        const response = await fetch('../data/sources.json');
        if (!response.ok) throw new Error('SOURCE REGISTER UNAVAILABLE.');

        const data = await response.json();
        const sources = data.sources || [];

        [...new Set(sources.map(source => source.type).filter(Boolean))]
            .sort()
            .forEach(sourceType => {
                const option = document.createElement('option');
                option.value = sourceType;
                option.textContent = sourceType.toUpperCase();
                type.appendChild(option);
            });

        const params = new URLSearchParams(location.search);
        if (input) input.value = params.get('q') || '';
        if (type && sources.some(source => source.type === params.get('type'))) type.value = params.get('type');

        const update = () => {
            const query = (input?.value || '').trim().toLowerCase();
            const typeFilter = type?.value || 'all';

            const matched = sources.filter(source => {
                const blob = [
                    source.id, source.name, source.type, source.role,
                    source.url, source.status
                ].join(' ').toLowerCase();

                return (typeFilter === 'all' || source.type === typeFilter) &&
                    (!query || blob.includes(query));
            });

            list.innerHTML = matched.map(source =>
                '<a class="source-row" href="' + escapeHTML(source.url) + '" target="_blank" rel="noopener">' +
                '<span class="source-type">' + escapeHTML(source.type || 'source') + '</span>' +
                '<div><h2>' + escapeHTML(source.name) + '</h2><p>' + escapeHTML(source.role || '') + '</p></div>' +
                '<span class="source-status">' + escapeHTML(source.status || '—') + '</span><b>↗</b></a>'
            ).join('') || '<p class="small-note">NO SOURCES MATCH THE CURRENT QUERY.</p>';

            if (count) count.textContent = String(matched.length).padStart(3, '0') + ' / ' + String(sources.length).padStart(3, '0') + ' SOURCES';
        };

        const writeUrl = () => {
            const next = new URL(location.href);
            if (input?.value.trim()) next.searchParams.set('q', input.value.trim());
            else next.searchParams.delete('q');
            if (type?.value && type.value !== 'all') next.searchParams.set('type', type.value);
            else next.searchParams.delete('type');
            history.replaceState(null, '', next);
        };

        input?.addEventListener('input', () => { writeUrl(); update(); });
        type?.addEventListener('change', () => { writeUrl(); update(); });
        update();
    } catch (error) {
        if (count) count.textContent = 'SOURCE ERROR';
        list.innerHTML = '<p class="small-note">SOURCE DATA COULD NOT BE READ.</p>';
    }
});
