(function() {
  'use strict';
  function init() {
    var bar = document.getElementById('reading-progress-bar');
    var container = document.getElementById('reading-progress');
    if (!bar || !container) return;

    var ticking = false;
    function updateProgress() {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progress = Math.min(100, Math.max(0, progress));
      bar.style.width = progress + '%';
      container.setAttribute('aria-valuenow', Math.round(progress));
      ticking = false;
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });

    updateProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
