// nicolasguilloux.eu: progressive enhancements. Every page stays readable without JavaScript.

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const ICONS = {
  copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  arrowUpRight: '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  maximize: '<path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="m21 3-7 7"/><path d="m3 21 7-7"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
};
const svg = (name, size = 16) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;
const star = (size) =>
  `<svg width="${size}" height="${size}" viewBox="6 6 28 28" aria-hidden="true"><path d="M20,6Q22.1,17.9 34,20Q22.1,22.1 20,34Q17.9,22.1 6,20Q17.9,17.9 20,6Z" fill="currentColor"/></svg>`;
const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/* ---------- Theme ---------- */
function initTheme() {
  const root = document.documentElement;
  const label = () => (root.dataset.theme === 'nuit' ? 'Passer en thème jour' : 'Passer en thème nuit');
  const apply = (theme) => {
    root.dataset.theme = theme;
    try { localStorage.setItem('theme', theme); } catch (e) { /* private mode */ }
    sync();
  };
  const sync = () => {
    $$('[data-theme-toggle]').forEach((b) => { b.setAttribute('aria-label', label()); b.title = label(); });
    $$('[data-set-theme]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setTheme === root.dataset.theme)));
  };
  $$('[data-theme-toggle]').forEach((b) => b.addEventListener('click', () => apply(root.dataset.theme === 'nuit' ? 'jour' : 'nuit')));
  $$('[data-set-theme]').forEach((b) => b.addEventListener('click', () => apply(b.dataset.setTheme)));
  sync();
}

/* ---------- Mobile menu ---------- */
function initMenu() {
  const toggle = $('[data-menu-toggle]');
  const menu = $('#menu-mobile');
  const backdrop = $('[data-menu-close]');
  if (!toggle || !menu) return;
  const set = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    menu.hidden = !open;
    if (backdrop) backdrop.hidden = !open;
  };
  toggle.addEventListener('click', () => set(menu.hidden));
  backdrop?.addEventListener('click', () => set(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { set(false); toggle.focus(); } });
  matchMedia('(min-width: 760px)').addEventListener('change', (e) => { if (e.matches) set(false); });
}

/* ---------- Code blocks ---------- */
const COMMAND_LANGS = ['bash', 'sh', 'shell', 'console', 'zsh', 'fish', 'shell-session'];

function enhanceCodeBlocks(prose) {
  $$('pre', prose).forEach((pre) => {
    if (pre.closest('.codeblock') || pre.closest('.literalblock') || pre.closest('table.lntable')) return;
    const listing = pre.closest('.listingblock');
    const chroma = pre.parentElement?.classList.contains('highlight') && !pre.classList.contains('highlight') ? pre.parentElement : null;
    const container = listing || chroma || pre;
    const code = $('code', pre);
    const lang = (code?.dataset.lang || '').toLowerCase();
    const title = listing ? $(':scope > .title', listing)?.textContent.trim() : '';
    const text = (code || pre).textContent.replace(/\n+$/, '');

    const block = document.createElement('div');
    block.className = 'codeblock';
    let label = title || lang;
    const isTree = /[├└]──/.test(text);
    const isCommand = !isTree && !title && COMMAND_LANGS.includes(lang) && !text.includes('\n');

    if (isTree) {
      block.classList.add('codeblock--tree');
      label = 'Arborescence';
      pre.innerHTML = escapeHtml(text).replace(/(←[^\n]*)/g, '<span class="tree-note">$1</span>');
    } else if (isCommand) {
      block.classList.add('codeblock--cmd');
      if (/^\$\s/.test(text)) (code || pre).textContent = text.replace(/^\$\s+/, '');
    } else if (title) {
      block.classList.add('codeblock--titled');
    }

    const bar = document.createElement('div');
    bar.className = 'codeblock__bar';
    bar.innerHTML = `<span class="codeblock__lang">${escapeHtml(label || '')}</span>`;
    const copy = document.createElement('button');
    copy.type = 'button';
    copy.className = 'codeblock__copy';
    copy.setAttribute('aria-label', isCommand ? 'Copier la commande' : 'Copier le code');
    copy.innerHTML = svg('copy', isCommand || title ? 18 : 16);
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText((code || pre).textContent.replace(/\n+$/, ''));
        copy.innerHTML = svg('check', isCommand || title ? 18 : 16);
        copy.setAttribute('aria-label', 'Copié');
        setTimeout(() => { copy.innerHTML = svg('copy', isCommand || title ? 18 : 16); copy.setAttribute('aria-label', 'Copier le code'); }, 1600);
      } catch (e) { /* clipboard unavailable */ }
    });
    bar.appendChild(copy);

    container.parentNode.insertBefore(block, container);
    block.appendChild(bar);
    block.appendChild(pre);
    if (container !== pre) container.remove();
  });
}

/* ---------- Tables ---------- */
function wrapTables(prose) {
  $$('table', prose).forEach((table) => {
    if (table.closest('.admonitionblock') || table.closest('.colist') || table.classList.contains('lntable') || table.closest('.table-wrap')) return;
    const wrap = document.createElement('div');
    wrap.className = 'table-wrap';
    if (table.classList.contains('scroll') || table.closest('.scroll')) wrap.classList.add('table-wrap--scroll');
    else if ((table.rows[0]?.cells.length || 0) >= 5) wrap.classList.add('table-wrap--dense');
    const block = document.createElement('div');
    block.className = 'table-block';
    const bar = document.createElement('div');
    bar.className = 'table-block__bar';
    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'table-block__open';
    open.innerHTML = `${svg('maximize', 14)}Agrandir`;
    open.setAttribute('aria-label', 'Ouvrir le tableau en grand');
    open.addEventListener('click', () => openTableModal(wrap));
    bar.appendChild(open);
    table.parentNode.insertBefore(block, table);
    block.appendChild(bar);
    block.appendChild(wrap);
    wrap.appendChild(table);
  });
}

let tableModal;
function openTableModal(wrap) {
  if (!tableModal) {
    tableModal = document.createElement('dialog');
    tableModal.className = 'table-modal';
    tableModal.setAttribute('aria-label', 'Tableau en grand');
    tableModal.innerHTML = `<div class="table-modal__bar"><span class="label">TABLEAU</span>
      <button type="button" class="icon-btn table-modal__close" aria-label="Fermer">${svg('x', 20)}</button></div>
      <div class="table-modal__body prose"></div>`;
    document.body.appendChild(tableModal);
    $('.table-modal__close', tableModal).addEventListener('click', () => tableModal.close());
    // Click on the backdrop closes the modal
    tableModal.addEventListener('click', (e) => { if (e.target === tableModal) tableModal.close(); });
    tableModal.addEventListener('close', () => { document.documentElement.classList.remove('modal-open'); });
  }
  const body = $('.table-modal__body', tableModal);
  body.innerHTML = '';
  const clone = wrap.cloneNode(true);
  clone.classList.remove('table-wrap--dense');
  clone.classList.add('table-wrap--scroll');
  body.appendChild(clone);
  document.documentElement.classList.add('modal-open');
  tableModal.showModal();
  $('.table-modal__close', tableModal).focus();
}

/* ---------- Full-width article ---------- */
function initWideToggle() {
  const btn = $('[data-wide-toggle]');
  if (!btn) return;
  const root = document.documentElement;
  const sync = () => btn.setAttribute('aria-pressed', String('wide' in root.dataset));
  btn.hidden = false;
  btn.addEventListener('click', () => {
    if ('wide' in root.dataset) delete root.dataset.wide; else root.dataset.wide = '';
    try { localStorage.setItem('wide', 'wide' in root.dataset ? '1' : '0'); } catch (e) { /* private mode */ }
    sync();
    window.dispatchEvent(new Event('resize'));
  });
  sync();
}

/* ---------- Images ---------- */
function enhanceImages(prose) {
  // Paragraphs made only of inline images become a full-width image or a gallery row
  $$('p', prose).forEach((p) => {
    if (p.closest('.float-right, .float-left, td, li, .admonitionblock')) return;
    const kids = Array.from(p.children);
    if (!kids.length || p.textContent.trim() !== '') return;
    const images = kids.filter((el) => el.matches('span.image, img') || (el.matches('a') && el.querySelector('img') && el.children.length === 1));
    if (images.length !== kids.length || kids.some((el) => el.matches('br'))) return;
    if (images.some((el) => /img\.shields\.io/.test(el.querySelector('img')?.src || el.src || ''))) return;
    p.classList.add(images.length > 1 ? 'image-row' : 'image-single');
  });

  // Click to enlarge
  const zoomable = $$('.imageblock img, .image-single img, .image-row img, figure img, .float-right img, .float-left img', prose)
    .filter((img) => !img.closest('a'));
  if (!zoomable.length) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.innerHTML = '<img alt="">';
  document.body.appendChild(dialog);
  const big = $('img', dialog);
  dialog.addEventListener('click', () => dialog.close());
  zoomable.forEach((img) => {
    img.addEventListener('click', () => {
      big.src = img.currentSrc || img.src;
      big.alt = img.alt;
      dialog.showModal();
    });
  });
}

/* ---------- Link cards and source links ---------- */
function enhanceLinks(prose) {
  $$('.link-card a', prose).forEach((a) => {
    let url = a.href;
    try { const u = new URL(a.href); url = (u.host + u.pathname).replace(/\/$/, ''); } catch (e) { /* keep href */ }
    a.innerHTML = `<span class="link-card__text"><span>${a.innerHTML}</span><span class="link-card__url">${escapeHtml(url)}</span></span>${svg('arrowUpRight', 20)}`;
  });
  $$('.source-link a', prose).forEach((a) => {
    a.insertAdjacentHTML('afterbegin', '<span class="source-link__label">Source</span>');
  });
}

/* ---------- YouTube (click to load) ---------- */
function initVideos() {
  $$('[data-youtube]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(btn.dataset.youtube)}?autoplay=1`;
      iframe.title = btn.getAttribute('aria-label') || 'Vidéo YouTube';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      btn.replaceWith(iframe);
    });
  });
}

/* ---------- Table of contents, reading progress ---------- */
function initToc(prose) {
  const headings = $$('h2[id]', prose).filter((h) => !h.closest('.admonitionblock, .exampleblock'));
  const toc = $('[data-toc]');
  const tocMobile = $('[data-toc-mobile]');
  if (headings.length < 2 || !toc || !tocMobile) return headings;
  const text = (h) => h.textContent.trim();
  $('[data-toc-links]').innerHTML = headings
    .map((h) => `<a class="hov" href="#${encodeURIComponent(h.id)}">${star(10)}${escapeHtml(text(h))}</a>`).join('');
  $('[data-toc-mobile-links]').innerHTML = headings
    .map((h) => `<a href="#${encodeURIComponent(h.id)}">${escapeHtml(text(h))}</a>`).join('');
  toc.classList.remove('toc--empty');
  tocMobile.hidden = false;
  $$('a', tocMobile).forEach((a) => a.addEventListener('click', () => { tocMobile.open = false; }));
  return headings;
}

function initScrollSpy(prose, headings) {
  const bar = $('.progress__bar');
  const progress = $('.progress');
  const links = $$('[data-toc-links] a');
  let ticking = false;
  const update = () => {
    ticking = false;
    const rect = prose.getBoundingClientRect();
    const total = rect.height - window.innerHeight * 0.6;
    const pct = Math.max(0, Math.min(100, (-rect.top / Math.max(total, 1)) * 100));
    if (bar) { bar.style.width = `${pct}%`; progress.setAttribute('aria-valuenow', String(Math.round(pct))); }
    if (links.length) {
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) + 48;
      let active = -1;
      headings.forEach((h, i) => { if (h.getBoundingClientRect().top <= offset) active = i; });
      links.forEach((a, i) => (i === active ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current')));
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}

/* ---------- Articles page: search, filters, sort, pagination ---------- */
function initArticles() {
  const root = $('[data-articles]');
  if (!root) return;
  const normalize = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const size = parseInt(root.dataset.pageSize, 10) || 6;
  const groups = $('[data-articles-groups]', root);
  const input = $('[data-articles-q]', root);
  const clear = $('[data-articles-clear]', root);
  const sortSel = $('[data-articles-sort]', root);
  const status = $('[data-articles-status]', root);
  const resetBtns = $$('[data-articles-reset]', root);
  const empty = $('[data-articles-empty]', root);
  const pager = $('[data-articles-pager]', root);
  const pagesBox = $('[data-articles-pages]', root);
  const prev = $('[data-articles-prev]', root);
  const next = $('[data-articles-next]', root);
  const catBtns = $$('[data-cat]', root);
  const tagBtns = $$('[data-tag]', root);
  const starSvg = $('.ygroup__title svg', groups)?.outerHTML || '';

  const items = $$('li[data-date]', groups).map((li) => ({
    li,
    date: li.dataset.date,
    year: li.dataset.date.slice(0, 4),
    cats: li.dataset.cats.split(' ').filter(Boolean),
    tags: li.dataset.tags.split(' ').filter(Boolean),
    text: normalize(li.textContent),
  }));

  const params = new URLSearchParams(location.search);
  const state = {
    q: params.get('q') || '',
    cat: params.get('cat') || 'all',
    tag: params.get('tag') || null,
    sort: params.get('sort') === 'asc' ? 'asc' : 'desc',
    page: Math.max(1, parseInt(params.get('page'), 10) || 1),
  };
  if (!catBtns.some((b) => b.dataset.cat === state.cat)) state.cat = 'all';
  input.value = state.q;
  sortSel.value = state.sort;

  const syncUrl = () => {
    const url = new URL(location.href);
    const set = (k, v, def) => (v && v !== def ? url.searchParams.set(k, v) : url.searchParams.delete(k));
    set('q', state.q.trim(), '');
    set('cat', state.cat, 'all');
    set('tag', state.tag, null);
    set('sort', state.sort, 'desc');
    set('page', String(state.page), '1');
    history.replaceState(null, '', url);
  };

  const render = (scroll) => {
    const terms = normalize(state.q.trim()).split(/\s+/).filter(Boolean);
    const matchQ = (a) => terms.every((t) => a.text.includes(t));
    const matchTag = (a) => !state.tag || a.tags.includes(state.tag);
    const matchCat = (a, c) => c === 'all' || a.cats.includes(c);
    const base = items.filter((a) => matchQ(a) && matchTag(a));
    const list = base.filter((a) => matchCat(a, state.cat))
      .sort((x, y) => (state.sort === 'asc' ? x.date.localeCompare(y.date) : y.date.localeCompare(x.date)));

    const total = list.length;
    const pages = Math.max(1, Math.ceil(total / size));
    if (state.page > pages) state.page = pages;
    const start = (state.page - 1) * size;
    const slice = list.slice(start, start + size);

    // Chips
    catBtns.forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.cat === state.cat));
      $('.fchip__count', b).textContent = base.filter((a) => matchCat(a, b.dataset.cat)).length;
    });
    tagBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tag === state.tag)));

    // Year groups, rebuilt around the existing list items
    groups.innerHTML = '';
    let ul = null; let year = null;
    slice.forEach((a) => {
      if (a.year !== year) {
        year = a.year;
        const sec = document.createElement('section');
        sec.className = 'ygroup';
        sec.innerHTML = `<h2 class="ygroup__title"><span class="fade">${starSvg}${year}</span><span class="ygroup__rule" aria-hidden="true"></span></h2><ul class="ygroup__list"></ul>`;
        groups.appendChild(sec);
        ul = $('ul', sec);
      }
      ul.appendChild(a.li);
    });

    const hasFilters = !!(terms.length || state.tag || state.cat !== 'all');
    status.textContent = total === 0
      ? 'Aucun résultat'
      : hasFilters
        ? `${total} ${total > 1 ? 'articles correspondent' : 'article correspond'}`
        : `Tous les articles, du plus ${state.sort === 'asc' ? 'ancien' : 'récent'} au plus ${state.sort === 'asc' ? 'récent' : 'ancien'}`;
    resetBtns[0].hidden = !hasFilters;
    empty.hidden = total !== 0;
    clear.hidden = !state.q;

    // Pagination
    pager.hidden = pages <= 1;
    groups.classList.toggle('is-paged', pages > 1);
    $('[data-articles-range]', root).textContent = `ARTICLES ${start + 1}–${Math.min(start + size, total)} SUR ${total}`;
    prev.disabled = state.page <= 1;
    next.disabled = state.page >= pages;
    pagesBox.innerHTML = '';
    for (let n = 1; n <= pages; n++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'apager__page';
      b.textContent = n;
      b.setAttribute('aria-label', `Page ${n}`);
      if (n === state.page) b.setAttribute('aria-current', 'page');
      b.addEventListener('click', () => go(n));
      pagesBox.appendChild(b);
    }

    syncUrl();
    if (scroll) root.querySelector('.articles__status').scrollIntoView({ block: 'start', behavior: 'smooth' });
  };

  const go = (n) => { state.page = n; render(true); };
  const update = (patch) => { Object.assign(state, patch, { page: 1 }); render(false); };

  input.addEventListener('input', () => update({ q: input.value }));
  clear.addEventListener('click', () => { input.value = ''; update({ q: '' }); input.focus(); });
  sortSel.addEventListener('change', () => update({ sort: sortSel.value }));
  catBtns.forEach((b) => b.addEventListener('click', () => update({ cat: b.dataset.cat })));
  tagBtns.forEach((b) => b.addEventListener('click', () => update({ tag: state.tag === b.dataset.tag ? null : b.dataset.tag })));
  resetBtns.forEach((b) => b.addEventListener('click', () => { input.value = ''; update({ q: '', cat: 'all', tag: null }); }));
  prev.addEventListener('click', () => state.page > 1 && go(state.page - 1));
  next.addEventListener('click', () => go(state.page + 1));

  // "/" focuses the search field, like the hint in the field says
  document.addEventListener('keydown', (e) => {
    if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.closest('input, textarea, select, [contenteditable]')) return;
    e.preventDefault();
    input.focus();
  });

  $('[data-articles-panel]', root).hidden = false;
  $('[data-articles-status-row]', root).hidden = false;
  render(false);
}

/* ---------- External links ---------- */
// Safety net: templates already mark external links; this catches anything else on the page.
function initExternalLinks() {
  $$('a[href^="http"]').forEach((a) => {
    if (a.host !== location.host && !a.target) {
      a.target = '_blank';
      if (!/\bnoopener\b/.test(a.rel)) a.rel = `${a.rel} noopener`.trim();
    }
  });
}

/* ---------- Interactive CV: live durations ---------- */
// The site is static: Hugo computes durations at build time. This refreshes every date-based value
// (years of experience, mission lengths, years per technology, timeline) from today's date,
// with the same month arithmetic as layouts/cv.html.
const cvMonth = (iso) => { const [y, m] = iso.split('-').map(Number); return y * 12 + m; };
function refreshCvDates(root) {
  const today = new Date();
  const nowM = today.getFullYear() * 12 + today.getMonth() + 1;
  const months = (el) => Math.max(1, (el.dataset.end ? cvMonth(el.dataset.end) : nowM) - cvMonth(el.dataset.start));

  $$('[data-cv-since]', root).forEach((el) => {
    el.textContent = `${Math.floor((nowM - cvMonth(el.dataset.cvSince)) / 12)} ans`;
  });

  const xps = $$('.xp[data-start]', root);
  xps.forEach((el) => {
    const m = months(el);
    const y = Math.floor(m / 12);
    const r = m % 12;
    const out = $('[data-cv-duration]', el);
    if (out) out.textContent = [y ? `${y} AN${y > 1 ? 'S' : ''}` : '', r ? `${r} MOIS` : ''].filter(Boolean).join(' ');
  });

  const perTech = {};
  xps.forEach((el) => el.dataset.stack.split(' ').forEach((t) => { perTech[t] = (perTech[t] || 0) + months(el); }));
  $$('.cv-tchip', root).forEach((chip) => {
    const out = $('[data-cv-yrs]', chip);
    const m = perTech[chip.dataset.tech];
    if (!out || !m) return;
    out.textContent = m >= 12 ? `${Math.round(m / 12)} an${m >= 18 ? 's' : ''}` : `${m} mois`;
  });

  const startM = cvMonth(root.dataset.cvStart);
  const span = nowM - startM;
  if (span <= 0) return;
  $$('.cv-frise__seg[data-start]', root).forEach((seg) => {
    const w = (months(seg) * 100) / span;
    seg.style.left = `${((cvMonth(seg.dataset.start) - startM) * 100) / span}%`;
    seg.style.width = `${w}%`;
    seg.classList.toggle('is-narrow', w < 5);
  });
  const years = $('[data-cv-years]', root);
  if (years) {
    years.textContent = '';
    for (let y = Math.floor((startM - 1) / 12); y <= today.getFullYear(); y += 1) {
      const left = ((y * 12 + 1 - startM) * 100) / span;
      if (left < 0) continue;
      const tick = document.createElement('span');
      tick.style.left = `${left}%`;
      tick.textContent = y;
      years.append(tick);
    }
  }
}

/* ---------- Interactive CV ---------- */
// Stack filter (?stack=symfony,docker), "Essentiel / Détaillé" view (?vue=detail), shareable link.
function initCv() {
  const root = $('[data-cv]');
  if (!root) return;
  const panel = $('[data-cv-panel]', root);
  const status = $('[data-cv-status]', root);
  const reset = $('[data-cv-reset]', root);
  const share = $('[data-cv-share]', root);
  const xps = $$('.xp', root);
  const projects = $$('.cvp', root);
  const segs = $$('.cv-frise__seg', root);
  const details = $$('.xp__more', root);
  const label = (id) => ($(`.cv-tchip[data-tech="${id}"]`, root)?.firstChild.textContent || id).trim();

  const params = new URLSearchParams(location.search);
  const known = new Set($$('.cv-tchip', root).map((b) => b.dataset.tech));
  const state = {
    stack: new Set((params.get('stack') || '').split(',').filter((t) => known.has(t))),
    view: params.get('vue') === 'detail' ? 'detail' : 'essentiel',
  };

  const syncUrl = () => {
    const p = new URLSearchParams();
    if (state.stack.size) p.set('stack', [...state.stack].join(','));
    if (state.view === 'detail') p.set('vue', 'detail');
    const qs = p.toString();
    history.replaceState(null, '', `${location.pathname}${qs ? `?${qs}` : ''}${location.hash}`);
  };

  const render = () => {
    const on = state.stack;
    const matches = (el) => el.dataset.stack.split(' ').some((t) => on.has(t));
    root.classList.toggle('is-filtered', on.size > 0);
    xps.forEach((el) => el.classList.toggle('is-match', on.size > 0 && matches(el)));
    projects.forEach((el) => el.classList.toggle('is-match', on.size > 0 && matches(el)));
    segs.forEach((s) => s.classList.toggle('is-match', !!$(`#xp-${s.dataset.cvXp}.is-match`, root)));
    $$('[data-tech]', root).forEach((b) => {
      const pressed = on.has(b.dataset.tech);
      if (b.classList.contains('cv-tchip')) b.setAttribute('aria-pressed', String(pressed));
      else b.classList.toggle('is-on', pressed);
    });
    reset.hidden = on.size === 0;
    if (on.size) {
      const nx = xps.filter((el) => el.classList.contains('is-match')).length;
      const np = projects.filter((el) => el.classList.contains('is-match')).length;
      const names = [...on].map((t) => `<strong>${escapeHtml(label(t))}</strong>`).join(' ou ');
      status.innerHTML = `${names} : ${nx} expérience${nx > 1 ? 's' : ''} sur ${xps.length} et ${np} projet${np > 1 ? 's' : ''}.`;
    } else {
      status.textContent = '';
    }
    $$('[data-cv-view]', root).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cvView === state.view)));
    syncUrl();
  };

  const setView = (view) => {
    state.view = view;
    details.forEach((d) => { d.open = view === 'detail'; });
    render();
  };

  const toggleTech = (id) => {
    if (state.stack.has(id)) state.stack.delete(id); else state.stack.add(id);
    render();
  };

  refreshCvDates(root);
  root.classList.add('is-enhanced');
  panel.hidden = false;
  // The filter is a sidebar on desktop and a collapsed block on smaller screens
  const filter = $('[data-cv-filter]', root);
  const desktop = matchMedia('(min-width: 1100px)');
  const syncFilter = () => { filter.open = desktop.matches || state.stack.size > 0; };
  desktop.addEventListener('change', syncFilter);
  syncFilter();
  filter.querySelector('summary').addEventListener('click', (e) => { if (desktop.matches) e.preventDefault(); });
  $$('.xp__tech', root).forEach((b) => b.removeAttribute('tabindex'));
  root.addEventListener('click', (e) => {
    const tech = e.target.closest('[data-tech]');
    if (tech) { toggleTech(tech.dataset.tech); return; }
    const view = e.target.closest('[data-cv-view]');
    if (view) setView(view.dataset.cvView);
  });
  reset.addEventListener('click', () => { state.stack.clear(); render(); });

  // Frise: flash the card the segment points to
  segs.forEach((s) => s.addEventListener('click', () => {
    const card = $(`#xp-${s.dataset.cvXp}`, root);
    if (!card) return;
    card.classList.remove('is-flash');
    void card.offsetWidth;
    card.classList.add('is-flash');
    setTimeout(() => card.classList.remove('is-flash'), 1600);
  }));

  // Share the current (filtered) view
  if (navigator.clipboard) {
    share.hidden = false;
    const text = $('[data-cv-share-label]', share);
    share.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(location.href);
        text.textContent = state.stack.size ? 'Lien filtré copié' : 'Lien copié';
      } catch (e) {
        text.textContent = 'Copie impossible';
      }
      setTimeout(() => { text.textContent = 'Copier le lien'; }, 2000);
    });
  }

  // Printing always shows every detail
  let before = [];
  window.addEventListener('beforeprint', () => { before = details.map((d) => d.open); details.forEach((d) => { d.open = true; }); });
  window.addEventListener('afterprint', () => details.forEach((d, i) => { d.open = before[i]; }));

  setView(state.view);
}

/* ---------- Boot ---------- */
initTheme();
initMenu();
initArticles();
initVideos();
initWideToggle();
initExternalLinks();
initCv();

const prose = $('[data-prose]');
if (prose) {
  enhanceCodeBlocks(prose);
  wrapTables(prose);
  enhanceImages(prose);
  enhanceLinks(prose);
  const headings = initToc(prose);
  initScrollSpy(prose, headings);
}
