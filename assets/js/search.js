(function() {
  'use strict';

  var index = null;
  var indexLoaded = false;
  var overlay, input, results;
  var activeIndex = -1;
  var debounceTimer = null;

  function loadIndex(callback) {
    if (indexLoaded) {
      callback();
      return;
    }
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/searchindexes.json', true);
    xhr.responseType = 'text';
    xhr.onload = function() {
      if (xhr.status !== 200) return;
      try {
        index = JSON.parse(xhr.responseText);
        indexLoaded = true;
        callback();
      } catch (e) {
        return;
      }
    };
    xhr.send();
  }

  function search(query) {
    if (!index || !query) return [];
    var q = query.toLowerCase();
    var results = [];
    for (var i = 0; i < index.length; i++) {
      var item = index[i];
      var titleMatch = item.title.toLowerCase().indexOf(q) !== -1;
      var contentMatch = item.content.toLowerCase().indexOf(q) !== -1;
      var tagMatch = item.tags.some(function(t) { return t.toLowerCase().indexOf(q) !== -1; });
      if (titleMatch || contentMatch || tagMatch) {
        var score = 0;
        if (titleMatch) score += 10;
        if (tagMatch) score += 5;
        if (contentMatch) score += 1;
        results.push({ item: item, score: score, titleMatch: titleMatch, contentMatch: contentMatch, tagMatch: tagMatch });
      }
    }
    results.sort(function(a, b) { return b.score - a.score; });
    return results;
  }

  function highlight(text, query) {
    if (!query) return text;
    var escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var re = new RegExp('(' + escaped + ')', 'gi');
    return text.replace(re, '<mark>$1</mark>');
  }

  function getSnippet(content, query, len) {
    len = len || 120;
    var lower = content.toLowerCase();
    var idx = lower.indexOf(query.toLowerCase());
    if (idx === -1) return content.substring(0, len) + (content.length > len ? '...' : '');
    var start = Math.max(0, idx - 40);
    var end = Math.min(content.length, idx + query.length + len - 40);
    var snippet = (start > 0 ? '...' : '') + content.substring(start, end) + (end < content.length ? '...' : '');
    return snippet;
  }

  function renderResults(matches, query) {
    if (!query) {
      results.innerHTML = '';
      return;
    }
    if (matches.length === 0) {
      results.innerHTML = '<div class="search-no-results">No results found for "' + escapeHTML(query) + '"</div>';
      return;
    }
    var html = '';
    var limit = Math.min(matches.length, 20);
    for (var i = 0; i < limit; i++) {
      var m = matches[i];
      var item = m.item;
      var snippet = m.contentMatch ? getSnippet(item.content, query) : '';
      html += '<a href="' + escapeAttr(item.url) + '" class="search-result-item" data-index="' + i + '">';
      html += '<div class="search-result-title">' + highlight(escapeHTML(item.title), query) + '</div>';
      if (snippet) {
        html += '<div class="search-result-snippet">' + highlight(escapeHTML(snippet), query) + '</div>';
      }
      if (item.categories && item.categories.length > 0) {
        html += '<div class="search-result-meta">' + escapeHTML(item.categories.join(', ')) + '</div>';
      }
      html += '</a>';
    }
    results.innerHTML = html;
    activeIndex = -1;
  }

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function openSearch() {
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    input.value = '';
    results.innerHTML = '';
    activeIndex = -1;
    document.body.style.overflow = 'hidden';
    loadIndex(function() {
      input.focus();
    });
  }

  function closeSearch() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    input.value = '';
    results.innerHTML = '';
    activeIndex = -1;
    document.body.style.overflow = '';
  }

  function setActiveItem(index) {
    var items = results.querySelectorAll('.search-result-item');
    items.forEach(function(item) { item.classList.remove('active'); });
    if (index >= 0 && index < items.length) {
      items[index].classList.add('active');
      items[index].scrollIntoView({ block: 'nearest' });
    }
    activeIndex = index;
  }

  function handleInput() {
    var query = input.value.trim();
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function() {
      var matches = search(query);
      renderResults(matches, query);
    }, 300);
  }

  function handleKeydown(e) {
    var items = results.querySelectorAll('.search-result-item');
    if (e.key === 'Escape') {
      e.preventDefault();
      closeSearch();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      var next = activeIndex + 1;
      if (next >= items.length) next = items.length - 1;
      setActiveItem(next);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      var prev = activeIndex - 1;
      if (prev < 0) prev = 0;
      setActiveItem(prev);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < items.length) {
        items[activeIndex].click();
      } else if (items.length > 0) {
        items[0].click();
      }
    }
  }

  function init() {
    overlay = document.getElementById('search-overlay');
    if (!overlay) return;
    input = document.getElementById('search-input');
    results = document.getElementById('search-results');

    var toggle = document.getElementById('search-toggle');
    if (toggle) {
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        openSearch();
      });
    }

    var close = document.getElementById('search-close');
    if (close) {
      close.addEventListener('click', function(e) {
        e.preventDefault();
        closeSearch();
      });
    }

    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeSearch();
    });

    input.addEventListener('input', handleInput);
    input.addEventListener('keydown', handleKeydown);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closeSearch();
        return;
      }
      var activeEl = document.activeElement;
      var isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable);
      if (isInput) return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      } else if (e.key === '/') {
        e.preventDefault();
        openSearch();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
