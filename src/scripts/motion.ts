import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const EASE = 'power3.out';
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Téléphones et tablettes : on défile vite au doigt, les photos doivent être là tout de suite
// (retour de Jerry). Aucun dévoilement ni fondu sur les photos ; les textes gardent leur apparition.
const touch = () => window.matchMedia('(max-width: 1023px), (hover: none)').matches;
let lenis: Lenis | null = null;

function smoothScroll() {
  if (reduced || lenis) return;
  lenis = new Lenis({ duration: 0.8, easing: (t) => 1 - Math.pow(1 - t, 3) });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// Fige le défilement (menu mobile ouvert) : Lenis s'arrête, la page ne bouge plus derrière le panneau.
export function setScrollLock(lock: boolean) {
  document.documentElement.classList.toggle('menu-open', lock);
  if (lock) lenis?.stop();
  else lenis?.start();
}

// En-tête : transparent sur l'ouverture, solide dès qu'on défile (actif même sans animations).
let headerBound = false;
function headerState() {
  const sync = () => document.querySelector('header')?.classList.toggle('is-solid', window.scrollY > 40);
  sync();
  if (headerBound) return;
  headerBound = true;
  window.addEventListener('scroll', sync, { passive: true });
}

function header() {
  const el = document.querySelector<HTMLElement>('header');
  if (!el) return;
  let last = 0;
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      const y = self.scroll();
      const down = y > last && y > 120;
      gsap.to(el, { yPercent: down ? -100 : 0, duration: 0.5, ease: EASE, overwrite: true });
      last = y;
    },
  });
}

// Photos de l'ouverture : fondu enchaîné lent (6 s par image), en pause quand l'onglet est caché.
let slideTimer: number | undefined;
function heroSlides(hero: Element) {
  window.clearInterval(slideTimer);
  const slides = [...hero.querySelectorAll<HTMLElement>('.hero-slide')];
  if (slides.length < 2) return;
  const counter = hero.querySelector<HTMLElement>('[data-hero-index]');
  let i = 0;
  const show = (n: number) => {
    slides[i].removeAttribute('data-active');
    i = (n + slides.length) % slides.length;
    slides[i].setAttribute('data-active', '');
    if (counter) counter.textContent = String(i + 1).padStart(2, '0');
  };
  slideTimer = window.setInterval(() => !document.hidden && show(i + 1), 6000);
}

function intro() {
  const hero = document.querySelector('main > section[data-hero]');
  if (!hero) return;
  heroSlides(hero);

  // Apparition en décalé, lente et sans à-coup (« expo.out », comme sur Les 3 Valets).
  gsap.fromTo(
    hero.querySelectorAll('.hero-reveal'),
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 1.6, ease: 'expo.out', stagger: 0.16, delay: 0.35, clearProps: 'transform' },
  );

  // Parallaxe : la photo glisse plus lentement que le texte.
  const media = hero.querySelector<HTMLElement>('[data-hero-media]');
  if (media) {
    gsap.to(media, {
      yPercent: 6,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });
  }

}

// Bouton « Défiler » de l'ouverture : actif aussi pour les visiteurs sans animations.
function heroCue() {
  const hero = document.querySelector('main > section[data-hero]');
  hero?.querySelector('[data-hero-next]')?.addEventListener('click', () => {
    const next = hero.nextElementSibling as HTMLElement | null;
    if (!next) return;
    if (lenis) lenis.scrollTo(next, { duration: 1.4 });
    else next.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  });
}

function reveals() {
  const hero = document.querySelector('main > section:first-child');
  const all = [...document.querySelectorAll<HTMLElement>(
    'main section h1, main section h2, main section h3, main section p, main section blockquote, main section article, main section li, main section form, main section .btn, main section [data-stat], main section figure',
  )].filter((el) => {
    if (hero?.contains(el) || el.closest('[data-marquee]')) return false;
    // Cartes et formulaires : révélés d'un bloc, sans animer leurs enfants.
    return !el.parentElement?.closest('article, form, figure');
  });
  // Grands titres et citations : ils montent derrière un masque (plus éditorial qu'un simple fondu).
  const titles = all.filter((el) => el.matches('.heading, .display, .quote-xl'));
  // Sur téléphone, les blocs qui portent une photo (cartes, figures) s'affichent sans fondu.
  const rest = all.filter((el) => !titles.includes(el) && !(touch() && el.querySelector('img')));
  if (touch()) gsap.set(all.filter((el) => !titles.includes(el) && el.querySelector('img')), { opacity: 1, y: 0 });

  gsap.set(titles, { opacity: 1, clipPath: 'inset(0 0 100% 0)', y: 48 });
  ScrollTrigger.batch(titles, {
    start: 'top 94%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { clipPath: 'inset(-10% 0 -20% 0)', y: 0, duration: 1, ease: 'expo.out', stagger: 0.12, overwrite: true, clearProps: 'clipPath,transform' }),
  });

  gsap.set(rest, { opacity: 0, y: 20 });
  ScrollTrigger.batch(rest, {
    start: 'top 94%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, ease: EASE, stagger: 0.06, overwrite: true, clearProps: 'transform' }),
  });
}

function images() {
  const hero = document.querySelector('main > section:first-child');
  document.querySelectorAll<HTMLImageElement>('main img').forEach((img) => {
    if (hero?.contains(img) || img.closest('[data-marquee], [data-cta-media]') || touch()) return;
    const wrap = img.parentElement!;
    // Le zoom d'entrée (106 %) ne doit pas déborder de la carte ni élargir la page.
    if (!img.closest('.overflow-hidden')) {
      const frame = document.createElement('div');
      frame.className = 'overflow-hidden ' + [...img.classList].filter((c) => c.startsWith('mb-')).join(' ');
      img.classList.forEach((c) => c.startsWith('mb-') && img.classList.remove(c));
      img.replaceWith(frame);
      frame.append(img);
    }
    gsap.fromTo(
      img,
      { clipPath: 'inset(0 0 100% 0)', scale: 1.06 },
      {
        clipPath: 'inset(0 0 0% 0)',
        scale: 1,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: { trigger: wrap, start: 'top bottom', once: true },
        clearProps: 'clipPath,transform',
      },
    );
  });
}

function ctaParallax() {
  document.querySelectorAll<HTMLElement>('[data-cta-media]').forEach((m) => {
    gsap.fromTo(m.querySelector('img'), { yPercent: -4, scale: 1.08 }, {
      yPercent: 4, scale: 1.08, ease: 'none',
      scrollTrigger: { trigger: m.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

function marquee() {
  const list = document.querySelector<HTMLElement>('[data-marquee]');
  if (!list || list.dataset.ready) return;
  list.dataset.ready = '1';
  list.innerHTML += list.innerHTML;
  const tween = gsap.to(list, { xPercent: -50, duration: 14, ease: 'none', repeat: -1 });
  list.addEventListener('mouseenter', () => gsap.to(tween, { timeScale: 0.2, duration: 0.6 }));
  list.addEventListener('mouseleave', () => gsap.to(tween, { timeScale: 1, duration: 0.6 }));
}

function stats() {
  document.querySelectorAll<HTMLElement>('[data-stat]').forEach((el) => {
    const m = el.textContent?.match(/^(\d[\d\s,  ]*)(\+?)$/);
    if (!m) return;
    const end = parseInt(m[1].replace(/[\s,  ]/g, ''), 10);
    const locale = document.documentElement.lang === 'en' ? 'en-GB' : 'fr-FR';
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          v: end,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => (el.textContent = Math.round(obj.v).toLocaleString(locale) + m[2]),
        }),
    });
  });
}

export function initMotion() {
  document.documentElement.classList.add('motion-ready');
  headerState();
  heroCue();
  if (reduced) {
    document.documentElement.classList.remove('js-motion');
    return;
  }
  smoothScroll();
  lenis?.scrollTo(0, { immediate: true });
  header();
  intro();
  reveals();
  images();
  marquee();
  ctaParallax();
  stats();
  ScrollTrigger.refresh();
}

export function cleanupMotion() {
  window.clearInterval(slideTimer);
  ScrollTrigger.getAll().forEach((t) => t.kill());
  gsap.killTweensOf('*');
}
