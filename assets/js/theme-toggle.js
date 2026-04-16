(function() {
  'use strict';

  var THEME_KEY = 'theme';
  var DARK_THEME = 'dark';
  var LIGHT_THEME = 'light';
  var THEME_MANUAL_KEY = 'theme-manual';

  function getCurrentTheme() {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved) {
      return saved;
    }
    var manual = localStorage.getItem(THEME_MANUAL_KEY);
    if (manual) {
      return LIGHT_THEME;
    }
    var hour = new Date().getHours();
    if (hour >= 18 || hour < 6) {
      return DARK_THEME;
    }
    return LIGHT_THEME;
  }

  function applyTheme(theme) {
    var html = document.documentElement;
    if (theme === DARK_THEME) {
      html.setAttribute('data-theme', DARK_THEME);
    } else {
      html.removeAttribute('data-theme');
    }
    updateButtonIcon(theme);
  }

  function updateButtonIcon(theme) {
    var toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    var sunIcon = toggle.querySelector('.sun-icon');
    var moonIcon = toggle.querySelector('.moon-icon');

    if (theme === DARK_THEME) {
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
    } else {
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
    }
  }

  function toggleTheme() {
    var current = getCurrentTheme();
    var newTheme = current === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    localStorage.setItem(THEME_KEY, newTheme);
    localStorage.setItem(THEME_MANUAL_KEY, 'true');
    applyTheme(newTheme);
  }

  function handleStorageChange(e) {
    if (e.key === THEME_KEY) {
      var newTheme = e.newValue || LIGHT_THEME;
      if (!e.newValue) {
        newTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK_THEME : LIGHT_THEME;
      }
      applyTheme(newTheme);
    }
  }

  function handleSystemPreferenceChange(e) {
    if (!localStorage.getItem(THEME_KEY)) {
      var newTheme = e.matches ? DARK_THEME : LIGHT_THEME;
      applyTheme(newTheme);
    }
  }

  function init() {
    var initialTheme = getCurrentTheme();
    applyTheme(initialTheme);

    var toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', toggleTheme);
    }

    window.addEventListener('storage', handleStorageChange);

    var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemPreferenceChange);
    } else {
      mediaQuery.addListener(handleSystemPreferenceChange);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
