(() => {
  'use strict';

  const STATES = ['work', 'play', 'about'];
  const DEFAULT_STATE = 'work';
  const TITLES = { work: 'Work', play: 'Play', about: 'About' };

  const hero = document.getElementById('hero');
  const panels = Object.fromEntries(
    STATES.map((s) => [s, document.getElementById(`panel-${s}`)])
  );
  const navLinks = document.querySelectorAll('.nav__link');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Opening timeline (ms from page load). The word timings live in css/styles.css.
  //   200 / 1000 / 2000  words 1, 2, 3 start fading in (each also slides in from the left)
  //   3000               word 3 is fully visible (starts 2000 + 1000 fade-in)
  //   3200               word 3 has finished sliding (2000 + 1200 slide)
  //   3700               OPENING_HOLD: the three lines start fading out, and the
  //                      greeting / statement / contact / scroll arrow sequence begins
  // Hold before the fade-out = OPENING_HOLD minus 3000 (word 3 fully visible) = 700ms.
  // If you change the word start delays or the fade-in / slide times in the CSS, update this too.
  const OPENING_HOLD = 3400;

  let introDone = false;
  let hintReady = false; // the scroll arrow waits for the hero statement + contact lines
  let current = null;

  const stateFromHash = () => {
    const h = location.hash.replace('#', '').toLowerCase();
    return STATES.includes(h) ? h : DEFAULT_STATE;
  };

  function showState(state, { animate = true } = {}) {
    current = state;

    STATES.forEach((s) => {
      const panel = panels[s];
      const active = s === state;
      panel.hidden = !active;
      panel.classList.remove('is-revealed');
    });

    navLinks.forEach((a) => {
      if (a.dataset.state === state) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    document.title = `${TITLES[state]} — Stefanie Chan, UX Designer`;

    // Tiles/sections only animate once the opening has finished.
    if (introDone) reveal(panels[state], animate);
    updateHint();
  }

  function reveal(panel, animate) {
    if (!animate || reduceMotion) {
      panel.classList.add('is-revealed');
      return;
    }
    void panel.offsetWidth; // restart the CSS animation
    panel.classList.add('is-revealed');
  }

  function finishIntro() {
    if (introDone) return;
    introDone = true;
    hero.dataset.phase = 'settled';
    // The scroll arrow appears when the hero statement + contact lines start to appear:
    // --statement-delay (css/styles.css) after the lines start fading out.
    const delay = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--statement-delay')) * 1000 || 0;
    window.setTimeout(() => { hintReady = true; updateHint(); }, reduceMotion ? 0 : delay);
    // Work/Play tiles (or About sections) fade up 2800ms after the fade-out starts,
    // once the greeting, statement and contact lines have landed. They sit below the fold on landing.
    window.setTimeout(() => reveal(panels[current], true), reduceMotion ? 0 : 2800);
  }


  // Scroll hint: a floating arrow while there is more page below the viewport.
  const hint = document.getElementById('scroll-hint');
  const HINT_THRESHOLD = 80; // px of remaining content before the arrow hides

  function updateHint() {
    if (!hint) return;
    const remaining = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
    const show = hintReady && remaining > HINT_THRESHOLD;
    hint.hidden = false;
    hint.classList.toggle('is-visible', show);
    hint.tabIndex = show ? 0 : -1;
    hint.setAttribute('aria-hidden', show ? 'false' : 'true');
  }

  if (hint) {
    hint.addEventListener('click', () => {
      window.scrollBy({ top: window.innerHeight * 0.95, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    window.addEventListener('scroll', updateHint, { passive: true });
    window.addEventListener('resize', updateHint);
    window.addEventListener('load', updateHint);
    // Content height changes when states switch, images load or text reflows.
    if ('ResizeObserver' in window) new ResizeObserver(updateHint).observe(document.body);
  }

  // Email reveal. The address is assembled here (not written in the HTML or in a
  // mailto: link) so simple scrapers that only read the page source don't find it.
  const emailToggle = document.getElementById('email-toggle');
  const emailLine = document.getElementById('email-line');
  if (emailToggle && emailLine) {
    const buildAddress = () => ['stefaniec', 'gmail.com'].join('@');

    function setEmailOpen(open) {
      if (open && !emailLine.firstChild) {
        const address = buildAddress();

        // The address is a mailto: link, built here so it never appears in the page source.
        const link = document.createElement('a');
        link.className = 'contact-line__address';
        link.href = `mailto:${address}`;
        link.textContent = address;

        const copy = document.createElement('button');
        copy.type = 'button';
        copy.className = 'contact-line__copy';
        copy.textContent = 'Copy';
        copy.setAttribute('aria-label', 'Copy email address');
        copy.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(address);
          } catch {
            // Fallback for browsers/contexts without the Clipboard API
            const range = document.createRange();
            range.selectNodeContents(link);
            const sel = window.getSelection();
            sel.removeAllRanges(); sel.addRange(range);
            document.execCommand('copy');
            sel.removeAllRanges();
          }
          copy.textContent = 'Copied!';
          window.clearTimeout(copy._reset);
          copy._reset = window.setTimeout(() => { copy.textContent = 'Copy'; }, 1800);
        });

        emailLine.append('Slide into my inbox: ', link, copy);
      }
      emailLine.classList.toggle('is-open', open);
      emailToggle.setAttribute('aria-expanded', String(open));
      emailToggle.setAttribute('aria-label', open ? 'Hide my email address' : 'Show my email address');
    }

    emailToggle.addEventListener('click', () => {
      setEmailOpen(!emailLine.classList.contains('is-open'));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && emailLine.classList.contains('is-open')) {
        setEmailOpen(false);
        emailToggle.focus();
      }
    });
  }

  // Routing: URL hash is the source of truth (#work, #play, #about).
  window.addEventListener('hashchange', () => showState(stateFromHash()));

  // Clicking the logomark returns to the homepage (default Work state, top of page).
  document.querySelectorAll('[data-home]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      history.pushState(null, '', location.pathname);
      showState(DEFAULT_STATE);
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });
  window.addEventListener('popstate', () => showState(stateFromHash()));

  // Skip the opening entirely (set by the ?skip-intro flag; the class is added in <head>)
  function skipIntroNow() {
    introDone = true;
    hintReady = true;
    hero.dataset.phase = 'settled';
    panels[current].classList.add('is-revealed');
    updateHint();
    // Tidy the address bar: keep the hash, drop ?skip-intro
    history.replaceState(null, '', location.pathname + location.hash);
  }

  // Boot
  showState(stateFromHash(), { animate: false });
  if (document.documentElement.classList.contains('skip-intro')) {
    skipIntroNow();
  } else if (reduceMotion) {
    finishIntro();
  } else {
    window.setTimeout(finishIntro, OPENING_HOLD);
  }
})();
