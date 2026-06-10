import siteConfig from '../data/global/site-config.json';

const GA_ID = siteConfig.googleAnalyticsId;

/**
 * Initializes Google Analytics by dynamically injecting the gtag script if not already present
 */
export const initGA = () => {
  if (typeof window === 'undefined') return;

  const id = GA_ID || 'G-W6FXMDLFF7';

  // Only inject if not already present in the HTML template
  if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);
  }

  if (!window.gtag) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', id, {
      send_page_view: false // We will trigger page views manually on route changes
    });
  }
};

/**
 * Tracks a pageview event for the given pathname (supporting both gtag and GTM dataLayer)
 */
export const trackPageView = (pathname) => {
  const id = GA_ID || 'G-W6FXMDLFF7';
  if (typeof window !== 'undefined') {
    if (window.gtag) {
      window.gtag('config', id, {
        page_path: pathname,
      });
    }
    // GTM dataLayer push
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'pageview',
      page_path: pathname
    });
  }
};

/**
 * Tracks a custom event (supporting both gtag and GTM dataLayer)
 */
export const trackEvent = (action, category, label, value) => {
  if (typeof window !== 'undefined') {
    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
    // GTM dataLayer push
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: action,
      eventCategory: category,
      eventLabel: label,
      eventValue: value
    });
  }
};
