// ═══════════════════════════════════════════════════════
// CARGA — Stats Dashboard  |  stats.js
// ═══════════════════════════════════════════════════════

import { initFirebase } from './lib/firebase.js';

// Change this to whatever access code you want
const ACCESS_CODE = 'lamp2025';

const TEST_META = {
  stroop:    { title: 'Stroop',             icon: '🎨', color: '#6366F1' },
  rt:        { title: 'Tiempo de Reacción', icon: '⚡', color: '#F59E0B' },
  digitspan: { title: 'Span de Dígitos',    icon: '🔢', color: '#3B82F6' },
  flanker:   { title: 'Flanker',            icon: '↔️', color: '#14B8A6' },
  gonogo:    { title: 'Go / No-Go',         icon: '🚦', color: '#22C55E' },
  search:    { title: 'Búsqueda Visual',    icon: '🔍', color: '#EC4899' },
};

// ── PIN gate ──────────────────────────────────────────
const pinInput = document.getElementById('pin-input');
const pinError = document.getElementById('pin-error');

document.getElementById('pin-btn').addEventListener('click', checkPin);
pinInput.addEventListener('keydown', e => { if (e.key === 'Enter') checkPin(); });

function checkPin() {
  if (pinInput.value.trim() === ACCESS_CODE) {
    document.getElementById('pin-screen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    loadDashboard();
  } else {
    pinError.classList.remove('hidden');
    pinInput.value = '';
    pinInput.focus();
  }
}

// ── Data loading ──────────────────────────────────────
let db = null;

async function loadDashboard() {
  if (!db) {
    initFirebase();
    db = firebase.firestore();
  }

  document.getElementById('stat-overview').innerHTML =
    '<div class="loading-text">Cargando datos de Firestore…</div>';

  try {
    const snap = await db.collection('carga_sessions').orderBy('timestamp', 'desc').get();
    const sessions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    document.getElementById('last-updated').textContent =
      `Actualizado: ${new Date().toLocaleTimeString('es-CL')} · ${sessions.length} sesiones`;
    renderDashboard(sessions);
  } catch (e) {
    document.getElementById('stat-overview').innerHTML =
      `<p style="color:var(--danger);grid-column:1/-1">Error: ${e.message}</p>`;
  }
}

document.getElementById('btn-refresh').addEventListener('click', loadDashboard);

// ── Helpers ───────────────────────────────────────────
const avg   = arr => arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : null;
const fmt   = (v, u = '') => v != null ? `${Math.round(v)}${u}` : '—';
const clean = arr => arr.filter(v => v != null && !isNaN(v));

function sd(arr) {
  if (arr.length < 2) return null;
  const m = avg(arr);
  return Math.sqrt(arr.reduce((s, v) => s + Math.pow(v - m, 2), 0) / arr.length);
}

function binData(values, min, max, size) {
  const bins = [];
  for (let i = min; i < max; i += size)
    bins.push({ label: `${i}`, count: 0 });
  values.forEach(v => {
    const idx = Math.floor((v - min) / size);
    if (idx >= 0 && idx < bins.length) bins[idx].count++;
  });
  return { labels: bins.map(b => b.label), counts: bins.map(b => b.count) };
}

// ── Chart setup ───────────────────────────────────────
Chart.defaults.color          = '#94A3B8';
Chart.defaults.borderColor    = '#1E293B';
Chart.defaults.font.family    = "'Inter', system-ui, sans-serif";
Chart.defaults.font.size      = 11;
Chart.defaults.plugins.legend.display = false;

const chartInstances = {};

function makeChart(id, type, labels, datasets, opts = {}) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  if (chartInstances[id]) chartInstances[id].destroy();
  chartInstances[id] = new Chart(canvas, {
    type,
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
      plugins: {
        legend: { display: datasets.length > 1, labels: { boxWidth: 12, padding: 16 } },
        tooltip: { backgroundColor: '#1E293B', borderColor: '#334155', borderWidth: 1,
                   padding: 10, titleFont: { weight: '700' } },
      },
      scales: {
        x: { grid: { color: '#1E293B' }, ticks: { maxRotation: 45 } },
        y: { grid: { color: '#1E293B' }, beginAtZero: true, ...opts.yAxis },
      },
      ...opts.chart,
    },
  });
}

function bar(id, labels, data, color) {
  makeChart(id, 'bar', labels,
    [{ data, backgroundColor: color, borderRadius: 5, borderWidth: 0 }]);
}

function groupedBar(id, labels, datasets) {
  makeChart(id, 'bar', labels, datasets.map(d => ({
    ...d, borderRadius: 5, borderWidth: 0,
  })), { chart: { plugins: { legend: { display: true } } } });
}

// ── Overview ──────────────────────────────────────────
function renderDashboard(sessions) {
  // destroy old charts
  Object.values(chartInstances).forEach(c => c.destroy());
  Object.keys(chartInstances).forEach(k => delete chartInstances[k]);

  const n = sessions.length;
  const testCounts = Object.fromEntries(
    Object.keys(TEST_META).map(id => [id, sessions.filter(s => s.results?.[id]).length])
  );
  const allSix    = sessions.filter(s => Object.keys(s.results || {}).length === 6).length;
  const topTest   = Object.entries(testCounts).sort((a, b) => b[1] - a[1])[0];
  const meanAge   = avg(clean(sessions.map(s => s.participant?.age)));

  document.getElementById('stat-overview').innerHTML = [
    card('Sesiones totales',   n),
    card('Completaron las 6',  `${allSix} <span class="stat-sub">de ${n}</span>`),
    card('Test más completado', `${TEST_META[topTest?.[0]]?.icon} ${TEST_META[topTest?.[0]]?.title ?? '—'}`),
    card('Edad media',         fmt(meanAge, ' años')),
  ].join('');

  renderDemographics(sessions);

  // Inject per-test section shells
  document.getElementById('test-sections').innerHTML =
    Object.entries(TEST_META).map(([id, meta]) => `
      <section class="dash-section">
        <h2 class="section-title" style="color:${meta.color}">
          ${meta.icon} ${meta.title}
          <span class="section-n">${testCounts[id]} participantes</span>
        </h2>
        <div id="mini-${id}"></div>
        <div class="charts-row" id="charts-${id}"></div>
      </section>`).join('');

  Object.keys(TEST_META).forEach(id =>
    renderTest(id, sessions.map(s => s.results?.[id]?.summary).filter(Boolean))
  );
}

function card(label, value) {
  return `<div class="stat-card">
    <div class="stat-val">${value}</div>
    <div class="stat-label">${label}</div>
  </div>`;
}

function miniStats(items) {
  return `<div class="mini-stats">${items.map(([label, val]) =>
    `<div class="mini-stat"><span class="ms-val">${val}</span><span class="ms-label">${label}</span></div>`
  ).join('')}</div>`;
}

// ── Demographics ──────────────────────────────────────
function renderDemographics(sessions) {
  const cursoOrder  = ['1M','2M','3M','4M','otro'];
  const cursoLabels = { '1M':'1° Medio','2M':'2° Medio','3M':'3° Medio','4M':'4° Medio','otro':'Otro' };
  const cursoCounts = Object.fromEntries(cursoOrder.map(k => [k, 0]));
  sessions.forEach(s => { const c = s.participant?.curso; if (c in cursoCounts) cursoCounts[c]++; });

  bar('chart-curso',
    cursoOrder.map(k => cursoLabels[k]),
    cursoOrder.map(k => cursoCounts[k]),
    '#6366F1');

  const gOrder  = ['F','M','NB','P'];
  const gLabels = { F:'Femenino', M:'Masculino', NB:'No binario', P:'No indica' };
  const gColors = { F:'#EC4899', M:'#3B82F6', NB:'#A855F7', P:'#64748B' };
  const gCounts = Object.fromEntries(gOrder.map(k => [k, 0]));
  sessions.forEach(s => { const g = s.participant?.gender; if (g in gCounts) gCounts[g]++; });

  makeChart('chart-gender', 'bar',
    gOrder.map(k => gLabels[k]),
    [{ data: gOrder.map(k => gCounts[k]),
       backgroundColor: gOrder.map(k => gColors[k]),
       borderRadius: 5, borderWidth: 0 }]);
}

// ── Per-test ──────────────────────────────────────────
function renderTest(id, data) {
  if (!data.length) {
    document.getElementById(`mini-${id}`).innerHTML =
      '<p class="no-data">Sin datos aún.</p>';
    return;
  }
  ({ stroop: rStroop, rt: rRT, digitspan: rDS,
     flanker: rFlanker, gonogo: rGNG, search: rSearch }[id])(data);
}

function rStroop(data) {
  const effects = clean(data.map(d => d.stroop_effect_ms));
  const rtC     = clean(data.map(d => d.mean_rt_congruent));
  const rtI     = clean(data.map(d => d.mean_rt_incongruent));
  const accC    = clean(data.map(d => d.accuracy_congruent));
  const accI    = clean(data.map(d => d.accuracy_incongruent));

  document.getElementById('mini-stroop').innerHTML = miniStats([
    ['Efecto Stroop medio',   fmt(avg(effects), ' ms')],
    ['± DE',                  fmt(sd(effects),  ' ms')],
    ['TR cong.',              fmt(avg(rtC),      ' ms')],
    ['TR incong.',            fmt(avg(rtI),      ' ms')],
    ['Precisión cong.',       fmt(avg(accC),     '%')],
    ['Precisión incong.',     fmt(avg(accI),     '%')],
  ]);

  const bins = binData(effects, -100, 350, 50);
  document.getElementById('charts-stroop').innerHTML = `
    <div class="chart-card"><h3>Distribución del efecto (ms)</h3><canvas id="ch-stroop-hist"></canvas></div>
    <div class="chart-card"><h3>TR medio: congruente vs incongruente</h3><canvas id="ch-stroop-rt"></canvas></div>`;

  bar('ch-stroop-hist', bins.labels, bins.counts, '#6366F1');
  groupedBar('ch-stroop-rt',
    ['Congruente', 'Incongruente'],
    [{ label: 'TR (ms)', data: [Math.round(avg(rtC)), Math.round(avg(rtI))],
       backgroundColor: ['#6366F1','#EC4899'] }]);
}

function rRT(data) {
  const rts = clean(data.map(d => d.mean_rt_ms));
  const mins = clean(data.map(d => d.min_rt_ms));

  document.getElementById('mini-rt').innerHTML = miniStats([
    ['TR medio',    fmt(avg(rts),  ' ms')],
    ['± DE',        fmt(sd(rts),   ' ms')],
    ['TR mín. medio', fmt(avg(mins), ' ms')],
    ['Más rápido',  rts.length ? fmt(Math.min(...rts), ' ms') : '—'],
    ['Más lento',   rts.length ? fmt(Math.max(...rts), ' ms') : '—'],
  ]);

  const bins = binData(rts, 100, 700, 50);
  document.getElementById('charts-rt').innerHTML =
    `<div class="chart-card wide"><h3>Distribución de TR promedio (ms)</h3><canvas id="ch-rt-hist"></canvas></div>`;
  bar('ch-rt-hist', bins.labels, bins.counts, '#F59E0B');
}

function rDS(data) {
  const spans = clean(data.map(d => d.max_span));
  const dist  = Object.fromEntries([3,4,5,6,7,8,9].map(i => [i, 0]));
  spans.forEach(s => { if (s in dist) dist[s]++; });

  document.getElementById('mini-digitspan').innerHTML = miniStats([
    ['Span medio',    fmt(avg(spans))],
    ['± DE',          sd(spans) ? fmt(sd(spans)) : '—'],
    ['Span más común', Object.entries(dist).sort((a,b) => b[1]-a[1])[0]?.[0] ?? '—'],
    ['Span mínimo',   spans.length ? Math.min(...spans) : '—'],
    ['Span máximo',   spans.length ? Math.max(...spans) : '—'],
  ]);

  document.getElementById('charts-digitspan').innerHTML =
    `<div class="chart-card wide"><h3>Distribución de span máximo</h3><canvas id="ch-ds-dist"></canvas></div>`;
  bar('ch-ds-dist',
    Object.keys(dist).map(k => `${k} dígitos`),
    Object.values(dist),
    '#3B82F6');
}

function rFlanker(data) {
  const effects = clean(data.map(d => d.flanker_effect_ms));
  const rtC     = clean(data.map(d => d.mean_rt_congruent));
  const rtI     = clean(data.map(d => d.mean_rt_incongruent));

  document.getElementById('mini-flanker').innerHTML = miniStats([
    ['Efecto Flanker medio', fmt(avg(effects), ' ms')],
    ['± DE',                 fmt(sd(effects),  ' ms')],
    ['TR cong.',             fmt(avg(rtC),      ' ms')],
    ['TR incong.',           fmt(avg(rtI),      ' ms')],
    ['Precisión incong.',    fmt(avg(clean(data.map(d => d.accuracy_incongruent))), '%')],
  ]);

  const bins = binData(effects, -50, 300, 50);
  document.getElementById('charts-flanker').innerHTML = `
    <div class="chart-card"><h3>Distribución del efecto (ms)</h3><canvas id="ch-fl-hist"></canvas></div>
    <div class="chart-card"><h3>TR medio: congruente vs incongruente</h3><canvas id="ch-fl-rt"></canvas></div>`;

  bar('ch-fl-hist', bins.labels, bins.counts, '#14B8A6');
  groupedBar('ch-fl-rt',
    ['Congruente', 'Incongruente'],
    [{ label: 'TR (ms)', data: [Math.round(avg(rtC)), Math.round(avg(rtI))],
       backgroundColor: ['#14B8A6','#F59E0B'] }]);
}

function rGNG(data) {
  const fa  = clean(data.map(d => d.false_alarm_rate));
  const hr  = clean(data.map(d => d.hit_rate));
  const rts = clean(data.map(d => d.mean_rt_hits));

  document.getElementById('mini-gonogo').innerHTML = miniStats([
    ['Tasa FA media',   fmt(avg(fa),  '%')],
    ['± DE (FA)',       fmt(sd(fa),   '%')],
    ['Tasa Hit media',  fmt(avg(hr),  '%')],
    ['TR hits medio',   fmt(avg(rts), ' ms')],
    ['FA < 10%',        fa.filter(v => v < 10).length + ' / ' + fa.length],
  ]);

  const bins = binData(fa, 0, 110, 10);
  document.getElementById('charts-gonogo').innerHTML = `
    <div class="chart-card wide"><h3>Distribución de tasa de falsas alarmas (%)</h3><canvas id="ch-gg-fa"></canvas></div>`;
  bar('ch-gg-fa', bins.labels.map(l => l + '%'), bins.counts, '#22C55E');
}

function rSearch(data) {
  const adv  = clean(data.map(d => d.popout_advantage_ms));
  const feat = clean(data.map(d => d.feature_mean_rt));
  const conj = clean(data.map(d => d.conjunction_mean_rt));

  document.getElementById('mini-search').innerHTML = miniStats([
    ['Ventaja pop-out',   fmt(avg(adv),  ' ms')],
    ['± DE',              fmt(sd(adv),   ' ms')],
    ['TR fácil',          fmt(avg(feat), ' ms')],
    ['TR difícil',        fmt(avg(conj), ' ms')],
    ['Precisión fácil',   fmt(avg(clean(data.map(d => d.feature_accuracy))), '%')],
    ['Precisión difícil', fmt(avg(clean(data.map(d => d.conjunction_accuracy))), '%')],
  ]);

  document.getElementById('charts-search').innerHTML = `
    <div class="chart-card wide"><h3>TR medio: pop-out vs conjunción</h3><canvas id="ch-sr-rt"></canvas></div>`;
  groupedBar('ch-sr-rt',
    ['Pop-out (fácil)', 'Conjunción (difícil)'],
    [{ label: 'TR (ms)', data: [Math.round(avg(feat)), Math.round(avg(conj))],
       backgroundColor: ['#22C55E','#EC4899'] }]);
}
