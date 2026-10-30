/* ==========================================================================
   estimator.js — ballpark quote.
   Deliberately simple and conservative: it recommends a package from the
   published table and adds line items, then shows a RANGE, never a single
   number. Nothing here can promise a price the sales team hasn't seen.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.getElementById('estimator');
  if (!root) return;

  var form = root.querySelector('.estimator__form');
  var out = root.querySelector('#estOut');
  if (!form || !out) return;

  /* Same numbers as the pricing table. Keep them in sync. */
  var BASE = { s: 499, m: 999, l: 1999 };
  var TIER = { s: 'starter', m: 'pro', l: 'custom' };
  var PRODUCTS = { none: 0, ten: 0, fifty: 150, all: 450 };
  var EXTRAS = { booking: 180, blog: 250, multi: 600 };

  function L(en, zh) { return window.I18N ? I18N.pick(en, zh) : en; }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var TIER_NAME = {
    s: function () { return L('Starter', '基础版'); },
    m: function () { return L('Professional', '专业版'); },
    l: function () { return L('Custom', '定制版'); }
  };

  function money(n) {
    return '$' + n.toLocaleString('en-AU');
  }

  function read() {
    var pagesEl = form.querySelector('input[name="pages"]:checked');
    var prodEl = form.querySelector('input[name="products"]:checked');
    var extras = Array.prototype.map.call(
      form.querySelectorAll('input[name="extra"]:checked'),
      function (i) { return i.value; }
    );
    return {
      pages: pagesEl ? pagesEl.value : 's',
      products: prodEl ? prodEl.value : 'none',
      extras: extras
    };
  }

  function render() {
    var s = read();
    var base = BASE[s.pages];
    var prodAdd = PRODUCTS[s.products] || 0;
    var extraAdd = s.extras.reduce(function (a, v) { return a + (EXTRAS[v] || 0); }, 0);
    var low = base + prodAdd + extraAdd;
    var high = Math.ceil((low * 1.22) / 50) * 50;

    var rows = [];
    rows.push([
      L('Package base', '套餐基础价'),
      money(base)
    ]);
    if (prodAdd) {
      rows.push([L('Product gallery', '产品图册'), money(prodAdd)]);
    }
    s.extras.forEach(function (v) {
      if (v === 'booking') rows.push([L('Booking widget embed', '预约组件嵌入'), money(EXTRAS.booking)]);
      if (v === 'blog') rows.push([L('Blog / news section', '博客 / 资讯板块'), money(EXTRAS.blog)]);
      if (v === 'multi') rows.push([L('Second language', '第二语言'), money(EXTRAS.multi)]);
    });

    var tier = TIER[s.pages];

    out.innerHTML =
      '<span class="est-out__tier">' + TIER_NAME[s.pages]() + '</span>' +
      '<div class="est-out__price">' +
        '<span class="est-out__cur">AUD</span>' +
        '<span class="est-out__amt">' + money(low) + ' – ' + money(high) + '</span>' +
      '</div>' +
      '<p class="est-out__note">' +
        L('Excluding GST. Estimate only — the written quote comes after we see the details.',
          '不含 GST。仅为估算，正式报价在看过需求后书面给出。') +
      '</p>' +
      '<ul class="est-break">' +
        rows.map(function (r) {
          return '<li><span>' + r[0] + '</span><span>' + r[1] + '</span></li>';
        }).join('') +
      '</ul>' +
      '<a class="btn btn--primary btn--block" href="contact.html?' +
        'tier=' + encodeURIComponent(tier) +
        '&pages=' + encodeURIComponent(s.pages) +
        '&products=' + encodeURIComponent(s.products) +
        '&extras=' + encodeURIComponent(s.extras.join(',')) +
        '">' + L('Take this to the quote form', '带着这个去填报价表') + '</a>';

    /* A small kick so the number visibly reacts to the last answer. */
    var amt = out.querySelector('.est-out__amt');
    if (amt && !reduceMotion) {
      amt.classList.remove('is-bump');
      void amt.offsetWidth;
      amt.classList.add('is-bump');
    }

    /* Analytics hook, fires on every change; debounced by GA itself. */
    if (window.gtag) {
      window.gtag('event', 'estimator_change', {
        pages: s.pages,
        products: s.products,
        extras: s.extras.join(',') || 'none',
        value: low,
        currency: 'AUD'
      });
    }
  }

  form.addEventListener('change', render);
  document.addEventListener('langchange', render);
  render();
})();
