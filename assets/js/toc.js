(function() {
  'use strict';
  function init() {
    var toc = document.getElementById('toc');
    var tocBody = document.getElementById('toc-body');
    if (!toc || !tocBody) return;

    var headings = document.querySelectorAll('.Content h2, .Content h3, .Content h4');
    if (!headings.length) return;

    // Add IDs to headings that don't have them
    headings.forEach(function(h, i) {
      if (!h.id) { h.id = 'heading-' + (i + 1); }
    });

    // Toggle collapse
    var toggle = document.getElementById('toc-toggle');
    if (toggle) {
      toggle.addEventListener('click', function() {
        var expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        toggle.classList.toggle('collapsed');
        tocBody.classList.toggle('collapsed');
      });
    }

    // Active heading tracking with IntersectionObserver
    var tocLinks = toc.querySelectorAll('a');
    var observerOptions = { rootMargin: '-80px 0px -80% 0px', threshold: 1 };

    // Auto-expand ancestor TOC items for active heading
    function expandAncestors(activeLink) {
      if (!activeLink) return;
      var li = activeLink.closest('li');
      while (li) {
        var parentLi = li.parentElement ? li.parentElement.closest('li') : null;
        if (parentLi && parentLi.querySelector(':scope > ul')) {
          parentLi.classList.add('expanded');
        }
        li = parentLi;
      }
    }

    // Collapse TOC items that don't contain the active link
    function collapseInactive(toc, activeLink) {
      var expandedItems = toc.querySelectorAll('#TableOfContents li.expanded');
      expandedItems.forEach(function(li) {
        if (!li.contains(activeLink)) {
          li.classList.remove('expanded');
        }
      });
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          tocLinks.forEach(function(link) { link.classList.remove('active'); });
          var activeLink = toc.querySelector('a[href="#' + entry.target.id + '"]');
          if (activeLink) {
            activeLink.classList.add('active');
            expandAncestors(activeLink);
            collapseInactive(toc, activeLink);
          }
        }
      });
    }, observerOptions);

    headings.forEach(function(h) { observer.observe(h); });

    // Smooth scroll on TOC link click
    toc.addEventListener('click', function(e) {
      var link = e.target.closest('a');
      if (!link) return;
      e.preventDefault();
      var target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update URL hash without jumping
        history.pushState(null, '', link.getAttribute('href'));
      }
    });

    // Collapse/expand sub-items
    if (toc.classList.contains('toc--collapsible')) {
      var parentItems = toc.querySelectorAll('#TableOfContents li');
      parentItems.forEach(function(li) {
        var subList = li.querySelector(':scope > ul');
        if (subList) {
          var link = li.querySelector(':scope > a');
          if (link) {
            link.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              li.classList.toggle('expanded');
              // Also scroll to the heading
              var target = document.querySelector(link.getAttribute('href'));
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.pushState(null, '', link.getAttribute('href'));
              }
            });
          }
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
