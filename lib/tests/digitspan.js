import { sleep } from '../helpers.js';

export const META = {
  id:          'digitspan',
  title:       'Span de Dígitos',
  icon:        '🔢',
  color:       '#3B82F6',
  tagline:     'Memoria de trabajo',
  description: 'Memoriza la secuencia de dígitos y repítela en orden.',
  duration:    '~3 min',

  history: `
    <p>En 1887, el psicólogo Joseph Jacobs publicó el primer estudio sistemático de lo que llamó
    <em>memoria de dígitos</em>, demostrando que los adultos podían recordar en promedio entre
    6 y 8 dígitos en secuencia. Décadas después, George A. Miller publicó en 1956 su célebre artículo
    <em>"The Magical Number Seven, Plus or Minus Two"</em>, argumentando que la memoria de trabajo
    tiene una capacidad de aproximadamente 7 "chunks" de información.</p>
    <p>Hoy el span de dígitos es una de las pruebas más utilizadas en neuropsicología para evaluar la
    <strong>memoria de trabajo verbal</strong>, que es la capacidad de mantener y manipular información
    en la mente durante unos segundos. Es sensible a lesiones del lóbulo frontal, deterioro cognitivo
    y trastornos del desarrollo como el TDAH. El rango normal para adolescentes y adultos jóvenes
    se considera entre <strong>5 y 9 dígitos</strong>.</p>
  `,

  interpret(summary) {
    const span = summary.max_span;
    if (span === null) return { level: 'note', headline: 'Sin datos', text: '' };
    if (span >= 9)  return { level: 'excellent', headline: '¡Memoria de trabajo excepcional!', text: `Recordaste ${span} dígitos. Este resultado está muy por encima del promedio — estás entre las personas con mayor capacidad de span de dígitos.` };
    if (span >= 7)  return { level: 'excellent', headline: 'Excelente memoria de trabajo',     text: `${span} dígitos. Estás claramente por encima del promedio típico (5–7 para adolescentes). Tu capacidad de retención verbal es muy buena.` };
    if (span >= 5)  return { level: 'good',      headline: 'Memoria de trabajo normal',        text: `${span} dígitos. Dentro del rango esperado. El promedio para tu grupo de edad es aproximadamente 6 dígitos.` };
    if (span >= 3)  return { level: 'average',   headline: 'Span bajo',                        text: `${span} dígitos. Por debajo del promedio esperado. El rendimiento en este test varía bastante según la concentración del momento.` };
    return            { level: 'note',      headline: 'Span muy bajo',                  text: `Solo ${span} dígito/s. ¿Estabas distraído/a? Este test es muy sensible al nivel de atención y concentración.` };
  },
};

const DIGIT_DURATION   = 700;  // ms each digit is shown
const INTER_DIGIT_BLANK = 200;
const START_SPAN       = 3;
const MAX_SPAN         = 9;
const TRIALS_PER_LEVEL = 2;    // must pass at least 1 of 2 to advance

function genSequence(length) {
  const digits = [];
  for (let i = 0; i < length; i++) {
    let d;
    do { d = Math.floor(Math.random() * 10); }
    while (digits.length && digits[digits.length - 1] === d);
    digits.push(d);
  }
  return digits;
}

function renderNumpad(container, header, entered = []) {
  container.innerHTML = `
    <div class="digitspan-wrap">
      <div class="ds-header">${header}</div>
      <div class="ds-entered">${entered.length ? entered.join(' ') : '<span class="ds-placeholder">—</span>'}</div>
      <div class="ds-numpad" id="ds-numpad">
        ${[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map(k => `
          <button class="ds-key${k === '' ? ' invisible' : ''}" data-key="${k}">${k}</button>`).join('')}
      </div>
      <button class="btn-primary" id="ds-confirm" ${entered.length === 0 ? 'disabled' : ''}>Confirmar</button>
    </div>`;
}

async function showSequence(container, sequence) {
  for (const digit of sequence) {
    container.innerHTML = `
      <div class="digitspan-show">
        <div class="ds-digit-display">${digit}</div>
      </div>`;
    await sleep(DIGIT_DURATION);
    container.innerHTML = `<div class="digitspan-show"><div class="ds-digit-display blank"></div></div>`;
    await sleep(INTER_DIGIT_BLANK);
  }
}

async function getResponse(container, expectedLength) {
  return new Promise(resolve => {
    let entered = [];
    renderNumpad(container, `Introduce los ${expectedLength} dígitos en orden`, entered);

    const numpad = container.querySelector('#ds-numpad');
    const confirm = container.querySelector('#ds-confirm');

    function update() {
      const disp = container.querySelector('.ds-entered');
      const conf = container.querySelector('#ds-confirm');
      if (disp) disp.innerHTML = entered.length ? entered.join(' ') : '<span class="ds-placeholder">—</span>';
      if (conf) conf.disabled = entered.length === 0;
    }

    numpad.addEventListener('pointerdown', e => {
      const btn = e.target.closest('.ds-key');
      if (!btn || btn.classList.contains('invisible')) return;
      const k = btn.dataset.key;
      if (k === '⌫') {
        entered.pop();
      } else if (k !== '') {
        if (entered.length < expectedLength) entered.push(Number(k));
      }
      update();
    });

    confirm.addEventListener('click', () => resolve(entered));
  });
}

export async function run(container) {
  container.innerHTML = `
    <div class="test-intro">
      <div class="test-intro-icon" style="background:${META.color}22;color:${META.color}">🔢</div>
      <h2>${META.title}</h2>
      <p>Verás una secuencia de números, uno a la vez. Cuando termine, introdúcelos <strong>en el mismo orden</strong> usando el teclado.</p>
      <p class="hint">La secuencia irá aumentando. ¡Ve hasta donde puedas!</p>
      <button class="btn-primary" id="btn-go">Comenzar →</button>
    </div>`;
  await new Promise(r => container.querySelector('#btn-go').addEventListener('click', r, { once: true }));

  const allTrials = [];
  let currentSpan = START_SPAN;
  let maxSpan = 0;
  let active = true;

  while (active && currentSpan <= MAX_SPAN) {
    let passedThisLevel = 0;

    for (let attempt = 0; attempt < TRIALS_PER_LEVEL; attempt++) {
      // Countdown
      container.innerHTML = `<div class="digitspan-show"><div class="ds-ready">Secuencia de ${currentSpan}<br/><span class="ds-ready-sub">Prepárate…</span></div></div>`;
      await sleep(1200);

      const sequence = genSequence(currentSpan);

      // Show digits
      container.innerHTML = `<div class="digitspan-show"><div class="ds-focus">Observa</div></div>`;
      await sleep(400);
      await showSequence(container, sequence);

      // Get response
      const response = await getResponse(container, currentSpan);
      const correct = JSON.stringify(response) === JSON.stringify(sequence);

      allTrials.push({ span: currentSpan, sequence, response, correct });

      // Feedback
      container.innerHTML = `
        <div class="digitspan-show">
          <div class="ds-feedback ${correct ? 'correct' : 'incorrect'}">
            ${correct ? '¡Correcto!' : `Incorrecto<br/><span class="ds-answer">Era: ${sequence.join(' ')}</span>`}
          </div>
        </div>`;
      await sleep(1400);

      if (correct) {
        passedThisLevel++;
        maxSpan = Math.max(maxSpan, currentSpan);
      }

      // Pass at least 1 of 2 to advance
      if (passedThisLevel >= 1 && attempt === 0) break;
    }

    if (passedThisLevel === 0) {
      active = false; // failed both attempts at this level
    } else {
      currentSpan++;
    }
  }

  container.innerHTML = `<div class="digitspan-show"><div class="ds-focus">Calculando…</div></div>`;
  await sleep(600);

  const summary = {
    max_span:    maxSpan,
    n_trials:    allTrials.length,
    accuracy:    Math.round(allTrials.filter(t => t.correct).length / allTrials.length * 100),
  };

  return { trials: allTrials, summary };
}
