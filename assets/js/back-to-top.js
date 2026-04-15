(function() {
  'use strict';
  function init() {
    var btn = document.getElementById('back-to-top');
    var percentEl = document.getElementById('back-to-top-percent');
    if (!btn) return;

    var ticking = false;
    function onScroll() {
      var scrollTop = window.scrollY;
      if (scrollTop > 300) {
        btn.removeAttribute('hidden');
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
        // Don't re-hide immediately, let transition finish
        setTimeout(function() {
          if (window.scrollY <= 300) { btn.setAttribute('hidden', ''); }
        }, 300);
      }
      if (percentEl) {
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var percent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
        percentEl.textContent = percent + '%';
      }
      ticking = false;
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });

    btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    onScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
