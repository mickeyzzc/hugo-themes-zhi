document.addEventListener('DOMContentLoaded', function() {
  if (document.body.hasAttribute('data-feature-theme-switch')) {
    var script = document.createElement('script');
    script.src = '/js/theme-toggle.js';
    script.defer = true;
    document.head.appendChild(script);
  }

  const pageContent = document.body.innerText;
  const hasInlineMath = /\$[^\$]+\$/.test(pageContent);
  const hasDisplayMath = /\$\$[\s\S]*?\$\$/.test(pageContent);
  const hasMathContent = hasInlineMath || hasDisplayMath;
  
  if (!hasMathContent) {
    initMermaidIfNeeded();
    return;
  }
  
  if (window.MathJax) {
    initMermaidIfNeeded();
    return;
  }
  
  const mathJaxConfig = document.createElement('script');
  mathJaxConfig.textContent = 'MathJax={tex:{inlineMath:[["$","$"],["\\\\(","\\\\)"]],displayMath:[["$$","$$"],["\\\\[","\\\\]"]],processEscapes:true,processEnvironments:true},options:{skipHtmlTags:["script","noscript","style","textarea","pre"]}};';
  document.head.appendChild(mathJaxConfig);
  
  const mathJaxScript = document.createElement('script');
  mathJaxScript.id = 'MathJax-script';
  mathJaxScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
  mathJaxScript.async = true;
  mathJaxScript.addEventListener('load', function() {
    if (window.MathJax) {
      initMermaidIfNeeded();
    } else {
      initMermaidIfNeeded();
    }
  });
  mathJaxScript.addEventListener('error', function() {
    initMermaidIfNeeded();
  });
  document.head.appendChild(mathJaxScript);
});

function initMermaidIfNeeded() {
  const hasMermaidCode = document.querySelector('code.language-mermaid, pre.mermaid');
  if (!hasMermaidCode) return;
  if (!window.mermaid) return;

  const isDark = document.querySelector('[data-theme="dark"]');
  window.mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    theme: isDark ? 'dark' : 'default'
  });

  const mermaidBlocks = document.querySelectorAll('code.language-mermaid');

  mermaidBlocks.forEach(function(block) {
    const code = block.textContent;
    const pre = document.createElement('pre');
    pre.className = 'mermaid';
    pre.textContent = code;

    const wrapper = block.closest('.code-block-wrapper');
    if (wrapper) {
      wrapper.replaceWith(pre);
    } else {
      block.replaceWith(pre);
    }
  });

  window.mermaid.run();

  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      setTimeout(reinitMermaidForTheme, 100);
    });
  }
}

function reinitMermaidForTheme() {
  const mermaidBlocks = document.querySelectorAll('.mermaid');
  if (mermaidBlocks.length === 0) return;
  if (!window.mermaid) return;

  const isDark = document.querySelector('[data-theme="dark"]');
  window.mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    theme: isDark ? 'dark' : 'default'
  });
  window.mermaid.run();
}
