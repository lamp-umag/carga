import { sleep, shuffle, rand, mean, pct } from '../helpers.js';

export const META = {
  id:          'gonogo',
  title:       'Go / No-Go',
  icon:        '🚦',
  color:       '#22C55E',
  tagline:     'Control inhibitorio',
  description: 'Toca cuando veas el círculo verde. ¡No toques cuando veas la X roja!',
  duration:    '~2 min',

  history: `
    <p>La distinción entre reacción simple y reacción de inhibición tiene raíces en el trabajo de
    Franciscus Donders (1869), quien identificó tres tipos de respuesta: A (simple), B (elección)
    y C (respuesta inhibida). La tarea Go/No-Go moderna emergió en la segunda mitad del siglo XX
    como herramienta para estudiar el <strong>control inhibitorio</strong>: la capacidad de suprimir
    una respuesta prepotente cuando el contexto lo requiere.</p>
    <p>Esta capacidad está asociada al córtex prefrontal inferior derecho y los ganglios basales.
    Es una de las funciones ejecutivas más estudiadas en psicopatología: el TDAH, los trastornos
    de conducta y el abuso de sustancias están asociados a déficits en la inhibición de respuestas.
    En la tarea, los <em>falsos positivos</em> (tocar cuando debías inhibirte) son el indicador
    clave de impulsividad — más informativo incluso que el tiempo de reacción.</p>
  `,

  interpret(summary) {
    const fa = summary.false_alarm_rate;
    const hr = summary.hit_rate;
    if (fa === null) return { level: 'note', headline: 'Sin datos', text: '' };

    let level, headline, text;
    if (fa <= 5 && hr >= 90) {
      level = 'excellent'; headline = '¡Control inhibitorio excelente!';
      text = `Solo ${fa}% de falsas alarmas y ${hr}% de respuestas correctas. Tu capacidad de inhibir respuestas impulsivas en esta sesión es muy alta.`;
    } else if (fa <= 15 && hr >= 80) {
      level = 'good'; headline = 'Buen control inhibitorio';
      text = `${fa}% de falsas alarmas. Dentro del rango normal. La mayoría de personas sanas cometen entre 5–20% de errores en este tipo de tarea.`;
    } else if (fa <= 30) {
      level = 'average'; headline = 'Control inhibitorio moderado';
      text = `${fa}% de falsas alarmas. Las respuestas No-Go son más difíciles de inhibir cuando la mayoría de ensayos requieren responder (70% Go). Esto es esperable.`;
    } else {
      level = 'note'; headline = 'Alta impulsividad de respuesta';
      text = `${fa}% de falsas alarmas — bastante alto. Puede indicar impulsividad de respuesta en esta sesión, o simplemente que la tarea no estaba clara. La fatiga también afecta mucho este indicador.`;
    }
    return { level, headline, text };
  },
};

const N_PRACTICE = 10;
const N_TEST     = 40;    // 28 Go (70%) + 12 No-Go (30%)
const GO_RATIO   = 0.70;
const FIX_MS     = 400;
const STIM_MS    = 1000;  // stimulus stays for max 1000ms
const FEEDBACK_MS = 600;

function genTrials(n) {
  const nGo   = Math.round(n * GO_RATIO);
  const nNoGo = n - nGo;
  const arr = [...Array(nGo).fill('go'), ...Array(nNoGo).fill('nogo')];
  return arr.sort(() => Math.random() - 0.5);
}

async function runTrial(container, type, index, total, phase) {
  container.innerHTML = `
    <div class="trial-wrap">
      <header class="trial-header">
        <span class="phase-badge">${phase === 'practice' ? 'Práctica' : 'Prueba'}</span>
        <div class="progress-track"><div class="progress-fill" style="width:${(index/total)*100}%"></div></div>
        <span class="trial-counter">${index + 1} / ${total}</span>
      </header>
      <div class="stimulus-area gonogo-area" id="gg-zone">
        <div id="gg-fix" class="fixation">+</div>
        <div id="gg-stim" class="gonogo-stim hidden"></div>
        <div id="gg-fb" class="feedback-overlay hidden"></div>
      </div>
    </div>`;

  const fix   = container.querySelector('#gg-fix');
  const stim  = container.querySelector('#gg-stim');
  const fb    = container.querySelector('#gg-fb');
  const zone  = container.querySelector('#gg-zone');

  await sleep(FIX_MS);
  fix.classList.add('hidden');

  if (type === 'go') {
    stim.innerHTML = '<div class="gg-circle go-circle"></div>';
  } else {
    stim.innerHTML = '<div class="gg-x no-go-x">✕</div>';
  }
  stim.classList.remove('hidden');

  const t0 = performance.now();
  let tapped = false;
  let rt = null;

  const result = await new Promise(resolve => {
    const tid = setTimeout(() => {
      zone.removeEventListener('pointerdown', tapHandler);
      resolve({ tapped: false, rt: null });
    }, STIM_MS);

    function tapHandler() {
      if (tapped) return;
      tapped = true;
      clearTimeout(tid);
      zone.removeEventListener('pointerdown', tapHandler);
      rt = Math.round(performance.now() - t0);
      resolve({ tapped: true, rt });
    }
    zone.addEventListener('pointerdown', tapHandler);
  });

  stim.classList.add('hidden');

  // Determine outcome
  let outcome, correct;
  if (type === 'go') {
    correct = result.tapped;
    outcome = result.tapped ? 'hit' : 'miss';
  } else {
    correct = !result.tapped;
    outcome = result.tapped ? 'false_alarm' : 'correct_rejection';
  }

  if (phase === 'practice') {
    const msgs = { hit: '¡Correcto!', miss: 'No respondiste', false_alarm: '¡Debías inhibirte!', correct_rejection: '¡Bien inhibido!' };
    fb.className = `feedback-overlay ${correct ? 'correct' : 'incorrect'}`;
    fb.textContent = msgs[outcome];
    fb.classList.remove('hidden');
    await sleep(FEEDBACK_MS);
    fb.classList.add('hidden');
  }

  await sleep(rand(200, 400));

  return { trial_index: index, type, outcome, correct, rt_ms: result.rt };
}

export async function run(container) {
  container.innerHTML = `
    <div class="test-intro">
      <div class="test-intro-icon" style="background:${META.color}22;color:${META.color}">🚦</div>
      <h2>${META.title}</h2>
      <div class="gonogo-legend">
        <div class="gg-legend-item"><div class="gg-circle go-circle sm"></div><span>Toca cuando veas el círculo verde</span></div>
        <div class="gg-legend-item"><div class="gg-x no-go-x sm">✕</div><span><strong>No toques</strong> cuando veas la X roja</span></div>
      </div>
      <p class="hint">La mayoría de veces verás el círculo. ¡Ojo con los No-Go!</p>
      <button class="btn-primary" id="btn-go">Comenzar práctica →</button>
    </div>`;
  await new Promise(r => container.querySelector('#btn-go').addEventListener('click', r, { once: true }));

  const practiceSeq = genTrials(N_PRACTICE);
  for (let i = 0; i < practiceSeq.length; i++)
    await runTrial(container, practiceSeq[i], i, N_PRACTICE, 'practice');

  container.innerHTML = `
    <div class="test-intro">
      <h2>¡Práctica lista!</h2>
      <p>${N_TEST} ensayos sin retroalimentación.</p>
      <button class="btn-primary" id="btn-go">Iniciar prueba →</button>
    </div>`;
  await new Promise(r => container.querySelector('#btn-go').addEventListener('click', r, { once: true }));

  const testSeq = genTrials(N_TEST);
  const trials = [];
  for (let i = 0; i < testSeq.length; i++)
    trials.push(await runTrial(container, testSeq[i], i, testSeq.length, 'test'));

  const hits   = trials.filter(t => t.outcome === 'hit').length;
  const misses = trials.filter(t => t.outcome === 'miss').length;
  const fas    = trials.filter(t => t.outcome === 'false_alarm').length;
  const crs    = trials.filter(t => t.outcome === 'correct_rejection').length;
  const goN    = hits + misses;
  const nogoN  = fas + crs;

  const summary = {
    n_trials:         trials.length,
    hits,
    misses,
    false_alarms:     fas,
    correct_rejections: crs,
    hit_rate:         pct(hits, goN),
    false_alarm_rate: pct(fas, nogoN),
    mean_rt_hits:     mean(trials.filter(t => t.outcome === 'hit').map(t => t.rt_ms).filter(Boolean)),
  };

  return { trials, summary };
}
