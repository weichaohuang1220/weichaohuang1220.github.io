'use strict';

document.getElementById('year').textContent = String(new Date().getFullYear());

// Keep the provider's asynchronously rendered date range in numeric format.
const visitorEmbed = document.querySelector('.visitor-map-embed');
if (visitorEmbed) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formatVisitorDate = () => {
    const date = visitorEmbed.querySelector('.mapmyvisitors-date');
    if (!date) return;
    const numeric = date.textContent.replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\.?\s+(\d{1,2})(?:st|nd|rd|th)?\b/g,
      (_, month, day) => `${String(months.indexOf(month) + 1).padStart(2, '0')}.${day.padStart(2, '0')}`
    ).replace(/\s+-\s+/g, ' – ');
    if (numeric !== date.textContent) date.textContent = numeric;
  };
  new MutationObserver(formatVisitorDate).observe(visitorEmbed, { childList: true, subtree: true, characterData: true });
  formatVisitorDate();
}

const copy = document.querySelector('[data-copy-email]');
const status = document.querySelector('.copy-status');
let statusTimer;
copy.addEventListener('click', async () => {
  clearTimeout(statusTimer);
  try {
    await navigator.clipboard.writeText(copy.dataset.copyEmail);
    status.textContent = 'Email copied.';
  } catch {
    status.textContent = 'Select the email address to copy it.';
  }
  statusTimer = setTimeout(() => { status.textContent = ''; }, 4000);
});

// Add verified news as { date: "YYYY-MM-DD", text: "..." } in #news-data.
const news = JSON.parse(document.getElementById('news-data').textContent);
const list = document.querySelector('.news-list');
const newsWindow = document.querySelector('.news-window');
news.sort((a, b) => b.date.localeCompare(a.date)).forEach(item => {
  const row = document.createElement('li');
  const date = document.createElement('time');
  date.dateTime = item.date;
  date.textContent = item.date.slice(0, 7).replace('-', '.');
  const body = document.createElement('p');
  body.textContent = item.text;
  row.append(date, body);
  list.append(row);
});
list.hidden = news.length === 0;
document.querySelector('.empty-news').hidden = news.length > 0;
function updateNewsFocus() {
  if (newsWindow.scrollHeight > newsWindow.clientHeight) newsWindow.tabIndex = 0;
  else newsWindow.removeAttribute('tabindex');
}
updateNewsFocus();
window.addEventListener('resize', updateNewsFocus, { passive: true });

const sections = [...document.querySelectorAll('main section[aria-labelledby]')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let reveal;
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  reveal = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        reveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });
  sections.forEach(section => {
    if (section.getBoundingClientRect().top > window.innerHeight) {
      section.classList.add('reveal');
      reveal.observe(section);
    }
  });
}
reducedMotion.addEventListener('change', () => {
  sections.forEach(section => section.classList.add('visible'));
  if (reveal) reveal.disconnect();
});

const navLinks = [...document.querySelectorAll('nav a')];
const targets = navLinks.map(link => document.querySelector(link.hash));
let queued = false;
function updateNavigation() {
  const headerHeight = document.querySelector('.topbar').offsetHeight;
  document.documentElement.style.setProperty('--topbar-height', `${headerHeight}px`);
  let active = 0;
  targets.forEach((section, i) => {
    if (section.getBoundingClientRect().top <= headerHeight + 30) active = i;
  });
  if (window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) active = navLinks.length - 1;
  navLinks.forEach((link, i) => {
    if (i === active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  const currentLink = navLinks[active];
  const nav = currentLink.parentElement;
  nav.style.setProperty('--nav-x', `${currentLink.offsetLeft}px`);
  nav.style.setProperty('--nav-y', `${currentLink.offsetTop}px`);
  nav.style.setProperty('--nav-width', `${currentLink.offsetWidth}px`);
  nav.style.setProperty('--nav-height', `${currentLink.offsetHeight}px`);
  nav.classList.add('has-indicator');
  const distance = document.documentElement.scrollHeight - window.innerHeight;
  const progress = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
  document.documentElement.style.setProperty('--read-progress', progress);
  queued = false;
}
window.addEventListener('scroll', () => {
  if (!queued) {
    queued = true;
    requestAnimationFrame(updateNavigation);
  }
}, { passive: true });
window.addEventListener('load', updateNavigation);
window.addEventListener('resize', updateNavigation, { passive: true });
if ('ResizeObserver' in window) new ResizeObserver(updateNavigation).observe(document.querySelector('.topbar'));
updateNavigation();

// Keep native details behavior as a fallback; animate both directions when supported.
document.querySelectorAll('details:not(.project-demo)').forEach(details => {
  const summary = details.querySelector('summary');
  let animation;
  let expanded = details.open;
  function settle() {
    if (animation) animation.cancel();
    animation = null;
    details.open = expanded;
    details.style.overflow = '';
    updateNavigation();
  }
  summary.addEventListener('click', event => {
    if (reducedMotion.matches || typeof details.animate !== 'function') return;
    event.preventDefault();
    const startHeight = details.getBoundingClientRect().height;
    if (animation) animation.cancel();
    else expanded = details.open;
    expanded = !expanded;
    details.open = true;
    const endHeight = expanded ? details.scrollHeight : summary.getBoundingClientRect().height;
    details.style.overflow = 'hidden';
    animation = details.animate(
      { height: [`${startHeight}px`, `${endHeight}px`] },
      { duration: 360, easing: 'cubic-bezier(.22,1,.36,1)' }
    );
    animation.onfinish = settle;
  });
  reducedMotion.addEventListener('change', () => { if (animation) settle(); });
});
document.addEventListener('visibilitychange', () => {
  document.body.classList.toggle('page-hidden', document.hidden);
});

// Pointer feedback runs only on fine pointers and never creates a continuous loop.
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
document.querySelectorAll('.portrait-wrap, .entry, .school').forEach(surface => {
  let bounds;
  let frame;
  let x = 0.5;
  let y = 0.5;
  function resetSurface() {
    if (frame) cancelAnimationFrame(frame);
    frame = null;
    bounds = null;
    ['--spot-x', '--spot-y', '--tilt-x', '--tilt-y'].forEach(name => surface.style.removeProperty(name));
  }
  surface.addEventListener('pointerenter', () => { bounds = surface.getBoundingClientRect(); });
  surface.addEventListener('pointermove', event => {
    if (!finePointer.matches || reducedMotion.matches) return;
    if (!bounds) bounds = surface.getBoundingClientRect();
    x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    if (frame) return;
    frame = requestAnimationFrame(() => {
      surface.style.setProperty('--spot-x', `${x * 100}%`);
      surface.style.setProperty('--spot-y', `${y * 100}%`);
      surface.style.setProperty('--tilt-x', `${(0.5 - y) * 7}deg`);
      surface.style.setProperty('--tilt-y', `${(x - 0.5) * 7}deg`);
      frame = null;
    });
  });
  surface.addEventListener('pointerleave', resetSurface);
  surface.addEventListener('pointercancel', resetSurface);
  reducedMotion.addEventListener('change', resetSurface);
  finePointer.addEventListener('change', resetSurface);
});


// Inline demos: independent scenes, manual selection, and pausable playback.
document.querySelectorAll('.project-demo').forEach(demo => {
  const panels = [...demo.querySelectorAll('.demo-panel')];
  const buttons = [...demo.querySelectorAll('[data-demo-step]')];
  const play = demo.querySelector('.demo-play');
  let index = 0;
  let playing = false;
  let inView = true;
  let timer;
  function sync() {
    clearTimeout(timer);
    const running = demo.open && playing && inView && !document.hidden && !reducedMotion.matches;
    demo.classList.toggle('demo-running', running);
    play.textContent = playing ? 'Pause' : 'Play';
    play.setAttribute('aria-label', playing ? 'Pause animation' : 'Play animation');
    play.disabled = reducedMotion.matches;
    if (running) timer = setTimeout(() => select((index + 1) % panels.length), 8500);
  }
  function select(next) {
    index = next;
    panels.forEach((panel, i) => { panel.hidden = i !== index; });
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    sync();
  }
  buttons.forEach((button, i) => button.addEventListener('click', () => select(i)));
  play.addEventListener('click', () => { playing = !playing; sync(); });
  demo.addEventListener('toggle', () => {
    playing = demo.open && !reducedMotion.matches;
    if (demo.open) select(0);
    else sync();
  });
  document.addEventListener('visibilitychange', sync);
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) playing = false; sync(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { inView = entries[0].isIntersecting; sync(); }, { threshold: .05 }).observe(demo);
  }
  demo.querySelector('.demo-controls').hidden = false;
  select(0);
});
