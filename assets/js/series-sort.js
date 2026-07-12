/**
 * Series sort toggle — reorders series items client-side.
 * Server renders in ascending order (chapters by min-weight, posts by weight
 * within each chapter). This script reverses to "latest first" (desc) by
 * default, with a toggle back to "reading order" (asc).
 *
 * Two layouts are supported:
 *   - Grouped  (.series-stepper--grouped): <details class="series-chapter">
 *                panels, each containing .series-chapter__items > items.
 *                Reversing means reversing BOTH the chapter order and the
 *                item order within each chapter.
 *   - Flat     (.series-stepper): items are direct children.
 *                Reversing means reversing the direct-child item order.
 *
 * After reordering, step numbers are recomputed 1..N in document order.
 * Preference persists in localStorage.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'series-sort-order';

  function init() {
    var toggle = document.getElementById('series-sort-toggle');
    var stepper = document.getElementById('series-stepper');
    if (!toggle || !stepper) return;

    // Read saved order, default to 'desc' (latest first).
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
      var grouped = stepper.classList.contains('series-stepper--grouped');

      if (grouped) {
        // --- Grouped mode: reverse chapter order, and reverse items within
        //     each chapter. asc = leave as server-rendered; desc = reverse.
        var chapters = Array.prototype.slice.call(
          stepper.querySelectorAll(':scope > .series-chapter')
        );
        if (ord === 'desc') chapters.reverse();
        // Re-append chapters in the target order.
        chapters.forEach(function (chapter) {
          stepper.appendChild(chapter);
          var items = Array.prototype.slice.call(
            chapter.querySelectorAll(':scope > .series-chapter__items > .series-stepper__item')
          );
          if (ord === 'desc') items.reverse();
          var container = chapter.querySelector(':scope > .series-chapter__items');
          items.forEach(function (item) { container.appendChild(item); });
        });
      } else {
        // --- Flat mode: reverse direct-child items.
        var items = Array.prototype.slice.call(
          stepper.querySelectorAll(':scope > .series-stepper__item')
        );
        if (ord === 'desc') items.reverse();
        items.forEach(function (item) { stepper.appendChild(item); });
      }

      // Recompute step numbers 1..N across the whole stepper in document order.
      var allItems = stepper.querySelectorAll('.series-stepper__item');
      Array.prototype.forEach.call(allItems, function (item, i) {
        var num = item.querySelector('.series-stepper__number');
        if (num) num.textContent = i + 1;
      });

      // Update toggle UI.
      toggle.setAttribute('data-current-order', ord);
      var label = toggle.querySelector('.series-sort-toggle__label');
      if (label) {
        var key = ord === 'desc' ? 'data-order-label-desc' : 'data-order-label-asc';
        label.textContent = toggle.getAttribute(key);
      }
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
