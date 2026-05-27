import { sleep, rand, mean } from '../helpers.js';

export const META = {
  id:          'rt',
  title:       'Tiempo de Reacción',
  icon:        '⚡',
  color:       '#F59E0B',
  tagline:     'Velocidad de procesamiento',
  description: 'Toca la pantalla tan rápido como puedas cuando aparezca el estímulo.',
  duration:    '~2 min',

  history: `
    <p>El estudio científico del tiempo de reacción nació en el observatorio astronómico de Greenwich
    a fines del siglo XVIII, cuando los astrónomos notaron diferencias sistemáticas entre observadores al
    registrar el tránsito de estrellas — el llamado <em>ecuación personal</em>. Fue el fisiólogo holandés
    Franciscus Donders quien en 1869 propuso usar el tiempo de reacción como ventana al pensamiento,
    distinguiendo entre reacción simple (detectar un estímulo) y reacción de elección (identificar cuál es).</p>
    <p>Wilhelm Wundt instaló el primer laboratorio de psicología experimental en Leipzig en 1879 y convirtió
    la medición del tiempo de reacción en un método estándar, usando un aparato llamado <em>cronóscopo</em>.
    Hoy sabemos que el tiempo de reacción simple en adultos jóvenes ronda los <strong>200–250 ms</strong>,
    y que puede variar por fatiga, edad, cafeína o entrenamiento. Es uno de los indicadores más directos
    de la velocidad de procesamiento del sistema nervioso central.</p>
  `,

  interpret(summary) {
    const rt = summary.mean_rt_ms;
    if (rt === null) return { level: 'note', headline: 'Sin datos', text: 'No se registraron respuestas.' };
    if (rt < 180)  return { level: 'excellent', headline: '¡Reacción ultra-rápida!',   text: `${rt} ms promedio. Estás entre los más rápidos. Tiempos tan bajos a veces indican anticipación — ¿tuviste falsas alarmas?` };
    if (rt < 230)  return { level: 'excellent', headline: '¡Muy rápido!',              text: `${rt} ms. Tu velocidad de procesamiento está claramente por encima del promedio para tu grupo de edad (referencia: ~220 ms en adolescentes).` };
    if (rt < 300)  return { level: 'good',      headline: 'Buen tiempo de reacción',   text: `${rt} ms. Dentro del rango promedio-alto. La mayoría de las personas sanas entre 15–30 años responde entre 200–300 ms.` };
    if (rt < 400)  return { level: 'average',   headline: 'Tiempo promedio',           text: `${rt} ms. Un poco por encima del promedio esperado. Factores como no haber dormido bien o distracciones pueden aumentar el TR notablemente.` };
    return           { level: 'note',      headline: 'TR elevado',                text: `${rt} ms. Pueden haber influido distracciones, fatiga u otros factores. El TR es muy sensible al estado del momento.` };
  },
};

const N_PRACTICE = 3;
const N_TEST     = 20;
const MIN_WAIT   = 1000;
const MAX_WAIT   = 3500;
const MAX_RT     = 1500;

function renderWait(container, phase, index, total) {
  container.innerHTML = `
    <div class="trial-wrap">
      <header class="trial-header">
        <span class="phase-badge">${phase === 'practice' ? 'Práctica' : 'Prueba'}</span>
        <div class="progress-track"><div class="progress-fill" style="width:${(index/total)*100}%"></div></div>
        <span class="trial-counter">${index + 1} / ${total}</span>
      </header>
      <div class="stimulus-area rt-area" id="rt-tap-zone">
        <div id="rt-inner" class="rt-waiting">
          <div class="rt-ring"></div>
          <p class="rt-label">Espera…</p>
        </div>
      </div>
    </div>`;
}

function renderReady(container, feedback = null) {
  const inner = container.querySelector('#rt-inner');
  if (!inner) return;
  inner.className = 'rt-ready';
  inner.innerHTML = `
    <div class="rt-circle"></div>
    <p class="rt-label">¡Toca!</p>
    ${feedback ? `<p class="rt-feedback">${feedback}</p>` : ''}`;
}

function renderTooEarly(container) {
  const inner = container.querySelector('#rt-inner');
  if (!inner) return;
  inner.className = 'rt-early';
  inner.innerHTML = `<p class="rt-label early">¡Muy pronto!</p><p class="rt-sublabel">Espera la señal verde.</p>`;
}

async function runRTTrial(container, index, total, phase) {
  renderWait(container, phase, index, total);
  const zone = container.querySelector('#rt-tap-zone');

  const delay = rand(MIN_WAIT, MAX_WAIT);
  let tooEarly = false;
  let earlyResolve = null;

  // Listen for early tap during wait phase
  const earlyPromise = new Promise(r => {
    earlyResolve = r;
    zone.addEventListener('pointerdown', function h() {
      zone.removeEventListener('pointerdown', h);
      r(true);
    });
  });

  const waitPromise = sleep(delay).then(() => false);
  tooEarly = await Promise.race([earlyPromise, waitPromise]);

  if (tooEarly) {
    renderTooEarly(container);
    await sleep(1200);
    return null; // discard trial
  }

  // Signal
  renderReady(container);
  const t0 = performance.now();

  const rt = await new Promise(r => {
    const tid = setTimeout(() => r(null), MAX_RT);
    zone.addEventListener('pointerdown', function h() {
      clearTimeout(tid);
      zone.removeEventListener('pointerdown', h);
      r(Math.round(performance.now() - t0));
    });
  });

  // Feedback during practice
  if (phase === 'practice' && rt !== null) {
    const inner = container.querySelector('#rt-inner');
    if (inner) {
      inner.className = 'rt-done';
      inner.innerHTML = `<p class="rt-label">${rt} ms</p>`;
    }
    await sleep(700);
  } else if (rt !== null) {
    await sleep(200);
  } else {
    await sleep(400);
  }

  return rt;
}

export async function run(container) {
  // Instructions
  container.innerHTML = `
    <div class="test-intro">
      <div class="test-intro-icon" style="background:${META.color}22;color:${META.color}">⚡</div>
      <h2>${META.title}</h2>
      <p>Aparecerá un círculo en la pantalla. Tócalo lo más rápido que puedas.</p>
      <p class="hint">⚠️ No toques antes de que aparezca — ¡se registrará como error!</p>
      <button class="btn-primary" id="btn-go">Comenzar →</button>
    </div>`;
  await new Promise(r => container.querySelector('#btn-go').addEventListener('click', r, { once: true }));

  // Practice
  for (let i = 0; i < N_PRACTICE; i++) {
    await runRTTrial(container, i, N_PRACTICE, 'practice');
    await sleep(400);
  }

  container.innerHTML = `
    <div class="test-intro">
      <h2>¡Listo!</h2>
      <p>Ahora la prueba real: ${N_TEST} ensayos.</p>
      <button class="btn-primary" id="btn-go">Iniciar →</button>
    </div>`;
  await new Promise(r => container.querySelector('#btn-go').addEventListener('click', r, { once: true }));

  // Test
  const rts = [];
  let i = 0;
  while (rts.length < N_TEST) {
    const rt = await runRTTrial(container, rts.length, N_TEST, 'test');
    if (rt !== null) rts.push({ trial_index: i, rt_ms: rt });
    i++;
    await sleep(rand(300, 600));
  }

  const validRTs = rts.map(r => r.rt_ms).filter(Boolean);
  const summary = {
    n_trials:    rts.length,
    mean_rt_ms:  mean(validRTs),
    min_rt_ms:   validRTs.length ? Math.min(...validRTs) : null,
    max_rt_ms:   validRTs.length ? Math.max(...validRTs) : null,
    sd_rt_ms:    validRTs.length > 1 ? Math.round(Math.sqrt(validRTs.reduce((s, v) => s + Math.pow(v - mean(validRTs), 2), 0) / validRTs.length)) : null,
  };

  return { trials: rts, summary };
}
