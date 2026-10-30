/* ==========================================================================
   site.js — shell behaviour: header, drawer, reveal, carousel,
   case filter + lightbox, contact form.
   No dependencies. Every block bails out quietly if its markup is absent.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Header: hairline once scrolled ---------------- */
  (function header() {
    var el = document.getElementById('siteHeader');
    if (!el) return;
    var ticking = false;
    function sync() {
      el.classList.toggle('is-stuck', window.scrollY > 4);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(sync);
    }, { passive: true });
    sync();
  })();

  /* ---------------- Mobile drawer ---------------- */
  (function drawer() {
    var toggle = document.getElementById('navToggle');
    var panel = document.getElementById('drawer');
    if (!toggle || !panel) return;

    function setOpen(open) {
      panel.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      panel.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) {
        var first = panel.querySelector('a, button');
        if (first) first.focus();
      }
    }

    toggle.addEventListener('click', function () {
      setOpen(!panel.classList.contains('is-open'));
    });

    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900 && panel.classList.contains('is-open')) setOpen(false);
    });
  })();

  /* ---------------- "Put your name on it" preview ---------------- */
  (function namePreview() {
    var stage = document.getElementById('pv');
    if (!stage) return;

    var nameInput = document.getElementById('pvName');
    var logo = document.getElementById('pvLogo');
    var url = document.getElementById('pvUrl');
    var links = document.getElementById('pvLinks');
    var btn = document.getElementById('pvBtn');
    var kick = document.getElementById('pvKick');
    var h = document.getElementById('pvH');
    var sub = document.getElementById('pvSub');
    var chips = Array.prototype.slice.call(document.querySelectorAll('[data-pv]'));
    if (!nameInput || !logo) return;

    /* The miniature copy stays English on purpose — it stands in for a
       client's own Australian site, which would be built in English. */
    var SKIN = {
      restaurant: {
        kick: 'Restaurant · Sydney', h: 'Wood-fired,\nfrom the beaches.',
        sub: 'A small kitchen doing big flavours. Local seafood, sourdough each morning.',
        links: 'Menu · Our story · Find us', btn: 'Book a table'
      },
      salon: {
        kick: 'Nail studio · Melbourne', h: 'Prices first,\nthen the chair.',
        sub: 'Gel, acrylic, and a proper cup of tea. Booked online, not by DM.',
        links: 'Services · Prices · Afterpay', btn: 'Book online'
      },
      hardware: {
        kick: 'Trade supplier · Brisbane', h: 'Everything the\ntrade needs.',
        sub: 'Twelve thousand lines, same-day delivery, and a counter that answers.',
        links: 'Catalogue · Trade account · Find us', btn: 'Open an account'
      },
      sports: {
        kick: 'Sports store · Perth', h: 'Fit first,\nthen the shoes.',
        sub: 'Free gait fitting with every pair. Six slots a Saturday.',
        links: 'Run · Footy · Swim · Book a fit', btn: 'Book a fit'
      },
      golf: {
        kick: 'Golf retail · Adelaide', h: 'Four brands.\nOne honest fitting.',
        sub: 'A 60-minute TrackMan session — and we will tell you if you do not need it.',
        links: 'Fitting · Pre-owned · Members', btn: 'Book a fitting'
      },
      other: {
        kick: 'Your trade · Australia', h: 'Built around\nhow you sell.',
        sub: 'Tell us how the business actually works and the site follows that.',
        links: 'Home · Services · Contact', btn: 'Get in touch'
      }
    };

    var current = 'restaurant';

    function slug(v) {
      var s = v.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 24);
      return (s || 'yourbusiness') + '.com.au';
    }

    function syncName() {
      var v = nameInput.value.trim();
      logo.textContent = v || 'Your business';
      url.textContent = slug(v);
    }

    function applySkin(style) {
      var d = SKIN[style] || SKIN.other;
      stage.setAttribute('data-pv-style', style);
      kick.textContent = d.kick;
      /* Built with text nodes rather than innerHTML so a typed name can
         never inject markup into the preview. */
      h.textContent = '';
      d.h.split('\n').forEach(function (line, i) {
        if (i) h.appendChild(document.createElement('br'));
        h.appendChild(document.createTextNode(line));
      });
      sub.textContent = d.sub;
      links.textContent = d.links;
      btn.textContent = d.btn;
      chips.forEach(function (c) {
        c.setAttribute('aria-pressed', String(c.getAttribute('data-pv') === style));
      });
      current = style;
    }

    nameInput.addEventListener('input', syncName);
    chips.forEach(function (c) {
      c.addEventListener('click', function () { applySkin(c.getAttribute('data-pv')); });
    });

    applySkin(current);
    syncName();
  })();

  /* ---------------- Scroll progress ---------------- */
  (function scrollProgress() {
    var bar = document.querySelector('.scroll-progress span');
    if (!bar) return;

    var max = 0;

    /* scrollHeight forces layout, so measure it only when the page can
       actually change height — never on every scroll tick. */
    function measure() {
      max = document.documentElement.scrollHeight - window.innerHeight;
    }

    function sync() {
      var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
    }

    /* A single style write — cheaper than an rAF round trip, and it can't
       get stuck behind a frame that never arrives. */
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', function () { measure(); sync(); });
    window.addEventListener('load', function () { measure(); sync(); });

    if ('ResizeObserver' in window) {
      new ResizeObserver(function () { measure(); sync(); }).observe(document.body);
    }

    measure();
    sync();
  })();

  /* ---------------- Hero showcase switcher ---------------- */
  (function heroShowcase() {
    var img = document.getElementById('heroShot');
    var url = document.getElementById('heroUrl');
    var wrap = document.querySelector('.hero__visual');
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.hero__tab'));
    if (!img || !url || !wrap || tabs.length < 2) return;

    var index = 0;
    var timer = null;
    var takenOver = false;
    var DELAY = 4800;

    function paint(i) {
      img.alt = tabs[i].getAttribute('data-alt') || '';
      url.textContent = tabs[i].getAttribute('data-url') || '';
      img.classList.remove('is-swapping');
      url.classList.remove('is-swapping');
      tabs.forEach(function (t, n) {
        t.setAttribute('aria-selected', String(n === i));
        t.tabIndex = n === i ? 0 : -1;
      });
      index = i;
    }

    function show(i) {
      i = (i + tabs.length) % tabs.length;
      if (i === index) return;
      var src = 'assets/img/cases/' + tabs[i].getAttribute('data-shot') + '-1080.webp';

      /* Only start the fade once the next shot is decoded, so the frame is
         never left blank waiting on the network. */
      var pre = new Image();
      var fired = false;
      function ready() {
        if (fired) return;
        fired = true;
        img.classList.add('is-swapping');
        url.classList.add('is-swapping');
        window.setTimeout(function () {
          img.src = src;
          paint(i);
        }, reduceMotion ? 0 : 170);
      }
      pre.onload = ready;
      pre.onerror = ready;
      pre.src = src;
      if (pre.complete) ready();
    }

    function stop() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }

    function start() {
      stop();
      if (takenOver || reduceMotion) return;
      timer = window.setInterval(function () { show(index + 1); }, DELAY);
    }

    tabs.forEach(function (tab, n) {
      tab.tabIndex = n === 0 ? 0 : -1;
      tab.addEventListener('click', function () {
        takenOver = true;
        stop();
        show(n);
      });
      tab.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        takenOver = true;
        stop();
        var next = (index + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        show(next);
        tabs[next].focus();
      });
    });

    wrap.addEventListener('mouseenter', stop);
    wrap.addEventListener('mouseleave', start);
    wrap.addEventListener('focusin', stop);
    wrap.addEventListener('focusout', function (e) {
      if (!wrap.contains(e.relatedTarget)) start();
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });

    /* Warm the other four once the page is quiet. */
    window.addEventListener('load', function () {
      window.setTimeout(function () {
        tabs.forEach(function (t, n) {
          if (n === 0) return;
          var im = new Image();
          im.src = 'assets/img/cases/' + t.getAttribute('data-shot') + '-1080.webp';
        });
      }, 1500);
    });

    start();
  })();

  /* ---------------- Mobile sticky CTA ---------------- */
  (function mobileCta() {
    var bar = document.getElementById('mobileCta');
    if (!bar) return;

    /* The contact page is already the call to action. */
    if (/\/contact\.html?$/.test(location.pathname)) {
      bar.remove();
      return;
    }

    document.body.classList.add('has-mobile-cta');

    var shown = null;
    function sync() {
      var show = window.scrollY > 700;
      if (show === shown) return;
      shown = show;
      bar.classList.toggle('is-in', show);
      document.body.classList.toggle('cta-visible', show);
    }
    window.addEventListener('scroll', sync, { passive: true });
    sync();
  })();

  /* ---------------- Reveal on scroll ---------------- */
  (function reveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  })();

  /* ---------------- Carousel ---------------- */
  (function carousel() {
    var root = document.getElementById('caseCarousel');
    if (!root) return;

    var track = root.querySelector('.carousel__track');
    var slides = Array.prototype.slice.call(root.querySelectorAll('.carousel__slide'));
    var prev = root.querySelector('.carousel__nav--prev');
    var next = root.querySelector('.carousel__nav--next');
    var dotsBox = root.querySelector('.dots');
    var playBtn = root.querySelector('.carousel__play');
    if (!track || slides.length < 2) return;

    var index = 0;
    var timer = null;
    var paused = reduceMotion;
    var DELAY = 4800;

    var dots = slides.map(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'dot';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', String(i === 0));
      b.setAttribute('aria-label', 'Slide ' + (i + 1));
      b.addEventListener('click', function () { go(i); restart(); });
      if (dotsBox) dotsBox.appendChild(b);
      return b;
    });

    function paint() {
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      slides.forEach(function (s, i) {
        s.setAttribute('aria-hidden', String(i !== index));
        var focusables = s.querySelectorAll('a, button');
        focusables.forEach(function (f) { f.tabIndex = i === index ? 0 : -1; });
      });
      dots.forEach(function (d, i) {
        d.setAttribute('aria-selected', String(i === index));
        d.setAttribute('aria-label', 'Slide ' + (i + 1));
      });
    }

    function go(i) {
      index = (i + slides.length) % slides.length;
      paint();
    }

    function tick() { go(index + 1); }

    function start() {
      stop();
      if (paused) return;
      timer = window.setInterval(tick, DELAY);
      if (playBtn) playBtn.setAttribute('aria-pressed', 'false');
    }

    function stop() {
      if (timer) { window.clearInterval(timer); timer = null; }
      if (playBtn) playBtn.setAttribute('aria-pressed', 'true');
    }

    function restart() { if (!paused) start(); }

    if (prev) prev.addEventListener('click', function () { go(index - 1); restart(); });
    if (next) next.addEventListener('click', function () { go(index + 1); restart(); });

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', function () { if (!paused) start(); });
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', function (e) {
      if (!root.contains(e.relatedTarget) && !paused) start();
    });

    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { go(index - 1); restart(); }
      if (e.key === 'ArrowRight') { go(index + 1); restart(); }
    });

    /* Swipe on touch — the arrows are hard to hit on a phone. */
    var touchX = 0, touchY = 0, touching = false;
    track.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) return;
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
      touching = true;
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      if (!touching) return;
      touching = false;
      var dx = e.changedTouches[0].clientX - touchX;
      var dy = e.changedTouches[0].clientY - touchY;
      if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;
      go(index + (dx < 0 ? 1 : -1));
      restart();
    }, { passive: true });

    if (playBtn) {
      playBtn.addEventListener('click', function () {
        paused = !paused;
        if (paused) stop(); else start();
      });
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else if (!paused) start();
    });

    paint();
    if (!paused) start();
  })();

  /* ---------------- Case filter + lightbox ---------------- */
  (function caseGrid() {
    var grid = document.getElementById('caseGrid');
    if (!grid) return;

    var chips = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.case'));
    var counter = document.getElementById('caseCount');
    var active = 'all';

    function setFilter(value) {
      active = value;
      var shown = 0;
      cards.forEach(function (card) {
        var match = value === 'all' || card.getAttribute('data-industry') === value;
        card.hidden = !match;
        if (match) shown += 1;
      });
      chips.forEach(function (c) {
        c.setAttribute('aria-pressed', String(c.getAttribute('data-filter') === value));
      });
      if (counter) {
        counter.textContent = I18N.pick(
          'Showing ' + shown + ' of ' + cards.length,
          '共 ' + cards.length + ' 个案例，当前显示 ' + shown + ' 个'
        );
      }
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () { setFilter(chip.getAttribute('data-filter')); });
    });

    document.addEventListener('langchange', function () { setFilter(active); });

    /* Lightbox */
    var lb = document.getElementById('lightbox');
    if (!lb) return;

    var lbImg = lb.querySelector('.lightbox__media img');
    var lbTag = lb.querySelector('[data-lb-tag]');
    var lbTitle = lb.querySelector('[data-lb-title]');
    var lbBody = lb.querySelector('[data-lb-body]');
    var lbSpecs = lb.querySelector('[data-lb-specs]');
    var closeBtn = lb.querySelector('.lightbox__close');
    var lastFocus = null;

    function open(card) {
      lastFocus = document.activeElement;
      var img = card.querySelector('img');
      if (img) {
        lbImg.src = img.currentSrc || img.src;
        lbImg.alt = img.alt || '';
        lbImg.width = img.getAttribute('width') || 1440;
        lbImg.height = img.getAttribute('height') || 900;
      }
      /* Read from the live DOM so the lightbox follows the current language. */
      var tagEl = card.querySelector('.tag');
      var titleEl = card.querySelector('.case__body h3');
      var longEl = card.querySelector('.case__long');
      var specEls = card.querySelectorAll('.case__spec-list li');
      var leftEl = card.querySelector('.case__left');

      if (lbTag && tagEl) lbTag.textContent = tagEl.textContent.trim();
      if (lbTitle && titleEl) lbTitle.textContent = titleEl.textContent.trim();
      if (lbBody && longEl) lbBody.textContent = longEl.textContent.trim();
      if (lbSpecs) {
        lbSpecs.innerHTML = '';
        Array.prototype.forEach.call(specEls, function (li) {
          var span = document.createElement('span');
          span.textContent = li.textContent.trim();
          lbSpecs.appendChild(span);
        });
      }
      var note = lb.querySelector('[data-lb-note]');
      if (note) {
        if (leftEl && leftEl.textContent.trim()) {
          note.hidden = false;
          note.innerHTML = '<b>' + I18N.pick('Left out on purpose.', '故意没做：') + '</b> ' +
            leftEl.textContent.trim();
        } else {
          note.hidden = true;
          note.textContent = '';
        }
      }
      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }

    /* The card itself is a link to the full case study; the quick-look
       button opens the preview without navigating. */
    cards.forEach(function (card) {
      var btn = card.querySelector('[data-quick]');
      if (!btn) return;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        open(card);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', close);
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.classList.contains('is-open')) close();
      if (e.key === 'Tab' && lb.classList.contains('is-open')) {
        var f = lb.querySelectorAll('button, [href], input, select, textarea');
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  })();

  /* ---------------- Contact form ---------------- */
  (function contactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    /* Where submissions go. Leave empty to run in demo mode
       (validates, shows the success panel, stores nothing). */
    var ENDPOINT = form.getAttribute('data-endpoint') || '';
    var RATE_KEY = 'ab.lastSubmit';
    var RATE_MS = 60 * 1000;

    var estimatorSummary = '';

    /* Prefill from the quote estimator: contact.html?tier=pro&pages=m&products=fifty&extras=booking,blog */
    (function prefill() {
      var params = new URLSearchParams(window.location.search);
      var tier = params.get('tier');
      if (tier) {
        var radio = form.querySelector('input[name="plan"][value="' + tier + '"]');
        if (radio) radio.checked = true;
      }
      var pages = params.get('pages');
      var products = params.get('products');
      var extras = (params.get('extras') || '').split(',').filter(Boolean);
      if (!pages && !products && !extras.length) return;

      var PAGE = { s: '1–5 pages', m: '6–10 pages', l: '11+ pages' };
      var PROD = { none: 'no product list', ten: 'up to 10 products', fifty: 'up to 50 products', all: 'unlimited products' };
      var EX = { booking: 'booking widget', blog: 'blog / news section', multi: 'second language' };
      var bits = [];
      if (pages) bits.push(PAGE[pages] || pages);
      if (products && products !== 'none') bits.push(PROD[products] || products);
      extras.forEach(function (e) { if (EX[e]) bits.push(EX[e]); });

      var brief = form.querySelector('#f-brief');
      if (brief && !brief.value.trim()) {
        brief.value = I18N.pick('From the quote estimator: ', '来自报价估算器：') + bits.join(', ') + '.';
      }
      estimatorSummary = bits.join(', ');
    })();

    var status = document.getElementById('formStatus');
    var success = document.getElementById('formSuccess');
    var submitBtn = form.querySelector('[type="submit"]');
    var submitLabel = submitBtn ? submitBtn.innerHTML : '';

    function fieldOf(input) { return input.closest('.field'); }

    function setError(input, message) {
      var wrap = fieldOf(input);
      if (!wrap) return;
      wrap.classList.add('has-error');
      var slot = wrap.querySelector('.field__error');
      if (slot) slot.textContent = message;
      input.setAttribute('aria-invalid', 'true');
    }

    function clearError(input) {
      var wrap = fieldOf(input);
      if (!wrap) return;
      wrap.classList.remove('has-error');
      input.removeAttribute('aria-invalid');
    }

    var EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
    var PHONE = /^(\+?61|0)[\s-]?\d{1,2}[\s-]?\d{3,4}[\s-]?\d{3,4}$/;

    function validate() {
      var ok = true;
      var firstBad = null;

      form.querySelectorAll('[required]').forEach(function (input) {
        clearError(input);
        if (!input.value.trim()) {
          setError(input, I18N.pick('This field is required', '这一项必填'));
          ok = false;
          firstBad = firstBad || input;
        }
      });

      var email = form.querySelector('#f-email');
      if (email && email.value.trim() && !EMAIL.test(email.value.trim())) {
        setError(email, I18N.pick('That email address looks off', '邮箱格式看起来不对'));
        ok = false;
        firstBad = firstBad || email;
      }

      var phone = form.querySelector('#f-phone');
      if (phone && phone.value.trim() && !PHONE.test(phone.value.replace(/\s/g, ''))) {
        setError(phone, I18N.pick('That phone number looks off', '电话格式看起来不对'));
        ok = false;
        firstBad = firstBad || phone;
      }

      var brief = form.querySelector('#f-brief');
      if (brief && brief.value.length > 500) {
        setError(brief, I18N.pick('Please keep this under 500 characters', '请控制在 500 字以内'));
        ok = false;
        firstBad = firstBad || brief;
      }

      if (firstBad) firstBad.focus();
      return ok;
    }

    form.addEventListener('input', function (e) {
      if (e.target.matches('input, select, textarea')) clearError(e.target);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (status) { status.className = 'form-status'; status.textContent = ''; }

      /* Honeypot — bots fill hidden fields, humans never see them. */
      var trap = form.querySelector('[name="company_website"]');
      if (trap && trap.value) return;

      /* Client-side throttle. Real limiting belongs on the server. */
      var last = 0;
      try { last = Number(localStorage.getItem(RATE_KEY) || 0); } catch (err) { /* noop */ }
      if (Date.now() - last < RATE_MS) {
        if (status) {
          status.className = 'form-status is-error';
          status.textContent = I18N.pick(
            'You just sent one — give it a minute.',
            '刚提交过一次，请等一分钟再试。'
          );
        }
        return;
      }

      if (!validate()) return;

      var data = Object.fromEntries(new FormData(form).entries());
      delete data.company_website;

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = I18N.pick('Sending…', '提交中…'); }

      function done(isDemo) {
        try { localStorage.setItem(RATE_KEY, String(Date.now())); } catch (err) { /* noop */ }
        form.style.display = 'none';
        if (success) {
          success.classList.add('is-visible');
          success.setAttribute('tabindex', '-1');
          success.focus();
          success.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        }
        var demoNote = document.getElementById('formDemo');
        if (demoNote) demoNote.hidden = !isDemo;
        /* Analytics hook — wire to GA4 when the property exists. */
        if (window.gtag) {
          window.gtag('event', 'generate_lead', { form: 'contact', mode: isDemo ? 'demo' : 'live' });
        }
      }

      function fail() {
        if (status) {
          status.className = 'form-status is-error';
          status.textContent = I18N.pick(
            'That didn\'t go through. Try again in a moment, or email us directly.',
            '提交失败，请稍后重试，或直接发邮件给我们。'
          );
        }
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = submitLabel; }
      }

      /* Three transports, in order of preference:
         1. an explicit data-endpoint on the form (client's own backend)
         2. the bundled local backend (server.py)
         3. demo mode — validates, shows the success state, stores nothing */
      var send;
      if (ENDPOINT) {
        send = fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }).then(function (res) {
          if (!res.ok) throw new Error('bad status');
          return { demo: false };
        });
      } else if (window.AB_API) {
        data.source = 'contact';
        if (estimatorSummary) data.estimate = estimatorSummary;
        send = window.AB_API.postLead(data).then(function (r) {
          if (r.ok) return { demo: false };
          if (r.mode === 'demo') return { demo: true };
          throw new Error(r.error || 'failed');
        });
      } else {
        send = Promise.resolve({ demo: true });
      }

      send.then(function (r) { done(r && r.demo); }).catch(fail);
    });

    var again = document.getElementById('formAgain');
    if (again) {
      again.addEventListener('click', function () {
        if (success) success.classList.remove('is-visible');
        var demoNote = document.getElementById('formDemo');
        if (demoNote) demoNote.hidden = true;
        form.style.display = '';
        form.reset();
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = submitLabel; }
        var first = form.querySelector('input, select, textarea');
        if (first) first.focus();
      });
    }
  })();

  /* ---------------- Footer year ---------------- */
  (function year() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  })();

  /* ---------------- Smooth anchor offset for same-page links ---------------- */
  (function anchors() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      if (target.hasAttribute('tabindex') === false) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  })();
})();
