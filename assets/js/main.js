(function() {
  'use strict';

  function getFeatures() {
    var attr = document.body.getAttribute('data-features');
    if (!attr) return {};
    try { return JSON.parse(attr); } catch (e) { return {}; }
  }

  var lightThemeVars = {
    background: '#FAFAFA',
    primaryColor: '#EDE9F6',
    primaryBorderColor: '#D5CFF0',
    primaryTextColor: '#1A1A2E',
    lineColor: '#B8B0CC',
    secondaryColor: '#F3F0F6',
    tertiaryColor: '#FAFAFA',
    textColor: '#1A1A2E',
    nodeTextColor: '#1A1A2E',
    nodeBorder: '#D5CFF0',
    mainBkg: '#EDE9F6',
    clusterBkg: '#F3F0F6',
    clusterBorder: '#D5CFF0',
    edgeLabelBackground: '#FAFAFA',
    titleColor: '#1A1A2E',
    fontSize: '14px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  var darkThemeVars = {
    darkMode: true,
    background: '#1e1e2e',
    primaryColor: '#313244',
    primaryBorderColor: '#45475a',
    primaryTextColor: '#cdd6f4',
    lineColor: '#6c7086',
    secondaryColor: '#181825',
    tertiaryColor: '#11111b',
    textColor: '#cdd6f4',
    nodeTextColor: '#cdd6f4',
    nodeBorder: '#45475a',
    mainBkg: '#313244',
    clusterBkg: '#181825',
    clusterBorder: '#45475a',
    edgeLabelBackground: '#1e1e2e',
    titleColor: '#cdd6f4',
    fontSize: '14px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  var mermaidDefs = [];

  /* ---------- Click-to-zoom modal ----------
   * The in-page diagram is always rendered complete (CSS scales the SVG to the
   * column, never crops). Clicking opens a full-screen modal showing the SAME
   * complete diagram at the largest size that fits the viewport, with wheel /
   * button zoom and drag pan so fine text can be read.
   */
  var mermaidModal = null;
  var mermaidModalZoom = null;
  var mermaidModalState = { scale: 1, x: 0, y: 0, stage: null };

  function ensureMermaidModal() {
    if (mermaidModal) return mermaidModal;
    mermaidModal = document.createElement('div');
    mermaidModal.className = 'mermaid-modal';
    mermaidModal.setAttribute('role', 'dialog');
    mermaidModal.setAttribute('aria-modal', 'true');
    mermaidModal.innerHTML =
      '<div class="mermaid-modal__stage">' +
        '<div class="mermaid-modal__zoom"></div>' +
      '</div>' +
      '<div class="mermaid-modal__toolbar">' +
        '<button class="mermaid-modal__btn" data-zoom="in" aria-label="放大">+</button>' +
        '<button class="mermaid-modal__btn" data-zoom="out" aria-label="缩小">−</button>' +
        '<button class="mermaid-modal__btn" data-zoom="reset" aria-label="重置">↺</button>' +
        '<button class="mermaid-modal__btn" data-zoom="close" aria-label="关闭">✕</button>' +
      '</div>' +
      '<div class="mermaid-modal__hint">滚轮缩放 · 拖动平移 · ESC 关闭</div>';
    document.body.appendChild(mermaidModal);
    mermaidModalZoom = mermaidModal.querySelector('.mermaid-modal__zoom');
    mermaidModalState.stage = mermaidModal.querySelector('.mermaid-modal__stage');

    function setZoom(action) {
      var s = mermaidModalState.scale;
      if (action === 'in') s = Math.min(s * 1.25, 6);
      else if (action === 'out') s = Math.max(s / 1.25, 0.3);
      else if (action === 'reset') { s = 1; mermaidModalState.x = 0; mermaidModalState.y = 0; }
      mermaidModalState.scale = s;
      applyMermaidTransform();
    }

    mermaidModal.addEventListener('click', function(e) {
      var btn = e.target.closest('[data-zoom]');
      if (btn) {
        var z = btn.getAttribute('data-zoom');
        if (z === 'close') closeMermaidModal();
        else setZoom(z);
        return;
      }
      // Click on empty backdrop closes.
      if (e.target === mermaidModal || e.target.classList.contains('mermaid-modal__stage') ||
          e.target.classList.contains('mermaid-modal__zoom')) {
        closeMermaidModal();
      }
    });

    // Wheel zoom centered on cursor.
    mermaidModal.addEventListener('wheel', function(e) {
      e.preventDefault();
      var st = mermaidModalState;
      var factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      var ns = Math.min(Math.max(st.scale * factor, 0.3), 6);
      var rect = st.stage.getBoundingClientRect();
      var cx = e.clientX - rect.left - rect.width / 2;
      var cy = e.clientY - rect.top - rect.height / 2;
      var ratio = ns / st.scale;
      st.x = cx - (cx - st.x) * ratio;
      st.y = cy - (cy - st.y) * ratio;
      st.scale = ns;
      applyMermaidTransform();
    }, { passive: false });

    // Pointer drag pan (works for mouse + touch).
    var dragging = false, lastX = 0, lastY = 0;
    mermaidModal.addEventListener('pointerdown', function(e) {
      if (e.target.closest('[data-zoom]')) return;
      dragging = true; lastX = e.clientX; lastY = e.clientY;
      try { mermaidModal.setPointerCapture(e.pointerId); } catch (_) {}
    });
    mermaidModal.addEventListener('pointermove', function(e) {
      if (!dragging) return;
      mermaidModalState.x += e.clientX - lastX;
      mermaidModalState.y += e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      applyMermaidTransform();
    });
    mermaidModal.addEventListener('pointerup', function(e) {
      dragging = false;
      try { mermaidModal.releasePointerCapture(e.pointerId); } catch (_) {}
    });
    mermaidModal.addEventListener('pointercancel', function() { dragging = false; });

    document.addEventListener('keydown', function(e) {
      if (!mermaidModal.classList.contains('mermaid-modal--open')) return;
      if (e.key === 'Escape') closeMermaidModal();
      else if (e.key === '+' || e.key === '=') setZoom('in');
      else if (e.key === '-' || e.key === '_') setZoom('out');
      else if (e.key === '0') setZoom('reset');
    });

    return mermaidModal;
  }

  function applyMermaidTransform() {
    if (!mermaidModalZoom) return;
    var st = mermaidModalState;
    mermaidModalZoom.style.transform =
      'translate(' + st.x + 'px,' + st.y + 'px) scale(' + st.scale + ')';
  }

  // Clone the source SVG into the modal and make it fill the stage while
  // preserving its aspect ratio (object-fit:contain via viewBox). We strip the
  // width/height attributes Mermaid emits and rely on viewBox + preserveAspectRatio
  // so the whole diagram is always visible, letterboxed within the stage.
  function loadMermaidSvg(svgSource) {
    mermaidModalZoom.innerHTML = '';
    if (!svgSource) return;
    var clone = svgSource.cloneNode(true);
    // Mermaid sets width="100%" and a pixel height; remove both so the element
    // honors its CSS size (100% of the stage) and scales by viewBox.
    clone.removeAttribute('width');
    clone.removeAttribute('height');
    clone.removeAttribute('style');
    // Guarantee contain behavior if Mermaid omitted it.
    if (!clone.getAttribute('preserveAspectRatio')) {
      clone.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    }
    mermaidModalZoom.appendChild(clone);
  }

  function openMermaidModal(svgSource) {
    var modal = ensureMermaidModal();
    loadMermaidSvg(svgSource);
    mermaidModalState.scale = 1;
    mermaidModalState.x = 0;
    mermaidModalState.y = 0;
    applyMermaidTransform();
    modal.classList.add('mermaid-modal--open');
    document.body.style.overflow = 'hidden';
  }

  function closeMermaidModal() {
    if (!mermaidModal) return;
    mermaidModal.classList.remove('mermaid-modal--open');
    document.body.style.overflow = '';
  }

  // Attach click-to-open and the expand hint. Called after every render pass.
  function enhanceMermaidContainers() {
    document.querySelectorAll('.mermaid').forEach(function(container) {
      if (container.dataset.mermaidEnhanced === '1') return;
      container.dataset.mermaidEnhanced = '1';

      var hint = document.createElement('span');
      hint.className = 'mermaid__expand';
      hint.textContent = '🔍 点击放大';
      container.appendChild(hint);

      container.addEventListener('click', function() {
        var svg = container.querySelector('svg');
        openMermaidModal(svg);
      });
    });
  }

  function fixMermaidDarkMode() {
    var isDark = document.querySelector('[data-theme="dark"]');
    if (!isDark) return;

    function parseColor(c) {
      if (!c || c === 'none' || c === 'transparent') return null;
      var m = c.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (m) return { r: parseInt(m[1]), g: parseInt(m[2]), b: parseInt(m[3]) };
      m = c.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
      if (m) return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
      return null;
    }

    function luminance(r, g, b) { return 0.299 * r + 0.587 * g + 0.114 * b; }

    // Convert RGB to HSL
    function rgbToHsl(r, g, b) {
      r /= 255; g /= 255; b /= 255;
      var max = Math.max(r, g, b), min = Math.min(r, g, b);
      var h, s, l = (max + min) / 2;
      if (max === min) { h = s = 0; }
      else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        else if (max === g) h = ((b - r) / d + 2) / 6;
        else h = ((r - g) / d + 4) / 6;
      }
      return { h: h * 360, s: s, l: l };
    }

    // Convert HSL to RGB
    function hslToRgb(h, s, l) {
      h /= 360;
      if (s === 0) { var v = Math.round(l * 255); return { r: v, g: v, b: v }; }
      function hue2rgb(p, q, t) {
        if (t < 0) t += 1; if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      }
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      return {
        r: Math.round(hue2rgb(p, q, h + 1/3) * 255),
        g: Math.round(hue2rgb(p, q, h) * 255),
        b: Math.round(hue2rgb(p, q, h - 1/3) * 255)
      };
    }

    // Darken a light color for dark mode: preserve hue, boost saturation, lower lightness
    function darkenForDarkMode(r, g, b) {
      var hsl = rgbToHsl(r, g, b);
      // Keep the hue, boost saturation to at least 0.5, clamp lightness to 0.16-0.22
      var newS = Math.max(hsl.s * 1.4, 0.5);
      if (newS > 1) newS = 1;
      var newL = Math.min(hsl.l, 0.20);
      if (newL > 0.22) newL = 0.22;
      if (newL < 0.12) newL = 0.12;
      return hslToRgb(hsl.h, newS, newL);
    }

    document.querySelectorAll('.mermaid svg .node').forEach(function(node) {
      var shapes = node.querySelectorAll('rect, path, polygon');
      shapes.forEach(function(shape) {
        // Always use computedStyle — Mermaid v11 classDef sets fill via style="... !important"
        // and inline CSS rules, both of which override setAttribute('fill', ...)
        var computedFill = window.getComputedStyle(shape).fill;
        var c = parseColor(computedFill);
        if (!c || luminance(c.r, c.g, c.b) <= 128) return;

        // Light fill detected — darken it with !important to override Mermaid's !important
        var dark = darkenForDarkMode(c.r, c.g, c.b);
        var darkFill = 'rgb(' + dark.r + ',' + dark.g + ',' + dark.b + ')';
        shape.style.setProperty('fill', darkFill, 'important');

        // Also darken the stroke if it's light
        var computedStroke = window.getComputedStyle(shape).stroke;
        var sc = parseColor(computedStroke);
        if (sc && luminance(sc.r, sc.g, sc.b) > 128) {
          var ds = darkenForDarkMode(sc.r, sc.g, sc.b);
          shape.style.setProperty('stroke', 'rgb(' + ds.r + ',' + ds.g + ',' + ds.b + ')', 'important');
        }
      });
    });
  }

  // Max retries for the "Mermaid CDN not loaded yet" poll. At 2s per attempt
  // this bounds total wait to ~30s before giving up, instead of retrying forever.
  var MERMAID_MAX_RETRIES = 15;
  var mermaidRetries = 0;

  async function initMermaid() {
    var hasMermaidCode = document.querySelector('code.language-mermaid, pre.mermaid');
    if (!hasMermaidCode) return;
    if (!window.mermaid) {
      if (mermaidRetries >= MERMAID_MAX_RETRIES) {
        console.warn('Mermaid JS failed to load after ' + MERMAID_MAX_RETRIES +
                     ' retries; diagrams will not render.');
        return;
      }
      mermaidRetries++;
      setTimeout(initMermaid, 2000);
      return;
    }

    var isDark = document.querySelector('[data-theme="dark"]');
    await window.mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      theme: 'base',
      themeVariables: isDark ? darkThemeVars : lightThemeVars
    });

    mermaidDefs = [];
    document.querySelectorAll('code.language-mermaid').forEach(function(block) {
      mermaidDefs.push(block.textContent);
      var pre = document.createElement('pre');
      pre.className = 'mermaid';
      pre.textContent = block.textContent;
      var wrapper = block.closest('.code-block-wrapper');
      if (wrapper) { wrapper.replaceWith(pre); }
      else { block.replaceWith(pre); }
    });

    await window.mermaid.run();
    fixMermaidDarkMode();
    enhanceMermaidContainers();

    var toggle = document.querySelector('#theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', async function() {
        var containers = document.querySelectorAll('.mermaid');
        if (!containers.length || !window.mermaid) return;

        containers.forEach(function(c) { c.classList.add('re-rendering'); });

        var dark = document.querySelector('[data-theme="dark"]');
        await window.mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose',
          theme: 'base',
          themeVariables: dark ? darkThemeVars : lightThemeVars
        });

        for (var i = 0; i < containers.length; i++) {
          if (mermaidDefs[i]) {
            var id = 'mermaid-svg-' + i + '-' + Date.now();
            try {
              var result = await window.mermaid.render(id, mermaidDefs[i]);
              containers[i].innerHTML = result.svg;
            } catch (e) {
              console.error('Mermaid render failed:', e);
              containers[i].textContent = mermaidDefs[i];
            }
          }
        }
        fixMermaidDarkMode();
        enhanceMermaidContainers();
        containers.forEach(function(c) { c.classList.remove('re-rendering'); });
      });
    }
  }
  function initMathJax() {
    var content = document.body.innerText;
    var hasMath = /\$[^\$]+\$/.test(content) || /\$\$[\s\S]*?\$\$/.test(content);
    if (!hasMath || window.MathJax) return;

    var cfg = document.createElement('script');
    cfg.textContent = 'MathJax={tex:{inlineMath:[["$","$"],["\\\\(","\\\\)"]],displayMath:[["$$","$$"],["\\\\[","\\\\]"]],processEscapes:true,processEnvironments:true},options:{skipHtmlTags:["script","noscript","style","textarea","pre"]}};';
    document.head.appendChild(cfg);

    var script = document.createElement('script');
    script.id = 'MathJax-script';
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script.async = true;
    document.head.appendChild(script);
  }

  function initNavToggle() {
    var toggle = document.querySelector('.nav-toggle');
    if (!toggle) return;
    // On mobile/tablet (<1024px) the hamburger drives the slide-in sidebar
    // drawer, handled by sidebar.js. Binding the aria-expanded toggle here too
    // would simultaneously drop the inline .site-nav dropdown AND open the
    // drawer — two navigation surfaces stacked on one tap. Skip on narrow
    // viewports so sidebar.js owns the button; desktop keeps this behavior.
    if (window.innerWidth < 1024) return;
    toggle.addEventListener('click', function() {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
  }

  function init() {
    var features = getFeatures();
    initNavToggle();
    // Mermaid and MathJax initialize independently. Previously Mermaid init was
    // chained as MathJax's load/error handler, so a slow CDN could stall every
    // diagram on the page. They touch different content, so parallelize them.
    if (features.mathJax) { initMathJax(); }
    if (features.mermaid) { initMermaid(); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();