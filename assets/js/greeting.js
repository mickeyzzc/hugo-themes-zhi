(function() {
  'use strict';

  function getGreeting(hour) {
    var isZh = document.documentElement.lang.indexOf('zh') === 0;
    if (hour >= 6 && hour <= 11) {
      return { text: isZh ? '早上好' : 'Good morning', icon: '☀️' };
    }
    if (hour >= 12 && hour <= 13) {
      return { text: isZh ? '中午好' : 'Good noon', icon: '🌞' };
    }
    if (hour >= 14 && hour <= 17) {
      return { text: isZh ? '下午好' : 'Good afternoon', icon: '🌤️' };
    }
    return { text: isZh ? '晚上好' : 'Good evening', icon: '🌙' };
  }

  function init() {
    var textEl = document.getElementById('greeting-text');
    var iconEl = document.getElementById('greeting-icon');
    if (!textEl || !iconEl) return;

    var greeting = getGreeting(new Date().getHours());
    textEl.textContent = greeting.text;
    iconEl.textContent = greeting.icon;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
