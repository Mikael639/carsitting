import { setScrollLock } from './motion';

const isOpen = () => document.getElementById('mobile-menu')?.hasAttribute('data-open') ?? false;

function setOpen(open: boolean, { restoreFocus = true } = {}) {
  const menu = document.getElementById('mobile-menu');
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  if (!menu || !toggle) return;
  const was = isOpen();
  menu.toggleAttribute('data-open', open);
  menu.inert = !open; // retire le panneau fermé de l'ordre de tabulation et des lecteurs d'écran
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  setScrollLock(open);
  if (open) menu.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
  else if (was && restoreFocus) toggle.focus({ preventScroll: true });
}

// L'en-tête est conservé entre les pages (transition:persist) : sa page courante se met à jour ici.
function markCurrent() {
  const path = location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll<HTMLAnchorElement>('header a[href], #mobile-menu a[href]').forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (href === path) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

export function initMenu() {
  document.addEventListener('click', (e) => {
    const t = e.target as Element;
    if (t.closest('[data-menu-toggle]')) setOpen(!isOpen());
    else if (t.closest('#mobile-menu a')) setOpen(false, { restoreFocus: false });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) setOpen(false);
    // Le focus reste dans le menu tant qu'il est ouvert.
    if (e.key === 'Tab' && isOpen()) {
      const toggle = document.querySelector<HTMLElement>('[data-menu-toggle]');
      const order = [toggle, ...document.querySelectorAll<HTMLElement>('#mobile-menu a')].filter(Boolean) as HTMLElement[];
      const idx = order.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && idx <= 0) { e.preventDefault(); order[order.length - 1].focus(); }
      else if (!e.shiftKey && idx === order.length - 1) { e.preventDefault(); order[0].focus(); }
    }
  });
  // Après navigation : nouveau panneau (fermé), liens à jour. Passage en grand écran : on referme.
  document.addEventListener('astro:after-swap', () => { setScrollLock(false); setOpen(false, { restoreFocus: false }); });
  document.addEventListener('astro:page-load', markCurrent);
  matchMedia('(min-width: 1024px)').addEventListener('change', (e) => e.matches && setOpen(false, { restoreFocus: false }));
  markCurrent();
}
