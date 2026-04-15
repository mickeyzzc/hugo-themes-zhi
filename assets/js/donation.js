(function() {
  'use strict';
  function init() {
    var btn = document.getElementById('donation-btn');
    var modal = document.getElementById('donation-modal');
    if (!btn || !modal) return;

    var overlay = document.getElementById('donation-modal-overlay');
    var closeBtn = document.getElementById('donation-modal-close');
    var tabs = modal.querySelectorAll('.donation-modal__tab');
    var qrItems = modal.querySelectorAll('.donation-modal__qr-item');

    function openModal() {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    }

    function closeModal() {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }

    btn.addEventListener('click', openModal);
    if (overlay) overlay.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeModal();
    });

    // Tab switching
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        tabs.forEach(function(t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var target = tab.getAttribute('data-tab');
        qrItems.forEach(function(item) { item.classList.add('hidden'); });
        var targetEl = document.getElementById('donation-qr-' + target);
        if (targetEl) targetEl.classList.remove('hidden');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
