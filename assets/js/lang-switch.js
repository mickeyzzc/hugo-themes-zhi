(function() {
  'use strict';

  function init() {
    // Bind every instance (header + floating .fab-group copy)
    document.querySelectorAll('.lang-switcher').forEach(function(switcher) {
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
    });
  }

  // Suggestion banner: when the browser's preferred UI language doesn't match
  // the page language, offer the translation once. Copy is written in the
  // *target* language so the reader can understand it. Dismissal is permanent
  // per browser. Pure client-side detection (navigator.language) — no geo/IP
  // lookup, no auto-redirect.
  function initLangHint() {
    var STORAGE_KEY = 'langHintDismissed';
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch (e) { return; }

    var altLink = document.querySelector('.lang-dropdown a[rel="alternate"]');
    if (!altLink) return;

    var pageLang = (document.documentElement.lang || '').toLowerCase();
    var browserLang = ((navigator.languages && navigator.languages[0]) || navigator.language || '').toLowerCase();
    if (!pageLang || !browserLang) return;

    // This site is zh/en only; treat "starts with zh" as the split.
    var pageIsZh = pageLang.indexOf('zh') === 0;
    var browserIsZh = browserLang.indexOf('zh') === 0;
    if (pageIsZh === browserIsZh) return;

    var copy = {
      en: { text: 'This page is also available in English.', switch: 'Switch to English', dismiss: 'Dismiss' },
      zh: { text: '本页也提供中文版。', switch: '切换到中文', dismiss: '关闭' }
    };
    var targetIsZh = altLink.getAttribute('lang').toLowerCase().indexOf('zh') === 0;
    var t = copy[targetIsZh ? 'zh' : 'en'];

    var banner = document.createElement('div');
    banner.className = 'lang-hint';
    banner.setAttribute('role', 'status');

    var text = document.createElement('span');
    text.className = 'lang-hint__text';
    text.textContent = t.text;

    var link = document.createElement('a');
    link.className = 'lang-hint__switch';
    link.href = altLink.getAttribute('href');
    link.textContent = t.switch;

    var close = document.createElement('button');
    close.className = 'lang-hint__close';
    close.type = 'button';
    close.setAttribute('aria-label', t.dismiss);
    close.textContent = '\u00d7';
    close.addEventListener('click', function() {
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
      banner.parentNode.removeChild(banner);
    });

    banner.appendChild(text);
    banner.appendChild(link);
    banner.appendChild(close);
    document.body.appendChild(banner);

    // Fade/slide in (see .lang-hint in lang-switch.css).
    requestAnimationFrame(function() {
      banner.classList.add('lang-hint--visible');
    });
  }

  function boot() {
    init();
    initLangHint();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
