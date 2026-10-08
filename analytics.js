'use strict';
// Only the published calculator sends analytics, never file:// or local previews.
(() => {
  const canonical = 'https://goodzeeak.github.io/filament-remaining-calculator/';
  if (location.origin !== 'https://goodzeeak.github.io' ||
      !['/filament-remaining-calculator/', '/filament-remaining-calculator/index.html'].includes(location.pathname)) return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', 'G-JE5CBMSQVC', {
      page_location: canonical,
      page_referrer: '',
      page_title: 'Filament Remaining Calculator',
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_path: '/filament-remaining-calculator/',
      cookie_domain: 'none'
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-JE5CBMSQVC';
    document.head.appendChild(script);
    window.trackCalculationCompleted = () => {
      try {
        window.gtag('event', 'calculation_completed', {send_to: 'G-JE5CBMSQVC'});
      } catch (_) { /* Analytics must never interrupt calculations. */ }
    };
  } catch (_) { /* The calculator remains usable if analytics is unavailable. */ }
})();
