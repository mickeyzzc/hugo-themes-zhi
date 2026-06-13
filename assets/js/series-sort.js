/**
 * Series sort toggle — reorders series items client-side
 * Default: descending (latest first), with toggle to ascending (reading order)
 * Persists preference in localStorage
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'series-sort-order';

  function init() {
    var toggle = document.getElementById('series-sort-toggle');
    var stepper = document.getElementById('series-stepper');
    if (!toggle || !stepper) return;

    // Read saved order, default to 'desc' (latest first)
    var order = 'desc';
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'asc' || saved === 'desc') order = saved;
    } catch (e) {}

    applyOrder(order);

    toggle.addEventListener('click', function () {
      order = order === 'desc' ? 'asc' : 'desc';
      try { localStorage.setItem(STORAGE_KEY, order); } catch (e) {}
      applyOrder(order);
    });

    function applyOrder(ord) {
      var items = Array.prototype.slice.call(
        stepper.querySelectorAll('.series-stepper__item')
      );

      items.sort(function (a, b) {
        var wA = parseInt(a.getAttribute('data-weight'), 10) || 0;
        var wB = parseInt(b.getAttribute('data-weight'), 10) || 0;
        return ord === 'desc' ? wB - wA : wA - wB;
      });

      // Re-append in sorted order and update step numbers
      items.forEach(function (item, i) {
        stepper.appendChild(item);
        var num = item.querySelector('.series-stepper__number');
        if (num) num.textContent = i + 1;
      });

      // Update toggle UI
      toggle.setAttribute('data-current-order', ord);
      var label = toggle.querySelector('.series-sort-toggle__label');
      if (label) {
        var key = ord === 'desc' ? 'data-order-label-desc' : 'data-order-label-asc';
        label.textContent = toggle.getAttribute(key);
      }

      // Toggle icon visibility
      var iconDesc = toggle.querySelector('.series-sort-toggle__icon-desc');
      var iconAsc = toggle.querySelector('.series-sort-toggle__icon-asc');
      if (iconDesc) iconDesc.style.display = ord === 'desc' ? '' : 'none';
      if (iconAsc) iconAsc.style.display = ord === 'asc' ? '' : 'none';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
