/**
 * graphics-runtime.js — shared helpers for the custom animation shortcodes.
 *
 * Every JS-driven shortcode (pipeline-flow, ring-buffer, sine-cancellation,
 * variable-step, blur-simulator, convergence-curve, etc.) used to re-implement
 * the same plumbing: requestAnimationFrame loop, IntersectionObserver start/stop,
 * ResizeObserver + devicePixelRatio scaling, and prefers-reduced-motion handling.
 * This module factors that out so each shortcode keeps only its own draw logic.
 *
 * Exposed as window.MiBeeGraphics (script is loaded once per page, only when the
 * page contains a shortcode). Each helper is opt-in — shortcodes adopt it one at
 * a time; the ones that have not are unaffected.
 *
 * Usage patterns (see migrated shortcodes for full examples):
 *
 *   // Pattern A — continuous canvas redraw (pipeline-flow style):
 *   var gfx = window.MiBeeGraphics;
 *   var cvs = gfx.setupCanvas(canvas, function (ctx, w, h, dpr) { /* resize *\/ });
 *   gfx.runWhenVisible(canvas, {
 *     draw: function () { /* redraw using ctx *\/ },
 *     update: function (dt) { /* advance particles *\/ }
 *   });
 *
 *   // Pattern B — time-based phase loop (ring-buffer style):
 *   gfx.phaseLoop(element, 12000, {
 *     phases: 10, starts: [0, .1, .22, ...],
 *     enter: function (phase) { /* once on phase entry *\/ },
 *     update: function (phase, progress) { /* every frame *\/ }
 *   });
 *
 *   // Pattern C — raw RAF bound to visibility (convergence-curve style):
 *   gfx.runWhenVisible(el, { draw: function () { ... } });
 */
(function () {
  'use strict';

  if (window.MiBeeGraphics) return; // load once

  /** Material Design palette, aligned with the AGENTS.md diagram color rules. */
  var COLORS = {
    green: '#4CAF50',   // success / output / done
    blue: '#2196F3',    // process / device / signal
    orange: '#FF9800',  // warning / intermediate / start
    purple: '#9C27B0',  // special / processor
    red: '#f44336'      // problem / error / noise
  };

  var reducedMQ = window.matchMedia('(prefers-reduced-motion: reduce)');

  /** True when the user has asked for reduced motion (may change at runtime). */
  function prefersReducedMotion() {
    return reducedMQ.matches;
  }

  /**
   * Configure a canvas for crisp rendering on high-DPI screens.
   * Calls onResize(ctx, cssWidth, cssHeight, dpr) whenever the canvas is
   * (re)sized — the callback should recompute layout and reissue draw setup.
   * Returns a small handle: { ctx, getSize, redraw }.
   *
   * The canvas's CSS size drives everything; backing store is scaled by dpr.
   * A ResizeObserver keeps it in sync with its container.
   */
  function setupCanvas(canvas, onResize) {
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var W = 0, H = 0;

    function applySize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      var w = Math.floor(rect.width);
      var h = Math.floor(canvas.getAttribute('data-h') || rect.height || 0);
      if (!h) h = Math.floor(rect.height) || 180;
      if (w < 1) w = 1;
      if (h < 1) h = 1;
      W = w; H = h; dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (onResize) onResize(ctx, W, H, dpr);
    }

    applySize();
    if ('ResizeObserver' in window) {
      new ResizeObserver(applySize).observe(canvas.parentElement);
    } else {
      window.addEventListener('resize', applySize);
    }

    return {
      ctx: ctx,
      getSize: function () { return { w: W, h: H, dpr: dpr }; },
      redraw: function () { if (onResize) onResize(ctx, W, H, dpr); }
    };
  }

  /**
   * Run an animation only while `target` is on screen, and pause it when off
   * screen (saves CPU/battery). Honors prefers-reduced-motion: when set, the
   * loop is not started and `onReduce()` (if provided) is called once instead.
   *
   * opts:
   *   draw(ctx)        — called every frame to paint (Pattern A/C). Required
   *                      unless using the time-based phase loop.
   *   update(dt)       — called every frame before draw to advance state (ms).
   *   onReduce()       — optional static fallback for reduced-motion users.
   *   threshold        — IntersectionObserver threshold (default 0.2).
   *
   * Returns { start, stop } for manual control.
   */
  function runWhenVisible(target, opts) {
    opts = opts || {};
    var rafId = null;
    var inView = false;
    var last = 0;

    function frame(ts) {
      if (!inView) return;
      var dt = last ? (ts - last) : 16;
      last = ts;
      if (opts.update) opts.update(dt);
      if (opts.draw) opts.draw();
      rafId = requestAnimationFrame(frame);
    }

    function start() {
      if (prefersReducedMotion()) { if (opts.onReduce) opts.onReduce(); return; }
      if (inView) return;
      inView = true;
      last = 0;
      rafId = requestAnimationFrame(frame);
    }
    function stop() {
      inView = false;
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) start(); else stop();
        });
      }, { threshold: opts.threshold || 0.2 }).observe(target);
    } else {
      start();
    }

    // React to runtime reduced-motion changes.
    if (reducedMQ.addEventListener) {
      reducedMQ.addEventListener('change', function (e) {
        if (e.matches) stop(); else start();
      });
    }

    return { start: start, stop: stop };
  }

  /**
   * Time-based phase loop (ring-buffer / variable-step style).
   * Cycles through discrete phases over `cycleMs`, calling enter() once on each
   * phase change and update(phase, progress) every frame. Paused when off screen
   * and frozen (with onReduce) under reduced-motion.
   *
   * opts:
   *   phases         — number of phases (0 .. phases-1).
   *   starts         — array of normalized start times (0..1) per phase, ascending.
   *   enter(phase)   — called once when a new phase is entered.
   *   update(phase, progress) — called every frame with current phase + overall progress.
   *   onReduce()     — optional static fallback for reduced-motion users.
   *   threshold      — IntersectionObserver threshold (default 0.2).
   */
  function phaseLoop(target, cycleMs, opts) {
    opts = opts || {};
    var phases = opts.phases || (opts.starts ? opts.starts.length : 0);
    var starts = opts.starts || [];
    var rafId = null, startTime = 0, lastPhase = -1, inView = false;

    function phaseAt(progress) {
      for (var p = phases - 1; p >= 0; p--) {
        if (progress >= starts[p]) return p;
      }
      return 0;
    }

    function tick(ts) {
      if (!inView) return;
      if (!startTime) startTime = ts;
      var progress = ((ts - startTime) % cycleMs) / cycleMs;
      var phase = phaseAt(progress);
      if (phase !== lastPhase) { lastPhase = phase; if (opts.enter) opts.enter(phase); }
      if (opts.update) opts.update(phase, progress);
      rafId = requestAnimationFrame(tick);
    }

    function start() {
      if (prefersReducedMotion()) { if (opts.onReduce) opts.onReduce(); return; }
      if (inView) return;
      inView = true;
      startTime = 0; lastPhase = -1;
      rafId = requestAnimationFrame(tick);
    }
    function stop() {
      inView = false;
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) start(); else stop();
        });
      }, { threshold: opts.threshold || 0.2 }).observe(target);
    } else {
      start();
    }

    if (reducedMQ.addEventListener) {
      reducedMQ.addEventListener('change', function (e) {
        if (e.matches) stop(); else start();
      });
    }

    return { start: start, stop: stop };
  }

  window.MiBeeGraphics = {
    COLORS: COLORS,
    prefersReducedMotion: prefersReducedMotion,
    setupCanvas: setupCanvas,
    runWhenVisible: runWhenVisible,
    phaseLoop: phaseLoop
  };
})();
