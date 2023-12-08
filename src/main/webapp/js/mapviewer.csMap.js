/**
 * Openlayers map service
 * @constructor
 */
mapviewer.csMap = {
  /**
  * openlayers map object
  * @type {Cesium.Viewer}
  */
  map: null,

  /**
  * openlayers map object
  * @type {Cesium.DefaultProxy}
  */
  proxy: new Cesium.DefaultProxy('proxycesium?url='),

  /**
  * initializes map
  * @param bgLayers - background layers to set
  */
  init: function (bgLayers) {
    $('#csMap').addClass('active');
    $('.oneg-bottom-controls').addClass('cs-mode');
    mapviewer.csMap.map = new Cesium.Viewer('csMap', {
      animation: false,
      geocoder: false,
      sceneModePicker: false,
      timeline: false,
      homeButton: false,
      navigationHelpButton: false,
      baseLayerPicker: false,
      infoBox: false,
      fullscreenButton: false,
      selectionIndicator: false
    });

    var mapLayers = mapviewer.csMap.map.scene.imageryLayers;

    _.each(bgLayers, function (bgLayer) {
      switch (bgLayer.type) {
        case 'WMS':
          bgLayer.csLayer = mapLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
            url: new Cesium.Resource({
              url: bgLayer.url,
              proxy: mapviewer.csMap.proxy
            }),
            parameters: bgLayer.params
          }));
          break;
        case 'Bing':
          bgLayer.csLayer = mapLayers.addImageryProvider(new Cesium.BingMapsImageryProvider({
            url: "https://dev.virtualearth.net",
            key: bgLayer.params.key,
            mapStyle: bgLayer.params.imagerySet == 'Road' ? Cesium.BingMapsStyle.ROAD : Cesium.BingMapsStyle.AERIAL
          }));
          break;
        case 'OSM':
          bgLayer.csLayer = mapLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
            url: bgLayer.url
          }))
          break;
      }
      bgLayer.csLayer.show = bgLayer.visible;
    });

    $('<div class="ol-mouse-position">X:&nbsp;0&nbsp;Y:&nbsp;0</div>')
      .appendTo('.mouse-position-control');

    $('<div class="ol-zoom ol-unselectable ol-control">\
            <button class="ol-zoom-in" type="button" title="' + i18next.t('controls.zoomInTitle') + '">\
        <i class="fa fa-plus"></i>\
      </button>\
            <button class="ol-zoom-out" type="button" title="' + i18next.t('controls.zoomOutTitle') + '">\
        <i class="fa fa-minus"></i>\
      </button>\
    </div>').appendTo('.oneg-right-inner-controls');

    $('<div class="ol-zoom-extent ol-unselectable ol-control">\
            <button type="button" title="' + i18next.t('controls.zoomToExtentTitle') + '">\
        <i class="fa fa-home"></i>\
      </button>\
    </div>').appendTo('.oneg-right-inner-controls');

    $('<div class="ol-full-screen ol-unselectable ol-control ">\
            <button class="ol-full-screen-false" type="button" title="' + i18next.t('controls.fullScreenTitle') + '">\
        <i class="fa fa-expand-arrows-alt"></i>\
      </button>\
    </div>').appendTo('.oneg-right-inner-controls');

    mapviewer.csMap.addControlsListeners();

    var handler = new Cesium.ScreenSpaceEventHandler(mapviewer.csMap.map.canvas);

    handler.setInputAction(function (movement) {
      var mousePos = movement.endPosition;
      if (!mapviewer.csMap.map) {
        return;
      }
      var ellipsoid = mapviewer.csMap.map.scene.globe.ellipsoid;
      var cartesian = mapviewer.csMap.map.camera.pickEllipsoid(new Cesium.Cartesian3(mousePos.x, mousePos.y), ellipsoid);
      if (cartesian) {
        var cartographic = ellipsoid.cartesianToCartographic(cartesian);
        var lon = (Math.round(Cesium.Math.toDegrees(cartographic.longitude * 10000)) / 10000).toFixed(4);
        var lat = (Math.round(Cesium.Math.toDegrees(cartographic.latitude * 10000)) / 10000).toFixed(4);
        $('.ol-mouse-position').html("X:&nbsp;" + lon + "&nbsp;Y:&nbsp;" + lat);
      }

    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    handler.setInputAction(function (movement) {
      var mousePosition = movement.position;
      if (!mapviewer.csMap.map) {
        return;
      }

      var ellipsoid = mapviewer.csMap.map.scene.globe.ellipsoid;
      var cartesian = mapviewer.csMap.map.camera.pickEllipsoid(mousePosition, ellipsoid);
      if (cartesian) {
        var cartographic = ellipsoid.cartesianToCartographic(cartesian);
        var long = Cesium.Math.toDegrees(cartographic.longitude);
        var lat = Cesium.Math.toDegrees(cartographic.latitude);
        mapviewer.map.gfi.displayPanel({ coordinate: [long, lat] });
      }

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    _.each(mapviewer.map.layers, function (layer) {
      mapviewer.csMap.addLayer(layer);
    });
    if (mapviewer.config.tools.autolayers.enable) {
      mapviewer.autolayers.updateAutolayers();
    }

    var camera = mapviewer.csMap.map.camera;
    camera.moveEnd.addEventListener(function () {
      if ($("#active-basic-datasets").prop('checked')) {
        mapviewer.autolayers.updateAutolayers();
      }
    });
  },

  /**
   * Destroys OL map
   */
  destroyMap: function () {
    $('#csMap').html('').removeClass('active');
    $('.mouse-position-control').html('');
    $('.oneg-right-inner-controls').html('');
    $('.oneg-bottom-controls').removeClass('cs-mode');
    mapviewer.csMap.map = null;
  },

  /**
   * Adds listeners to cesium controls buttons
   */
  addControlsListeners: function () {
    $('.oneg-right-inner-controls .ol-zoom-in').click(mapviewer.csMap.zoomIn);
    $('.oneg-right-inner-controls .ol-zoom-out').click(mapviewer.csMap.zoomOut);
    $('.oneg-right-inner-controls .ol-zoom-extent button').click(mapviewer.csMap.zoomToHome);
    $('.oneg-right-inner-controls .ol-full-screen button').click(mapviewer.csMap.enableFullScreen);

  },

  /**
   * Zooms cesium map in
   */
  zoomIn: function () {
    mapviewer.csMap.map.camera.zoomIn(500000.0);
  },

  /**
   * Zooms cesium map out
   */
  zoomOut: function () {
    mapviewer.csMap.map.camera.zoomOut(500000.0);
  },

  /**
   * Activate navigator full screen for cesium map
   */
  enableFullScreen: function () {
    Cesium.Fullscreen.requestFullscreen(mapviewer.csMap.map.canvas);
  },

  /**
   * Adds layer to map and sets it in layer data
   * @param {JSON} layer - layer data
   */
  addLayer: function (layer) {
    if (layer.sourceParams.type === "WMS") {
      var params = _.clone(layer.sourceParams.params) || {};
      _.defaults(params, {
        transparent: 'true',
        format: 'image/png'
      });
      layer.csLayer = mapviewer.csMap.map.scene.imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
        url: new Cesium.Resource({
          url: layer.url,
          proxy: mapviewer.csMap.proxy
        }),
        parameters: params
      }));
      layer.csLayer.show = layer.visible;
      layer.csLayer.alpha = layer.opacity;
    }
  },

  /**
  * Removes given layer from map
  * @param {JSON} layer - layer to remove, from layer list
  */
  removeLayer: function (layer) {
    if (layer.csLayer) {
      mapviewer.csMap.map.scene.imageryLayers.remove(layer.csLayer, true);
    }
  },

  /**
  * Gets current map extent
  * @return {number[]}
  */
  getCurrentExtent: function () {
    var scratchRectangle = new Cesium.Rectangle();
    var rectangle = mapviewer.csMap.map.camera.computeViewRectangle(mapviewer.csMap.map.scene.globe.ellipsoid, scratchRectangle);
    return [
      Cesium.Math.toDegrees(rectangle.west),
      Cesium.Math.toDegrees(rectangle.south),
      Cesium.Math.toDegrees(rectangle.east),
      Cesium.Math.toDegrees(rectangle.north)
    ];
  },

  /**
  * Gets current map scale
  * @return {number}
  */
  getCurrentScale: function () {
    var positions = Cesium.Cartesian3.fromDegreesArray(mapviewer.csMap.getCurrentExtent());

    var surfacePositions = Cesium.PolylinePipeline.generateArc({
      positions: positions
    });

    var scratchCartesian3 = new Cesium.Cartesian3();
    var surfacePositionsLength = surfacePositions.length;
    var totalDistanceInMeters = 0;
    for (var i = 3; i < surfacePositionsLength; i += 3) {
      scratchCartesian3.x = surfacePositions[i] - surfacePositions[i - 3];
      scratchCartesian3.y = surfacePositions[i + 1] - surfacePositions[i - 2];
      scratchCartesian3.z = surfacePositions[i + 2] - surfacePositions[i - 1];
      totalDistanceInMeters += Cesium.Cartesian3.magnitude(scratchCartesian3);
    }
    if (totalDistanceInMeters >= 20000000.0) {
      totalDistanceInMeters = 60000000
    }
    return totalDistanceInMeters;
  },

  /**
  * Changes current background layer displayed
  */
  updateBgLayers: function () {
    _.each(mapviewer.config.bgLayers, function (bgLayer) {
      bgLayer.csLayer.show = bgLayer.visible;
    });
  },

  /**
   * Sets map view center to new coordinates
   * @param {number[]} lonLat - new coordinates to go to
   * @param {boolean} closeZoom - if true, set zoom to 9 instead of 5
   */
  goToCoord: function (lonLat, closeZoom) {
    var zoom = 6000000.0;
    if (closeZoom) {
      zoom = 450000.0;
    }
    mapviewer.csMap.map.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(lonLat[0], lonLat[1], zoom)
    });

  },

  /**
   * Zooms to cesium home (whole planet)
   */
  zoomToHome: function () {
    mapviewer.csMap.map.camera.flyHome();
  },

  /**
   * Zooms to given layer extent
   * @param {number[]} extent - extent to zoom
   */
  zoomToExtent: function (extent) {
    var rectangle = Cesium.Rectangle.fromDegrees(extent[0], extent[1], extent[2], extent[3]);
    mapviewer.csMap.map.camera.flyTo({
      destination: rectangle
    });
  },

  /**
   * Changes layer position map layer list
   * @param {JSON} layer - layer to zoom, from layers list
   * @param {number} from - origin index in list
   * @param {number} to - destination index in list
   */
  moveLayer: function (layer, from, to) {
    if (layer.csLayer) {
      if (from < to) {
        for (var i = from + 1; i <= to; i++) {
          mapviewer.csMap.map.scene.imageryLayers.raise(layer.csLayer);
        }
      } else if (from > to) {
        for (var i = from - 1; i >= to; i--) {
          mapviewer.csMap.map.scene.imageryLayers.lower(layer.csLayer);
        }
      }
    }
  },

  /**
   * Sets given layer visibility
   * @param {JSON} layer - layer to zoom, from layers list
   * @param {boolean} isVisible - visibility
   */
  setVisible: function (layer, isVisible) {
    layer.csLayer.show = isVisible;
  },

  /**
   * Sets given layer opacity
   * @param {JSON} layer - layer to zoom, from layers list
   * @param {number} opacity - opacity
   */
  setOpacity: function (layer, opacity) {
    layer.csLayer.alpha = opacity;
  },

  markGfiPosition: function (coords) {
    mapviewer.csMap.map.scene.primitives.removeAll();
    if (coords) {
      var billboards = mapviewer.csMap.map.scene.primitives.add(new Cesium.BillboardCollection());
      billboards.add({
        position: Cesium.Cartesian3.fromDegrees(coords[0], coords[1], 0),
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        image: location.pathname + "images/map-marker.png"
      });
    }
  }

}
