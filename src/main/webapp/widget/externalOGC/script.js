/**
 * Import layers from files widget
 */
var externalOGC = {
  /**
   * GetCapabilites result
   * @type {Object}
   */
  capabilities: {},

  /**
   * X max of WCS imported file full extent
   * @type {number}
   */
  xmaxFullExt: 0,

  /**
   * Y max of WCS imported file full extent
   * @type {number}
   */
  ymaxFullExt: 0,

  /**
   * X min of WCS imported file full extent
   * @type {number}
   */
  xminFullExt: 0,

  /**
   * Y min of WCS imported file full extent
   * @type {number}
   */
  yminFullExt: 0,

  /**
   * WCS extent layer
   * @type {ol.layer.Vector|Null}
   */
  extentLayer: null,

  /**
   * WCS bbox layer
   * @type {ol.layer.Vector|Null}
   */
  bboxLayer: null,

  /**
   * Draw extent interaction
   * @type {ol.interaction.DragBox|Null}
   */
  draw: null,

  /**
   * Current bbox coverage extent
   * @type {number[]}
   */
  bboxCoverageExtent: [],

  /**
   * Imported WMC map
   * @type {ol.Map}
   */
  mapToImport: null,

  /**
   * Imported KML map
   * @type {ol.Map}
   */
  kmlMapToImport: null,

  /**
   * Initializes widget
   */
  init: function (options) {
    //plug the events
    externalOGC.addListeners();

    if (!mapviewer.config.tools.wfsLayers.enable) {
      $('#OGCChoiceWFS').closest('div').remove();
    }
    if (mapviewer.urlParams.serviceType && mapviewer.urlParams.serviceType.toLowerCase() === 'wmc' && mapviewer.urlParams.serviceUrl) {
      $('#import-wmc-url').val(mapviewer.urlParams.serviceUrl);
      $('#externalOGC .import-wmc-form').trigger('submit');
      if (!$('a[href="#menu-datasets"]').closest('li').hasClass('active')) {
        setTimeout(function () {
          $('a[href="#menu-datasets"]').click();
        }, 500);
      }
    }
  },

  /**
   * Disables drawing for 3D mode, enables it for 2D mode
   */
  handleMapMode: function () {
    if (mapviewer.map.currentMap === "ol") {
      $('.active-import').show();
      $('.no-import').hide();
      $('#import-from-url input[name="OGCChoice"]').prop('disabled', false);
    } else {
      $('.active-import').hide();
      $('.no-import').show();
      $('#OGCChoiceWMS').prop('checked', true);
      $('#import-from-url input[name="OGCChoice"]').prop('disabled', true);
      if ($('#OGCChoiceWCS').prop('checked')) {
        $('#externalOGC .externalOGCResult').html('');
        $("#externalOGC .externalOGCMetadata").hide();
        $('#externalOGC .add-button').hide();
      }
    }
  },

  /**
   * Creates widget listeners
   */
  addListeners: function () {
    $('.main-tabs a').on('show.bs.tab', externalOGC.onTabChange);
    $('.sidebar-tabs a').on('click', externalOGC.onPanelChange);

    $('#externalOGC .import-form').on("submit", function (e) {
      e.preventDefault();
      if ($('#OGCChoiceWMS').prop('checked')) {
        externalOGC.launchGetCapabilities('WMS');
      } else if ($('#OGCChoiceWCS').prop('checked')) {
        externalOGC.launchGetCapabilities('WCS');
      } else if ($('#OGCChoiceWFS').prop('checked')) {
        externalOGC.launchGetCapabilities('WFS');
      }
    });

    $('#externalOGC .import-wmc-form').on("submit", function (e) {
      e.preventDefault();
      var defer = $.Deferred();

      if ($('#import-wmc-url-tab').hasClass('active')) {
        var url = $('#import-wmc-url').val();
        if (url) {
          $('#import-loader').show();
          $.ajax({
            type: 'GET',
            url: "proxyxml?url=" + encodeURIComponent(url),
            dataType: "text",
            timeout: 60000
          }).done(function (result) {
            try {
              if (window.DOMParser) {
                var parser = new DOMParser();
                result = parser.parseFromString(result, "text/xml");
              } else { // Internet Explorer
                var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = false;
                xmlDoc.loadXML(result);
                result = xmlDoc;
              }
              externalOGC.mapToImport = mapviewer.tools.parseXML(result, { Layer: true, OnlineResource: true, Server: true });
              defer.resolve();
            } catch (e) {
              toastr.error(i18next.t('import.parseWMCError'));
              defer.reject(e);
            }
          }).fail(function (error) {
            toastr.error(i18next.t('import.getWMCError'));
            defer.reject(e);
          });
        } else {
          toastr.error(i18next.t('import.noWMCUrlError'));
          defer.reject(e);
        }
      } else {
        defer.resolve();
      }

      defer.done(function () {
        if (externalOGC.mapToImport) {
          externalOGC.importMap();
        }
      });
    });

    $('#externalOGC .import-kml-form').on("submit", function (e) {
      e.preventDefault();
      if (externalOGC.kmlMapToImport) {
        externalOGC.importKmlMap();
      }
    });

    $('#externalOGC input[type="file"]').change(function (e) {
      var $label = $(this).siblings('label');
      var reader = new FileReader();
      var id = $(this).attr('id');
      $label.text(e.target.files[0].name);

      reader.onload = (function (file) {
        return function (e) {
          try {
            var result = e.target.result.replace(/\r\n/g, '').replace(/[\r\n]/g, '').replace(/(>)\s+(<)/g, '$1$2');

            if (window.DOMParser) {
              var parser = new DOMParser();
              result = parser.parseFromString(result, "text/xml");
            } else { // Internet Explorer
              var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
              xmlDoc.async = false;
              xmlDoc.loadXML(result);
              result = xmlDoc;
            }
            if (id === "import-file") {
              externalOGC.mapToImport = mapviewer.tools.parseXML(result, { Layer: true, OnlineResource: true, Server: true });
            } else if (id === "import-kml-file") {
              externalOGC.kmlMapToImport = mapviewer.tools.parseXML(result);
            }
            $label.removeClass('error');
          } catch (e) {
            console.error(e);
            if (id === "import-file") {
              externalOGC.mapToImport = null;
            } else if (id === "import-kml-file") {
              externalOGC.kmlMapToImport = null;
            }
            $label.addClass('error');
          }
        };
      })(e.target.files[0]);

      reader.readAsText(e.target.files[0]);
    });

    $("#externalOGC .add-button").on("click", "", externalOGC.manageAddLayer);
    $('#externalOGC .externalOGCResult')
      .on("click", ".tree-list .item-title", externalOGC.showHideSubLayers)
      .on('change', '#CoverageIDget', externalOGC.setCoverageExtent.bind(this, false))
      .on('change', '#fullExt', externalOGC.onFullCoverage.bind(this))
      .on('change', '#subsetExt', externalOGC.onSubset.bind(this))
      .on('click', '#viewFullExtentBtn', externalOGC.setCoverageExtent.bind(this, true))
      .on('click', '#getCoverageBtn', externalOGC.getCoverage.bind(this));
  },

  /**
   * Expands or collapses tree list subitems
   */
  showHideSubLayers: function () {
    var $list = $(this).siblings('ul');
    $list.toggle();
    if ($list.css('display') === 'none') {
      $(this).find('.fa').removeClass('fa-minus').addClass('fa-plus');
    } else {
      $(this).find('.fa').removeClass('fa-plus').addClass('fa-minus');
    }
  },

  /**
   * Does GetCapabilities with url to import
   */
  launchGetCapabilities: function (serviceTypeParam) {
    externalOGC.disableWCSImportFeatures();
    var serviceType = serviceTypeParam;
    var wmsURL = $("#externalOGC .externalOGCSearchInput").val();
    if (wmsURL) {
      $("#externalOGC .externalOGCResult").html("");
      $("#externalOGC .externalOGCMetadata").hide();
      $('#externalOGC .add-button').hide();
      $("#externalOGC .loadingResultsOGC").show();

      mapviewer.tools.getCapabilities(wmsURL, serviceTypeParam)
        .done(function (capabilities) {
          externalOGC.capabilities = capabilities;
          if (serviceType === 'WMS') {
            externalOGC.showWMSGetCapabilities("#externalOGC .externalOGCResult");
          } else if (serviceType === 'WCS') {
            externalOGC.showWCSGetCapabilities("#externalOGC .externalOGCResult");
          } else if (serviceType === 'WFS') {
            externalOGC.capabilities.ServiceUrl = wmsURL;
            externalOGC.showWFSGetCapabilities("#externalOGC .externalOGCResult");
          }
        })
        .fail(function (e) {
          console.error(e);
          $("#externalOGC .loadingResultsOGC").hide();
          $("#externalOGC .externalOGCResult").show();
          $("#externalOGC .externalOGCResult").html(i18next.t("export.urlError"));
        });
    }
  },

  /**
   * Display full extent of imported WCS selected coverage
   */
  onFullCoverage: function () {
    if (externalOGC.bboxLayer) {
      externalOGC.bboxLayer.getSource().clear();
    }
    if ($('#fullExt').prop('checked')) {
      if (externalOGC.draw) {
        mapviewer.olMap.map.removeInteraction(externalOGC.draw);
      }
      $("#xmin").text(externalOGC.xminFullExt);
      $("#ymin").text(externalOGC.yminFullExt);
      $("#xmax").text(externalOGC.xmaxFullExt);
      $("#ymax").text(externalOGC.ymaxFullExt);
      $("#bboxHelp").hide();
    }

  },

  /**
   * Enable bbox draw
   */
  onSubset: function () {
    externalOGC.addInteraction();
    $("#xmin").text("");
    $("#ymin").text("");
    $("#xmax").text("");
    $("#ymax").text("");

    $("#bboxHelp").show();
  },

  /**
   * Enable bbox draw to select extent in imported WCS selected coverage
   */
  addInteraction: function () {
    externalOGC.draw = new ol.interaction.DragBox({
      condition: ol.events.condition.platformModifierKeyOnly
    });

    externalOGC.draw.on('boxend', function (e) {
      externalOGC.bboxLayer.getSource().clear();
      externalOGC.bboxCoverageExtent = e.target.getGeometry().getExtent();
      $("#xmin").text(externalOGC.bboxCoverageExtent[0]);
      $("#ymin").text(externalOGC.bboxCoverageExtent[1]);
      $("#xmax").text(externalOGC.bboxCoverageExtent[2]);
      $("#ymax").text(externalOGC.bboxCoverageExtent[3]);

      externalOGC.bboxLayer.getSource().addFeature(
        new ol.Feature({
          geometry: ol.geom.Polygon.fromExtent(externalOGC.bboxCoverageExtent)
        })
      );
    });

    mapviewer.olMap.map.addInteraction(externalOGC.draw);
  },

  /**
   * Draws imported WCS selected coverage extent and zoom on it
   * @param {boolean} zoomTo - must zoom to extent
   */
  setCoverageExtent: function (zoomTo) {
    if (externalOGC.extentLayer) {
      externalOGC.extentLayer.getSource().clear();
    }

    var bboxString = $('#CoverageIDget').val().split('|')[0];
    if (!bboxString) {
      $("#bboxHelp").hide();
      return;
    }
    var bbox = bboxString.split(",");

    externalOGC.xminFullExt = Number(bbox[0]);
    externalOGC.yminFullExt = Number(bbox[1]);
    externalOGC.xmaxFullExt = Number(bbox[2]);
    externalOGC.ymaxFullExt = Number(bbox[3]);

    externalOGC.onFullCoverage();

    var thing = ol.geom.Polygon.fromExtent(ol.proj.transformExtent(bbox, 'EPSG:4326', mapviewer.map.getCurrentProjection()));

    var style = new ol.style.Style({
      stroke: new ol.style.Stroke({
        width: 3,
        color: '#ff0000',
        lineDash: [0.1, 5]
      }),
      zIndex: 2
    })
    var featurething = new ol.Feature({
      name: "Thing",
      geometry: thing
    });
    featurething.setStyle(style);

    externalOGC.extentLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        wrapX: false,
        features: [featurething]
      })
    });

    externalOGC.bboxLayer = new ol.layer.Vector({
      source: new ol.source.Vector({ wrapX: false })
    });

    mapviewer.olMap.map.addLayer(externalOGC.extentLayer);
    mapviewer.olMap.map.addLayer(externalOGC.bboxLayer);

    // Zoom to WCS extent
    if (zoomTo) {
      mapviewer.map.zoomToExtent(externalOGC.extentLayer.getSource().getExtent());
    }
  },

  /**
   * Imports layer from coverage
   */
  getCoverage: function () {
    $('.menuLayerCounter .layerCount').addClass('loading');
    var wcsURL = $("#externalOGC .externalOGCSearchInput").val();
    var selectedCoverage = $("#CoverageIDget option:selected");
    if (!selectedCoverage.val() || !$("#xmin").text()) {
      return;
    }
    var id = selectedCoverage.val().split('|')[1];

    var layerData = {
      id: id,
      layername: id,
      url: wcsURL,
      type: 'layer',
      dataUrl: wcsURL,
      opacity: 0.7
    };

    // Image layer from WCS
    if (document.getElementById("fullExt").checked == true) {
      layerData.extentWcs = externalOGC.extentLayer.getSource().getExtent();
    } else {
      layerData.extentWcs = [
        Number($("#xmin").text()),
        Number($("#ymin").text()),
        Number($("#xmax").text()),
        Number($("#ymax").text())
      ];
    }

    layerData.serviceType = "WCS";

    mapviewer.map.addLayers([layerData])
      .done(function () {
        $("#externalOGC .externalOGCResult .tree-list input[type=checkbox]:checked").prop('checked', false);
        $('a[href="#layer-switcher"]').click();
        $('.menuLayerCounter .layerCount').removeClass('loading');
      });
  },

  /**
   * Creates HTML of import according to WCS GetCapabilities
   * @param {String} treeContainer - html tree container selector
   */
  showWCSGetCapabilities: function (treeContainer) {
    $("#OGCServerTitle").html(externalOGC.capabilities.ServiceIdentification.Title);
    $("#OGCServerAbstract").html(externalOGC.capabilities.ServiceIdentification.Abstract);
    $("#OGCServerConstraint").html(externalOGC.capabilities.ServiceIdentification.AccessConstraints);

    var html = '<div id="docs">';

    html += '<div class="form-group">';
    html += '<label for="CoverageIDget" class="import-url-label">Coverage identifier</label>';
    html += '<select id="CoverageIDget" class="form-control">';

    var obj = externalOGC.capabilities.Contents.CoverageSummary;
    for (var i in obj) {
      html += '<option value="' + obj[i].BoundingBox.LowerCorner.replace(" ", ",") + ',' + obj[i].BoundingBox.UpperCorner.replace(" ", ",") + '|' + obj[i].CoverageId.replace(':', '__') + '">' + obj[i].Title + '</option>';
    }

    html += '</select>';
    html += '</div>';
    html += '<div class="form-group">';
    html += '<div class="classic-radio">';
    html += '<input id="fullExt" type="radio" name="r1" value="full" checked />';
    html += '<label for="fullExt">Full coverage</label>';
    html += '</div>';
    html += '<div class="classic-radio">';
    html += '<input id="subsetExt" type="radio" name="r1" value="subset" />';
    html += '<label for="subsetExt">Subset</label>';
    html += '</div>';
    html += '</div>';
    html += '<div class="row">';
    html += '<div class="col-xs-12 col-md-6">';
    html += '<p class="bbox-coord"><b>Xmin: </b> <span id="xmin">0</span></p>';
    html += '</div>';
    html += '<div class="col-xs-12 col-md-6">';
    html += '<p class="bbox-coord"><b>Ymin: </b> <span id="ymin">0</span></p>';
    html += '</div>';
    html += '</div>';
    html += '<div class="row">';
    html += '<div class="col-xs-12 col-md-6">';
    html += '<p class="bbox-coord"><b>Xmax: </b> <span id="xmax">0</span></p>';
    html += '</div>';
    html += '<div class="col-xs-12 col-md-6">';
    html += '<p class="bbox-coord"><b>Ymax: </b> <span id="ymax">0</span></p>';
    html += '</div>';
    html += '</div>';
    html += '<p id="bboxHelp"><b>Ctrl+Click+Drag to draw BBOX</b></p>';
    html += '<div class="form-group">'
    html += '<button id="viewFullExtentBtn" class="btn btn-primary extent-btn" type="button">Go to extent</button>';
    html += '<button id="getCoverageBtn" class="btn btn-primary import-btn" type="button">Import from coverage</button>';
    html += '</div>';


    $(treeContainer).append(html)
      .localize()
      .show();
    $('#externalOGC .add-button').hide();
    externalOGC.setCoverageExtent(false)
    $("#externalOGC .externalOGCMetadata").show();
    $("#externalOGC .loadingResultsOGC").hide();
  },

  /**
   * Creates HTML of import according to WMS GetCapabilities
   * @param {String} treeContainer - html tree container selector
   */
  showWMSGetCapabilities: function (treeContainer) {
    var groupLayerList = externalOGC.capabilities.Capability.Layer.Layer;

    $("#OGCServerTitle").html(externalOGC.capabilities.Service.Title);
    $("#OGCServerAbstract").html(externalOGC.capabilities.Service.Abstract);
    $("#OGCServerConstraint").html(externalOGC.capabilities.Service.AccessConstraints);

    var html = '<ul class="tree-list">';

    html += '<li>';
    html += '<span class="item-title"><i class="fa fa-minus"></i> ' + externalOGC.capabilities.Service.Title + '</span>';
    html += '<ul style="display: block">';


    html += externalOGC.parcoursNoeud(groupLayerList, 1);
    html += '</ul>'
    html += '<li></ul>';

    $(treeContainer).append(html)
      .localize()
      .show();
    $('#externalOGC .add-button').show();
    $("#externalOGC .externalOGCMetadata").show();

    //hide second level layer list
    $(".level2name").hide();
    $("#externalOGC .loadingResultsOGC").hide();
  },

  showWFSGetCapabilities: function (treeContainer) {
    $("#OGCServerTitle").html(externalOGC.capabilities.ServiceIdentification.Title);
    $("#OGCServerAbstract").html(externalOGC.capabilities.ServiceIdentification.Abstract);
    $("#OGCServerConstraint").html(externalOGC.capabilities.ServiceIdentification.AccessConstraints);

    var html = '<ul class="tree-list">';

    html += '<li>';
    html += '<span class="item-title"><i class="fa fa-minus"></i> ' + externalOGC.capabilities.ServiceIdentification.Title + '</span>';
    html += '<ul style="display: block">';

    var visibleLayerCount = 0;
    _.each(externalOGC.capabilities.FeatureTypeList.FeatureType, function (layer, id) {
      if (!layer.OutputFormats || layer.OutputFormats.Format.indexOf('application/json') >= 0) {
        var upperCorner = layer.WGS84BoundingBox.UpperCorner.split(" ").map(parseFloat);
        var lowerCorner = layer.WGS84BoundingBox.LowerCorner.split(" ").map(parseFloat);
        var bbox = [lowerCorner[0], lowerCorner[1], upperCorner[0], upperCorner[1]];
        html += '<li class="classic-checkbox">';
        html += '<input type="checkbox" id="externalOGCLayer' + id + '" ' +
          'data-extent="' + bbox.join(',') + '" ' +
          'data-layername="' + layer.Name + '"' +
          'data-service-type="WFS" />';
        html += '<label for="externalOGCLayer' + id + '">' + layer.Title + '</label>';
        html += '</li>';
        visibleLayerCount++;
      }
    });

    html += '</ul>'
    html += '<li></ul>';

    if (visibleLayerCount === 0) {
      html = '<p class="bg-info">' + i18next.t('import.noWFSAvailable') + '</p>';
    }

    $(treeContainer).append(html)
      .localize()
      .show();

    $('#externalOGC .add-button').show();
    $("#externalOGC .externalOGCMetadata").show();
    $("#externalOGC .loadingResultsOGC").hide();
  },

  /**
   * Creates HTML tree item (recursive)
   * @param {Object} treeNode - layer node of GetCapabilities
   * @param {number} id - id of current item
   */
  parcoursNoeud: function (treeNode, id) {
    if (!treeNode) return "";
    if (!_.isArray(treeNode)) treeNode = [treeNode];
    var html = "";
    for (var i = 0; i < treeNode.length; i++) {
      if (treeNode[i].Layer) {
        html += '<li>';
        html += '<span class="item-title"><i class="fa fa-plus"></i> ' + treeNode[i].Title + '</span>';
        html += '<ul>';
        html += externalOGC.parcoursNoeud(treeNode[i].Layer, id);
        html += '</ul>';
        id += treeNode[i].Layer.length;
      } else {
        var bbox = treeNode[i].EX_GeographicBoundingBox || treeNode[i].LatLonBoundingBox || [];
        html += '<li class="classic-checkbox">';
        html += '<input type="checkbox" id="externalOGCLayer' + id + '" ' +
          'data-extent="' + bbox.join(',') + '" ' +
          'data-layername="' + treeNode[i].Name + '"' +
          'data-service-type="WMS" />';
        html += '<label for="externalOGCLayer' + id + '">' + treeNode[i].Title + '</label>';
      }

      id++;

      html += "</li>";
    }
    return html;
  },

  /**
   * Adds checked layers in import layer list if they aren't already in the map
   */
  manageAddLayer: function () {
    $('.menuLayerCounter .layerCount').addClass('loading');
    var addedIds = [];
    var layersData = [];
    $("#externalOGC .externalOGCResult .tree-list input[type=checkbox]:checked").each(function () {
      var layerData = Object.assign({}, $(this).data());
      layerData.id = $(this).attr('id').replace('externalOGCLayer', '');
      // layerData.title = $(this).siblings('label').text();
      layerData.extent = layerData.extent.split(",").map(Number);
      layerData.type = 'layer';
      if (layerData.serviceType === "WFS") {
        layerData.url = externalOGC.capabilities.ServiceUrl;
      } else {
        layerData.url = externalOGC.capabilities.Capability.Request.GetCapabilities.DCPType[0].HTTP.Get.OnlineResource;
      }
      layerData.version = externalOGC.capabilities.version;
      // layerData.serviceType = "WMS";
      layerData.opacity = layerData.serviceType === "WFS" ? 1 : 0.7;
      if (addedIds.indexOf(layerData.id) < 0) {
        layersData.push(layerData);
        addedIds.push(layerData.id);
      }
    });
    mapviewer.map.addLayers(layersData)
      .done(function () {
        $("#externalOGC .externalOGCResult .tree-list input[type=checkbox]:checked").prop('checked', false);
        $('a[href="#layer-switcher"]').click();
        $('.menuLayerCounter .layerCount').removeClass('loading');
      });

  },

  /**
   * Toggles WCS import features on main tab change
   */
  onTabChange: function () {
    if ($('#CoverageIDget').length > 0) {
      if ($(this).attr('href') == '#import-layer') {
        externalOGC.enableWCSImportFeatures();
      } else if ($('#import-layer').hasClass('active')) {
        externalOGC.disableWCSImportFeatures();
      }
    }
  },

  /**
   * Toggles WCS import features on main panel change
   */
  onPanelChange: function () {
    if ($('#import-layer').hasClass('active') && $('#CoverageIDget').length > 0) {
      if (!$(this).parent().hasClass('active') && $(this).attr('href') == '#menu-datasets') {
        externalOGC.enableWCSImportFeatures();
      } else if (
        ($(this).parent().hasClass('active') && $(this).attr('href') == '#menu-datasets') ||
        ($(this).attr('href') != '#menu-datasets' && $('#menu-datasets').hasClass('active'))
      ) {
        externalOGC.disableWCSImportFeatures();
      }
    }
  },

  /**
   * Disables WCS import layers and interactions
   */
  disableWCSImportFeatures: function () {
    if (externalOGC.extentLayer) {
      mapviewer.olMap.map.removeLayer(externalOGC.extentLayer);
    }
    if (externalOGC.bboxLayer) {
      mapviewer.olMap.map.removeLayer(externalOGC.bboxLayer);
    }
    if (externalOGC.draw) {
      mapviewer.olMap.map.removeInteraction(externalOGC.draw);
    }
  },

  /**
   * Enables WCS import layers and interactions
   */
  enableWCSImportFeatures: function () {
    if (externalOGC.extentLayer) {
      mapviewer.olMap.map.addLayer(externalOGC.extentLayer);
    }
    if (externalOGC.bboxLayer) {
      mapviewer.olMap.map.addLayer(externalOGC.bboxLayer);
    }
    if ($('#subsetExt').prop('checked') && externalOGC.draw) {
      mapviewer.olMap.map.addInteraction(externalOGC.draw);
    }
  },

  /**
   * Imports map from the chosen WMC file in the form and add its layers that aren't already in the map
   */
  importMap: function () {
    if (!externalOGC.mapToImport) {
      return;
    }
    $('#import-loader').show();

    mapviewer.map.cleanMap();

    $("#active-basic-datasets").prop('checked', false);

    if (externalOGC.mapToImport.ViewContext && externalOGC.mapToImport.ViewContext.LayerList && externalOGC.mapToImport.ViewContext.LayerList.Layer) {
      var layersData = [];
      if (!_.isArray(externalOGC.mapToImport.ViewContext.LayerList.Layer)) {
        externalOGC.mapToImport.ViewContext.LayerList.Layer = [externalOGC.mapToImport.ViewContext.LayerList.Layer];
      }
      _.each(externalOGC.mapToImport.ViewContext.LayerList.Layer, function (layer, i) {
        if (layer.attributes.queryable) {
          var url = layer.content.Server.content.OnlineResource.attributes.href;
          var version = layer.content.Server.attributes.version;
          var layerName = layer.content.Name;
          var mapLayer = _.find(mapviewer.config.bgLayers, function (bl) {
            return bl.url == url && bl.params.LAYERS == layerName;
          });

          if (!mapLayer) {
            layersData.push({
              layername: layerName,
              url: url,
              opacity: 0.7,
              type: 'layer',
              id: 'WMC' + i,
              titleAdd: '(WMC)',
              version: version || null,
              serviceType: 'WMS'
            });
          }
        }
      });
      if (layersData.length > 0) {
        mapviewer.map.addLayers(layersData)
          .done(function () {
            externalOGC.mapToImport = null;
            $('a[href="#layer-switcher"]').click();
            $('#import-loader').hide();
          });
      }
    }
  },

  /**
   * Imports map from the chosen KML file in the form and add its layers that aren't already in the map
   */
  importKmlMap: function () {
    if (!externalOGC.kmlMapToImport || $('#import-kml-loader').css('display') != 'none') {
      return;
    }
    $('#import-kml-loader').show();

    mapviewer.map.cleanMap();

    $("#active-basic-datasets").prop('checked', false);

    var layersData = [];
    _.each(externalOGC.kmlMapToImport.kml.Document.GroundOverlay, function (kmlLayer, i) {
      var url = kmlLayer.Icon.href.replace(/(^.*)\?.*$/, "$1");
      var mapLayer = _.find(mapviewer.config.bgLayers, function (bl) {
        return bl.url && bl.url.replace('?', '') === url && bl.params.LAYERS == kmlLayer.name;
      });
      if (!mapLayer) {
        layersData.push({
          layername: kmlLayer.name,
          url: url,
          opacity: 0.7,
          type: 'layer',
          id: 'KML' + i,
          titleAdd: '(KML)'
        });
      }

    });

    mapviewer.map.addLayers(layersData, true)
      .done(function () {
        externalOGC.kmlMapToImport = null;
        $('a[href="#layer-switcher"]').click();
        $('#import-kml-loader').hide();
      });

  }
};