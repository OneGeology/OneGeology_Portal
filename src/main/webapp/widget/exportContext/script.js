/**
 * Export map context widget
 * @constructor
 */
var exportContext = {
  /**
   * Initializes widget
   */
  init: function () {
    if (!mapviewer.config.tools.export.enable) {
      $('#exportContext .export-pdf-form').remove();
    }
    if (!mapviewer.config.tools.wfsLayers.enable) {
      $('.active-export .alert').remove();
    }
    exportContext.addEvents();
  },

  /**
   * Creates widget listeners
   */
  addEvents: function () {
    $('#exportContext .export-form').on('submit', function (e) {
      e.preventDefault();

      if ($(this).find('#exportChoiceWMC').prop('checked')) {
        exportContext.exportWMC();
      } else if ($(this).find('#exportChoiceKML').prop('checked')) {
        exportContext.exportKML();
      }
    });

    $('#exportContext .export-pdf-form').on('submit', function (e) {
      e.preventDefault();
      exportContext.exportToPDF();
    });
  },

  /**
   * Disables drawing for 3D mode, enables it for 2D mode
   */
  handleMapMode: function () {
    if (mapviewer.map.currentMap === "ol") {
      $('.active-export').show();
      $('.no-export').hide();
    } else {
      $('.active-export').hide();
      $('.no-export').show();
    }
  },

  /**
   * Converts map context as WMC file and download it
   */
  exportWMC: function () {
    var dataCleaned = exportContext.prepareMapExport();

    // Optionally allow the user to choose a file name by providing
    // an imput field in the HTML and using the collected data here
    var fileNameToSaveAs = $('#filenameInput').val();
    if (fileNameToSaveAs == "") {
      fileNameToSaveAs = "ViewSaveWMC.xml";
    } else if (/.xml/i.test(fileNameToSaveAs) == false) {
      fileNameToSaveAs = fileNameToSaveAs + ".xml";
    }

    $('#savewmcforminputwmc').val(dataCleaned);
    $('#savewmcforminputfilename').val(fileNameToSaveAs);
    document.savewmcform.submit();
  },

  /**
   * Converts map context as KML file and download it
   */
  exportKML: function () {
    var dataCleaned = exportContext.prepareMapExport();

    // Optionally allow the user to choose a file name by providing
    // an imput field in the HTML and using the collected data here
    var fileNameToSaveAs = $('#filenameInput').val();
    if (fileNameToSaveAs == "") {
      fileNameToSaveAs = "ViewSaveKML.kml";
    } else if (/.kml/i.test(fileNameToSaveAs) == false) {
      fileNameToSaveAs = fileNameToSaveAs + ".kml";
    }

    $('#savekmlforminputwmc').val(dataCleaned);
    $('#savekmlforminputfilename').val(fileNameToSaveAs);
    document.savekmlform.submit();
  },

  /**
   * Prepares map content for exporting
   * @return {string}
   */
  prepareMapExport: function () {
    if (mapviewer.map.currentMap !== 'ol') {
      return "";
    }
    var mapView = mapviewer.olMap.map.getView();
    var layers = [];
    _.each(mapviewer.map.layers, function (layer) {
      var source;
      if (layer.sourceParams.type === "WMS") {
        source = new ol.source.ImageWMS({
          url: layer.sourceParams.url,
          params: layer.sourceParams.params,
          ratio: 1.1,
          imageLoadFunction: mapviewer.olMap.imageLoadFromProxy
        });
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
      layers.push(mapLayer);
    });

    var exportMap = new ol.Map({
      target: 'export-map',
      layers: layers,
      view: new ol.View({
        projection: mapView.getProjection(),
        center: mapView.getCenter(),
        zoom: mapView.getZoom()
      })
    });

    var parserWMC = new ol.format.Wmc();

    $('#export-map').html('');
    var text = parserWMC.write(exportMap);

    var dataCleaned = text.replace(/p0:/g, "");
    dataCleaned = dataCleaned.replace(/:p0/g, "");
    dataCleaned = dataCleaned.replace(/:p[0-9]+/g, ":xlink");
    dataCleaned = dataCleaned.replace(/p[0-9]+:/g, "xlink:");

    return dataCleaned;
  },

  /**
   * Exports map to PDF format
   */
  exportToPDF: function () {
    if (mapviewer.map.currentMap === 'ol') {
      var resolution = Number($('#pdf-resolution').val());
      var withLegends = $('#pdf-with-legends').prop('checked');
      mapviewer.olMap.exportToPdf(resolution, withLegends);
    }
  }
};