import { sleep, shuffle, rand, mean } from '../helpers.js';

export const META = {
  id:          'search',
  title:       'Búsqueda Visual',
  icon:        '🔍',
  color:       '#EC4899',
  tagline:     'Atención visual',
  description: 'Encuentra el elemento diferente entre todos los demás.',
  duration:    '~3 min',

  history: `
    <p>La búsqueda visual fue investigada sistemáticamente por Anne Treisman, quien en 1980 publicó
    su influyente <em>Teoría de la Integración de Características</em>. Treisman demostró que algunas
    búsquedas son prácticamente instantáneas — el objeto diferente "salta a la vista" (<em>pop-out</em>)
    cuando se distingue por una sola característica básica como el color. Otras búsquedas son
    <strong>lentas y seriales</strong>: cuando el objetivo se define por la combinación de dos
    características (color Y forma), el sistema atencional debe examinar cada elemento uno a uno.</p>
    <p>Este hallazgo reveló que la atención visual opera en dos modos: un procesamiento preatencional
    masivamente paralelo para características simples, y un procesamiento atencional serial para
    conjunciones de características. Estas ideas fundamentaron décadas de investigación en neurociencia
    visual y tienen aplicaciones en el diseño de interfaces, señalética de seguridad y diagnóstico
    de dificultades atencionales.</p>
  `,

  interpret(summary) {
    const diff = summary.conjunction_mean_rt - summary.feature_mean_rt;
    if (!summary.feature_mean_rt) return { level: 'note', headline: 'Sin datos', text: '' };

    if (diff < 50)  return { level: 'excellent', headline: 'Pop-out muy claro',          text: `Solo ${diff} ms de diferencia entre condiciones. La ventaja del pop-out en tu caso es pequeña — podrías ser especialmente eficiente también en búsquedas difíciles.` };
    if (diff < 150) return { level: 'good',      headline: 'Efecto pop-out normal',      text: `Las búsquedas de características fueron ${diff} ms más rápidas. Este resultado muestra claramente el fenómeno de Treisman: las búsquedas simples "saltan a la vista".` };
    if (diff < 300) return { level: 'average',   headline: 'Búsqueda en conjunción lenta', text: `${diff} ms de diferencia. Las búsquedas por conjunción te costaron bastante más, lo cual es el resultado esperado — requieren examinar cada ítem individualmente.` };
    return            { level: 'note',      headline: 'Gran asimetría entre condiciones',  text: `${diff} ms de diferencia — mucho mayor de lo habitual. ¿Las condiciones de la pantalla (brillo, ángulo) dificultaron ver bien los ítems?` };
  },
};

// Grid settings
const GRID_SIZE   = 16;  // 4×4
const N_FEATURE   = 6;
const N_CONJ      = 6;
const MAX_RT      = 8000;

// Shapes as emoji/symbols rendered in divs
// Feature condition: all circles same color, one different color
// Conjunction: mix of colors and shapes; target is unique combination

function makeFeatureTrial(i) {
  // All blue squares, one red square → target pops out by color
  const targetIdx = Math.floor(Math.random() * GRID_SIZE);
  const items = Array(GRID_SIZE).fill(null).map((_, idx) => ({
    color:    idx === targetIdx ? '#EF4444' : '#3B82F6',
    shape:    'square',
    isTarget: idx === targetIdx,
    idx,
  }));
  return { items, targetIdx, condition: 'feature', trial_index: i };
}

function makeConjunctionTrial(i) {
  // Distractors: blue squares + red circles. Target: blue circle (unique combo)
  const targetIdx = Math.floor(Math.random() * GRID_SIZE);
  const distractorTypes = [
    { color: '#3B82F6', shape: 'square' },   // blue square
    { color: '#EF4444', shape: 'circle' },   // red circle
  ];
  const items = Array(GRID_SIZE).fill(null).map((_, idx) => {
    if (idx === targetIdx) return { color: '#3B82F6', shape: 'circle', isTarget: true, idx };
    const d = distractorTypes[idx % 2];
    return { ...d, isTarget: false, idx };
  });
  return { items, targetIdx, condition: 'conjunction', trial_index: i };
}

function renderGrid(container, trial, index, total) {
  const label = trial.condition === 'feature'
    ? 'Encuentra el elemento diferente'
    : 'Encuentra el círculo azul';
  container.innerHTML = `
    <div class="trial-wrap">
      <header class="trial-header">
        <span class="phase-badge">${trial.condition === 'feature' ? 'Fácil' : 'Difícil'}</span>
        <div class="progress-track"><div class="progress-fill" style="width:${(index/total)*100}%"></div></div>
        <span class="trial-counter">${index + 1} / ${total}</span>
      </header>
      <div class="search-label">${label}</div>
      <div class="search-grid" id="sg-grid">
        ${trial.items.map(item => `
          <button class="search-item ${item.shape}" data-idx="${item.idx}"
            style="--item-color:${item.color}${item.isTarget ? ';outline:none' : ''}">
          </button>`).join('')}
      </div>
    </div>`;
}

async function runSearchTrial(container, trial, index, total) {
  renderGrid(container, trial, index, total);
  const grid = container.querySelector('#sg-grid');
  const t0 = performance.now();

  const tappedIdx = await new Promise(resolve => {
    const tid = setTimeout(() => {
      grid.removeEventListener('pointerdown', handler);
      resolve(null);
    }, MAX_RT);

    function handler(e) {
      const item = e.target.closest('.search-item');
      if (!item) return;
      clearTimeout(tid);
      grid.removeEventListener('pointerdown', handler);
      resolve(Number(item.dataset.idx));
    }
    grid.addEventListener('pointerdown', handler);
  });

  const rt      = Math.round(performance.now() - t0);
  const correct = tappedIdx === trial.targetIdx;

  // Brief feedback flash
  if (tappedIdx !== null) {
    const tapped = grid.querySelector(`[data-idx="${tappedIdx}"]`);
    if (tapped) {
      tapped.style.outline = `3px solid ${correct ? '#22C55E' : '#EF4444'}`;
    }
    // Always reveal target on error
    if (!correct) {
      const target = grid.querySelector(`[data-idx="${trial.targetIdx}"]`);
      if (target) target.style.outline = '3px solid #22C55E';
    }
  }

  await sleep(correct ? 400 : 900);

  return {
    trial_index: index,
    condition:   trial.condition,
    correct,
    rt_ms:       tappedIdx !== null ? rt : null,
  };
}

export async function run(container) {
  container.innerHTML = `
    <div class="test-intro">
      <div class="test-intro-icon" style="background:${META.color}22;color:${META.color}">🔍</div>
      <h2>${META.title}</h2>
      <p>Verás una cuadrícula de figuras. Tu tarea es tocar el elemento que es <strong>diferente</strong> a los demás, lo más rápido posible.</p>
      <p>Habrá dos tipos de búsqueda: una <span style="color:#22C55E">fácil</span> y una más <span style="color:#EC4899">difícil</span>.</p>
      <button class="btn-primary" id="btn-go">Comenzar →</button>
    </div>`;
  await new Promise(r => container.querySelector('#btn-go').addEventListener('click', r, { once: true }));

  // Generate trials: interleaved feature and conjunction
  const featureTrials     = Array(N_FEATURE).fill(null).map((_, i) => makeFeatureTrial(i));
  const conjunctionTrials = Array(N_CONJ).fill(null).map((_, i) => makeConjunctionTrial(N_FEATURE + i));
  const allTrials = shuffle([...featureTrials, ...conjunctionTrials]);

  const trials = [];
  for (let i = 0; i < allTrials.length; i++) {
    const t = { ...allTrials[i], trial_index: i };
    const result = await runSearchTrial(container, t, i, allTrials.length);
    trials.push(result);
    await sleep(rand(200, 400));
  }

  const feat = trials.filter(t => t.condition === 'feature'     && t.rt_ms !== null).map(t => t.rt_ms);
  const conj = trials.filter(t => t.condition === 'conjunction' && t.rt_ms !== null).map(t => t.rt_ms);

  const summary = {
    n_trials:          trials.length,
    feature_mean_rt:   mean(feat),
    conjunction_mean_rt: mean(conj),
    feature_accuracy:  Math.round(trials.filter(t => t.condition === 'feature'     && t.correct).length / N_FEATURE * 100),
    conjunction_accuracy: Math.round(trials.filter(t => t.condition === 'conjunction' && t.correct).length / N_CONJ * 100),
    popout_advantage_ms: mean(feat) !== null && mean(conj) !== null ? mean(conj) - mean(feat) : null,
  };

  return { trials, summary };
}
