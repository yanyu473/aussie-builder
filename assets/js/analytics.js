/* ==========================================================================
   analytics.js — GA4, loaded only when an ID is configured.
   Set AB_GA4_ID to your measurement ID (e.g. 'G-XXXXXXXXXX') and deploy.
   Nothing is sent anywhere while it's empty.
   ========================================================================== */
window.AB_GA4_ID = '';

(function () {
  var id = window.AB_GA4_ID;
  if (!id) return;

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', id, { anonymize_ip: true });

  /* Event hooks the PRD asks for. They fire from site.js / chat.js via
     window.gtag('event', ...) — no extra wiring needed here. */
})();
