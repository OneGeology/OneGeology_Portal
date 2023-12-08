/**
 * Manage automatic layers
 * @constructor
 */
mapviewer.autolayers = {
  /**
   * XML url where autolayers are stocked
   * @type {string}
   */
  url: "",

  /**
   * List of xml-file specified automatic layers
   * @type {Object[]}
   */
  layerList: [],

  debounceTimeout: null,

  /**
   * Autolayers initialization function
   */
  init: function () {
    if (mapviewer.urlParams.al && mapviewer.config.tools.autolayers.urlDefaultPath) {
      mapviewer.autolayers.url = mapviewer.config.tools.autolayers.urlDefaultPath + mapviewer.urlParams.al + '.xml'
    } else if (mapviewer.config.tools.autolayers.url) {
      mapviewer.autolayers.url = mapviewer.config.tools.autolayers.url;
    }
    if (mapviewer.urlParams.autolayer === false) {
      $("#active-basic-datasets").prop('checked', false);
    }

    this.addEvents();
    this.getAllLayers();
  },

  /**
   * Creates all listeners for autolayers
   */
  addEvents: function () {
    $("#active-basic-datasets").on("change", mapviewer.autolayers.manageAutoLayers);
  },

  /**
   * Adds/removes autolayers according to autolayers checkbox
   */
  manageAutoLayers: function () {
    if ($(this).prop("checked")) {
      mapviewer.autolayers.updateAutolayers();
      mapviewer.monitoring.track("enable_auto_layer", "Enable autolayers", "Enable autolayers");
    } else {
      mapviewer.autolayers.removeAutoLayers();
      mapviewer.monitoring.track("disable_auto_layer", "Disable autolayers", "Disable autolayers");
    }
  },

  /**
   * Sets layerList according to autolayers xml
   */
  getAllLayers: function () {
    var xml = mapviewer.load("./proxyxml?url=" + escape(mapviewer.autolayers.url));
    $(xml).find("Layer").each(function () {
      var layer = {};
      layer.title = $(this).attr("name");
      layer.url = $(this).find("url").text();
      layer.name = $(this).find("layername").text();

      let visible = $(this).find("enable").length > 0 ? $(this).find("enable").text() : "";
      if (visible && visible.toLowerCase() === "false") {
        layer.visible = false;
      } else {
        layer.visible = true;
      }

      layer.extent = [
        $(this).find("BBOX").attr('minx'),
        $(this).find("BBOX").attr('miny'),
        $(this).find("BBOX").attr('maxx'),
        $(this).find("BBOX").attr('maxy')
      ].map(Number);
      layer.minscale = Number($(this).find("Scale").attr('min'));
      layer.maxscale = Number($(this).find("Scale").attr('max'));
      layer.srs = [];
      $(this).find("SRS").each(function () {
        layer.srs.push($(this).text());
      });

      mapviewer.autolayers.layerList.push(layer);
    });
  },

  /**
   * Adds/removes automatic layers according to current map extent
   */
  updateAutolayers: function () {
    if (mapviewer.autolayers.debounceTimeout) {
      clearTimeout(mapviewer.autolayers.debounceTimeout);
      mapviewer.autolayers.debounceTimeout = null;
    }
    mapviewer.autolayers.debounceTimeout = setTimeout(mapviewer.autolayers.doUpdateAutolayers, 500);
  },

  /**
   * Executes autolayers add or remove
   */
  doUpdateAutolayers: function () {
    //list of auto layer to display (depends on map extent and scale)
    var selectedLayers = [];
    var currentExtent = mapviewer.map.getCurrentExtent();
    if (mapviewer.map.getCurrentProjection() != "EPSG:4326") {
      currentExtent = ol.proj.transformExtent(currentExtent, mapviewer.map.getCurrentProjection(), 'EPSG:4326');
    }

    var curExtentPolygon = new ol.geom.Polygon.fromExtent(currentExtent);
    var currentScale = mapviewer.map.getCurrentScale();
    var currentProj = mapviewer.map.getCurrentProjection();

    _.each(mapviewer.autolayers.layerList, function (alLayer) {
      var alExtent = alLayer.extent;

      var alPolygon = new ol.geom.Polygon.fromExtent(alExtent);

      var existing = _.find(selectedLayers, { url: alLayer.url, layername: alLayer.name });

      if (
        !existing && alLayer.srs.indexOf(currentProj) >= 0 &&
        (curExtentPolygon.intersectsExtent(alExtent) || alPolygon.intersectsExtent(currentExtent)) && mapviewer.autolayers.checkScale(alLayer.minscale, currentScale, alLayer.maxscale)) {
        selectedLayers.push({
          title: alLayer.title,
          layername: alLayer.name,
          url: alLayer.url,
          type: 'layer',
          autolayer: true,
          extent: alLayer.extent,
          visible: alLayer.visible,
          opacity: 0.5,
          minScale: alLayer.minscale,
          maxScale: alLayer.maxscale,
          srs: alLayer.srs,
          version: '1.1.1',
          serviceType: 'WMS'
        });
      }
    });

    //list of autolayers to remove
    var removedLayers = [];
    _.each(mapviewer.map.layers, function (layer) {
      if (layer.autolayer) {
        var autolayerIndex = _.findIndex(selectedLayers, { url: layer.url, layername: layer.name });
        if (autolayerIndex >= 0) {
          selectedLayers.splice(autolayerIndex, 1);
        } else {
          removedLayers.push(layer);
        }
      }
    });

    if (selectedLayers.length > 0) {
      $('.menuLayerCounter .layerCount').addClass('loading');
    }

    _.each(removedLayers, function (layer) {
      mapviewer.map.removeLayer(layer);
    });
    mapviewer.map.addLayers(selectedLayers, true)
      .done(function () {
        $('.menuLayerCounter .layerCount').removeClass('loading');
      });
  },

  /**
   * Checks if a layer may be displayed in current map scale
   * @return {boolean}
   */
  checkScale: function (minScale, currentScale, maxScale) {
    return !currentScale || ((minScale < currentScale) && (currentScale < maxScale));
  },

  /**
   * Removes all automatic layer
   */
  removeAutoLayers: function () {
    var layersToRemove = [];
    _.each(mapviewer.map.layers, function (layer) {
      if (layer.autolayer) {
        layersToRemove.push(layer);
      }
    });

    _.each(layersToRemove, function (layer) {
      mapviewer.map.removeLayer(layer);
    });
  },
};
