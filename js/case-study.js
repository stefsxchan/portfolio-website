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
