// Anneau or qui suit la souris avec un léger retard, et s'ouvre sur les éléments cliquables.
// Désactivé sur écran tactile et pour les visiteurs qui demandent moins d'animations ; le curseur natif reste visible.
export function initCursor() {
  const el = document.getElementById('cursor');
  if (!el || !matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let x = -100, y = -100, cx = x, cy = y;
  window.addEventListener('pointermove', (e) => {
    x = e.clientX; y = e.clientY;
    el.classList.add('is-on');
    el.classList.toggle('is-link', !!(e.target as Element).closest?.('a, button, label, select, [role="button"]'));
  }, { passive: true });
  document.addEventListener('pointerleave', () => el.classList.remove('is-on'));
  const tick = () => {
    cx += (x - cx) * 0.18;
    cy += (y - cy) * 0.18;
    el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    requestAnimationFrame(tick);
  };
  tick();
}
