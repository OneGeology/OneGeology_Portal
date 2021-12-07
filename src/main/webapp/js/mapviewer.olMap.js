/**
 * Openlayers map service
 */
mapviewer.olMap = {
  /**
   * Openlayers map object
   * @type {ol.Map}
   */
  map: null,

  /**
   * Mouse position control
   * @type {ol.Control.MousePosition}
   */
  mousePositionControl: null,

  /**
   * Overview map control
   * @type {ol.Control.OverviewMap}
   */
  overViewMap: null,

  /**
   * Is overview visibility in manual mode ?
   * @type {boolean}
   */
  overviewManualMode: false,

  /**
   * Layer for display gfi point
   * @type {ol.layer.Vector}
   */
  gfiPointLayer: null,

  /**
   * Initializes map
   * @param {JSON} bgLayers - background layers to set
   * @param {JSON} overviewBgLayer - default overview background layer to display
   */
  init: function (bgLayers, overviewBgLayer) {
    var initialProjection = _.find(mapviewer.config.projections, { code: mapviewer.config.defaultProjection });
    $('#olMap').addClass('active');
    $('#changeSRS').show();
    var mapLayers = mapviewer.olMap.generateBackgroundLayers(bgLayers);
    mapLayers.push(mapviewer.olMap.generateGfiPointLayer());

    var scaleLine = new ol.control.ScaleLine({
      target: $(".oneg-bottom-controls .scale-line-control")[0]
    });

    mapviewer.olMap.mousePositionControl = new ol.control.MousePosition({
      coordinateFormat: function (coordinate) {
        return ol.coordinate.format(coordinate, 'X:&nbsp;{x}&nbsp;Y:&nbsp;{y}', 4);
      },
      undefinedHTML: 'X:&nbsp;0&nbsp;Y:&nbsp;0',
      projection: initialProjection.code,
      target: $(".oneg-bottom-controls .mouse-position-control")[0]
    });

    mapviewer.olMap.overViewMap = new ol.control.OverviewMap({
      layers: mapviewer.olMap.generateBackgroundLayers([overviewBgLayer], true),
      view: new ol.View({
        projection: initialProjection.code
      }),
      label: $('<i class="fa fa-arrow-right"></i>')[0],
      collapseLabel: $('<i class="fa fa-arrow-left"></i>')[0],
      tipLabel: i18next.t('controls.overviewTitle')
    });

    var zoomToExtentControl = new ol.control.ZoomToExtent({
      label: $('<i class="fa fa-home"></i>')[0],
      target: $(".oneg-right-controls .oneg-right-inner-controls")[0],
      tipLabel: i18next.t('controls.zoomToExtentTitle')
    });

    var fullScreenControl = new ol.control.FullScreen({
      label: $('<i class="fa fa-expand-arrows-alt"></i>')[0],
      target: $(".oneg-right-controls .oneg-right-inner-controls")[0],
      tipLabel: i18next.t('controls.fullScreenTitle')
    });

    var attribution = new ol.control.Attribution({
      collapsible: false
    });

    mapviewer.olMap.map = new ol.Map({
      controls: ol.control.defaults({
        attribution: false,
        zoomOptions: {
          target: $(".oneg-right-controls .oneg-right-inner-controls")[0],
          zoomInLabel: $('<i class="fa fa-plus"></i>')[0],
          zoomInTipLabel: i18next.t('controls.zoomInTitle'),
          zoomOutLabel: $('<i class="fa fa-minus"></i>')[0],
          zoomOutTipLabel: i18next.t('controls.zoomOutTitle'),
        }
      }).extend([
        attribution,
        scaleLine,
        mapviewer.olMap.mousePositionControl,
        zoomToExtentControl,
        fullScreenControl,
        mapviewer.olMap.overViewMap
      ]),
      layers: mapLayers,
      loadTilesWhileInteracting: true,
      target: 'olMap',
      view: new ol.View({
        projection: initialProjection.code,
        center: ol.extent.getCenter(initialProjection.extent || [0, 0, 0, 0]),
        zoom: initialProjection.initialZoom
      })
    });

    mapviewer.olMap.map.on('singleclick', function (evt) {
      mapviewer.map.gfi.displayPanel(evt);
    });

    _.each(mapviewer.map.layers, function (layer) {
      mapviewer.olMap.addLayer(layer);
    });

    mapviewer.olMap.map.on('moveend', function (e) {
      if ($("#active-basic-datasets").prop('checked')) {
        mapviewer.autolayers.updateAutolayers();
      }
      mapviewer.olMap.updateOverviewVisibility();
      mapviewer.olMap.updateCurrentScale();
    });

    if (mapviewer.urlParams.extent || mapviewer.config.initialExtent) {
      var initialExtent = mapviewer.config.initialExtent;
      if (mapviewer.urlParams.extent) {
        initialExtent = mapviewer.urlParams.extent.split(',');
      }
      var extent = ol.proj.transformExtent(initialExtent, mapviewer.config.defaultProjection, mapviewer.map.getCurrentProjection());
      // var extent = ol.proj.transformExtent(initialExtent, "EPSG:4326", mapviewer.map.getCurrentProjection());
      mapviewer.olMap.map.getView().fit(extent);
    }

    $('.ol-overviewmap button').click(function () {
      mapviewer.olMap.overviewManualMode = true;
    });
  },

  /**
   * Destroys OL map
   */
  destroyMap: function () {
    $('#olMap').html('').removeClass('active');
    $('.oneg-right-inner-controls').html('');
    $('.scale-line-control').html('');
    $('.mouse-position-control').html('');
    $('#changeSRS').hide();
    mapviewer.olMap.map = null;
  },

  /**
   * Gets current map projection
   * @return {string}
   */
  getCurrentProjection: function () {
    if (mapviewer.olMap.map) {
      return mapviewer.olMap.map.getView().getProjection().getCode();
    }
    return 'EPSG:4326';
  },

  /**
   * Removes given layer from map
   * @param {JSON} layer - layer to remove, from layer list
   */
  removeLayer: function (layer) {
    if (layer.olLayer) {
      mapviewer.olMap.map.removeLayer(layer.olLayer);
    }
  },

  /**
   * Generates the list of OpenLayers' layers for given background layers
   * @param {JSON[]} bgLayers - Background layers to set in OpenLayers
   * @return {ol.layer[]}
   */
  generateBackgroundLayers: function (bgLayers, isOverviewLayer) {
    var mapLayers = [];
    _.each(bgLayers, function (bgLayer) {
      var mapLayer;
      switch (bgLayer.type) {
        case 'WMS':
          mapLayer = new ol.layer.Image({
            visible: isOverviewLayer ? true : bgLayer.visible,
            source: new ol.source.ImageWMS({
              url: bgLayer.url,
              params: bgLayer.params,
              ratio: 1,
              imageLoadFunction: mapviewer.olMap.imageLoadFromProxy
            })
          });
          if (!isOverviewLayer) {
            mapLayer.getSource().on('imageloadstart', bgLayer.onImageLoadStart);
            mapLayer.getSource().on('imageloadend', bgLayer.onImageLoadEnd);
          }
          break;
        case 'Bing':
          mapLayer = new ol.layer.Tile({
            visible: isOverviewLayer ? true : bgLayer.visible,
            preload: bgLayer.preload,
            source: new ol.source.BingMaps({
              key: bgLayer.params.key,
              imagerySet: bgLayer.params.imagerySet
            })
          });
          if (!isOverviewLayer) {
            mapLayer.getSource().on('tileloadstart', bgLayer.onImageLoadStart);
            mapLayer.getSource().on('tileloadend', bgLayer.onImageLoadEnd);
          }
          break;
        case 'OSM':
          var source;
          if (bgLayer.url) {
            source = new ol.source.OSM({ url: bgLayer.url });
          } else {
            source = new ol.source.OSM();
          }
          if (bgLayer.attributions) {
            source.setAttributions(bgLayer.attributions);
          }
          mapLayer = new ol.layer.Tile({
            visible: isOverviewLayer ? true : bgLayer.visible,
            source: source
          });
          if (!isOverviewLayer) {
            mapLayer.getSource().on('tileloadstart', bgLayer.onImageLoadStart);
            mapLayer.getSource().on('tileloadend', bgLayer.onImageLoadEnd);
          }
          break;
      }
      if (mapLayer) {
        mapLayers.push(mapLayer);
        if (!isOverviewLayer) {
          bgLayer.olLayer = mapLayer;
        }
      }
    });
    return mapLayers;
  },

  /**
   * Generates the gfi point display layer
   * @return {ol.layer.Vector}
   */
  generateGfiPointLayer: function () {
    var layer = new ol.layer.Vector({
      source: new ol.source.Vector({}),
      style: new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 0],
          anchorOrigin: 'bottom-left',
          src: location.pathname + "images/map-marker.png"
        })
      }),
      zIndex: 9999
    });
    mapviewer.olMap.gfiPointLayer = layer;
    return layer;
  },

  /**
   * Adds layer to map and sets it in layer data
   * @param {JSON} layer - layer data
   */
  addLayer: function (layer) {
    var source;
    if (layer.sourceParams.type === "WMS") {
      source = new ol.source.ImageWMS({
        url: layer.sourceParams.url,
        params: layer.sourceParams.params,
        ratio: 1.1,
        imageLoadFunction: mapviewer.olMap.imageLoadFromProxy
      });
      if (layer.onImageLoadStart) {
        source.on('imageloadstart', layer.onImageLoadStart);
      }
      if (layer.onImageLoadEnd) {
        source.on('imageloadend', layer.onImageLoadEnd);
      }
      if (layer.onImageLoadError) {
        source.on('imageloaderror', layer.onImageLoadError);
      }
    } else if (layer.sourceParams.type === 'WFS') {
      source = new ol.source.Vector({});
    } else {
      source = new ol.source.ImageStatic({
        url: layer.sourceParams.url,
        imageExtent: layer.sourceParams.imageExtent,
        imageLoadFunction: mapviewer.olMap.imageLoadFromProxy
      });
    }
    var currentProj = mapviewer.olMap.getCurrentProjection();
    var extent = layer.extent;
    if (currentProj === "EPSG:3413" || currentProj === "EPSG:3031") {
      extent = ol.proj.get(currentProj).getExtent();
    }
    var mapLayer;
    if (layer.sourceParams.type === 'WFS') {
      mapLayer = new ol.layer.Vector({
        idx: layer.idx,
        // extent: extent,
        visible: layer.visible,
        opacity: layer.opacity,
        source: source
      });
    } else {
      mapLayer = new ol.layer.Image({
        idx: layer.idx,
        extent: extent,
        visible: layer.visible,
        opacity: layer.opacity,
        source: source
      });
    }
    if (mapviewer.olMap.map) {
      mapviewer.olMap.map.addLayer(mapLayer);
    }
    layer.olLayer = mapLayer;
  },

  /**
   * Gets current map extent
   * @return {number[]}
   */
  getCurrentExtent: function () {
    return mapviewer.olMap.map.getView().calculateExtent(mapviewer.olMap.map.getSize());
  },

  /**
   * Gets current map scale
   * @return {number}
   */
  getCurrentScale: function () {
    var view = mapviewer.olMap.map.getView();
    var resolution = view.getResolution(); // => meters per pixel
    var mpu = view.getProjection().getMetersPerUnit(); // => meters per unit
    var dpi = 25.4 / 0.28; // => pixels per inch
    var ipu = 39.37; // => inches per unit
    var scale = null;
    if (mpu) {
      scale = resolution * dpi * mpu * ipu;
    }
    return scale;
  },

  updateCurrentScale: function () {
    if (mapviewer.config.tools.scalesZoom.enable) {
      var currentScale = mapviewer.olMap.getCurrentScale();
      var minimalDiff = Infinity;
      var nearestScale = null;
      _.each(mapviewer.config.tools.scalesZoom.scales, function (scale) {
        var diff = Math.abs(currentScale - scale);
        if (diff < minimalDiff) {
          minimalDiff = diff;
          nearestScale = scale;
        }
      });
      if (nearestScale) {
        $('#scales-list').find('span')
          .text('1 / ' + nearestScale)
          .data('value', nearestScale);
      }
    }
  },

  /**
   * Gets current map scale
   * @return {number}
   */
  getCurrentResolution: function () {
    return mapviewer.olMap.map.getView().getResolution();
  },

  /**
   * Changes map projection with new projection
   * @param {string} proj - new projection to apply
   */
  updateViewProjection: function (proj) {
    mapviewer.autolayers.removeAutoLayers();

    var newProj = ol.proj.get(proj);
    var newProjConfig = _.find(mapviewer.config.projections, { code: newProj.getCode() });
    if (!newProjConfig) {
      return;
    }
    var newProjExtent = newProj.getExtent();
    var newCenter = ol.extent.getCenter(newProjExtent || [0, 0, 0, 0]);

    mapviewer.monitoring.track("projection_change", newProj.getCode(), newProj.getCode());

    var bgLayer = _.find(mapviewer.config.bgLayers, { name: newProjConfig.defaultBgLayer });
    var overviewBgLayer = _.find(mapviewer.config.bgLayers, { name: newProjConfig.defaultBackgroundOverview });
    if (!bgLayer) {
      bgLayer = mapviewer.config.bgLayers[0];
    }
    if (!overviewBgLayer) {
      overviewBgLayer = bgLayer;
    }

    mapviewer.map.updateBgLayers(bgLayer);

    _.each(mapviewer.map.layers, function (layer) {
      if (layer.sourceParams.type !== "WFS") {
        if (proj === "EPSG:3413" || proj === "EPSG:3031") {
          layer.olLayer.setExtent(newProjExtent);
        } else {
          layer.olLayer.setExtent(layer.extent);
        }
      }
    });

    //update the map view with the new projection code
    var newView = new ol.View({
      projection: newProj,
      center: newCenter || [0.0],
      zoom: newProjConfig.initialZoom,
      extent: newProjExtent || undefined
    });
    mapviewer.olMap.map.setView(newView);
    mapviewer.olMap.mousePositionControl.setProjection(newProj);
    if (newProjConfig.homeExtent) {
      mapviewer.map.zoomToExtent(newProjConfig.homeExtent);
    }

    //Change the overwiewMap projection (and base layers...)
    mapviewer.olMap.map.removeControl(mapviewer.olMap.overViewMap);
    mapviewer.olMap.overViewMap = new ol.control.OverviewMap({
      layers: mapviewer.olMap.generateBackgroundLayers([overviewBgLayer], true),
      view: new ol.View({
        projection: newProj
      }),
      label: $('<i class="fa fa-arrow-right"></i>')[0],
      collapseLabel: $('<i class="fa fa-arrow-left"></i>')[0]
    });
    mapviewer.olMap.map.addControl(mapviewer.olMap.overViewMap);
    $('.ol-overviewmap button').click(function () {
      mapviewer.olMap.overviewManualMode = true;
    });
    mapviewer.olMap.map.render();
    var readdLayers = [];
    _.each(mapviewer.map.layers, function (layer, i) {
      if (layer.sourceParams.type === "WCS") {
        layer.layerData.mustMove = i;
        readdLayers.push(layer);
      }
      if (layer.sourceParams.type === "WFS") {
        mapviewer.olMap.updateWfsFeatures(layer);
      }
    });
    if (readdLayers.length > 0) {
      _.each(readdLayers, function (layer) {
        mapviewer.map.removeLayer(layer);
      });
      mapviewer.map.addLayers(readdLayers.map(function (layer) {
        return layer.layerData
      }))
        .then(function () {
          _.each(readdLayers, function (layer) {
            var l = _.findIndex(mapviewer.map.layers, { name: layer.name });
            if (l >= 0) {
              mapviewer.map.moveLayer(l, l.layerData.mustMove);
              delete l.layerData.mustMove;
            }
          });
        });
    }
  },

  /**
   * Changes current background layer displayed
   */
  updateBgLayers: function () {
    _.each(mapviewer.config.bgLayers, function (bgLayer) {
      bgLayer.olLayer.setVisible(bgLayer.visible);
    });
  },

  /**
   * Sets map view center to new coordinates
   * @param {number[]} lonLat - new coordinates to go to
   * @param {boolean} closeZoom - if true, set zoom to 9 instead of 5
   */
  goToCoord: function (lonLat, closeZoom) {
    var view = mapviewer.olMap.map.getView();
    view.setCenter(ol.proj.transform(lonLat, 'EPSG:4326', view.getProjection().getCode()));
    view.setZoom(closeZoom ? 9 : 5);
  },

  /**
   * Zooms to predefined extent according to current projection
   */
  zoomToHome: function () {
    var view = mapviewer.olMap.map.getView();
    var extentToZoom;
    var projConfig = _.find(mapviewer.config.projections, { code: mapviewer.map.getCurrentProjection() });

    if (projConfig) {
      extentToZoom = projConfig.homeExtent || projConfig.extent;
    } else {
      extentToZoom = view.getProjection().getExtent()
    }

    if (extentToZoom) {
      mapviewer.olMap.zoomToExtent(extentToZoom);
    }
  },

  /**
   * Zooms to given extent
   * @param {number[]} extent - extent to zoom
   */
  zoomToExtent: function (extent) {
    var right = 50;
    if ($('.sidebar-content.active').length > 0) {
      right += $('.sidebar-content.active').width();
    }
    mapviewer.olMap.map.getView().fit(extent, {
      constrainResolution: false,
      padding: [50, right, 50, 50],
      maxZoom: 20,
      duration: 500
    });
  },

  /**
   * Zooms to given scale
   * @param {number} scale Scale to zoom in (ex: 1000 for '1:1000')
   */
  zoomToScale: function (scale) {
    var view = mapviewer.olMap.map.getView();
    var mpu = view.getProjection().getMetersPerUnit(); // => meters per unit
    var dpi = 25.4 / 0.28; // => pixels per inch
    var ipu = 39.37; // => inches per unit
    var resolution;
    if (mpu) {
      resolution = scale / (dpi * mpu * ipu)
    }

    if (resolution) {
      view.setResolution(resolution);
    }
  },

  /**
   * Changes layer position map layer list
   * @param {JSON} layer - layer to move, from layers list
   * @param {number} to - destination index in list
   */
  moveLayer: function (layer, to) {
    mapviewer.olMap.map.removeLayer(layer.olLayer);
    mapviewer.olMap.map.getLayers().insertAt(to + mapviewer.config.bgLayers.length, layer.olLayer);
  },

  /**
   * Sets given layer visibility
   * @param {JSON} layer - layer to zoom, from layers list
   * @param {boolean} isVisible - visibility
   */
  setVisible: function (layer, isVisible) {
    layer.olLayer.setVisible(isVisible);
  },

  /**
   * Sets given layer opacity
   * @param {JSON} layer - layer to zoom, from layers list
   * @param {number} opacity - opacity
   */
  setOpacity: function (layer, opacity) {
    layer.olLayer.setOpacity(opacity);
  },

  /**
   * Updates given layer source params without overwrite no given params
   * @param {JSON} layer - layer to zoom, from layers list
   * @param {Object} params - new params to apply
   */
  updateSourceParams: function (layer, params) {
    layer.olLayer.getSource().updateParams(params);
    mapviewer.olMap.map.render();
  },

  /**
   * Overwrites given layer source
   * @param {JSON} layer - layer to zoom, from layers list
   * @param {Object} sourceParams - new params for new source created
   */
  updateSource: function (layer, sourceParams) {
    var source = new ol.source.ImageWMS({
      url: sourceParams.url,
      params: sourceParams.params,
      ratio: 1,
      imageLoadFunction: mapviewer.olMap.imageLoadFromProxy
    });
    layer.olLayer.setSource(source);
    mapviewer.olMap.map.render();
  },

  /**
   * Replaces all layer features
   * @param {*} layer layer to update
   * @param {*} featureCollection GeoJSON which contains the feature collection
   */
  updateWfsFeatures: function (layer) {
    var source = layer.olLayer.getSource();
    source.clear();
    if (layer.sourceParams.featureCollection) {
      var format = new ol.format.GeoJSON();
      var projection = mapviewer.map.getCurrentProjection();
      var features = format.readFeatures(layer.sourceParams.featureCollection, { featureProjection: projection });

      var color = mapviewer.tools.hexToRgb(layer.sourceParams.color);
      if (color) {
        mapviewer.olMap.generateFeaturesStyle(features, color);
      }
      source.addFeatures(features);
    }
  },

  /**
   * Generates the styles of the feature list
   * @param {ol.Feature[]} features Features to style
   * @param {*} color Color to apply
   */
  generateFeaturesStyle: function (features, color) {
    // Geometry types copied from https://openlayers.org/en/latest/apidoc/module-ol_geom_GeometryType.html
    var plainColor = [color.r, color.g, color.b, 1];
    var fadeColor = [color.r, color.g, color.b, 0.4];
    var width = 2;
    var styles = {};
    styles.Polygon = [
      new ol.style.Style({
        fill: new ol.style.Fill({
          color: plainColor
        })
      })
    ];
    styles.MultiPolygon = styles.Polygon;
    styles.LineString = [
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: fadeColor,
          width: width + 2
        })
      }),
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: plainColor,
          width: width
        })
      })
    ];
    styles.MultiLineString = styles.LineString;
    styles.Point = [
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: width * 2,
          fill: new ol.style.Fill({
            color: plainColor
          }),
          stroke: new ol.style.Stroke({
            color: fadeColor,
            width: width
          })
        }),
        zIndex: Infinity
      })
    ];
    styles.MultiPoint = styles.Point;
    styles.GeometryCollection = styles.Polygon.concat(styles.LineString, styles.Point);

    _.each(features, function (feature) {
      var style = styles[feature.getGeometry().getType()];
      if (style) {
        feature.setStyle(style);
      }
    });
  },

  /**
   * Updates overview visibility in proportion to current zoom
   */
  updateOverviewVisibility: function () {
    if (!mapviewer.olMap.overviewManualMode) {
      if (mapviewer.olMap.map.getView().getZoom() < 8) {
        mapviewer.olMap.overViewMap.setCollapsed(true);
      } else {
        mapviewer.olMap.overViewMap.setCollapsed(false);
      }
    }
  },

  /**
   * Marks position of current displayed gfi
   */
  markGfiPosition: function (coords) {
    mapviewer.olMap.gfiPointLayer.getSource().clear();
    if (coords) {
      mapviewer.olMap.gfiPointLayer.getSource().addFeature(new ol.Feature({
        geometry: new ol.geom.Point(coords)
      }));
    }
  },

  /**
   * Exports OL map to PDF
   * @param {number} resolution Resolution to export
   * @param {boolean} withLegends Export legends too ?
   */
  exportToPdf: function (resolution, withLegends) {
    toastr.info(i18next.t('export.exportPDFBegin'));

    // export parameters
    var dim = [297, 210]; // format A4
    var width = Math.round(dim[0] * resolution / 25.4);
    var height = Math.round(dim[1] * resolution / 25.4);
    var size = mapviewer.olMap.map.getSize();
    var viewResolution = mapviewer.olMap.map.getView().getResolution();

    mapviewer.olMap.map.once('rendercomplete', function () {
      var canvas = $('.ol-layer canvas')[0];
      var pdf = new jsPDF('landscape', undefined, 'a4');

      // first page : map snapshot
      pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, dim[0], dim[1]);
      mapviewer.olMap.map.setSize(size);
      mapviewer.olMap.map.getView().setResolution(viewResolution);

      // add logo
      var logoImg = $('#banniere1GG img')[0];
      var cLogo = document.createElement('canvas');
      cLogo.width = logoImg.naturalWidth;
      cLogo.height = logoImg.naturalHeight;
      cLogo.getContext('2d').drawImage(logoImg, 0, 0);

      var logoWidth = cLogo.width * 25.4 / resolution;
      var logoHeight = cLogo.height * 25.4 / resolution;

      pdf.addImage(cLogo.toDataURL('image/png'), 'PNG', 5, 5, logoWidth, logoHeight);

      // others pages : legends
      var calls = [];
      if (withLegends) {
        var legends = {};
        _.each(mapviewer.map.layers, function (layer, i) {
          if (layer.metadata.legendURL) {
            calls.push(
              mapviewer.tools.getImage(layer.metadata.legendURL)
                .then(function (dataImage) {
                  var defer = $.Deferred();
                  var img = new Image();
                  img.src = dataImage;
                  img.onload = function () {
                    // necessary use canvas for good image shape
                    var c = document.createElement('canvas');
                    c.width = img.naturalWidth;
                    c.height = img.naturalHeight;

                    c.getContext('2d').drawImage(img, 0, 0);
                    legends[i] = {
                      title: layer.title,
                      width: c.width,
                      height: c.height,
                      image: c.toDataURL('image/png')
                    };
                    defer.resolve();
                  }
                  img.onerror = function (err) {
                    defer.resolve();
                  }
                  return defer;
                })
            );
          }
        });
      } else {
        var defer = $.Deferred();
        calls.push(defer);
        defer.resolve();
      }

      $.when.apply(undefined, calls).then(function () {
        var keys = _.keys(legends).map(Number).sort();
        _.each(keys, function (i) {
          pdf.addPage('a4', 'portrait');
          pdf.text(legends[i].title, 5, 10);

          var cmHeight = legends[i].height * 25.4 / resolution;
          var cmWidth = legends[i].width * 25.4 / resolution;
          var ratio = cmWidth / cmHeight;

          if (cmHeight > 280) {
            cmHeight = 280;
            cmWidth = cmHeight * ratio;
          }

          if (cmWidth > 203) {
            cmWidth = 203;
            cmHeight = cmWidth / ratio;
          }

          pdf.addImage(legends[i].image, 'PNG', 5, 15, cmWidth, cmHeight);
        });

        // download final pdf
        pdf.save(mapviewer.config.appName + ' - export.pdf');
        toastr.success(i18next.t('export.exportPDFEnd'));
      }, function (e) {
        toastr.error(i18next.t('export.exportPDFError'));
      });
    });

    // resize map for trigger 'rendercomplete'
    mapviewer.olMap.map.setSize([width, height]);
    var scaling = Math.min(width / size[0], height / size[1]);
    mapviewer.olMap.map.getView().setResolution(viewResolution / scaling);
  },

  /**
   * Load image replacer for image layers, use proxy
   * @param {*} image
   * @param {string} url
   */
  imageLoadFromProxy: function (image, url) {
    if (!url) {
      image.getImage().src = "";
    } else {
      mapviewer.tools.getImage(url)
        .then(function (dataImage) {
          image.getImage().src = dataImage;
        }, function (e) {
          console.error(e);
          image.getImage().src = null;
        });
    }
  }

}
