/* Case study pages: scroll behaviour of the section dividers.
 *
 *  - Each divider (phase title, line, logomark) is a full-width bar that pins to the top of the window while its
 *    phase scrolls past, with a solid background so everything else scrolls under it. That part is pure CSS
 *    (position: sticky in css/case-study.css). The next phase's bar replaces it when it arrives.
 *  - The logomark (where the Figma star was) turns clockwise as the visitor scrolls down and counter-clockwise
 *    as they scroll up. This file only does that.
 *
 * Not in the Figma notes, chosen here (listed for review): the logomark turns TURN_PER_PX degrees per pixel scrolled.
 * With prefers-reduced-motion the logomark stays still.
 */
(function () {
  var TURN_PER_PX = 0.2;   // logomark rotation per scrolled pixel (5 px = 1 degree)

  var root = document.documentElement;
  if (!document.querySelector('[data-divider]')) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var queued = false;

  function update() {
    queued = false;
    // The rotation follows the scroll position, so it reverses when scrolling back up
    root.style.setProperty('--cs-mark-turn', reduceMotion.matches ? '0deg' : (window.scrollY * TURN_PER_PX) + 'deg');
  }

  function queue() {
    if (!queued) { queued = true; window.requestAnimationFrame(update); }
  }

  window.addEventListener('scroll', queue, { passive: true });
  update();
})();

/* Tap to enlarge: links marked data-zoom open their image in a full-screen <dialog>.
 * Close with the button, the Escape key, or a click outside the image. Focus goes back to the link. */
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('[data-zoom]'));
  if (!links.length || typeof HTMLDialogElement === 'undefined') return; // the link then just opens the image file

  var root = document.documentElement;
  var dialog, scroller, image;

  function build() {
    if (dialog) return;
    dialog = document.createElement('dialog');
    dialog.className = 'cs-lightbox';
    dialog.setAttribute('aria-label', 'Enlarged image');

    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'cs-lightbox__close';
    close.setAttribute('aria-label', 'Close enlarged image');
    close.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

    scroller = document.createElement('div');
    scroller.className = 'cs-lightbox__scroll';
    image = document.createElement('img');
    image.className = 'cs-lightbox__img';
    scroller.appendChild(image);

    dialog.appendChild(scroller);
    dialog.appendChild(close);
    document.body.appendChild(dialog);

    close.addEventListener('click', shut);
    scroller.addEventListener('click', function (e) { if (e.target === scroller) shut(); });
    // 'cancel' fires straight away on Escape and 'close' after any close, so the page scroll lock is always released
    dialog.addEventListener('cancel', unlock);
    dialog.addEventListener('close', unlock);
  }

  function unlock() { root.classList.remove('cs-lightbox-open'); }
  function shut() { unlock(); dialog.close(); }

  function open(link) {
    build();
    var thumb = link.querySelector('img');
    image.src = link.getAttribute('href');
    image.alt = thumb ? thumb.alt : '';
    if (thumb) { image.width = thumb.getAttribute('width'); image.height = thumb.getAttribute('height'); }
    root.classList.add('cs-lightbox-open');
    dialog.showModal();
    scroller.scrollTop = 0; scroller.scrollLeft = 0;
  }

  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return; // let "open in new tab" work
      e.preventDefault();
      open(link);
    });
  });
})();

/* Back to top: the button fades in once the visitor is more than a screen down, and out again when the footer
 * is in view (a green button would disappear on the green footer). One tap scrolls smoothly to the top and moves
 * focus to the page title so keyboard and screen reader users start from the top too. */
(function () {
  var button = document.getElementById('cs-top');
  var footer = document.querySelector('.footer');
  var title = document.getElementById('cs-title');
  if (!button) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var queued = false;

  function update() {
    queued = false;
    var pastFirstScreen = window.scrollY > window.innerHeight;
    var footerInView = footer ? footer.getBoundingClientRect().top < window.innerHeight : false;
    var show = pastFirstScreen && !footerInView;
    button.hidden = false;
    button.classList.toggle('is-visible', show);
    button.tabIndex = show ? 0 : -1;
    button.setAttribute('aria-hidden', show ? 'false' : 'true');
  }

  function queue() {
    if (!queued) { queued = true; window.requestAnimationFrame(update); }
  }

  button.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    if (title) title.focus({ preventScroll: true });
  });
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  update();
})();
