/**
 * Manages all monitoring tools
 * @constructor
 */
mapviewer.monitoring = {
  /**
   * Piwik object
   */
  piwik: null,

  /**
   * Google analytics object
   */
  googleAnalytics: null,

  init: function () {
    this.initPiwik();
    this.initGoogleAnalytics();
  },

  /**
   * Initiates Piwik tracker with configuration's parameters
   */
  initPiwik: function () {
    if (mapviewer.config.piwik && mapviewer.config.piwik.url) {
      window._paq = window._paq || []; // Global piwik object

      window._paq.push(['trackPageView']);
      window._paq.push(['enableLinkTracking']);
      var u = (("https:" == document.location.protocol) ? "https" : "http") + "://" + mapviewer.config.piwik.url + "/";
      window._paq.push(['setTrackerUrl', u + 'piwik.php']);
      window._paq.push(['setSiteId', mapviewer.config.piwik.appId]);
      var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
      g.type = 'text/javascript';
      g.defer = true;
      g.async = true;
      g.src = u + 'piwik.js';
      s.parentNode.insertBefore(g, s);

      g.onload = function (e) {
        mapviewer.monitoring.piwik = window._paq;
      }
    }
  },

  initGoogleAnalytics: function () {
    if (mapviewer.config.googleAnalytics && mapviewer.config.googleAnalytics.trackerId) {
      //<script async src="https://www.googletagmanager.com/gtag/js?id=G-HX7HVK2D9R"></script>
      var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
      g.type = 'text/javascript';
      g.defer = true;
      g.async = true;
      g.src = 'https://www.googletagmanager.com/gtag/js?id=' + mapviewer.config.googleAnalytics.trackerId;
      s.parentNode.insertBefore(g, s);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { dataLayer.push(arguments); };
      window.gtag('js', new Date());

      window.gtag('config', 'G-HX7HVK2D9R');

      g.onload = function (e) {
        mapviewer.monitoring.googleAnalytics = window.gtag;
      }
    }
  },

  /**
   * Tracks an event
   * @param {string} action Event's action type
   * @param {string} category Event's category
   * @param {string} label Event's details
   */
  track: function (action, category, label) {
    if (location.host.indexOf('localhost') < 0 && action) {
      category = category || "";
      label = label || "";

      if (this.piwik) {
        this.piwik.push(['trackEvent', action, category, label]);
      }

      if (this.googleAnalytics) {
        this.googleAnalytics('event', action, {
          'event_category': category,
          'event_label': label
        });
      }
    }
  },
}