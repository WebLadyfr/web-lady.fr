(function() {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const rejectBtn = document.getElementById('cookie-reject');

  const CONSENT_KEY = 'cookie-consent';

  // Charge cookies.css seulement quand on doit afficher la bannière
  function loadCookiesCss() {
    if (document.querySelector('link[href="/css/cookies.css"]')) return; // évite double chargement

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/cookies.css';
    document.head.appendChild(link);
  }

  // Vérifie si un choix a déjà été fait
  const consent = localStorage.getItem(CONSENT_KEY);

  if (!consent) {
    loadCookiesCss();
    banner.style.display = 'block';
  } else if (consent === 'accepted') {
    loadAnalytics(); // Active Google Analytics etc.
  }

  acceptBtn.addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    banner.style.display = 'none';
    loadAnalytics();
  });

  rejectBtn.addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, 'rejected');
    banner.style.display = 'none';
  });

  function loadAnalytics() {
    // Mets ici ton code Google Analytics, Meta Pixel, etc.
    // Exemple :
    // const script = document.createElement('script');
    // script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXX';
    // document.head.appendChild(script);
  }
})();