import { uuidv4, fadeIn, fadeOut, sleep } from './lib/helpers.js';
import { STATE, setParticipant, saveResult, reset } from './lib/state.js';
import { initFirebase, saveSession } from './lib/firebase.js';

import { META as stroopMeta, run as runStroop }     from './lib/tests/stroop.js';
import { META as rtMeta,     run as runRT }         from './lib/tests/rt.js';
import { META as dsMeta,     run as runDigitSpan }  from './lib/tests/digitspan.js';
import { META as flankerMeta,run as runFlanker }    from './lib/tests/flanker.js';
import { META as gonogoMeta, run as runGoNoGo }     from './lib/tests/gonogo.js';
import { META as searchMeta, run as runSearch }     from './lib/tests/search.js';

// ── Test registry ─────────────────────────────────────
const TESTS = [
  { meta: stroopMeta,  run: runStroop    },
  { meta: rtMeta,      run: runRT        },
  { meta: dsMeta,      run: runDigitSpan },
  { meta: flankerMeta, run: runFlanker   },
  { meta: gonogoMeta,  run: runGoNoGo    },
  { meta: searchMeta,  run: runSearch    },
];

// ── DOM roots ─────────────────────────────────────────
const app    = document.getElementById('app');
const header = document.getElementById('app-header');

function showHeader(show) {
  header.classList.toggle('hidden', !show);
}

// ── Screens ───────────────────────────────────────────
function setScreen(html) {
  app.innerHTML = html;
  fadeIn(app);
}

// ── Onboarding ────────────────────────────────────────
async function askQuestion({ prompt, sub, type, options, optional, emoji }) {
  return new Promise(resolve => {
    const inputHtml = (() => {
      if (type === 'text') {
        return `<input id="qa-input" type="text" class="qa-input" placeholder="${sub || ''}" autocomplete="off" maxlength="30" />`;
      }
      if (type === 'number') {
        return `<input id="qa-input" type="number" inputmode="numeric" class="qa-input" placeholder="${sub || ''}" min="10" max="99" />`;
      }
      if (type === 'options') {
        return `<div class="qa-options">${options.map(o =>
          `<button class="qa-option" data-val="${o.val}">${o.label}</button>`).join('')}</div>`;
      }
      if (type === 'emoji') {
        const emojis = ['😊','😎','🤔','🧠','🎯','⚡','🔥','🌙','🌊','🎮','🦁','🐺','🌵','🚀','🎸','📚','🧩','💡','🌈','🏆'];
        return `
          <div class="emoji-grid">${emojis.map(e =>
            `<button class="emoji-btn" data-val="${e}">${e}</button>`).join('')}</div>
          <p class="emoji-or">o escribe uno:</p>
          <input id="qa-input" type="text" class="qa-input emoji-direct" placeholder="ej. 🦊" maxlength="4" />`;
      }
      return '';
    })();

    app.innerHTML = `
      <div class="onboard-screen">
        <div class="qa-card">
          <p class="qa-prompt">${prompt}</p>
          ${inputHtml}
          ${optional ? '<p class="qa-skip-hint">Puedes saltarte esta pregunta.</p>' : ''}
          <div class="qa-actions">
            ${optional ? `<button class="btn-secondary" id="qa-skip">Saltar</button>` : ''}
            ${type !== 'options' && type !== 'emoji' ? `<button class="btn-primary" id="qa-next">Siguiente →</button>` : ''}
            ${type === 'emoji' ? `<button class="btn-primary" id="qa-next">Siguiente →</button>` : ''}
          </div>
        </div>
      </div>`;
    fadeIn(app);

    // Option buttons resolve immediately
    if (type === 'options') {
      app.querySelectorAll('.qa-option').forEach(btn => {
        btn.addEventListener('click', () => resolve(btn.dataset.val), { once: true });
      });
    }

    // Emoji grid
    if (type === 'emoji') {
      app.querySelectorAll('.emoji-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          app.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          const direct = app.querySelector('#qa-input');
          if (direct) direct.value = btn.dataset.val;
        });
      });
    }

    const nextBtn = app.querySelector('#qa-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const input = app.querySelector('#qa-input');
        const val = input ? input.value.trim() : '';
        resolve(val || null);
      });
    }

    const skipBtn = app.querySelector('#qa-skip');
    if (skipBtn) skipBtn.addEventListener('click', () => resolve(null));

    // Enter key on text/number inputs
    app.querySelectorAll('.qa-input').forEach(inp => {
      inp.addEventListener('keydown', e => {
        if (e.key === 'Enter') nextBtn?.click();
      });
    });
  });
}

async function runOnboarding() {
  // Splash
  setScreen(`
    <div class="splash">
      <div class="splash-logo">CARGA</div>
      <p class="splash-full">Cognitive Assessment Research<br/>Gamified Application</p>
      <p class="splash-sub">Herramienta de exploración cognitiva experimental</p>
      <button class="btn-primary splash-btn" id="btn-splash">Comenzar →</button>
      <p class="splash-footer">LAMP · Laboratorio de Medición Psicosocial · UMAG</p>
    </div>`);
  await new Promise(r => app.querySelector('#btn-splash').addEventListener('click', r, { once: true }));

  showHeader(true);

  // Questions
  let nickname = await askQuestion({
    prompt: '¡Hola! ¿Cómo quieres que te llamemos?',
    sub: 'Apodo, nombre, emoji… lo que quieras',
    type: 'text',
  });
  if (!nickname) nickname = 'Anónimo';

  const emoji = await askQuestion({
    prompt: '¿Tienes un emoji favorito?',
    type: 'emoji',
    optional: true,
  });

  let age = await askQuestion({
    prompt: `${nickname}, ¿cuántos años tienes?`,
    sub: 'ej. 16',
    type: 'number',
  });
  age = parseInt(age) || null;

  const curso = await askQuestion({
    prompt: '¿En qué curso estás?',
    type: 'options',
    options: [
      { val: '1M', label: '1° Medio' },
      { val: '2M', label: '2° Medio' },
      { val: '3M', label: '3° Medio' },
      { val: '4M', label: '4° Medio' },
      { val: 'otro', label: 'Otro / No aplica' },
    ],
  });

  const gender = await askQuestion({
    prompt: '¿Con qué género te identificas?',
    type: 'options',
    options: [
      { val: 'F',  label: 'Femenino' },
      { val: 'M',  label: 'Masculino' },
      { val: 'NB', label: 'No binario' },
      { val: 'P',  label: 'Prefiero no decir' },
    ],
  });

  setParticipant({ id: STATE.sessionId, nickname, emoji, age, curso, gender });
}

// ── Hub ───────────────────────────────────────────────
function renderHub() {
  const label = STATE.participant?.emoji
    ? `${STATE.participant.emoji} ${STATE.participant.nickname}`
    : STATE.participant?.nickname || 'Participante';

  const cards = TESTS.map(({ meta }) => {
    const done    = !!STATE.results[meta.id];
    const summary = STATE.results[meta.id]?.summary;
    const badge   = done ? buildBadge(meta, summary) : '';
    return `
      <div class="test-card ${done ? 'done' : ''}" data-test="${meta.id}">
        <div class="card-icon" style="background:${meta.color}22;color:${meta.color}">${meta.icon}</div>
        <div class="card-body">
          <h3 class="card-title">${meta.title}</h3>
          <p class="card-tag">${meta.tagline}</p>
          <p class="card-desc">${meta.description}</p>
        </div>
        <div class="card-footer">
          ${badge}
          <div class="card-meta">
            <span class="duration-badge">⏱ ${meta.duration}</span>
            <button class="btn-card" data-test="${meta.id}">${done ? 'Repetir' : 'Iniciar'}</button>
          </div>
        </div>
      </div>`;
  }).join('');

  const doneCount = Object.keys(STATE.results).length;

  app.innerHTML = `
    <div class="hub">
      <div class="hub-header">
        <div>
          <h1 class="hub-title">Panel de Pruebas</h1>
          <p class="hub-sub">Bienvenido/a, <strong>${label}</strong></p>
        </div>
        ${doneCount > 0 ? `<div class="hub-progress-pill">${doneCount}/6 completadas</div>` : ''}
      </div>
      <div class="hub-intro">
        <p>Cada prueba mide un aspecto diferente de tu cognición. Puedes realizarlas en cualquier orden.</p>
      </div>
      <div class="tests-grid" id="tests-grid">${cards}</div>
    </div>`;
  fadeIn(app);

  app.querySelectorAll('.btn-card').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const testId = e.target.dataset.test;
      await startTest(testId);
      renderHub();
    });
  });
}

function buildBadge(meta, summary) {
  if (!summary) return '';
  let key = '', val = '';
  if (meta.id === 'stroop')    { key = 'Efecto'; val = summary.stroop_effect_ms !== null ? `${summary.stroop_effect_ms > 0 ? '+' : ''}${summary.stroop_effect_ms} ms` : '—'; }
  if (meta.id === 'rt')        { key = 'TR medio'; val = summary.mean_rt_ms ? `${summary.mean_rt_ms} ms` : '—'; }
  if (meta.id === 'digitspan') { key = 'Span máx.'; val = summary.max_span ?? '—'; }
  if (meta.id === 'flanker')   { key = 'Efecto'; val = summary.flanker_effect_ms !== null ? `${summary.flanker_effect_ms > 0 ? '+' : ''}${summary.flanker_effect_ms} ms` : '—'; }
  if (meta.id === 'gonogo')    { key = 'FA'; val = summary.false_alarm_rate !== null ? `${summary.false_alarm_rate}%` : '—'; }
  if (meta.id === 'search')    { key = 'Pop-out'; val = summary.popout_advantage_ms !== null ? `+${summary.popout_advantage_ms} ms` : '—'; }
  return `<div class="card-badge"><span class="badge-key">${key}</span><span class="badge-val">${val}</span></div>`;
}

// ── Test flow ─────────────────────────────────────────
async function startTest(testId) {
  const entry = TESTS.find(t => t.meta.id === testId);
  if (!entry) return;
  const { meta, run } = entry;

  // Switch to test container — hide reiniciar during trials
  showHeader(false);
  app.innerHTML = `<div id="test-container" class="test-container"></div>`;
  const container = document.getElementById('test-container');

  let results;
  try {
    results = await run(container);
  } catch (e) {
    console.error('[CARGA] Test error:', e);
    showHeader(true);
    return;
  }

  saveResult(testId, results);
  await showResults(meta, results, container);
  showHeader(true);
}

// ── Results screen ────────────────────────────────────
async function showResults(meta, results, container) {
  const { summary } = results;
  const interp = meta.interpret(summary);
  const levelColors = { excellent: '#22C55E', good: '#6366F1', average: '#F59E0B', note: '#94A3B8' };
  const scoreCards = buildScoreCards(meta, summary);

  container.innerHTML = `
    <div class="results-wrap">
      <div class="results-header">
        <div class="results-icon" style="background:${meta.color}22;color:${meta.color}">${meta.icon}</div>
        <div>
          <h2 class="results-title">${meta.title}</h2>
          <p class="results-sub">Tu resultado</p>
        </div>
      </div>

      <div class="score-cards">${scoreCards}</div>

      <div class="interp-card" style="border-left:3px solid ${levelColors[interp.level] || '#94A3B8'}">
        <p class="interp-headline">${interp.headline}</p>
        <p class="interp-text">${interp.text}</p>
      </div>

      <details class="history-details">
        <summary>Historia y ciencia de este test</summary>
        <div class="history-body">${meta.history}</div>
      </details>

      <button class="btn-primary" id="btn-back">Volver al panel →</button>
    </div>`;
  fadeIn(container);

  await new Promise(r => container.querySelector('#btn-back').addEventListener('click', r, { once: true }));
}

function buildScoreCards(meta, s) {
  const card = (label, value, accent = false) =>
    `<div class="score-card${accent ? ' accent' : ''}"><span class="sc-val">${value ?? '—'}</span><span class="sc-label">${label}</span></div>`;

  if (meta.id === 'stroop') return [
    card('Ensayos', s.n_trials),
    card('Precisión congruente', s.accuracy_congruent !== null ? s.accuracy_congruent + '%' : null),
    card('TR congruente', s.mean_rt_congruent ? s.mean_rt_congruent + ' ms' : null),
    card('TR incongruente', s.mean_rt_incongruent ? s.mean_rt_incongruent + ' ms' : null),
    card('Efecto Stroop', s.stroop_effect_ms !== null ? (s.stroop_effect_ms > 0 ? '+' : '') + s.stroop_effect_ms + ' ms' : null, true),
  ].join('');

  if (meta.id === 'rt') return [
    card('Ensayos', s.n_trials),
    card('TR mínimo', s.min_rt_ms ? s.min_rt_ms + ' ms' : null),
    card('TR promedio', s.mean_rt_ms ? s.mean_rt_ms + ' ms' : null, true),
    card('TR máximo', s.max_rt_ms ? s.max_rt_ms + ' ms' : null),
    card('Variabilidad (DE)', s.sd_rt_ms ? s.sd_rt_ms + ' ms' : null),
  ].join('');

  if (meta.id === 'digitspan') return [
    card('Span máximo', s.max_span, true),
    card('Ensayos totales', s.n_trials),
    card('Precisión global', s.accuracy !== null ? s.accuracy + '%' : null),
  ].join('');

  if (meta.id === 'flanker') return [
    card('Ensayos', s.n_trials),
    card('TR congruente', s.mean_rt_congruent ? s.mean_rt_congruent + ' ms' : null),
    card('TR incongruente', s.mean_rt_incongruent ? s.mean_rt_incongruent + ' ms' : null),
    card('Efecto Flanker', s.flanker_effect_ms !== null ? (s.flanker_effect_ms > 0 ? '+' : '') + s.flanker_effect_ms + ' ms' : null, true),
    card('Precisión', s.accuracy_incongruent !== null ? s.accuracy_incongruent + '%' : null),
  ].join('');

  if (meta.id === 'gonogo') return [
    card('Hits (correctos)', s.hits ? s.hits + ' (' + s.hit_rate + '%)' : null, true),
    card('Falsas alarmas', s.false_alarms !== undefined ? s.false_alarms + ' (' + s.false_alarm_rate + '%)' : null),
    card('Omisiones', s.misses),
    card('TR en Hits', s.mean_rt_hits ? s.mean_rt_hits + ' ms' : null),
  ].join('');

  if (meta.id === 'search') return [
    card('TR Fácil (pop-out)', s.feature_mean_rt ? s.feature_mean_rt + ' ms' : null, true),
    card('TR Difícil (conjunción)', s.conjunction_mean_rt ? s.conjunction_mean_rt + ' ms' : null),
    card('Ventaja pop-out', s.popout_advantage_ms !== null ? '+' + s.popout_advantage_ms + ' ms' : null),
    card('Precisión fácil', s.feature_accuracy !== null ? s.feature_accuracy + '%' : null),
    card('Precisión difícil', s.conjunction_accuracy !== null ? s.conjunction_accuracy + '%' : null),
  ].join('');

  return '';
}

// ── Reiniciar ─────────────────────────────────────────
document.getElementById('btn-reiniciar').addEventListener('click', async () => {
  if (!confirm('¿Reiniciar para un nuevo participante? Se borrarán los datos actuales.')) return;
  reset();
  showHeader(false);
  STATE.sessionId = uuidv4();
  await runOnboarding();
  renderHub();
});

// ── Boot ──────────────────────────────────────────────
async function boot() {
  initFirebase();
  STATE.sessionId = uuidv4();
  await runOnboarding();
  renderHub();

  // Persist session on page unload if any tests were done
  window.addEventListener('beforeunload', () => {
    if (Object.keys(STATE.results).length > 0 && STATE.participant) {
      saveSession({
        session_id:  STATE.sessionId,
        participant: STATE.participant,
        results:     STATE.results,
      });
    }
  });
}

boot();
