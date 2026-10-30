/* ==========================================================================
   chat.js — pre-sales assistant.
   Deliberately rules-based: a marketing site must never invent a price.
   Every price answer is hard-coded from the same numbers used on pricing.html.
   Scope: PRD §8.2 (8 topics) + §8.3 (lead capture) + §8.4 (fallback).
   ========================================================================== */
(function () {
  'use strict';

  var root = document.getElementById('chat');
  if (!root) return;

  var launcher = document.getElementById('chatToggle');
  var panel = document.getElementById('chatPanel');
  var closeBtn = document.getElementById('chatClose');
  var log = document.getElementById('chatLog');
  var form = document.getElementById('chatForm');
  var input = document.getElementById('chatInput');
  var quickBox = document.getElementById('chatQuick');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var state = {
    turns: 0,          // user messages sent
    leadShown: false,
    leadSent: false,
    busy: false
  };

  /* Transcript handed to the backend when a real model is configured. */
  var history = [];

  function L(en, zh) { return window.I18N ? I18N.pick(en, zh) : en; }

  /* ------------------------------------------------------------------
     Knowledge base. One entry per PRD §8.2 topic.
     `hit` returns a score; the highest scorer wins.
     ------------------------------------------------------------------ */
  var KB = [
    {
      id: 'price',
      kw: ['price', 'pricing', 'cost', 'how much', 'quote', 'cheap', 'expensive', 'budget', 'package', '套餐', '价格', '报价', '多少钱', '费用', '便宜', '贵'],
      answer: {
        en: 'Three packages, all in AUD (ex GST):\n' +
            '• Starter — $499 from: up to 5 pages, 1 revision round, 5 business days\n' +
            '• Professional — $999 from: up to 10 pages, 3 revision rounds, basic SEO, 7 business days\n' +
            '• Custom — $1,999 from: unlimited pages, dedicated designer, 10–14 business days\n\n' +
            'Those are starting prices. A precise quote needs your page count and features — I won\'t guess at a number that later has to change.',
        zh: '三档套餐，均为澳元（不含 GST）：\n' +
            '• 基础版 — $499 起：最多 5 页、1 轮修改、5 个工作日\n' +
            '• 专业版 — $999 起：最多 10 页、3 轮修改、含基础 SEO、7 个工作日\n' +
            '• 定制版 — $1,999 起：不限页数、专属设计师、10–14 个工作日\n\n' +
            '以上都是起步价。准确报价要看你的页面数和功能——我不想在这里给你一个之后要改的数。'
      }
    },
    {
      id: 'time',
      kw: ['how long', 'time', 'turnaround', 'fast', 'days', 'week', 'deadline', 'when', '多久', '时间', '几天', '快', '周期', '什么时候'],
      answer: {
        en: 'First draft lands in 3 business days.\n\nFull delivery: Starter 5 business days, Professional 7, Custom 10–14.\n\nThe clock starts the day you send your content (logo, photos, opening hours), not the day you sign — that\'s usually where projects slip.',
        zh: '首稿 3 个工作日出来。\n\n整体交付：基础版 5 个工作日，专业版 7 个，定制版 10–14 个。\n\n计时从你交齐素材那天开始（Logo、照片、营业时间），不是从签约那天——项目卡住基本都是卡在这一步。'
      }
    },
    {
      id: 'assets',
      kw: ['what do i need', 'provide', 'prepare', 'photo', 'logo', 'content', 'copy', 'material', '需要什么', '准备', '照片', '图片', 'logo', '文案', '素材'],
      answer: {
        en: 'Four things, and we can work around three of them:\n' +
            '• Logo — no logo? We\'ll set a clean wordmark instead.\n' +
            '• Photos — shopfront, product or team shots. Phone photos are fine if they\'re sharp.\n' +
            '• Opening hours and address.\n' +
            '• A few lines about what you do.\n\n' +
            'Can\'t write the copy? Answer the questionnaire in plain English and we\'ll turn it into page copy.',
        zh: '四样东西，其中三样缺了也能开工：\n' +
            '• Logo — 没有的话我们做一个干净的字标。\n' +
            '• 照片 — 门面、产品、团队都行。手机拍的只要够清楚就可以。\n' +
            '• 营业时间和地址。\n' +
            '• 几行介绍你生意的话。\n\n' +
            '文案写不出来？问卷里用大白话答就行，我们负责转成页面上的文字。'
      }
    },
    {
      id: 'industry',
      kw: ['industry', 'my business', 'restaurant', 'cafe', 'salon', 'nail', 'beauty', 'hardware', 'trade', 'sport', 'golf', 'shop', 'store', '行业', '生意', '餐厅', '咖啡', '美甲', '美容', '五金', '体育', '高尔夫', '店'],
      answer: {
        en: 'We build for five industries: restaurants and cafés, nail and beauty, hardware and trade suppliers, sports stores, and golf retail.\n\n' +
            'If you\'re outside those five, we can usually still do it — the templates are just less tuned, so expect one extra revision round. What kind of business is it?',
        zh: '我们主要做五个行业：餐厅与咖啡馆、美甲美业、五金工具、体育用品、高尔夫用品。\n\n' +
            '不在这五个里面通常也能做，只是模板没那么贴合，可能要预留一轮额外修改。你的生意是哪一类？'
      }
    },
    {
      id: 'language',
      kw: ['chinese', 'mandarin', 'speak', 'language', '中文', '汉语', '沟通', '英文', '语言'],
      answer: {
        en: 'Yes — you can talk to us in Mandarin or Cantonese. The site itself is delivered in Australian English, because that\'s what your customers read. We\'ll translate your content and check the wording with you before it goes live.',
        zh: '可以，中文沟通没问题。\n\n网站本身交付的是澳洲英文——因为你的客人读的是英文。你的内容我们会翻译好，上线前跟你对一遍措辞。'
      }
    },
    {
      id: 'features',
      kw: ['map', 'google', 'hours', 'opening', 'contact form', 'form', 'booking', 'call', 'phone', '地图', '谷歌', '营业时间', '表单', '预约', '电话'],
      answer: {
        en: 'Every package includes Google Maps, opening hours, a contact form and a tap-to-call button.\n\n' +
            'Online booking is different — that\'s a third-party integration (Fresha, Calendly, OpenTable) and is quoted separately. We can drop their widget onto your site, but we don\'t build the booking engine itself.',
        zh: '每一档都包含谷歌地图、营业时间、联系表单和一键拨号。\n\n' +
            '在线预约是另一回事——那属于第三方系统对接（Fresha、Calendly、OpenTable 之类），单独报价。我们可以把它们的组件嵌到你的网站上，但预约系统本身不是我们做的。'
      }
    },
    {
      id: 'edit',
      kw: ['edit', 'update', 'change', 'myself', 'cms', 'later', 'admin', '自己改', '修改', '更新', '后台', '以后'],
      answer: {
        en: 'Yes. On launch we hand over an admin login — you can change text, swap photos and update prices yourself. No code, no ticket to us.\n\nIf you\'d rather not touch it, we do content updates on a per-job basis.',
        zh: '可以。上线时我们会给你一个后台账号，改文字、换照片、调价格都能自己来，不用写代码，也不用找我们开工单。\n\n不想自己弄的话，也可以按次找我们改。'
      }
    },
    {
      id: 'payment',
      kw: ['pay', 'payment', 'invoice', 'deposit', 'stripe', 'card', '付款', '支付', '发票', '定金', '怎么付'],
      answer: {
        en: '50% deposit on signing, balance on delivery. We invoice in AUD and you can pay by bank transfer.\n\nWe don\'t take card payments through this website — online checkout isn\'t part of the current build.',
        zh: '签约付 50% 定金，交付时付尾款。澳元开票，支持银行转账。\n\n这个网站本身不做在线收款——在线支付不在本期范围内。'
      }
    },
    {
      id: 'seo',
      kw: ['seo', 'google search', 'rank', 'found', 'traffic', '搜索', '排名', '收录', '流量', '找到'],
      answer: {
        en: 'Starter covers the technical basics: page titles, meta descriptions, sitemap, and getting you indexed.\n\n' +
            'Professional and Custom add keyword research and local SEO setup (Google Business Profile, suburb-level pages).\n\n' +
            'Worth being straight with you: nobody can promise a ranking. Anyone who does is selling you something.',
        zh: '基础版做技术层：页面标题、描述、sitemap、提交收录。\n\n' +
            '专业版和定制版加上关键词调研和本地 SEO 设置（Google Business Profile、按区县做落地页）。\n\n' +
            '说句实话：没人能保证排名。跟你保证的，都是在卖别的东西。'
      }
    }
  ];

  var BUY_INTENT = /(ready|sign me up|get started|book|hire|interested|let'?s do it|start now|合作|开始|签约|感兴趣|想做|报价给我|联系我)/i;

  function score(msg, entry) {
    var hits = 0;
    for (var i = 0; i < entry.kw.length; i += 1) {
      if (msg.indexOf(entry.kw[i]) !== -1) hits += entry.kw[i].length > 3 ? 2 : 1;
    }
    return hits;
  }

  function bestAnswer(msg) {
    var lower = msg.toLowerCase();
    var best = null;
    var bestScore = 0;
    KB.forEach(function (entry) {
      var s = score(lower, entry);
      if (s > bestScore) { bestScore = s; best = entry; }
    });
    return bestScore >= 2 ? best : null;
  }

  /* ---------------- Rendering ---------------- */
  function scrollDown() {
    if (!log) return;
    /* Two frames: one for the paint that adds the node, one for the
       reflow it causes. Without this the scroll lands short. */
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        log.scrollTop = log.scrollHeight;
      });
    });
  }

  function addMsg(text, who, isHtml) {
    var div = document.createElement('div');
    div.className = 'msg msg--' + who;
    if (isHtml) div.innerHTML = text;
    else div.textContent = text;
    log.appendChild(div);
    scrollDown();
    return div;
  }

  function typing() {
    var div = document.createElement('div');
    div.className = 'msg msg--bot msg--typing';
    div.innerHTML = '<i></i><i></i><i></i>';
    div.setAttribute('aria-label', L('Assistant is typing', '助手正在输入'));
    log.appendChild(div);
    scrollDown();
    return div;
  }

  function reply(text) {
    var t = typing();
    var wait = reduceMotion ? 120 : 520 + Math.random() * 260;
    window.setTimeout(function () {
      t.remove();
      addMsg(text, 'bot');
      state.busy = false;
    }, wait);
  }

  /* ---------------- Lead form (PRD §8.3) ---------------- */
  function showLeadForm() {
    if (state.leadShown || state.leadSent) return;
    state.leadShown = true;

    var wrap = document.createElement('div');
    wrap.className = 'msg msg--bot';
    wrap.innerHTML =
      '<strong>' + L('Leave a contact and we\'ll send a specific quote', '留个联系方式，我们发你一份具体报价') + '</strong>' +
      '<form class="lead-form" novalidate>' +
        '<input name="business" type="text" placeholder="' + L('Business name *', '店名 *') + '" autocomplete="organization" required>' +
        '<select name="industry" aria-label="' + L('Industry', '行业') + '">' +
          '<option value="">' + L('Industry (optional)', '行业（可选）') + '</option>' +
          '<option>' + L('Restaurant / café', '餐厅 / 咖啡馆') + '</option>' +
          '<option>' + L('Nail / beauty', '美甲 / 美容') + '</option>' +
          '<option>' + L('Hardware / trade', '五金 / 工具') + '</option>' +
          '<option>' + L('Sports store', '体育用品') + '</option>' +
          '<option>' + L('Golf retail', '高尔夫用品') + '</option>' +
          '<option>' + L('Other', '其他') + '</option>' +
        '</select>' +
        '<input name="name" type="text" placeholder="' + L('Your name *', '联系人 *') + '" autocomplete="name" required>' +
        '<input name="email" type="email" placeholder="' + L('Email *', '邮箱 *') + '" autocomplete="email">' +
        '<input name="phone" type="tel" placeholder="' + L('Phone', '电话') + '" autocomplete="tel">' +
        '<textarea name="brief" placeholder="' + L('One line about what you need', '一句话说下你的需求') + '"></textarea>' +
        '<p class="lead-err" role="alert" hidden></p>' +
        '<button type="submit">' + L('Send', '提交') + '</button>' +
      '</form>';

    log.appendChild(wrap);
    scrollDown();

    var f = wrap.querySelector('form');
    var err = wrap.querySelector('.lead-err');

    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = Object.fromEntries(new FormData(f).entries());
      var needEmail = !data.email.trim() && !data.phone.trim();
      if (!data.business.trim() || !data.name.trim() || needEmail) {
        err.hidden = false;
        err.textContent = L(
          'Business name, your name, and an email or phone — we need all three.',
          '店名、联系人、邮箱或电话，这三样得填一下。'
        );
        return;
      }
      state.leadSent = true;

      var thanks = function (demo) {
        f.outerHTML = '<p style="margin:8px 0 0"><strong>' +
          L('Got it. We\'ll be in touch within 1 business day.', '收到了，我们会在 1 个工作日内联系你。') +
          '</strong>' +
          (demo ? '<br><small style="color:var(--muted)">' +
            L('Preview mode — nothing was sent.', '预览模式——这条没有发出去。') + '</small>' : '') +
          '</p>';
        scrollDown();
        if (window.gtag) {
          window.gtag('event', 'generate_lead', { form: 'chat', mode: demo ? 'demo' : 'live' });
        }
      };

      data.source = 'chat';
      if (window.AB_API) {
        window.AB_API.postLead(data).then(function (r) {
          thanks(!r.ok && r.mode === 'demo');
        });
      } else {
        thanks(true);
      }
    });
  }

  /* ---------------- Turn handling ---------------- */
  /* Knowledge-base path: instant, offline, cannot hallucinate a price. */
  function kbPath(text) {
    var match = bestAnswer(text);

    if (match) {
      reply(L(match.answer.en, match.answer.zh));
      window.setTimeout(function () {
        if (state.turns >= 2) showLeadForm();
      }, reduceMotion ? 200 : 900);
      return;
    }

    if (BUY_INTENT.test(text)) {
      reply(L(
        'Good — that\'s the bit I can actually help with. Leave a few details and a real person will come back with a quote within 1 business day.',
        '好——这个我能帮上。留个联系方式，真人会在 1 个工作日内带着报价回你。'
      ));
      window.setTimeout(showLeadForm, reduceMotion ? 200 : 700);
      return;
    }

    /* PRD §8.4 — never guess, hand off. */
    reply(L(
      'I\'d rather not guess at that one and give you a wrong answer.\n\nLeave your details below and a person will reply within 1 business day.',
      '这个问题我拿不准，不想给你错的答案。\n\n留个联系方式，我们一个工作日内让真人回你。'
    ));
    window.setTimeout(showLeadForm, reduceMotion ? 200 : 700);
  }

  /* Model path: used only when the backend reports a real model is wired. */
  function askModel(fallbackText) {
    var t = typing();
    window.AB_API.chat(history, window.I18N && I18N.isZh() ? 'zh' : 'en').then(function (r) {
      t.remove();
      if (r.ok) {
        addMsg(r.reply, 'bot');
        history.push({ role: 'assistant', content: r.reply });
        state.busy = false;
        if (state.turns >= 2) window.setTimeout(showLeadForm, reduceMotion ? 200 : 900);
      } else {
        /* Backend down, out of quota, or no model configured — degrade quietly. */
        kbPath(fallbackText);
      }
    });
  }

  function handle(text) {
    if (state.busy) return;
    state.busy = true;
    state.turns += 1;

    addMsg(text, 'user');
    if (quickBox) quickBox.hidden = true;
    history.push({ role: 'user', content: text });

    /* Wait for the capability probe if it hasn't landed yet, then route. */
    var wait = (window.AB_API && !window.AB_API.state.checked)
      ? window.AB_API.ready()
      : Promise.resolve();

    wait.then(function () {
      if (window.AB_API && window.AB_API.state.chat === 'llm') askModel(text);
      else kbPath(text);
    });
  }

  /* ---------------- Open / close ---------------- */
  var lastFocus = null;

  function open() {
    lastFocus = document.activeElement;
    root.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    launcher.setAttribute('aria-expanded', 'true');
    window.setTimeout(function () { if (input) input.focus(); }, 60);
  }

  function close() {
    root.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    launcher.setAttribute('aria-expanded', 'false');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  launcher.addEventListener('click', function () {
    if (root.classList.contains('is-open')) close(); else open();
  });
  if (closeBtn) closeBtn.addEventListener('click', close);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && root.classList.contains('is-open')) close();
  });

  /* Trap Tab inside the panel while it's open. */
  panel.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var f = panel.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!f.length) return;
    var first = f[0];
    var last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = (input.value || '').trim();
      if (!v) return;
      input.value = '';
      handle(v);
    });
  }

  if (quickBox) {
    quickBox.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      handle(b.textContent.trim());
    });
  }

  /* Re-render the greeting when the language flips mid-conversation. */
  document.addEventListener('langchange', function () {
    if (!log) return;
    var first = log.querySelector('.msg--bot');
    if (first && log.children.length === 1) {
      first.textContent = L(
        'Kia ora — I\'m the Aussie Builder assistant. Ask me about pricing, turnaround, or whether we cover your industry.',
        '你好，我是 Aussie Builder 的助手。价格、交付时间、做不做你的行业——都可以问。'
      );
    }
    if (quickBox) quickBox.hidden = false;
  });

  /* Any element with data-open-chat opens the assistant. */
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-open-chat]')) {
      e.preventDefault();
      open();
    }
  });
})();
