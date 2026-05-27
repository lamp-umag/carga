import { sleep, shuffle, rand, mean, pct } from '../helpers.js';

export const META = {
  id:          'stroop',
  title:       'Test de Stroop',
  icon:        '🎨',
  color:       '#6366F1',
  tagline:     'Interferencia cognitiva',
  description: 'Identifica el color de la tinta, ignorando el significado de la palabra.',
  duration:    '~3 min',

  history: `
    <p>Este test lleva el nombre de John Ridley Stroop, quien lo publicó en 1935. Sin embargo, sus raíces
    son más antiguas: Wilhelm Wundt — considerado el padre de la psicología experimental — ya proponía
    en la década de 1880 medir el tiempo que tomaban los procesos mentales, incluyendo nombrar colores.
    James McKeen Cattell demostró en 1886 que <em>leer</em> palabras era más rápido que <em>nombrar</em>
    colores, sentando la base del efecto que Stroop formalizaría décadas después.</p>
    <p>El <strong>efecto Stroop</strong> ocurre porque leer es un proceso altamente automatizado: tu cerebro
    procesa el significado de la palabra incluso cuando no quieres que lo haga. Inhibir esa respuesta
    automática y responder solo al color de la tinta requiere control ejecutivo, una función del
    córtex prefrontal. Hoy el test se usa en neuropsicología clínica para evaluar funciones ejecutivas.</p>
  `,

  interpret(summary) {
    const e = summary.stroop_effect_ms;
    if (e === null) return { level: 'note', headline: 'Sin datos suficientes', text: 'No se registraron suficientes respuestas correctas.' };
    if (e < 0)    return { level: 'excellent', headline: '¡Efecto invertido!',          text: 'Respondiste más rápido en ensayos incongruentes. Esto ocurre ocasionalmente y puede reflejar hipervigilancia o un efecto de priming. Los resultados digitales pueden variar respecto al papel.' };
    if (e < 50)   return { level: 'excellent', headline: '¡Control inhibitorio muy alto!', text: `Tu efecto Stroop fue de solo ${e} ms. Inhibir la lectura automática te costó muy poco esfuerzo cognitivo. Esto sugiere una buena capacidad ejecutiva en esta sesión.` };
    if (e < 100)  return { level: 'good',      headline: 'Control inhibitorio bueno',      text: `Tu efecto fue de ${e} ms, dentro del rango típico (50–100 ms) para implementaciones digitales. La interferencia es esperada: leer es más rápido que nombrar colores.` };
    if (e < 200)  return { level: 'average',   headline: 'Interferencia moderada',          text: `Con ${e} ms de efecto Stroop, mostraste interferencia notable. Esto es completamente normal — el test mide un fenómeno robusto que afecta a casi todas las personas.` };
    return          { level: 'note',      headline: 'Interferencia alta',              text: `Tu efecto fue de ${e} ms. La lectura automática generó bastante interferencia. Factores como la fatiga, distracción o ser el primer test del día pueden amplificarlo.` };
  },
};

// ── Config ────────────────────────────────────────────
const COLORS = {
  rojo:     { label: 'Rojo',     hex: '#EF4444' },
  azul:     { label: 'Azul',     hex: '#3B82F6' },
  verde:    { label: 'Verde',    hex: '#22C55E' },
  amarillo: { label: 'Amarillo', hex: '#EAB308' },
};
const KEYS = Object.keys(COLORS);
const PRACTICE_N = 6;
const TEST_N     = 36;
const FIX_MS     = 500;
const MAX_RT     = 3000;
const FEEDBACK_MS = 900;
const ITI_MIN    = 300;
const ITI_MAX    = 600;

// ── Trial generation ──────────────────────────────────
function genTrials(n) {
  const pool = [];
  for (const ink of KEYS)
    for (const word of KEYS)
      pool.push({ word, ink, condition: word === ink ? 'congruent' : 'incongruent' });
  const out = [];
  while (out.length < n) out.push(...shuffle(pool));
  return shuffle(out.slice(0, n));
}

// ── Rendering helpers ─────────────────────────────────
function renderTrialShell(container, phase, index, total) {
  container.innerHTML = `
    <div class="trial-wrap">
      <header class="trial-header">
        <span class="phase-badge">${phase === 'practice' ? 'Práctica' : 'Prueba'}</span>
        <div class="progress-track"><div class="progress-fill" id="t-progress" style="width:${(index/total)*100}%"></div></div>
        <span class="trial-counter">${index + 1} / ${total}</span>
      </header>
      <div class="stimulus-area" id="t-stim-area">
        <div id="t-fix"  class="fixation hidden">+</div>
        <div id="t-word" class="stimulus-word hidden"></div>
        <div id="t-feedback" class="feedback-overlay hidden"></div>
      </div>
      <footer class="response-buttons" id="t-btns">
        ${KEYS.map(c => `<button class="resp-btn" data-color="${c}" style="--btn-color:${COLORS[c].hex}">${COLORS[c].label}</button>`).join('')}
      </footer>
    </div>`;
}

function waitForResponse(container, maxMs) {
  return new Promise(resolve => {
    let done = false;
    const t0 = performance.now();

    const tid = setTimeout(() => {
      if (done) return;
      done = true;
      container.querySelectorAll('.resp-btn').forEach(b => b.disabled = true);
      resolve({ response: null, rt: maxMs });
    }, maxMs);

    container.addEventListener('pointerdown', function handler(e) {
      const btn = e.target.closest('.resp-btn');
      if (!btn || btn.disabled || done) return;
      done = true;
      clearTimeout(tid);
      container.removeEventListener('pointerdown', handler);
      container.querySelectorAll('.resp-btn').forEach(b => b.disabled = true);
      resolve({ response: btn.dataset.color, rt: Math.round(performance.now() - t0) });
    });
  });
}

async function runTrial(container, trial, index, total, phase) {
  renderTrialShell(container, phase, index, total);

  const fix  = container.querySelector('#t-fix');
  const word = container.querySelector('#t-word');
  const fb   = container.querySelector('#t-feedback');
  const btns = container.querySelector('#t-btns');

  btns.querySelectorAll('.resp-btn').forEach(b => b.disabled = true);
  fix.classList.remove('hidden');
  await sleep(FIX_MS);

  fix.classList.add('hidden');
  word.textContent = trial.word.toUpperCase();
  word.style.color = COLORS[trial.ink].hex;
  word.classList.remove('hidden');

  const { response, rt } = await waitForResponse(container, MAX_RT);
  const correct = response === trial.ink;

  word.classList.add('hidden');

  if (phase === 'practice') {
    fb.className = `feedback-overlay ${correct ? 'correct' : 'incorrect'}`;
    fb.textContent = correct ? '¡Correcto!' : 'Incorrecto';
    fb.classList.remove('hidden');
    await sleep(FEEDBACK_MS);
    fb.classList.add('hidden');
  }

  await sleep(rand(ITI_MIN, ITI_MAX));

  return { trial_index: index, word: trial.word, ink_color: trial.ink,
           condition: trial.condition, response, correct, rt_ms: response ? rt : null };
}

// ── Main export ───────────────────────────────────────
export async function run(container) {
  // Instructions
  container.innerHTML = `
    <div class="test-intro">
      <div class="test-intro-icon" style="background:${META.color}22;color:${META.color}">🎨</div>
      <h2>${META.title}</h2>
      <p>Verás una <strong>palabra de color</strong> escrita en una tinta de color diferente.<br/>
         Toca el botón del color de la <strong>tinta</strong>, no lo que dice la palabra.</p>
      <div class="example-row">
        <span class="ex-word" style="color:#3B82F6">ROJO</span>
        <span class="ex-arrow">→</span>
        <button class="resp-btn" style="--btn-color:#3B82F6;pointer-events:none">Azul</button>
      </div>
      <p class="hint">Primero harás 6 ensayos de práctica con retroalimentación.</p>
      <button class="btn-primary" id="btn-go">Comenzar práctica →</button>
    </div>`;
  await new Promise(r => container.querySelector('#btn-go').addEventListener('click', r, { once: true }));

  // Practice
  const practiceTrials = genTrials(PRACTICE_N);
  for (let i = 0; i < practiceTrials.length; i++)
    await runTrial(container, practiceTrials[i], i, PRACTICE_N, 'practice');

  // Break
  container.innerHTML = `
    <div class="test-intro">
      <div class="icon-big">🏁</div>
      <h2>¡Práctica lista!</h2>
      <p>Ahora comienza la prueba real.<br/><strong>Sin retroalimentación</strong> durante los ensayos.</p>
      <button class="btn-primary" id="btn-go">Iniciar prueba →</button>
    </div>`;
  await new Promise(r => container.querySelector('#btn-go').addEventListener('click', r, { once: true }));

  // Test
  const testTrials = genTrials(TEST_N);
  const trials = [];
  for (let i = 0; i < testTrials.length; i++) {
    const res = await runTrial(container, testTrials[i], i, TEST_N, 'test');
    trials.push(res);
  }

  // Summary
  const byC = cond => trials.filter(t => t.condition === cond && t.rt_ms !== null);
  const cong   = byC('congruent');
  const incong = byC('incongruent');
  const rtC = mean(cong.map(t => t.rt_ms));
  const rtI = mean(incong.map(t => t.rt_ms));
  const cTotal = trials.filter(t => t.condition === 'congruent').length;
  const iTotal = trials.filter(t => t.condition === 'incongruent').length;

  const summary = {
    n_trials:             trials.length,
    mean_rt_congruent:    rtC,
    mean_rt_incongruent:  rtI,
    stroop_effect_ms:     rtC !== null && rtI !== null ? rtI - rtC : null,
    accuracy_congruent:   pct(cong.filter(t => t.correct).length,   cTotal),
    accuracy_incongruent: pct(incong.filter(t => t.correct).length, iTotal),
  };

  return { trials, summary };
}
