import { sleep, shuffle, rand, mean, pct } from '../helpers.js';

export const META = {
  id:          'flanker',
  title:       'Tarea Flanker',
  icon:        '↔️',
  color:       '#14B8A6',
  tagline:     'Atención selectiva',
  description: 'Responde a la dirección de la flecha central, ignorando las laterales.',
  duration:    '~3 min',

  history: `
    <p>La tarea flanker fue desarrollada por Barbara y Charles Eriksen en 1974. En su diseño original,
    los participantes debían identificar una letra central mientras ignoraban letras "flanqueadoras"
    a sus lados. El hallazgo clave: cuando los flanqueadores eran incompatibles con el objetivo
    (p. ej., la letra correcta era S pero estaba rodeada de H's), los tiempos de respuesta aumentaban
    notablemente — el llamado <strong>efecto flanker</strong>.</p>
    <p>Este efecto refleja la dificultad del sistema atencional para filtrar información irrelevante
    que aparece en el campo visual periférico. Actualmente la versión con flechas (introducida en los
    años 90) es ampliamente usada en estudios de neurociencia cognitiva y con técnicas de neuroimagen.
    Se ha relacionado con la actividad del córtex cingulado anterior, una región clave en la detección
    de conflictos y el control atencional.</p>
  `,

  interpret(summary) {
    const e = summary.flanker_effect_ms;
    if (e === null) return { level: 'note', headline: 'Sin datos', text: '' };
    if (e < 0)   return { level: 'excellent', headline: '¡Sin efecto flanker!',          text: 'Resultado inusual — puede que hayas anticipado respuestas o la variabilidad aleatoria sea alta. Inténtalo de nuevo para confirmar.' };
    if (e < 25)  return { level: 'excellent', headline: 'Atención selectiva excelente',  text: `${e} ms de efecto. Tu capacidad para ignorar información irrelevante es muy alta.` };
    if (e < 60)  return { level: 'good',      headline: 'Buena atención selectiva',      text: `${e} ms. Levemente afectado por las flechas distractoras, dentro de un rango normal-bajo.` };
    if (e < 120) return { level: 'average',   headline: 'Interferencia moderada',        text: `${e} ms. Las flechas laterales interfirieron de manera notable. Es el comportamiento esperado para la mayoría de las personas.` };
    return          { level: 'note',      headline: 'Alta interferencia',           text: `${e} ms. Las flechas distractoras te afectaron bastante. Esto puede deberse a fatiga, alta impulsividad o simplemente variabilidad normal.` };
  },
};

// Stimuli: arrays of 5 arrows
const STIMULI = [
  { arrows: '< < < < <', direction: 'left',  condition: 'congruent'   },
  { arrows: '> > > > >', direction: 'right', condition: 'congruent'   },
  { arrows: '< < > < <', direction: 'right', condition: 'incongruent' },
  { arrows: '> > < > >', direction: 'left',  condition: 'incongruent' },
];
const PRACTICE_N = 8;
const TEST_N     = 32;
const FIX_MS     = 400;
const MAX_RT     = 2000;
const FEEDBACK_MS = 700;

function genTrials(n) {
  const out = [];
  while (out.length < n) out.push(...[...STIMULI, ...STIMULI]);
  return out.slice(0, n).sort(() => Math.random() - 0.5);
}

async function runTrial(container, trial, index, total, phase) {
  container.innerHTML = `
    <div class="trial-wrap">
      <header class="trial-header">
        <span class="phase-badge">${phase === 'practice' ? 'Práctica' : 'Prueba'}</span>
        <div class="progress-track"><div class="progress-fill" style="width:${(index/total)*100}%"></div></div>
        <span class="trial-counter">${index + 1} / ${total}</span>
      </header>
      <div class="stimulus-area">
        <div id="fix" class="fixation">+</div>
        <div id="arrows" class="flanker-arrows hidden">${trial.arrows}</div>
        <div id="fb" class="feedback-overlay hidden"></div>
      </div>
      <footer class="response-buttons flanker-btns" id="f-btns">
        <button class="resp-btn flanker-btn" data-dir="left"  style="--btn-color:#6366F1;font-size:2.5rem">←</button>
        <button class="resp-btn flanker-btn" data-dir="right" style="--btn-color:#6366F1;font-size:2.5rem">→</button>
      </footer>
    </div>`;

  const fix    = container.querySelector('#fix');
  const arrows = container.querySelector('#arrows');
  const fb     = container.querySelector('#fb');
  const btns   = container.querySelectorAll('.resp-btn');

  btns.forEach(b => b.disabled = true);
  await sleep(FIX_MS);

  fix.classList.add('hidden');
  arrows.classList.remove('hidden');

  const t0 = performance.now();
  let done = false;
  let response = null;

  const result = await new Promise(resolve => {
    const tid = setTimeout(() => {
      if (done) return;
      done = true;
      resolve({ response: null, rt: MAX_RT });
    }, MAX_RT);

    container.querySelector('#f-btns').addEventListener('pointerdown', function h(e) {
      const btn = e.target.closest('.resp-btn');
      if (!btn || btn.disabled || done) return;
      done = true;
      clearTimeout(tid);
      container.querySelector('#f-btns').removeEventListener('pointerdown', h);
      btns.forEach(b => b.disabled = true);
      resolve({ response: btn.dataset.dir, rt: Math.round(performance.now() - t0) });
    });

    btns.forEach(b => b.disabled = false);
  });

  const correct = result.response === trial.direction;
  arrows.classList.add('hidden');

  if (phase === 'practice') {
    fb.className = `feedback-overlay ${correct ? 'correct' : 'incorrect'}`;
    fb.textContent = correct ? '¡Correcto!' : 'Incorrecto';
    fb.classList.remove('hidden');
    await sleep(FEEDBACK_MS);
    fb.classList.add('hidden');
  }

  await sleep(rand(200, 400));

  return {
    trial_index: index,
    arrows:      trial.arrows,
    direction:   trial.direction,
    condition:   trial.condition,
    response:    result.response,
    correct,
    rt_ms:       result.response ? result.rt : null,
  };
}

export async function run(container) {
  container.innerHTML = `
    <div class="test-intro">
      <div class="test-intro-icon" style="background:${META.color}22;color:${META.color}">↔️</div>
      <h2>${META.title}</h2>
      <p>Verás una fila de cinco flechas. Toca el botón según la dirección de la <strong>flecha central</strong>, ignorando las demás.</p>
      <div class="flanker-example">
        <div class="flanker-row incongruent">← ← <span>→</span> ← ←</div>
        <p class="hint-sm">Aquí la respuesta correcta es <strong>→</strong></p>
      </div>
      <button class="btn-primary" id="btn-go">Comenzar práctica →</button>
    </div>`;
  await new Promise(r => container.querySelector('#btn-go').addEventListener('click', r, { once: true }));

  const practiceTrials = genTrials(PRACTICE_N);
  for (let i = 0; i < practiceTrials.length; i++)
    await runTrial(container, practiceTrials[i], i, PRACTICE_N, 'practice');

  container.innerHTML = `
    <div class="test-intro">
      <h2>¡Práctica lista!</h2>
      <p>${TEST_N} ensayos sin retroalimentación.</p>
      <button class="btn-primary" id="btn-go">Iniciar prueba →</button>
    </div>`;
  await new Promise(r => container.querySelector('#btn-go').addEventListener('click', r, { once: true }));

  const testTrials = genTrials(TEST_N);
  const trials = [];
  for (let i = 0; i < testTrials.length; i++) {
    trials.push(await runTrial(container, testTrials[i], i, TEST_N, 'test'));
  }

  const byC = cond => trials.filter(t => t.condition === cond && t.rt_ms !== null);
  const cong  = byC('congruent');
  const incong = byC('incongruent');
  const rtC = mean(cong.map(t => t.rt_ms));
  const rtI = mean(incong.map(t => t.rt_ms));
  const cTotal = trials.filter(t => t.condition === 'congruent').length;
  const iTotal = trials.filter(t => t.condition === 'incongruent').length;

  const summary = {
    n_trials:             trials.length,
    mean_rt_congruent:    rtC,
    mean_rt_incongruent:  rtI,
    flanker_effect_ms:    rtC !== null && rtI !== null ? rtI - rtC : null,
    accuracy_congruent:   pct(cong.filter(t => t.correct).length,   cTotal),
    accuracy_incongruent: pct(incong.filter(t => t.correct).length, iTotal),
  };

  return { trials, summary };
}
