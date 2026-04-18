(function() {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const rejectBtn = document.getElementById('cookie-reject');

  // Vérifie si un choix a déjà été fait
  const consent = localStorage.getItem('cookie-consent');

  if (!consent) {
    banner.style.display = 'block';
  } else if (consent === 'accepted') {
    loadAnalytics(); // Active Google Analytics etc.
  }

  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'accepted');
    banner.style.display = 'none';
    loadAnalytics();
  });

  rejectBtn.addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'rejected');
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
