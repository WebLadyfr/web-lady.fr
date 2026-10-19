(function() {
  const GA_ID = 'G-L7LGEDK44F';
  const CONSENT_KEY = 'cookie-consent';

  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const rejectBtn = document.getElementById('cookie-reject');

  // ============================================
  // GOOGLE CONSENT MODE v2 : tout est refusé par défaut.
  // Aucun script Google n'est chargé tant que le visiteur n'a pas accepté.
  // ============================================
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });

  let analyticsLoaded = false;

  function loadAnalytics() {
    if (analyticsLoaded) return;
    analyticsLoaded = true;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(script);

    gtag('js', new Date());
    gtag('consent', 'update', { analytics_storage: 'granted' });
    gtag('config', GA_ID);
  }

  // ============================================
  // ÉVÉNEMENTS DE CONVERSION GA4 (uniquement si le visiteur a accepté)
  // ============================================
  function conversionEventName(href) {
    if (href.indexOf('https://wa.me/') === 0) return 'click_whatsapp';
    if (href.indexOf('https://tally.so/r/RGJ00d') === 0) return 'click_tally';
    if (href.indexOf('https://calendly.com/weblady-web/30min') === 0) return 'click_calendly';
    if (href.indexOf('mailto:contact@web-lady.fr') === 0 || href.indexOf('to=contact@web-lady.fr') !== -1) return 'click_email';
    return null;
  }

  document.addEventListener('click', (e) => {
    if (!analyticsLoaded || !e.target.closest) return;
    const link = e.target.closest('a[href]');
    if (!link) return;

    const eventName = conversionEventName(link.getAttribute('href'));
    if (!eventName) return;

    gtag('event', eventName, {
      link_url: link.href,
      page_path: location.pathname,
      transport_type: 'beacon'
    });
  });

  // ============================================
  // BANDEAU COOKIES
  // ============================================
  function readConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (err) { return null; }
  }

  function saveConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (err) { /* stockage indisponible */ }
  }

  // Charge cookies.css seulement quand on doit afficher la bannière
  function loadCookiesCss() {
    if (document.querySelector('link[href="/css/cookies.css"]')) return; // évite double chargement

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/cookies.css';
    document.head.appendChild(link);
  }

  const consent = readConsent();

  if (!consent) {
    if (banner) {
      loadCookiesCss();
      banner.style.display = 'block';
    }
  } else if (consent === 'accepted') {
    loadAnalytics();
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      saveConsent('accepted');
      banner.style.display = 'none';
      loadAnalytics();
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      saveConsent('rejected');
      banner.style.display = 'none';
    });
  }
})();
