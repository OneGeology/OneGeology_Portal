
/**
 * Generate url page
 * @constructor
 */
var generateUrl = {
  /**
   * Vector layer where selected extent is displayed
   * @type {ol.layer.Vector|Null}
   */
  extentLayer: null,

  /**
   * Memorization of map dragbox interaction
   * @type {ol.interaction.DragBox|Null}
   */
  dragboxInteraction: null,

  /**
   * Current selected extent
   * @type {number[]|Null}
   */
  selectedExtent: null,

  /**
   * Initializes widget
   */
  init: function () {
    generateUrl.initEvents();

    generateUrl.generateShareUrl();
  },

  /**
   * Binds all events of this page
   */
  initEvents: function () {
    $('.sidebar-tabs a').on('click', generateUrl.onPanelChange);

    $('#generateUrl .share-link .copy-btn').click(this.copyUrl.bind(this));
    $('#generateUrl .btn-clear-extent').click(this.clearExtent.bind(this));

    $('#generateUrl .tab-pane input[type="checkbox"]').on('change', this.generateShareUrl.bind(this));
    $('#generateUrl .tab-pane select').on('change', this.generateShareUrl.bind(this));
    $('#generateUrl .tab-pane input[type="text"]').on('keyup', this.generateShareUrl.bind(this));

    $('#generateUrl .generate-url-from-layers .dropdown-menu').on('click', 'a', this.selectLayer);
    $('#generate-url-service-url').on('keyup', this.toggleFieldsFromServiceUrl.bind(this));
    $('#generate-url-layername').on('keyup', this.toggleFieldsFromServiceType.bind(this));
    $('#generate-url-service-type').on('change', this.toggleFieldsFromServiceType.bind(this));

  },

  /**
   * Disables extent selection in 3D mode, enables it for 2D mode
   */
  handleMapMode: function () {
    if (mapviewer.map.currentMap === "ol") {
      $('.active-set-extent').show();
      $('.no-set-extent').hide();
      if ($('a[href="#menu-generate-url"]').parent().hasClass('active')) {
        generateUrl.enableExtentDraw();
      }
    } else {
      $('.active-set-extent').hide();
      $('.no-set-extent').show();
      if ($('a[href="#menu-generate-url"]').parent().hasClass('active')) {
        generateUrl.disableExtentDraw();
      }
    }
    this.generateShareUrl();
  },

  /**
   * Enables or disables extent selection and display when active panel change
   */
  onPanelChange: function () {
    if (mapviewer.map.currentMap === "ol") {
      if (!$(this).parent().hasClass('active') && $(this).attr('href') == '#menu-generate-url') {
        generateUrl.enableExtentDraw();
        generateUrl.generateLayersList();
      } else if (
        ($(this).parent().hasClass('active') && $(this).attr('href') == '#menu-generate-url') ||
        ($(this).attr('href') != '#menu-generate-url' && $('#menu-generate-url').hasClass('active'))
      ) {
        generateUrl.disableExtentDraw();
      }
    }
  },

  /**
   * Generates layer list for service/layer autoload
   */
  generateLayersList: function () {
    if (mapviewer.map.layers.length > 0) {
      var $list = $('#generateUrl .generate-url-from-layers .dropdown-menu');
      $list.html('');
      _.each(mapviewer.map.layers, function (layer) {
        if (layer.layerData.serviceType.toLowerCase() !== 'wcs') {
          $('<li>')
            .append(
              $('<a href="#">')
                .data('layername', layer.layerData.layername)
                .data('service-url', layer.layerData.url)
                .data('service-type', layer.layerData.serviceType)
                .text(layer.title)
            )
            .appendTo($list);
        }
      });
      if ($list.find('li').length > 0) {
        $('#generateUrl .generate-url-from-layers').show();
      } else {
        $('#generateUrl .generate-url-from-layers').hide();
      }
    } else {
      $('#generateUrl .generate-url-from-layers').hide();
    }
  },

  /**
   * Enables and displays extent selection
   */
  enableExtentDraw: function () {
    if (!generateUrl.extentLayer) {
      generateUrl.extentLayer = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(255,255,255,0.5)'
          }),
          stroke: new ol.style.Stroke({
            width: 2,
            color: '#FF3333'
          })
        })
      });
    }
    mapviewer.olMap.map.addLayer(generateUrl.extentLayer);

    if (!generateUrl.dragboxInteraction) {
      generateUrl.dragboxInteraction = new ol.interaction.DragBox({
        condition: ol.events.condition.platformModifierKeyOnly
      });

      generateUrl.dragboxInteraction.on('boxend', function (e) {
        generateUrl.drawExtent(e.target.getGeometry().getExtent());
      });
    }

    mapviewer.olMap.map.addInteraction(generateUrl.dragboxInteraction);
  },

  /**
   * Disables and hide extent selection
   */
  disableExtentDraw: function () {
    mapviewer.olMap.map.removeInteraction(generateUrl.dragboxInteraction);
    mapviewer.olMap.map.removeLayer(generateUrl.extentLayer);
  },

  /**
   * Draw selected extent
   * @param {ol.interaction.DragBox.DragBoxEvent} e 
   */
  drawExtent: function (extent) {
    generateUrl.extentLayer.getSource().clear();
    generateUrl.extentLayer.getSource().addFeature(new ol.Feature({
      geometry: ol.geom.Polygon.fromExtent(extent)
    }));

    generateUrl.selectedExtent = ol.proj.transformExtent(extent, mapviewer.map.getCurrentProjection(), mapviewer.config.defaultProjection);

    $("#generateUrl .twest").html(extent[0].toFixed(3));
    $("#generateUrl .tsouth").html(extent[1].toFixed(3));
    $("#generateUrl .teast").html(extent[2].toFixed(3));
    $("#generateUrl .tnorth").html(extent[3].toFixed(3));
    this.generateShareUrl();
  },

  /**
   * Clears extent from generated url and map
   */
  clearExtent: function () {
    if (generateUrl.extentLayer) {
      generateUrl.extentLayer.getSource().clear();
      generateUrl.selectedExtent = null;
      $('#generateUrl .trosace span').text('');
      this.generateShareUrl();
    }
  },

  /**
   * Generate the share link for selected options
   */
  generateShareUrl: function () {
    var url = location.origin + location.pathname;

    var options = [];

    if ($('#generate-url-disable-autolayers').prop('checked')) {
      options.push('autolayer=false');
    }

    var alCatalog = $('#generate-url-catalog-url').val();
    if (alCatalog) {
      options.push('al=' + alCatalog);
    }

    var configFileName = $('#generate-url-config-name').val();
    if (configFileName) {
      options.push('id=' + configFileName);
    }

    var serviceUrl = $('#generate-url-service-url').val();
    if (serviceUrl) {
      options.push('serviceUrl=' + encodeURIComponent(serviceUrl));
      var serviceType = $('#generate-url-service-type').val() || 'WMS';
      options.push('serviceType=' + serviceType);
      var layername = $('#generate-url-layername').val();
      if (layername && serviceType !== 'WMC') {
        options.push('layername=' + layername);
        if (serviceType === 'WFS' && $('#generate-url-forceload').prop('checked')) {
          options.push('forceLoad=true');
        }
      }
    }

    if (mapviewer.map.currentMap === "ol" && generateUrl.selectedExtent) {
      options.push('extent=' + generateUrl.selectedExtent.join(','));
    }

    if (options.length > 0) {
      url += "?" + options.join("&");
    }

    $('#generateUrl .share-link a')
      .text(url)
      .attr('href', url);
  },

  /**
   * Copy generated url to clipboard
   */
  copyUrl: function (event) {
    var el = $(event.target);
    var url = el.siblings('a').attr('href');

    //copy to clipboard
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(url).select();
    document.execCommand("copy");
    $temp.remove();

    el.addClass('ok');

    setTimeout(function () { el.removeClass('ok') }, 500);
  },

  /**
   * Toggles layername field depending serviceUrl
   */
  toggleFieldsFromServiceUrl: function () {
    var val = $('#generate-url-service-url').val();
    if (val) {
      $('#generate-url-service-type').prop('disabled', false);
    } else {
      $('#generate-url-service-type').prop('disabled', true);
    }
    this.toggleFieldsFromServiceType();
  },

  /**
   * Toggles forceload field depending service type
   */
  toggleFieldsFromServiceType: function () {
    var serviceUrlVal = $('#generate-url-service-url').val();
    var layernameVal = $('#generate-url-layername').val();
    var val = $('#generate-url-service-type').val();
    if(val === 'WMC' && serviceUrlVal) {
      $('#generate-url-layername').prop('disabled', true);
      $('#generate-url-layername').val('');
      $('#generate-url-forceload').prop('disabled', true);
      $('#generate-url-forceload').prop('checked', false);
    } else {
      $('#generate-url-layername').prop('disabled', false);
      if (serviceUrlVal && layernameVal && val === 'WFS') {
        $('#generate-url-forceload').prop('disabled', false);
      } else {
        $('#generate-url-forceload').prop('disabled', true);
        if (serviceUrlVal && layernameVal) {
          $('#generate-url-forceload').prop('checked', false);
        }
      }
    }
  },

  /**
   * Updates autoadd service and layer from selection
   * @param {*} e Event from jQuery click listener
   */
  selectLayer: function (e) {
    e.preventDefault();
    var data = $(this).data();

    $('#generate-url-service-url').val(data.serviceUrl);
    $('#generate-url-layername').val(data.layername);

    if (['WMS', 'WFS', 'WMTS'].indexOf(data.serviceType) >= 0) {
      $('#generate-url-service-type').val(data.serviceType);
    } else {
      $('#generate-url-service-type').val('WMS');
    }

    generateUrl.toggleFieldsFromServiceUrl();
    generateUrl.generateShareUrl();
  }
};