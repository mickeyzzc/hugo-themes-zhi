(function() {
  'use strict';

  var overlay = null;
  var img = null;
  var closeBtn = null;

  function createOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'lb-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Image lightbox');
    overlay.setAttribute('aria-hidden', 'true');

    img = document.createElement('img');
    img.className = 'lb-image';

    closeBtn = document.createElement('button');
    closeBtn.className = 'lb-close';
    closeBtn.setAttribute('aria-label', 'Close lightbox');
    closeBtn.innerHTML = '×';

    overlay.appendChild(img);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function(e) {
      if (e.target === overlay || e.target === closeBtn) close();
    });
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && overlay.classList.contains('lb-active')) close();
    });
  }

  function open(src, alt) {
    if (!overlay) createOverlay();
    img.src = src || '';
    img.alt = alt || '';
    overlay.classList.add('lb-active');
    document.body.classList.add('lightbox-open');
    closeBtn.focus();
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('lb-active');
    document.body.classList.remove('lightbox-open');
    setTimeout(function() { img.src = ''; }, 300);
  }

  function init() {
    var articleImages = document.querySelectorAll('article img, .post-content img, .article-content img');
    articleImages.forEach(function(image) {
      image.style.cursor = 'zoom-in';
      image.addEventListener('click', function() {
        var fullSrc = image.getAttribute('src');
        var alt = image.getAttribute('alt') || '';
        if (fullSrc) open(fullSrc, alt);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.Lightbox = { open: open, close: close };
})();
