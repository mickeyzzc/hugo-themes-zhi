(function() {
  'use strict';

  function init() {
    var switcher = document.querySelector('.lang-switcher');
    if (!switcher) return;
    var toggle = switcher.querySelector('.lang-toggle');
    if (!toggle) return;

    // Toggle the dropdown on click. The dropdown's visibility is driven by
    // aria-expanded in lang-switch.css; :hover/:focus-within alone are
    // unreliable on touch devices, making the language switcher effectively
    // unusable on mobile without this handler.
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });

    // Close when a language link is chosen.
    switcher.querySelectorAll('.lang-dropdown a').forEach(function(link) {
      link.addEventListener('click', function() {
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click.
    document.addEventListener('click', function(e) {
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      if (!switcher.contains(e.target)) {
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape.
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
