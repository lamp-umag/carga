// Shared utilities across all CARGA test modules

export const sleep = ms => new Promise(r => setTimeout(r, ms));
export const rand  = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

export const mean = arr =>
  arr.length ? Math.round(arr.reduce((s, v) => s + v, 0) / arr.length) : null;

export const pct = (n, total) =>
  total ? Math.round((n / total) * 100) : null;

// Renders html into container, returns the container element
export function setHTML(container, html) {
  container.innerHTML = html;
  return container;
}

// Animate container in (fade + slight rise)
export function fadeIn(el, duration = 250) {
  el.style.opacity = '0';
  el.style.transform = 'translateY(12px)';
  el.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  });
}

export function fadeOut(el, duration = 200) {
  return new Promise(resolve => {
    el.style.transition = `opacity ${duration}ms ease`;
    el.style.opacity = '0';
    setTimeout(resolve, duration);
  });
}

// Waits for a tap on any child matching selector; returns the matched element
export function waitForTap(container, selector) {
  return new Promise(resolve => {
    const handler = e => {
      const el = e.target.closest(selector);
      if (!el || el.disabled) return;
      container.removeEventListener('pointerdown', handler);
      resolve(el);
    };
    container.addEventListener('pointerdown', handler);
  });
}
