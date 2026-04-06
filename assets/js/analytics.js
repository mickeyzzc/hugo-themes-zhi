(function() {
  'use strict';

  function getDevice() {
    var width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  function sendEvent(eventName, eventData) {
    // Check DNT
    if (navigator.doNotTrack === '1') return;

    // Get config
    var config = window.ANALYTICS_CONFIG || {};
    var sampleRate = config.sampleRate || 100;

    // Check sample rate
    if (Math.random() * 100 >= sampleRate) return;

    // Check endpoint
    var endpoint = config.endpoint;
    if (!endpoint) return;

    // Build payload
    var payload = {
      event: eventName,
      page: window.location.pathname,
      title: document.title,
      referrer: document.referrer || '',
      device: getDevice(),
      screen: window.innerWidth + 'x' + window.innerHeight,
      theme: document.documentElement.getAttribute('data-theme') || 'light',
      lang: document.documentElement.lang || 'en',
      site: config.siteId || ''
    };

    // Merge additional event data
    if (eventData) {
      var key;
      for (key in eventData) {
        if (eventData.hasOwnProperty(key)) {
          payload[key] = eventData[key];
        }
      }
    }

    // Send via sendBeacon
    var blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    navigator.sendBeacon(endpoint, blob);
  }

  function initAnalytics() {
    // Send pageview event on load
    sendEvent('pageview', {});

    // Track theme switches
    var themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', function() {
        sendEvent('theme_switch', {
          to: document.documentElement.getAttribute('data-theme') || 'light'
        });
      });
    }

    // Track video platform switches
    var videoSwitchButtons = document.querySelectorAll('.video-switch-button');
    videoSwitchButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        sendEvent('video_platform_switch', {});
      });
    });

    // Track code copies
    var copyButtons = document.querySelectorAll('.copy-button');
    copyButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        sendEvent('code_copy', {});
      });
    });
  }

  // Export for main.js orchestration
  window.initAnalyticsModule = initAnalytics;

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnalytics);
  } else {
    initAnalytics();
  }
})();
