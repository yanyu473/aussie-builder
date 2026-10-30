(function () {
  'use strict';

  var TOKEN_KEY = 'ab.admin.token';
  var INDUSTRY = {
    restaurant: 'Restaurant / café', salon: 'Nail / beauty', hardware: 'Hardware / trade',
    sports: 'Sports store', golf: 'Golf retail', other: 'Other'
  };
  var PLAN = { starter: 'Starter', pro: 'Professional', custom: 'Custom', unsure: 'Undecided' };

  var token = '';
  var leads = [];
  var filter = 'all';
  var query = '';
  var openId = null;

  var $ = function (id) { return document.getElementById(id); };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function when(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return iso || '';
    var diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
    return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
  }

  function api(path, opts) {
    opts = opts || {};
    opts.headers = Object.assign({
      'X-Admin-Token': token,
      'Accept': 'application/json'
    }, opts.headers || {});
    return fetch(path, opts).then(function (r) {
      if (r.status === 401) { signOut(); throw new Error('unauthorised'); }
      return r.json();
    });
  }

  function signOut() {
    try { localStorage.removeItem(TOKEN_KEY); } catch (e) {}
    token = '';
    $('app').hidden = true;
    $('gate').hidden = false;
    $('signOut').hidden = true;
    $('csvBtn').hidden = true;
    $('statusLine').textContent = 'signed out';
  }

  function render() {
    var rows = leads.filter(function (l) {
      if (filter !== 'all' && l.status !== filter) return false;
      if (!query) return true;
      var hay = [l.business, l.name, l.email, l.phone, l.brief, l.notes, l.estimate]
        .join(' ').toLowerCase();
      return hay.indexOf(query) !== -1;
    });
    var tbody = $('rows');
    tbody.innerHTML = '';
    $('empty').hidden = leads.length > 0;
    $('countLine').textContent = rows.length + ' of ' + leads.length + ' shown'
      + (query ? ' · "' + query + '"' : '');

    rows.forEach(function (l) {
      var tr = document.createElement('tr');
      tr.className = openId === l.id ? 'is-open' : '';
      tr.innerHTML =
        '<td class="mono">' + esc(when(l.created_at)) + '</td>' +
        '<td><span class="cell-name">' + esc(l.business) + '</span>' +
          (l.estimate ? '<div class="cell-sub">' + esc(l.estimate) + '</div>' : '') + '</td>' +
        '<td>' + esc(l.name) + '<div class="cell-sub">' + esc(l.email || l.phone) + '</div></td>' +
        '<td>' + esc(INDUSTRY[l.industry] || l.industry) + '</td>' +
        '<td>' + esc(PLAN[l.plan] || l.plan) + '</td>' +
        '<td class="mono">' + esc(l.source) + '</td>' +
        '<td><span class="pill pill--' + esc(l.status) + '">' + esc(l.status) + '</span></td>';

      tr.addEventListener('click', function () {
        openId = openId === l.id ? null : l.id;
        render();
      });
      tbody.appendChild(tr);

      if (openId === l.id) {
        var d = document.createElement('tr');
        d.className = 'detail';
        d.innerHTML =
          '<td colspan="7"><div class="detail-inner">' +
            '<div>' +
              '<span class="detail-label">Brief</span><p>' + (esc(l.brief) || '<em style="color:var(--muted)">none</em>') + '</p>' +
              '<span class="detail-label">Contact</span>' +
              '<div class="kv"><b>Email</b><span>' + (esc(l.email) || '—') + '</span></div>' +
              '<div class="kv"><b>Phone</b><span>' + (esc(l.phone) || '—') + '</span></div>' +
              '<div class="kv"><b>Site</b><span>' + (esc(l.site) || '—') + '</span></div>' +
              '<div class="kv"><b>Received</b><span>' + esc(l.created_at) + '</span></div>' +
              '<div class="kv"><b>ID</b><span class="mono">' + esc(l.id) + '</span></div>' +
            '</div>' +
            '<div>' +
              '<span class="detail-label">Status</span>' +
              '<select data-status="' + esc(l.id) + '">' +
                ['new', 'contacted', 'quoted', 'won', 'lost'].map(function (s) {
                  return '<option value="' + s + '"' + (l.status === s ? ' selected' : '') + '>' + s + '</option>';
                }).join('') +
              '</select>' +
              '<span class="detail-label" style="margin-top:16px">Notes</span>' +
              '<textarea data-notes="' + esc(l.id) + '" placeholder="Called, left message…">' + esc(l.notes) + '</textarea>' +
              '<p style="margin-top:8px;font-size:.78rem;color:var(--muted)">Saves when you click away.</p>' +
            '</div>' +
          '</div></td>';
        tbody.appendChild(d);

        var sel = d.querySelector('[data-status]');
        sel.addEventListener('change', function () { patch(l.id, { status: sel.value }); });

        var ta = d.querySelector('[data-notes]');
        ta.addEventListener('blur', function () {
          if (ta.value !== l.notes) patch(l.id, { notes: ta.value });
        });
      }
    });
  }

  function patch(id, body) {
    api('/api/leads/' + encodeURIComponent(id), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(function () { load(); }).catch(function () {});
  }

  function load() {
    $('statusLine').textContent = 'loading…';
    api('/api/leads').then(function (data) {
      leads = data.leads || [];
      var week = Date.now() - 7 * 864e5;
      $('sTotal').textContent = leads.length;
      $('sNew').textContent = leads.filter(function (l) { return l.status === 'new'; }).length;
      $('sWeek').textContent = leads.filter(function (l) { return new Date(l.created_at).getTime() > week; }).length;
      $('sChat').textContent = leads.filter(function (l) { return l.source === 'chat'; }).length;
      $('statusLine').textContent = leads.length + ' leads on file';
      $('csvBtn').href = '/api/leads.csv?token=' + encodeURIComponent(token);
      $('csvBtn').hidden = false;
      render();
    }).catch(function (err) {
      $('statusLine').textContent = 'error: ' + err.message;
    });
  }

  function start(t) {
    token = t;
    try { localStorage.setItem(TOKEN_KEY, t); } catch (e) {}
    $('gate').hidden = true;
    $('app').hidden = false;
    $('signOut').hidden = false;
    load();
  }

  // ---- boot ----
  var params = new URLSearchParams(location.search);
  var fromUrl = params.get('token');
  var saved = '';
  try { saved = localStorage.getItem(TOKEN_KEY) || ''; } catch (e) {}

  if (fromUrl) {
    history.replaceState(null, '', location.pathname);
    start(fromUrl);
  } else if (saved) {
    start(saved);
  } else {
    $('gate').hidden = false;
    $('statusLine').textContent = 'token required';
  }

  $('gateForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var v = $('tokenInput').value.trim();
    if (v) start(v);
  });

  $('searchInput').addEventListener('input', function () {
    query = this.value.trim().toLowerCase();
    render();
  });
  $('refreshBtn').addEventListener('click', load);
  $('signOut').addEventListener('click', signOut);

  document.querySelectorAll('[data-filter]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      filter = btn.getAttribute('data-filter');
      document.querySelectorAll('[data-filter]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      render();
    });
  });
})();
