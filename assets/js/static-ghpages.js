/* Adaptador estático para GitHub Pages (Busca, Categorias e Lazy Images) */
(function () {
  function revealLazyImages() {
    var imgs = document.querySelectorAll('img[data-src]');
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      var src = img.getAttribute('data-src');
      if (src && img.getAttribute('src') !== src) {
        img.setAttribute('src', src);
        img.classList.remove('lazy');
      }
    }
  }

  function initStaticFilter() {
    var articles = Array.prototype.slice.call(document.querySelectorAll('article.itm, article'));
    if (!articles.length) return;

    var mainContainer = articles[0].parentElement;
    var banner = document.createElement('div');
    banner.id = 'ghpages-filter-bar';
    banner.style.cssText = 'display:none;margin:0 0 16px;padding:12px 16px;border:1px solid rgba(148,163,184,0.35);border-radius:8px;font-size:14px;align-items:center;justify-content:space-between;gap:12px;';

    function applyFilter(query, modeLabel) {
      var term = (query || '').trim().toLowerCase();
      var matches = 0;

      articles.forEach(function (art) {
        var text = (art.textContent || '').toLowerCase();
        var links = Array.prototype.map.call(art.querySelectorAll('a'), function (a) {
          return ((a.getAttribute('href') || '') + ' ' + (a.textContent || '')).toLowerCase();
        }).join(' ');

        var show = !term || text.indexOf(term) !== -1 || links.indexOf(term) !== -1;
        art.style.display = show ? '' : 'none';
        if (show) matches++;
      });

      if (!term) {
        banner.style.display = 'none';
        banner.innerHTML = '';
        return;
      }

      if (!banner.parentElement && mainContainer) {
        mainContainer.insertBefore(banner, mainContainer.firstChild);
      }

      banner.style.display = 'flex';
      banner.innerHTML =
        '<span>' + modeLabel + ': <strong>' + term.replace(/</g, '&lt;') + '</strong> (' + matches + ' resultado' + (matches === 1 ? '' : 's') + ')</span>' +
        '<button type="button" id="ghpages-clear-filter" style="cursor:pointer;padding:6px 12px;border-radius:6px;border:1px solid currentColor;background:transparent;font-size:12px;font-weight:600;">Limpar filtro</button>';

      var clearBtn = document.getElementById('ghpages-clear-filter');
      if (clearBtn) {
        clearBtn.addEventListener('click', function () {
          if (window.location.hash.indexOf('#label:') === 0 || window.location.hash.indexOf('#search:') === 0) {
            history.replaceState(null, '', window.location.pathname + window.location.search);
          }
          applyFilter('', '');
        });
      }
    }

    var searchForms = document.querySelectorAll('form[action*="search"], form.srch');
    searchForms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
        var input = form.querySelector('input[type="search"], input[name="q"], input[type="text"]');
        if (input) {
          e.preventDefault();
          var val = input.value || '';
          if (val.trim()) {
            window.location.hash = 'search:' + encodeURIComponent(val.trim());
          }
          applyFilter(val, 'Busca');
        }
      });
    });

    document.addEventListener('click', function (e) {
      var target = e.target;
      while (target && target.tagName !== 'A') {
        target = target.parentElement;
      }
      if (!target) return;
      var href = target.getAttribute('href') || '';
      if (href.indexOf('#label:') === 0) {
        e.preventDefault();
        var lbl = decodeURIComponent(href.slice(7));
        window.location.hash = 'label:' + encodeURIComponent(lbl);
        applyFilter(lbl, 'Categoria');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    function checkHash() {
      var h = window.location.hash || '';
      if (h.indexOf('#label:') === 0) {
        applyFilter(decodeURIComponent(h.slice(7)), 'Categoria');
      } else if (h.indexOf('#search:') === 0) {
        applyFilter(decodeURIComponent(h.slice(8)), 'Busca');
      }
    }

    window.addEventListener('hashchange', checkHash);
    checkHash();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      revealLazyImages();
      initStaticFilter();
    });
  } else {
    revealLazyImages();
    initStaticFilter();
  }
})();
