/**
 * app core & bootstrap
 * @constructor
 */
mapviewer = {

  /**
   * Widget configuration file path
   * @type {string}
   */
  WIDGET_CONFIG_FILE: "conf/widgets.json",

  /**
   * Configuration file path
   * @type {string}
   */
  CONFIG_FILE: "conf/conf_geothermie_perspective.json",
  // CONFIG_FILE: "conf/conf_geothermie_perspective_recette.json",

  /**
   * Configuration file contents parsed in JSON type
   * @type {JSON}
   */
  config: {},

  /**
   * Configuration widget file contents parsed in JSON type
   * @type {JSON}
   */
  widgets: {},

  /**
   * Params from url
   * @type {JSON}
   */
  urlParams: {},

  /**
   * Mapviewer initialization function
   */
  init: function () {
    $(function () {
      Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ODJiMDhhZi04MWQyLTQ1ZWEtOThjZS0wZDc4ZTdjYzI0MTQiLCJpZCI6NjgyNCwic2NvcGVzIjpbImFzciJdLCJpYXQiOjE1NDc1NDM2MjB9.SChhAE8tNTmSqLwsvIiPcExptA550Rj64zBWefbjfbA";
      mapviewer.parseUrlParams();
      mapviewer.getConfig().then(function (config) {
        mapviewer.config = config;
        mapviewer.monitoring.init();
        // TODO : bouchon, will be get by configuration call
        $.ajax({
          method: 'GET',
          url: 'conf/monitoring.json?' + Date.now()
        }).then(function (monitoring) {
          mapviewer.config.monitoring = monitoring.monitoring;
          _.each(mapviewer.config.monitoring, function (item) {
            item.name = item.name.split('?')[0].toLowerCase();
            item.sla = Number(item.sla);
          });
          mapviewer.loadLocalization().then(function () {
            mapviewer.applyConfig();

            var widgetConfigContent = mapviewer.load(mapviewer.WIDGET_CONFIG_FILE);
            mapviewer.widgets = JSON.parse(widgetConfigContent);

            mapviewer.map.init();
            mapviewer.map.gfi.init();
            mapviewer.widget.init();
            if (mapviewer.config.tools.autolayers.enable) {
              mapviewer.autolayers.init();
            }
            if (mapviewer.config.tools.autolayers.hideButton) {
              $(".pull-right.switch-checkbox").hide();              
            }
            mapviewer.addEvents();    
                        
            if (mapviewer.config.tools.showMenuByDefault.enable){
              $('.sidebar-content').addClass('active');
              $('.sidebar-pane').addClass('active');
              $('.sidebar-tabs > ul:first > li:first').addClass('active');
            }
          });        
        }, function (e) {
          console.error(e);
          alert("An error occured during the application's loading. Please refresh the page or contact an administrator");
        });
      }, function (e) {
        console.error(e);
        alert("An error occured during the application's loading. Please refresh the page or contact an administrator");
      });
    });
  },

  /**
   * Retrieve configuration file and complete it
   * @return {Promise} ajax promise
   */
  getConfig: function () {
    var defer = $.Deferred();
    var urlConf = mapviewer.CONFIG_FILE + '?' + Date.now();
    if (mapviewer.urlParams.id) {
      urlConf = 'conf/' + mapviewer.urlParams.id + '.json'
    }

    $.ajax({
      method: 'GET',
      url: urlConf
    }).then(function (config) {
      defer.resolve(config);
    }, function (e) {
      defer.reject(e);
    });

    return defer;
  },

  /**
   * Parses url params into a configuration object
   */
  parseUrlParams: function () {
    var params = location.search.replace('?', '').split('&');
    _.each(params, function (param) {
      var kv = param.split('=');
      if (kv.length === 2) {
        var val = decodeURIComponent(kv[1])
        if (val === "true") {
          val = true;
        } else if (val === "false") {
          val = false;
        } else if (_.isString(val) && val.split(',').length < 2) {
          if (_.isFinite(parseInt(val, 10))) {
            val = parseInt(val, 10);
          } else if (_.isFinite(parseFloat(val))) {
            val = parseFloat(val);
          }
        }
        mapviewer.urlParams[kv[0]] = val;
      }
    });
  },

  /**
   * Removes disabled modules from configuration and launch generations about configuration
   */
  applyConfig: function () {
    if (mapviewer.config.appName) {
      $('head title').text(mapviewer.config.appName);
    }
    if (mapviewer.config.logo.imgUrl) {
      $('#banniere1GG img').attr('src', mapviewer.config.logo.imgUrl);
      $('#banniere1GG .brand-text').remove();
    }
    $('#banniere1GG img').attr('alt', mapviewer.config.logo.imgAlt);
    if (mapviewer.config.logo.url) {
      $('#banniere1GG a').attr('href', mapviewer.config.logo.url);
    }
    $('#banniere1GG a').attr('title', mapviewer.config.logo.linkTitle);
    if (mapviewer.config.logo.favicon) {
      $('head link[rel*="icon"]')
        .removeAttr('type')
        .attr('href', mapviewer.config.logo.favicon);
    }

    if (!mapviewer.config.tools.measure.enable) {
      $('a[href="#menu-measurement"]').closest('li').remove();
      $('#menu-measurement').remove();
    }
    if (!mapviewer.config.tools.saveView.enable) {
      $('a[href="#menu-download"]').closest('li').remove();
      $('#menu-download').remove();
    }
    if (!mapviewer.config.tools.catalogLink.enable) {
      $('.menu-catalog').remove();
    } else if (mapviewer.config.tools.catalogLink.url) {
      $('.menu-catalog a').attr('href', mapviewer.config.tools.catalogLink.url);
    }
    if (!mapviewer.config.tools.autolayers.enable) {
      $('#active-basic-datasets')
        .prop('checked', false)
        .closest('.switch-checkbox').hide();
    }
    if (!mapviewer.config.tools.globeView.enable) {
      $('.ol-globe-control').remove();
    }
    if (!mapviewer.config.tools.legendPanel.enable) {
      $('a[href="#menu-legends"]').closest('li').remove();
      $('#menu-legends').remove();
    }
    if (!mapviewer.config.tools.scalesZoom.enable) {
      $('#scalesZoom').remove();
    } else {
      mapviewer.generateScaleSelector();
    }
    if (!mapviewer.config.tools.urlGenerator.enable) {
      $('a[href="#menu-generate-url"]').closest('li').remove();
    }

    mapviewer.generateLayerSelector();
    mapviewer.configureProjections();
    mapviewer.generateSRSSelector();
  },

  /**
   * Generates the background layer dropdown content with the configuration's bgLayers
   */
  generateLayerSelector: function () {
    var $layerSelector = $('#base-layers');
    var defaultBgLayer;
    var defaultProj = _.find(mapviewer.config.projections, { code: mapviewer.config.defaultProjection });
    if (defaultProj) {
      defaultBgLayer = defaultProj.defaultBgLayer;
    }
    _.each(mapviewer.config.bgLayers, function (bgLayer) {
      if (bgLayer.visibleInSelector) {
        var $option = $('<option value="' + bgLayer.name + '">' + bgLayer.label + '</option>');
        if (bgLayer.name === defaultBgLayer) {
          $option.attr('selected', 'selected');
        }
        $layerSelector.append($option);
      }
    });
    $layerSelector.val(defaultBgLayer);
  },

  /**
   * Generates the SRS dropdown content with the configuration's projections
   */
  generateSRSSelector: function () {
    var $srsBtn = $('#srsList');
    var $srsList = $('#changeSRS .srs-container .dropdown-menu');
    var defaultProjection = _.find(mapviewer.config.projections, { code: mapviewer.config.defaultProjection });
    if (defaultProjection) {
      $srsBtn.find('span')
        .text(defaultProjection.label)
        .data('value', defaultProjection.code);
    }
    _.each(mapviewer.config.projections, function (proj) {
      var $li = $('<li>');
      $('<a>')
        .data('value', proj.code)
        .text(proj.label)
        .appendTo($li);

      $srsList.append($li);
    });
  },

  /**
   * Generates the scales selector content
   */
  generateScaleSelector: function () {
    var $scalesList = $('#scalesZoom .srs-container .dropdown-menu')
    _.each(mapviewer.config.tools.scalesZoom.scales, function (scale) {
      var $li = $('<li>');
      $('<a>')
        .data('value', scale)
        .text('1 / ' + scale)
        .appendTo($li);

      $scalesList.append($li);
    });
  },

  /**
   * Configures projections from configuration in OpenLayers
   */
  configureProjections: function () {
    _.each(mapviewer.config.projections, function (proj) {
      if (proj.proj4def) {
        proj4.defs(proj.code, proj.proj4def);
      }
    });

    ol.proj.proj4.register(proj4);

    _.each(mapviewer.config.projections, function (proj) {
      if (proj.proj4def && proj.extent) {
        var proj4Def = ol.proj.get(proj.code);
        proj4Def.setExtent(proj.extent);
        if (proj.flippedAxis) {
          proj4Def.axisOrientation_ = "neu";
        }
      }
    });
  },

  /**
   * Creates global app listeners
   */
  addEvents: function () {
    $('.sidebar-tabs a').on('click', function (e) {
      e.preventDefault();
      $('.toolsContainer .popover').hide();

      $('.sidebar-pane-subpane').removeClass('active');

      var $parent = $(this).parent();
      if ($parent.hasClass('active')) {
        $parent.removeClass('active');
        $('.sidebar-content').removeClass('active');
      } else {
        $('.sidebar-tabs li').removeClass('active');
        $parent.addClass('active');
        $('.sidebar-pane').removeClass('active');
        $($(this).attr('href')).addClass('active');
        $('.sidebar-content').addClass('active');
      }
    });

    $('.sidebar-tabs a').each(function () {
      if ($(this).attr('target') == "_blank") {
        $(this).off('click');
      }
    });

    $('.panel-toggle-btn').click(function () {
      $active = $('.sidebar-pane.active');
      if ($active.length === 0) {
        $('.sidebar-tabs a[href="#menu-datasets"]').trigger('click');
      } else {
        $('.sidebar-tabs a[href="#' + $('.sidebar-pane.active').attr('id') + '"]').trigger('click');
      }
    });

    $('.oneg-right-controls .ol-globe-control button').click(function () {

      if (mapviewer.map.currentMap === "cs") {
        $(this).find('i').removeClass('far fa-map').addClass('fa fa-globe')
      } else {
        $(this).find('i').removeClass('fa fa-globe').addClass('far fa-map')
      }
      mapviewer.map.swapToMap(mapviewer.map.currentMap === "cs" ? "ol" : "cs");

    });

    $('.oneg-top-controls button, .srs-button').click(function () {
      var $target;
      if ($(this).closest('div').hasClass('ol-search-control')) {
        $target = $('.gazetteer');
      } else if ($(this).hasClass('srs-button')) {
        $target = $(this).siblings('.srs-container');
      } else {
        $target = $('.base-layer-selector');
      }
      if ($target) {
        if ($target.hasClass('active')) {
          $target.removeClass('active');
        } else {
          $target.addClass('active');
        }
      }
    });

    $('#sidebar').on('show.bs.collapse', '.panel-collapse', function () {
      $(this).siblings('.panel-heading').addClass('active');
    });

    $('#sidebar').on('hide.bs.collapse', '.panel-collapse', function () {
      $(this).siblings('.panel-heading').removeClass('active');
    });

    $(document).click(function (e) {
      var $el = $(e.target);
      if (!$el.hasClass('paginate_button') && $el.closest('.sidebar-pane-subpane').length == 0 && $el.closest('.map-block').length == 0) {
        $('.sidebar-pane-subpane').removeClass('active');
      }
      if ($el.closest('.popover').length == 0) {
        $('.toolsContainer .popover').not($el.siblings('.popover')).hide();
        if ($el.attr('id') != 'goToCoordButton') {
          $('#goToCoordButton').popover('hide');
        }
      }
      if ($el.closest('.gazetteer').length === 0 && $el.closest('.ol-search-control').length === 0) {
        $('.gazetteer').removeClass('active');
      }
      if ($el.closest('.base-layer-selector').length === 0 && $el.closest('.ol-background-selector-control').length === 0) {
        $('.base-layer-selector').removeClass('active');
      }
      if ($el.closest('#changeSRS.projection-control').length === 0) {
        $('#changeSRS .srs-container').removeClass('active');
      }
      if ($el.closest('#scalesZoom.projection-control').length === 0) {
        $('#scalesZoom .srs-container').removeClass('active');
      }
    });

    $(window).on('resize', function () {
      if ($(window).width() < 992) {
        if ($('#menu-measurement').hasClass('active')) {
          $('.sidebar-tabs a[href="#menu-measurement"]').click();
        }
        if ($('#menu-download').hasClass('active')) {
          $('.sidebar-tabs a[href="#menu-download"]').click();
        }
        if ($('#OGCChoiceWCS').prop('checked')) {
          $('#OGCChoiceWCS').prop('checked', false);
          $('#OGCChoiceWMS').prop('checked', true);
          $('#externalOGC .externalOGCSearchInput').val('');
          $("#externalOGC .externalOGCMetadata").hide();
          $("#externalOGC .externalOGCResult").html('');
          externalOGC.disableWCSImportFeatures();
        }
        $('.tab-pane.layerAnalysis').each(function () {
          if ($(this).hasClass('active')) {

            $(this).closest('.sidebar-pane-content')
              .find('.nav-tabs a[href^="#layerInfos"]')
              .click();
          }
        });
      }

    });

    $(document).on('mouseout', 'a, button', function () {
      $(this).trigger('blur');
    });
  },

  /**
   * Gets url content synchronously
   * @param {string} url - url where get content
   * @return {string}
   */
  load: function (url) {
    return $.ajax({
      url: url,
      async: false,
      cache: false
    }).responseText;
  },

  /**
   * Loads localization file
   * @param {string} lang - (optional) language to use
   * @return {Promise}
   */
  loadLocalization: function (lang) {
    if (!lang) {
      lang = mapviewer.config.lang;
    }
    return $.ajax({
      type: 'GET',
      url: "localization/" + lang + ".json",
      dataType: "json",
      timeout: 10000
    }).then(function (res) {
      var resources = {};
      resources[lang] = {
        translation: res
      };
      return i18next.init({
        lng: lang,
        resources: resources
      }, function () {
        jqueryI18next.init(i18next, $);
        // save to use translation function as resources are fetched
        $('body').localize();
      });
    }, function (e) {
      console.error(e);
      return mapviewer.loadLocalization('en');
    });
  },

  /**
   * Adds given js file at the end of document's body
   * @param {string} fileURL - url of the js source to add
   */
  addJSFile: function (fileURL) {
    var jsLink = $("<script type='text/javascript' src='" + fileURL + "'>");
    $("body").append(jsLink);
  },

  /**
   * Adds given css file to the document's head
   * @param {string} fileURL - url of the css source to add
   */
  addCSSFile: function (fileURL) {
    // var jsLink = $("<link rel='stylesheet' type='text/css' href='" + fileURL + "'>");
    // $("head").append(jsLink);
  },

  /**
   * Gets a function by its name
   * @param {string} str - function name
   * @return {string}
   */
  stringToFunction: function (str) {
    var arr = str.split(".");

    var fn = (window || this);
    for (var i = 0, len = arr.length; i < len; i++) {
      fn = fn[arr[i]];
    }

    if (typeof fn !== "function") {
      throw new Error("function not found");
    }

    return fn;
  },

  /**
   * Converts object to an array of key-value pairs sorted by key
   * @param {Object} obj : object to convert
   * @return {Array[]}
   */
  sortProperties: function (obj) {
    var sortable = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        sortable.push([key, obj[key]]); // each item is an array in format [key, value]
      }
    }

    sortable.sort(function (a, b) {
      var x = a[0].toLowerCase();
      var y = b[0].toLowerCase();
      return x < y ? -1 : x > y ? 1 : 0;
    });
    return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
  }
}
