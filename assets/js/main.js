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

  function initMermaid() {
    var hasMermaidCode = document.querySelector('code.language-mermaid, pre.mermaid');
    if (!hasMermaidCode || !window.mermaid) return;

    var isDark = document.querySelector('[data-theme="dark"]');
    window.mermaid.initialize({
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

    window.mermaid.run();

    var toggle = document.querySelector('#theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', function() {
        setTimeout(function() {
          if (!window.mermaid) return;
          var dark = document.querySelector('[data-theme="dark"]');
          window.mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'loose',
            theme: 'base',
            themeVariables: dark ? darkThemeVars : lightThemeVars
          });
          document.querySelectorAll('.mermaid').forEach(function(container, i) {
            if (mermaidDefs[i]) {
              container.removeAttribute('data-processed');
              container.innerHTML = mermaidDefs[i];
            }
          });
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
