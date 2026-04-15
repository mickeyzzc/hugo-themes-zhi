(function() {
  'use strict';
  function init() {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebar-overlay');
    if (!sidebar || !overlay) return;

    function open() {
      sidebar.classList.add('open');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Toggle via header nav-toggle button on mobile
    var navToggle = document.querySelector('.nav-toggle');
    if (navToggle && window.innerWidth < 1024) {
      navToggle.addEventListener('click', function() {
        if (sidebar.classList.contains('open')) { close(); }
        else { open(); }
      });
    }

    overlay.addEventListener('click', close);

    // Close on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) { close(); }
    });

    // Reset on resize to desktop
    window.addEventListener('resize', function() {
      if (window.innerWidth >= 1024) { close(); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
