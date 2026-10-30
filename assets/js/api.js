/* ==========================================================================
   api.js — talks to the local backend (server.py) when one is present.
   Probes /api/health once on load; every caller awaits that probe, so a form
   submitted before the check finishes still goes to the right place.

   If no backend answers (static hosting, file://, backend down), everything
   reports mode:'demo' and the callers degrade to their local behaviour.
   ========================================================================== */
window.AB_API = (function () {
  'use strict';

  var state = {
    checked: false,
    ready: false,
    mode: 'demo',
    chat: 'kb',
    leads: 0
  };

  var controller = ('AbortController' in window) ? new AbortController() : null;
  var timer = controller ? window.setTimeout(function () { controller.abort(); }, 1500) : null;

  var probe = fetch('/api/health', {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal: controller ? controller.signal : undefined,
    cache: 'no-store'
  })
    .then(function (res) { return res.ok ? res.json() : null; })
    .then(function (data) {
      if (data && data.ok) {
        state.ready = true;
        state.mode = 'live';
        state.chat = data.chat || 'kb';
        state.leads = data.leads || 0;
      }
    })
    .catch(function () { /* no backend, that's fine */ })
    .then(function () {
      if (timer) window.clearTimeout(timer);
      state.checked = true;
      document.dispatchEvent(new CustomEvent('ab-api-ready', { detail: state }));
    });

  function post(path, body) {
    return fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        return { status: res.status, data: data };
      });
    });
  }

  return {
    /** Resolves once the capability probe has finished. */
    ready: function () { return probe; },

    get state() { return state; },

    /**
     * Persist a lead.
     * Resolves { ok:true, id } | { ok:false, mode:'demo' } | { ok:false, error }
     */
    postLead: function (payload) {
      return probe.then(function () {
        if (!state.ready) return { ok: false, mode: 'demo' };
        return post('/api/leads', payload)
          .then(function (r) {
            if (r.status === 201 && r.data && r.data.ok) return { ok: true, id: r.data.id };
            return { ok: false, error: (r.data && r.data.error) || 'request failed' };
          })
          .catch(function () { return { ok: false, error: 'network' }; });
      });
    },

    /**
     * Ask the backend for a reply.
     * Resolves { ok:true, reply } | { ok:false, reason }
     */
    chat: function (messages, lang) {
      return probe.then(function () {
        if (!state.ready || state.chat !== 'llm') return { ok: false, reason: 'no-llm' };
        return post('/api/chat', { messages: messages, lang: lang || 'en' })
          .then(function (r) {
            if (r.status === 200 && r.data && r.data.reply) {
              return { ok: true, reply: r.data.reply };
            }
            return { ok: false, reason: (r.data && r.data.reason) || 'unavailable' };
          })
          .catch(function () { return { ok: false, reason: 'network' }; });
      });
    }
  };
})();
