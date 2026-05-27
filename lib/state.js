// Global application state — single source of truth

export const STATE = {
  participant: null,   // { id, nickname, age, curso, gender }
  sessionId:   null,
  results:     {},     // { testId: { trials, summary } }
};

export function setParticipant(data) {
  STATE.participant = data;
  try { localStorage.setItem('carga_p', JSON.stringify(data)); } catch (_) {}
}

export function saveResult(testId, result) {
  STATE.results[testId] = result;
  try { localStorage.setItem('carga_r', JSON.stringify(STATE.results)); } catch (_) {}
}

export function loadFromStorage() {
  try {
    const p = localStorage.getItem('carga_p');
    const r = localStorage.getItem('carga_r');
    if (p) STATE.participant = JSON.parse(p);
    if (r) STATE.results     = JSON.parse(r);
  } catch (_) {}
}

export function reset() {
  STATE.participant = null;
  STATE.sessionId   = null;
  STATE.results     = {};
  try {
    localStorage.removeItem('carga_p');
    localStorage.removeItem('carga_r');
  } catch (_) {}
}
