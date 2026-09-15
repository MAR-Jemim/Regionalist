/* CP Roadmap — static, no backend. Progress lives in localStorage;
   solved problems come from the public Codeforces API. */

const API = 'https://codeforces.com/api/';
const DB_TTL = 7 * 864e5;        // problemset cache: 7 days
const USER_TTL = 15 * 6e4;       // user solves cache: 15 minutes
const TIER_TARGET = 10;          // CF problems per topic counted as "full"

const TIERS = [
  { n:0, name:'Setup',      lo:0,    hi:0,    blurb:'Toolchain, complexity intuition, and the containers you will use in every solution. Skipping this tier is the most common reason people plateau early.' },
  { n:1, name:'Newbie',     lo:0,    hi:1199, blurb:'Careful implementation, sorting, and small observations. The goal here is reliability: solve Div2 A without failed submissions.' },
  { n:2, name:'Pupil',      lo:1200, hi:1399, blurb:'The first real techniques. Prefix sums, two pointers and binary search on the answer cover an enormous share of problems at this level.' },
  { n:3, name:'Specialist', lo:1400, hi:1599, blurb:'Graphs and dynamic programming enter. Most people stall here because they learn DP syntax without learning to choose a state.' },
  { n:4, name:'Expert',     lo:1600, hi:1899, blurb:'The heart of competitive programming. DP patterns, shortest paths, trees, and the data structures that make them fast.' },
  { n:5, name:'Cand. Master', lo:1900, hi:2099, blurb:'Heavy data structures and real mathematics. Segment trees, string algorithms, combinatorics and game theory.' },
  { n:6, name:'Master+',    lo:2100, hi:9999, blurb:'Specialist territory: flows, geometry, suffix structures and DP optimisations. Most of ICPC regional difficulty lives here.' }
];

const S = {
  topics: [], byId: {}, curated: {},
  tags: [], problems: [], byTag: null,
  solved: new Map(),          // "cid-idx" -> first accepted unix seconds
  info: null,
  lang: lsGet('cpr.lang', 'cpp'),
  handle: lsGet('cpr.handle', ''),
  topicDone: lsGet('cpr.topicDone', {}),
  probDone: lsGet('cpr.probDone', {}),
  filter: { icpc:false, todo:false, tier:null },
  open: null
};

/* ---------------- storage helpers (never throw) ---------------- */
function lsGet(k, d){ try{ const v = localStorage.getItem(k); return v===null?d:JSON.parse(v); }catch(e){ return d; } }
function lsSet(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); return true; }catch(e){ return false; } }
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const $  = s => document.querySelector(s);

function setStatus(html, isErr){
  const el = $('#status');
  el.className = 'status' + (isErr ? ' err' : '');
  el.innerHTML = html;
}

/* ---------------- Codeforces API ---------------- */
async function cf(method, params){
  const r = await fetch(API + method + (params ? '?' + params : ''));
  if (!r.ok) throw new Error('Codeforces returned HTTP ' + r.status);
  const j = await r.json();
  if (j.status !== 'OK') throw new Error(j.comment || 'Codeforces API error');
  return j.result;
}

// Compact the 11k-problem set so it fits comfortably in localStorage.
function packDB(res){
  const tags = [], ti = new Map();
  const stat = new Map();
  for (const s of res.problemStatistics) stat.set(s.contestId + '-' + s.index, s.solvedCount);
  const problems = [];
  for (const p of res.problems){
    if (!p.contestId || p.rating == null) continue;   // skip unrated / gym
    const idx = [];
    for (const t of (p.tags || [])){
      if (!ti.has(t)){ ti.set(t, tags.length); tags.push(t); }
      idx.push(ti.get(t));
    }
    problems.push([p.contestId, p.index, p.name, p.rating, idx,
                   stat.get(p.contestId + '-' + p.index) || 0]);
  }
  return { ts: Date.now(), tags, problems };
}

function useDB(db){
  S.tags = db.tags;
  S.problems = db.problems.map(p => ({
    cid:p[0], idx:p[1], name:p[2], rating:p[3], tags:p[4], solvedCount:p[5],
    key:p[0] + '-' + p[1]
  }));
  S.byTag = new Map();
  S.tags.forEach((t,i) => S.byTag.set(i, []));
  for (const p of S.problems) for (const t of p.tags) S.byTag.get(t).push(p);
}

async function loadDB(force){
  const c = lsGet('cpr.db', null);
  if (!force && c && Date.now() - c.ts < DB_TTL){ useDB(c); return 'cached'; }
  setStatus('Fetching the Codeforces problemset…');
  const db = packDB(await cf('problemset.problems'));
  useDB(db);
  lsSet('cpr.db', db);   // silently skipped if over quota
  return 'fresh';
}

async function loadUser(handle, force){
  const c = lsGet('cpr.user', null);
  if (!force && c && c.handle === handle && Date.now() - c.ts < USER_TTL){
    S.solved = new Map(c.solved); S.info = c.info; return 'cached';
  }
  setStatus('Fetching solved problems for <b>' + esc(handle) + '</b>…');
  const [subs, info] = await Promise.all([
    cf('user.status', 'handle=' + encodeURIComponent(handle)),
    cf('user.info',   'handles=' + encodeURIComponent(handle)).then(r => r[0]).catch(() => null)
  ]);
  const m = new Map();
  for (const s of subs){
    if (s.verdict !== 'OK' || !s.problem || !s.problem.contestId) continue;
    const k = s.problem.contestId + '-' + s.problem.index;
    const t = s.creationTimeSeconds;
    if (!m.has(k) || t < m.get(k)) m.set(k, t);   // keep the FIRST accepted
  }
  S.solved = m;
  S.info = info ? { rating: info.rating || null, maxRating: info.maxRating || null,
                    rank: info.rank || null, handle: info.handle } : null;
  lsSet('cpr.user', { handle, ts: Date.now(), solved: [...m], info: S.info });
  return 'fresh';
}

/* ---------------- derived data ---------------- */
function tagIdx(name){ return S.tags.indexOf(name); }

// Candidate CF problems for a topic: tag match + inside the topic's rating band.
function ladderFor(t){
  if (!t.cfTags || !t.cfTags.length || !S.problems.length) return [];
  const want = new Set(t.cfTags.map(tagIdx).filter(i => i >= 0));
  if (!want.size) return [];
  const [lo, hi] = t.band;
  const out = [];
  for (const p of S.problems){
    if (p.rating < lo || p.rating > hi) continue;
    let hit = false;
    for (const x of p.tags) if (want.has(x)){ hit = true; break; }
    if (hit) out.push(p);
  }
  out.sort((a,b) => b.solvedCount - a.solvedCount);
  return out;
}

function topicProgress(t){
  if (S.topicDone[t.id]) return { pct:1, solved:TIER_TARGET, total:TIER_TARGET, manual:true };
  const lad = ladderFor(t);
  let solved = 0;
  for (const p of lad) if (S.solved.has(p.key)) solved++;
  const cur = S.curated[t.id] || [];
  let cs = 0;
  for (const c of cur) if (S.probDone[c.url]) cs++;
  if (!lad.length){
    // meta topics (setup, ICPC strategy) have no CF ladder — curated/manual only
    if (!cur.length) return { pct:0, solved:0, total:0, manual:false, noLadder:true };
    return { pct: cs/cur.length, solved:cs, total:cur.length, manual:false, meta:true };
  }
  const score = Math.min(TIER_TARGET, solved + cs);
  return { pct: score / TIER_TARGET, solved, total: lad.length, curatedDone: cs, manual:false };
}

function myTier(){
  const r = S.info && S.info.rating;
  if (r == null) return null;
  for (const t of TIERS) if (t.n > 0 && r >= t.lo && r <= t.hi) return t.n;
  return null;
}

/* Weak-tag analysis: for each tag, what share of the problems available in your
   practice band have you actually solved? Compare each tag against your own median. */
function tagCoverage(){
  const r = (S.info && S.info.rating) || 1200;
  const lo = Math.max(800, r - 100), hi = r + 300;
  const rows = [];
  for (let i = 0; i < S.tags.length; i++){
    if (S.tags[i] === '*special') continue;
    let avail = 0, done = 0;
    for (const p of S.byTag.get(i)){
      if (p.rating < lo || p.rating > hi) continue;
      avail++;
      if (S.solved.has(p.key)) done++;
    }
    if (avail < 25) continue;                    // too few to be meaningful
    rows.push({ tag:S.tags[i], avail, done, cov: done/avail });
  }
  if (!rows.length) return { rows:[], median:0, band:[lo,hi] };
  const sorted = rows.map(x => x.cov).sort((a,b) => a-b);
  const median = sorted[Math.floor(sorted.length/2)] || 0;
  rows.sort((a,b) => a.cov - b.cov);
  return { rows, median, band:[lo,hi] };
}

function activity(){
  const now = Date.now()/1000, weeks = 16, buckets = new Array(weeks).fill(0);
  let last = 0, total = 0, last30 = 0;
  const lastByTag = new Map();
  for (const [k, t] of S.solved){
    total++;
    if (t > last) last = t;
    const ageD = (now - t) / 86400;
    if (ageD <= 30) last30++;
    const w = Math.floor(ageD / 7);
    if (w >= 0 && w < weeks) buckets[weeks - 1 - w]++;
  }
  // per-tag recency, for the "going stale" readout
  const pmap = new Map(S.problems.map(p => [p.key, p]));
  for (const [k, t] of S.solved){
    const p = pmap.get(k);
    if (!p) continue;
    for (const ti of p.tags){
      const nm = S.tags[ti];
      if (!lastByTag.has(nm) || t > lastByTag.get(nm)) lastByTag.set(nm, t);
    }
  }
  return { buckets, last, total, last30, lastByTag };
}

const ago = ts => {
  if (!ts) return '—';
  const d = Math.floor((Date.now()/1000 - ts) / 86400);
  if (d <= 0) return 'today';
  if (d === 1) return 'yesterday';
  if (d < 30) return d + 'd ago';
  if (d < 365) return Math.floor(d/30) + 'mo ago';
  return Math.floor(d/365) + 'y ago';
};

/* ---------------- rendering ---------------- */
function renderDash(){
  const el = $('#dash');
  if (!S.solved.size && !S.handle){ el.innerHTML = ''; return; }
  const act = activity();
  const { rows, median, band } = S.problems.length ? tagCoverage() : { rows:[], median:0, band:[0,0] };
  const weak = rows.filter(r => r.cov < median).slice(0, 5);
  const strong = rows.slice().reverse().slice(0, 3);
  const mx = Math.max(1, ...act.buckets);

  let done = 0;
  for (const t of S.topics) if (topicProgress(t).pct >= 1) done++;

  const stale = [...act.lastByTag.entries()]
    .filter(([t]) => rows.some(r => r.tag === t))
    .sort((a,b) => a[1] - b[1]).slice(0, 3);

  el.innerHTML = `
  <div class="card">
    <h3>Roadmap progress</h3>
    <div class="big">${done}<span style="color:var(--ink-3);font-size:17px"> / ${S.topics.length}</span></div>
    <div class="sub">topics complete${S.info && S.info.rating ? ' · rated ' + S.info.rating : ''}</div>
  </div>
  <div class="card">
    <h3>Solved on Codeforces</h3>
    <div class="big">${act.total}</div>
    <div class="sub">${act.last30} in the last 30 days · last ${ago(act.last)}</div>
    <div class="spark">${act.buckets.map(b =>
      `<i style="height:${Math.max(3, Math.round(b/mx*38))}px" title="${b} solved"></i>`).join('')}</div>
  </div>
  <div class="card">
    <h3>Weakest tags ${band[0] ? `<span style="text-transform:none;letter-spacing:0">(${band[0]}–${band[1]})</span>` : ''}</h3>
    ${weak.length ? `<div class="taglist">${weak.map(r => `
      <div class="tagrow"><span class="nm">${esc(r.tag)}</span>
        <span class="bar"><i style="width:${Math.min(100, r.cov/Math.max(median,1e-9)*50)}%"></i></span>
        <span class="n">${r.done}/${r.avail}</span></div>`).join('')}</div>
      <div class="sub" style="margin-top:9px">vs your median coverage of ${(median*100).toFixed(1)}%</div>`
      : '<div class="empty">Sync a handle to see this.</div>'}
  </div>
  <div class="card">
    <h3>Going stale</h3>
    ${stale.length ? `<div class="taglist">${stale.map(([t, ts]) => `
      <div class="tagrow"><span class="nm">${esc(t)}</span><span class="n">${ago(ts)}</span></div>`).join('')}
      </div><div class="sub" style="margin-top:9px">Longest since you last solved one.</div>`
      : '<div class="empty">Sync a handle to see this.</div>'}
    ${strong.length ? `<div class="sub" style="margin-top:11px">Strongest: ${strong.map(r => esc(r.tag)).join(', ')}</div>` : ''}
  </div>`;
}

function renderTiers(){
  const here = myTier();
  const root = $('#tiers');
  root.innerHTML = TIERS.map(T => {
    let list = S.topics.filter(t => t.tier === T.n);
    if (S.filter.icpc) list = list.filter(t => t.icpc === 'high');
    if (S.filter.todo) list = list.filter(t => topicProgress(t).pct < 1);
    if (S.filter.tier !== null && S.filter.tier !== T.n) return '';
    if (!list.length) return '';

    const all = S.topics.filter(t => t.tier === T.n);
    const dn = all.filter(t => topicProgress(t).pct >= 1).length;

    return `<section class="tier">
      <div class="tier-head">
        <span class="tier-dot" style="background:var(--t${T.n})"></span>
        <h2>Tier ${T.n} · ${T.name}</h2>
        <span class="tier-rng">${T.n===0 ? 'prerequisite' : (T.hi>=9999 ? T.lo+'+' : (T.n===1 ? '<'+(T.hi+1) : T.lo+'–'+T.hi))}</span>
        ${here === T.n ? '<span class="you-are-here">you are here</span>' : ''}
        <span class="tier-prog">${dn}/${all.length}</span>
      </div>
      <p class="tier-blurb">${esc(T.blurb)}</p>
      <div class="grid">${list.map(topicCard).join('')}</div>
    </section>`;
  }).join('') || '<p class="empty">No topics match these filters.</p>';
}

function topicCard(t){
  const pr = topicProgress(t);
  const done = pr.pct >= 1;
  const unmet = t.prereqs.filter(p => { const q = S.byId[p]; return q && topicProgress(q).pct < 1; });
  const locked = unmet.length > 0 && !done;
  return `<button class="topic${done ? ' done':''}${locked ? ' locked':''}" data-id="${t.id}">
    <div class="tt">${done ? '<span class="mark">&#10003;</span>' : ''}<span>${esc(t.title)}</span></div>
    <div class="meta">
      ${t.icpc === 'high' ? '<span class="badge icpc">ICPC</span>' : ''}
      ${t.stub ? '<span class="badge">ladder only</span>' : ''}
      ${locked ? `<span class="badge lock">${unmet.length} prereq${unmet.length>1?'s':''}</span>` : ''}
      <span class="bar${done?' good':''}"><i style="width:${Math.round(pr.pct*100)}%"></i></span>
      <span>${pr.noLadder ? 'manual' : (pr.meta ? pr.solved + '/' + pr.total : pr.solved)}</span>
    </div>
  </button>`;
}

function openTopic(id){
  const t = S.byId[id];
  if (!t) return;
  S.open = id;
  const pr = topicProgress(t);
  const lad = ladderFor(t);
  const cur = S.curated[t.id] || [];
  const unsolved = lad.filter(p => !S.solved.has(p.key)).slice(0, 8);
  const solvedN = lad.length - lad.filter(p => !S.solved.has(p.key)).length;
  const code = (t.template && t.template[S.lang]) || '';

  $('#dtitle').textContent = t.title;
  $('#dkv').innerHTML = `
    <span class="badge">Tier ${t.tier}</span>
    <span class="badge">CF ${t.band[0]}–${t.band[1]}</span>
    ${t.icpc === 'high' ? '<span class="badge icpc">ICPC core</span>' : ''}
    ${t.cfTags.map(x => `<span class="badge">${esc(x)}</span>`).join('')}`;

  const mark = S.topicDone[t.id];
  $('#dbody').innerHTML = `
  <div class="sec">
    <button class="btn ${mark ? '' : 'primary'}" id="toggleDone">
      ${mark ? '&#10003; Marked complete — undo' : 'Mark this topic complete'}
    </button>
    <span class="note" style="margin-left:10px">${
      lad.length ? `${solvedN} of ${lad.length} Codeforces problems in band solved` : 'no Codeforces ladder for this topic'}</span>
  </div>

  ${t.prereqs.length ? `<div class="sec"><h4>Prerequisites</h4><div class="prereqs">${
    t.prereqs.map(p => { const q = S.byId[p]; if (!q) return '';
      const ok = topicProgress(q).pct >= 1;
      return `<span class="pre${ok?' ok':''}" data-goto="${p}">${ok?'&#10003; ':''}${esc(q.title)}</span>`;
    }).join('')}</div></div>` : ''}

  <div class="sec"><h4>Why it matters</h4><div class="prose">${md(t.why)}</div></div>

  ${t.traps && t.traps.length ? `<div class="sec"><h4>Traps</h4>
    <ul class="traps">${t.traps.map(x => `<li>${md(x)}</li>`).join('')}</ul></div>` : ''}

  ${code ? `<div class="sec"><h4>Template — ${S.lang === 'cpp' ? 'C++' : 'Python'}</h4>
    <pre>${esc(code)}</pre></div>` : ''}

  ${t.pyNote ? `<div class="sec"><div class="pynote"><b>Python note</b>${md(t.pyNote)}</div></div>` : ''}

  ${cur.length ? `<div class="sec"><h4>Curated — do these first</h4>
    <div class="plist">${cur.map(c => `
      <div class="p${S.probDone[c.url] ? ' solved':''}">
        <input type="checkbox" data-url="${esc(c.url)}" ${S.probDone[c.url]?'checked':''}
          aria-label="mark solved" style="margin:0;flex:0 0 auto;cursor:pointer">
        <a class="nm" href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.name)}</a>
        <span class="src">${esc(c.src)}</span>
      </div>`).join('')}</div>
    <div class="note" style="margin-top:7px">CSES and AtCoder are separate judges, so these are ticked by hand.</div>
    </div>` : ''}

  <div class="sec"><h4>Next up on Codeforces</h4>
    ${unsolved.length ? `<div class="plist">${unsolved.map(p => `
      <div class="p">
        <a class="nm" href="https://codeforces.com/problemset/problem/${p.cid}/${p.idx}"
           target="_blank" rel="noopener">${p.cid}${esc(p.idx)} — ${esc(p.name)}</a>
        <span class="rt">${p.rating}</span>
        <span class="sc">${fmt(p.solvedCount)}&#215;</span>
      </div>`).join('')}</div>
      <div class="note" style="margin-top:7px">Unsolved, tag-matched, inside the band, most-solved first.</div>`
      : `<div class="empty">${S.solved.size ? 'Nothing left in this band — move up a tier.'
          : 'Sync your Codeforces handle to generate a ladder.'}</div>`}
  </div>

  ${t.checkpoint ? `<div class="sec"><h4>Move on when</h4>
    <div class="check"><b>&#10003;</b><span>${md(t.checkpoint)}</span></div></div>` : ''}

  ${t.stub ? `<div class="sec"><div class="note">Deep notes for this tier aren't written yet — the ladder and
    checkpoint above are live. Add notes to <code>data/topics/t${t.tier}.json</code> as you learn it.</div></div>` : ''}`;

  $('#scrim').classList.add('open');
  $('#drawer').classList.add('open');
  $('#drawer').scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

const fmt = n => n >= 1000 ? (n/1000).toFixed(n >= 10000 ? 0 : 1) + 'k' : String(n);
// minimal inline markdown: **bold** and `code`
const md = s => esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                      .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
                      .replace(/`([^`]+)`/g, '<code>$1</code>');

function closeDrawer(){
  S.open = null;
  $('#scrim').classList.remove('open');
  $('#drawer').classList.remove('open');
  document.body.style.overflow = '';
}

function rerender(){ renderDash(); renderTiers(); if (S.open) openTopic(S.open); }

/* ---------------- sync ---------------- */
async function sync(force){
  const h = $('#handle').value.trim();
  $('#sync').disabled = true;
  try {
    const d = await loadDB(force);
    if (h){
      S.handle = h; lsSet('cpr.handle', h);
      await loadUser(h, force);
    }
    rerender();
    const r = S.info && S.info.rating;
    setStatus(h
      ? `<b>${esc(S.info ? S.info.handle : h)}</b>${r ? ' · rating <b>' + r + '</b>' : ' · unrated'}` +
        `${S.info && S.info.rank ? ' · ' + esc(S.info.rank) : ''} · <b>${S.solved.size}</b> solved · ` +
        `problemset ${d === 'fresh' ? 'refreshed' : 'from cache'} (${S.problems.length} rated problems)`
      : `Problemset loaded — <b>${S.problems.length}</b> rated problems. Add your handle to auto-tick what you've solved.`);
  } catch (e){
    setStatus('Sync failed: ' + esc(e.message) + '. Codeforces may be rate-limiting — wait a few seconds and retry.', true);
  } finally {
    $('#sync').disabled = false;
  }
}

/* ---------------- boot ---------------- */
async function boot(){
  const files = ['t0','t1','t2','t3','t4','t5','t6'];
  const parts = await Promise.all(files.map(f => fetch('data/topics/' + f + '.json').then(r => r.json())));
  S.topics = parts.flat();
  S.topics.forEach(t => S.byId[t.id] = t);
  S.curated = await fetch('data/curated.json').then(r => r.json());

  $('#handle').value = S.handle;
  document.querySelectorAll('#lang button').forEach(b =>
    b.setAttribute('aria-pressed', String(b.dataset.lang === S.lang)));

  rerender();
  setStatus(`${S.topics.length} topics loaded. Press Sync to pull the Codeforces problemset` +
            (S.handle ? ' and your solved list.' : ' (add a handle to auto-tick your solves).'));

  // auto-sync if we already have warm caches
  const c = lsGet('cpr.db', null);
  if (c && Date.now() - c.ts < DB_TTL) sync(false);
}

/* ---------------- events ---------------- */
$('#sync').addEventListener('click', () => sync(true));
$('#handle').addEventListener('keydown', e => { if (e.key === 'Enter') sync(true); });
$('#lang').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  S.lang = b.dataset.lang; lsSet('cpr.lang', S.lang);
  document.querySelectorAll('#lang button').forEach(x =>
    x.setAttribute('aria-pressed', String(x.dataset.lang === S.lang)));
  if (S.open) openTopic(S.open);
});
$('#tiers').addEventListener('click', e => {
  const b = e.target.closest('.topic'); if (b) openTopic(b.dataset.id);
});
$('#filters').addEventListener('click', e => {
  const c = e.target.closest('.chip'); if (!c) return;
  const k = c.dataset.f;
  if (k === 'icpc' || k === 'todo'){
    S.filter[k] = !S.filter[k];
    c.setAttribute('aria-pressed', String(S.filter[k]));
  } else {
    const n = k === 'all' ? null : +k;
    S.filter.tier = S.filter.tier === n ? null : n;
    document.querySelectorAll('#filters .chip[data-tier]').forEach(x =>
      x.setAttribute('aria-pressed', String(+x.dataset.f === S.filter.tier)));
  }
  renderTiers();
});
$('#dbody').addEventListener('click', e => {
  if (e.target.id === 'toggleDone'){
    const id = S.open;
    if (S.topicDone[id]) delete S.topicDone[id]; else S.topicDone[id] = true;
    lsSet('cpr.topicDone', S.topicDone);
    rerender(); return;
  }
  const g = e.target.closest('[data-goto]');
  if (g) openTopic(g.dataset.goto);
});
$('#dbody').addEventListener('change', e => {
  const cb = e.target.closest('input[type=checkbox]'); if (!cb) return;
  if (cb.checked) S.probDone[cb.dataset.url] = true; else delete S.probDone[cb.dataset.url];
  lsSet('cpr.probDone', S.probDone);
  rerender();
});
$('#scrim').addEventListener('click', closeDrawer);
$('#dclose').addEventListener('click', closeDrawer);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

boot().catch(e => setStatus('Failed to load roadmap data: ' + esc(e.message) +
  '. If you opened this file directly, serve it over HTTP instead (see README).', true));
