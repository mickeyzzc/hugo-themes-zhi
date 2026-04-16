(function() {
  'use strict';

  function getFeatures() {
    var attr = document.body.getAttribute('data-features');
    if (!attr) return {};
    try { return JSON.parse(attr); } catch (e) { return {}; }
  }

  function initMermaid() {
    var hasMermaidCode = document.querySelector('code.language-mermaid, pre.mermaid');
    if (!hasMermaidCode || !window.mermaid) return;

    var isDark = document.querySelector('[data-theme="dark"]');
    window.mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      theme: isDark ? 'dark' : 'default',
      themeVariables: isDark ? {
        darkMode: true,
        background: '#1e1e2e',
        primaryColor: '#45475a',
        primaryTextColor: '#cdd6f4',
        primaryBorderColor: '#585b70',
        lineColor: '#a6adc8',
        secondaryColor: '#313244',
        tertiaryColor: '#181825',
        nodeTextColor: '#cdd6f4',
        mainBkg: '#313244',
        nodeBorder: '#585b70',
        clusterBkg: '#181825',
        clusterBorder: '#45475a',
        titleColor: '#cdd6f4',
        edgeLabelBackground: '#1e1e2e',
        textColor: '#cdd6f4'
      } : {}
    });

    document.querySelectorAll('code.language-mermaid').forEach(function(block) {
      var pre = document.createElement('pre');
      pre.className = 'mermaid';
      pre.textContent = block.textContent;
      var wrapper = block.closest('.code-block-wrapper');
      if (wrapper) { wrapper.replaceWith(pre); }
      else { block.replaceWith(pre); }
    });

    window.mermaid.run();

    var toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', function() {
        setTimeout(function() {
          if (!window.mermaid) return;
          var dark = document.querySelector('[data-theme="dark"]');
          window.mermaid.initialize({ startOnLoad: false, securityLevel: 'loose', theme: dark ? 'dark' : 'default', themeVariables: dark ? {
            darkMode: true, background: '#1e1e2e', primaryColor: '#45475a', primaryTextColor: '#cdd6f4', primaryBorderColor: '#585b70', lineColor: '#a6adc8', secondaryColor: '#313244', tertiaryColor: '#181825', nodeTextColor: '#cdd6f4', mainBkg: '#313244', nodeBorder: '#585b70', clusterBkg: '#181825', clusterBorder: '#45475a', titleColor: '#cdd6f4', edgeLabelBackground: '#1e1e2e', textColor: '#cdd6f4'
          } : {} });
          window.mermaid.run();
        }, 100);
      });
    }
  }

  function initMathJax() {
    var content = document.body.innerText;
    var hasMath = /\$[^\$]+\$/.test(content) || /\$\$[\s\S]*?\$\$/.test(content);
    if (!hasMath || window.MathJax) { initMermaid(); return; }

    var cfg = document.createElement('script');
    cfg.textContent = 'MathJax={tex:{inlineMath:[["$","$"],["\\\\(","\\\\)"]],displayMath:[["$$","$$"],["\\\\[","\\\\]"]],processEscapes:true,processEnvironments:true},options:{skipHtmlTags:["script","noscript","style","textarea","pre"]}};';
    document.head.appendChild(cfg);

    var script = document.createElement('script');
    script.id = 'MathJax-script';
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script.async = true;
    script.addEventListener('load', initMermaid);
    script.addEventListener('error', initMermaid);
    document.head.appendChild(script);
  }

  function initNavToggle() {
    var toggle = document.querySelector('.nav-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', function() {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
  }

  function init() {
    var features = getFeatures();
    initNavToggle();
    if (features.mathJax) { initMathJax(); }
    else if (features.mermaid) { initMermaid(); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
