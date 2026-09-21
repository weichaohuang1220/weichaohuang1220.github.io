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
  // Scale the provider's fixed-size map and its markers together after layout changes.
  const fitVisitorMap = () => {
    const map = visitorEmbed.querySelector('.mapmyvisitors-map');
    if (!map) return;
    const nativeWidth = parseFloat(map.style.width);
    const availableWidth = visitorEmbed.clientWidth;
    if (nativeWidth > 0 && availableWidth > 0) {
      map.style.setProperty('--visitor-map-scale', String(availableWidth / nativeWidth));
    }
  };
  new MutationObserver(() => {
    formatVisitorDate();
    fitVisitorMap();
  }).observe(visitorEmbed, { childList: true, subtree: true, characterData: true });
  if ('ResizeObserver' in window) new ResizeObserver(fitVisitorMap).observe(visitorEmbed);
  else window.addEventListener('resize', fitVisitorMap, { passive: true });
  formatVisitorDate();
  fitVisitorMap();
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
document.querySelectorAll('.project-demo:not([data-architecture])').forEach(demo => {
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

// Data-driven walkthroughs keep the full map visible across steps and modes.
document.querySelectorAll('[data-architecture]').forEach(demo => {
  const config = JSON.parse(demo.querySelector('[data-flow-config]').textContent);
  const modeNames = Object.keys(config);
  const modeButtons = [...demo.querySelectorAll('[data-flow-mode]')];
  const buttons = [...demo.querySelectorAll('[data-flow-step]')];
  const groups = [...demo.querySelectorAll('[data-step-group]')];
  const captions = [...demo.querySelectorAll('[data-caption]')];
  const play = demo.querySelector('.demo-play');
  const progress = demo.querySelector('[data-flow-progress]');
  let mode = modeNames[0];
  let index = 0;
  let playing = false;
  let inView = true;
  let timer;
  function sync() {
    clearTimeout(timer);
    const running = demo.open && playing && inView && !document.hidden && !reducedMotion.matches;
    demo.classList.toggle('demo-running', running);
    play.textContent = playing ? 'Pause' : (index === config[mode].length - 1 ? 'Replay' : 'Play');
    play.setAttribute('aria-label', playing ? 'Pause walkthrough' : 'Play walkthrough');
    play.disabled = reducedMotion.matches;
    if (running) timer = setTimeout(() => {
      if (index + 1 < config[mode].length) select(index + 1);
      else { playing = false; sync(); }
    }, 7500);
  }
  function select(next) {
    index = next;
    const step = config[mode][index];
    const selected = `${mode}:${index}`;
    demo.dataset.mode = mode;
    demo.querySelectorAll('[data-node]').forEach(node => node.classList.toggle('is-active', step.nodes.includes(node.dataset.node)));
    demo.querySelectorAll('[data-route]').forEach(route => route.classList.toggle('is-active', step.routes.includes(route.dataset.route)));
    captions.forEach(caption => { caption.hidden = caption.dataset.caption !== selected; });
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.flowStep === selected)));
    modeButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.flowMode === mode)));
    groups.forEach(group => { group.hidden = group.dataset.stepGroup !== mode; });
    if (progress) progress.textContent = step.badge;
    sync();
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    const [nextMode, nextIndex] = button.dataset.flowStep.split(':');
    mode = nextMode;
    playing = false;
    select(Number(nextIndex));
  }));
  modeButtons.forEach(button => button.addEventListener('click', () => {
    mode = button.dataset.flowMode;
    playing = false;
    select(0);
  }));
  play.addEventListener('click', () => {
    if (!playing && index === config[mode].length - 1) index = 0;
    playing = !playing;
    select(index);
  });
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

// A quiet background track controlled through SoundCloud's supported Widget API.
// Autoplay is attempted, then retried on a page gesture if the browser blocks it.
const springRadio = document.querySelector('.spring-radio');
if (springRadio) {
  const toggle = springRadio.querySelector('.radio-toggle');
  const label = springRadio.querySelector('.radio-label');
  const icon = springRadio.querySelector('.radio-action-icon');
  const panel = springRadio.querySelector('.radio-panel');
  const settings = springRadio.querySelector('.radio-settings');
  const volumeInput = springRadio.querySelector('input[type=range]');
  const volumeOutput = springRadio.querySelector('output');
  const preferenceKey = 'spring-music-paused';
  let wantsPlay = true;
  try { wantsPlay = localStorage.getItem(preferenceKey) !== 'true'; } catch (_) {}
  let widget;
  let ready = false;
  let failed = false;
  let state = 'loading';
  let volume = 12;
  let duration = 0;
  let retryOnGesture = wantsPlay;
  let pendingTimer;
  let showPlayerOnBlock = false;
  let nativePlayAllowed = false;
  let scrollAttempts = 0;
  let lastScrollAttempt = 0;
  function rememberPause(paused) {
    try { localStorage.setItem(preferenceKey, String(paused)); } catch (_) {}
  }
  function render(next) {
    state = next;
    toggle.dataset.state = next;
    label.textContent = { loading: 'Spring · Loading', starting: 'Spring · Starting', playing: 'Spring music', paused: 'Spring · Paused', blocked: 'Spring · Tap to play', error: 'Spring · Unavailable' }[next];
    const canPause = next === 'playing';
    icon.textContent = canPause ? 'Ⅱ' : '▷';
    toggle.setAttribute('aria-label', canPause ? 'Pause spring music' : 'Play spring music');
    toggle.setAttribute('aria-pressed', String(next === 'playing'));
  }
  function start(manual = false) {
    if (manual) {
      wantsPlay = true;
      retryOnGesture = true;
      showPlayerOnBlock = true;
      rememberPause(false);
      // A direct tap inside the provider player remains available on mobile.
      if (window.matchMedia('(pointer: coarse)').matches || state === 'blocked' || failed) setPanel(true);
    }
    if (failed) {
      if (manual) reloadPlayer();
      return;
    }
    if (!wantsPlay) return;
    if (!ready) { render('loading'); return; }
    clearTimeout(pendingTimer);
    widget.setVolume(volume);
    widget.play();
    render('starting');
    pendingTimer = setTimeout(() => {
      if (wantsPlay && state === 'starting') {
        render('blocked');
        if (showPlayerOnBlock) setPanel(true);
      }
    }, 3500);
  }
  function pause() {
    wantsPlay = false;
    retryOnGesture = false;
    showPlayerOnBlock = false;
    nativePlayAllowed = false;
    clearTimeout(pendingTimer);
    rememberPause(true);
    if (ready) widget.pause();
    render('paused');
  }
  function setPanel(open) {
    panel.hidden = !open;
    nativePlayAllowed = open;
    settings.setAttribute('aria-expanded', String(open));
  }
  function unavailable() {
    failed = true;
    retryOnGesture = false;
    clearTimeout(pendingTimer);
    if (ready) widget.pause();
    render('error');
    if (showPlayerOnBlock) setPanel(true);
  }
  function initMusic() {
    if (!window.SC || !window.SC.Widget) { unavailable(); return; }
    widget = window.SC.Widget(document.getElementById('spring-player'));
    const events = window.SC.Widget.Events;
    widget.bind(events.READY, () => {
      ready = true;
      failed = false;
      retryOnGesture = wantsPlay;
      clearTimeout(loadTimer);
      widget.setVolume(volume);
      widget.getDuration(value => { duration = value; });
      if (wantsPlay) start();
      else { widget.pause(); render('paused'); }
    });
    widget.bind(events.PLAY, () => {
      if (!wantsPlay && !nativePlayAllowed) { widget.pause(); return; }
      wantsPlay = true;
      rememberPause(false);
      clearTimeout(pendingTimer);
      retryOnGesture = false;
      widget.setVolume(volume);
      render('playing');
    });
    widget.bind(events.PAUSE, () => {
      if (!wantsPlay) { render('paused'); return; }
      if (state !== 'playing') return;
      widget.getPosition(position => {
        // A completed track will loop via FINISH; a manual pause stays paused.
        if (duration && position >= duration - 800) return;
        if (state === 'playing') pause();
      });
    });
    widget.bind(events.FINISH, () => {
      if (!wantsPlay) return;
      widget.seekTo(0);
      retryOnGesture = true;
      start();
    });
    widget.bind(events.ERROR, unavailable);
  }
  toggle.addEventListener('click', () => {
    if (state === 'playing') pause();
    else start(true);
  });
  settings.addEventListener('click', () => setPanel(panel.hidden));
  springRadio.querySelector('.radio-close').addEventListener('click', () => { setPanel(false); settings.focus(); });
  volumeInput.addEventListener('input', () => {
    volume = Number(volumeInput.value);
    volumeOutput.textContent = `${volume}%`;
    if (ready) widget.setVolume(volume);
  });
  function tryGesture(event) {
    if (!retryOnGesture || !wantsPlay || failed || springRadio.contains(event.target)) return;
    if (event.type === 'keydown' && (event.repeat || event.metaKey || event.ctrlKey || event.altKey || !['Enter', ' '].includes(event.key))) return;
    if (event.type === 'pointerup' && event.button !== 0) return;
    if (state !== 'playing') start();
  }
  document.addEventListener('pointerup', tryGesture, { passive: true });
  document.addEventListener('touchend', tryGesture, { passive: true });
  // Scroll is best-effort: it does not grant audible autoplay permission in Safari.
  // Limit retries so a long scroll never floods the player or postpones the fallback.
  function tryScroll() {
    if (!ready || failed || !wantsPlay || !retryOnGesture || state === 'playing') return;
    const now = Date.now();
    if (scrollAttempts >= 3 || now - lastScrollAttempt < 4000) return;
    lastScrollAttempt = now;
    scrollAttempts += 1;
    start();
  }
  window.addEventListener('scroll', tryScroll, { passive: true });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) { setPanel(false); settings.focus(); return; }
    tryGesture(event);
  });
  springRadio.querySelector('.radio-actions').hidden = false;
  render(wantsPlay ? 'loading' : 'paused');
  let loadTimer;
  function loadSdk() {
    const sdk = document.createElement('script');
    sdk.src = 'https://w.soundcloud.com/player/api.js';
    sdk.onload = initMusic;
    sdk.onerror = () => { clearTimeout(loadTimer); unavailable(); };
    document.head.append(sdk);
  }
  function reloadPlayer() {
    failed = false;
    ready = false;
    render('loading');
    clearTimeout(loadTimer);
    loadTimer = setTimeout(unavailable, 30000);
    const player = document.getElementById('spring-player');
    player.src = player.src;
    // Existing bindings receive READY again when the iframe reloads.
    if (!widget) {
      if (window.SC && window.SC.Widget) initMusic();
      else loadSdk();
    }
  }
  loadTimer = setTimeout(unavailable, 30000);
  loadSdk();
}
