/**
 * map
 * openlayers map manager
 */
mapviewer.map = {
  /**
   * Current active map indicator
   * @type {string}
   */
  currentMap: 'ol',

  /**
   * Current displayed layers configurations
   * @type {*[]}
   */
  layers: [],

  /**
   * Last layer id used
   * @type {number}
   */
  lastIdx: 0,

  /**
   * Initializes map
   */
  init: function () {
    var initialProjection = _.find(mapviewer.config.projections, { code: mapviewer.config.defaultProjection });
    if (!initialProjection) {
      alert('Bad SRS configuration, please contact an administrator');
      return;
    }
    var defaultBgLayer, defaultOverviewBgLayer;
    var firstLoad = true;
    _.each(mapviewer.config.bgLayers, function (bgLayer) {
      bgLayer.onImageLoadStart = function () {
        $("#loading").show();
      };

      bgLayer.onImageLoadEnd = function () {
        $("#loading").hide();
        if (firstLoad) {
          $('.full-screen-loader').addClass('loaded');
          setTimeout(function () {
            $('.full-screen-loader').remove();
          }, 1000);
          firstLoad = false;
        }
      };

      bgLayer.visible = false;
      if (bgLayer.name === initialProjection.defaultBgLayer) {
        defaultBgLayer = bgLayer;
      }
      if (bgLayer.name === initialProjection.defaultBackgroundOverview) {
        defaultOverviewBgLayer = bgLayer;
      }
    });

    if (!defaultBgLayer) {
      defaultBgLayer = mapviewer.config.bgLayers[0];
    }
    if (!defaultOverviewBgLayer) {
      defaultOverviewBgLayer = defaultBgLayer;
    }

    defaultBgLayer.visible = true;
    mapviewer.olMap.init(mapviewer.config.bgLayers, defaultOverviewBgLayer);

    mapviewer.map.initEvents();

    $('.oneg-right-controls .ol-control button').tooltip({ placement: 'right' });

  },

  /**
   * Creates map and document listeners for map functionality
   */
  initEvents: function () {
    $("#changeSRS .dropup a").on("click", function () {
      var proj = $(this).data('value');
      $('#srsList').data('value', proj);
      $('#srsList span').text($(this).text());
      mapviewer.map.updateViewProjection(proj);
      $('#changeSRS .srs-container').removeClass('active');
      var newProjConfig = _.find(mapviewer.config.projections, { code: proj });
      if (newProjConfig && $('#base-layers option[value="' + newProjConfig.defaultBgLayer + '"]').length === 0) {
        $('#base-layers').attr('disabled', true);
      } else {
        $('#base-layers').attr('disabled', false);
        $('#base-layers').val(newProjConfig.defaultBgLayer);
      }
    });

    $("#scalesZoom .dropup a").on("click", function () {
      var scale = $(this).data('value');
      $('#scales-list').data('value', scale);
      $('#scales-list span').text($(this).text());
      mapviewer.map.zoomToScale(scale);
      $('#scalesZoom .srs-container').removeClass('active');
    });

    $('#goToCoordButton').popover({
      html: true,
      trigger: 'manual',
      title: function () {
        return $("#popover-head").html();
      },
      content: function () {
        return $("#popover-content").html();
      }
    });
    $('#goToCoordButton').click(function () {
      $(this).popover('toggle');
    });

    $('.go-to-coord-control').on('submit', '.go-to-coord-form', function (e) {
      e.preventDefault();
      var lon = parseInt(document.getElementById('inputLong').value);
      var lat = parseInt(document.getElementById('inputLat').value);
      mapviewer.map.goToCoord([lon, lat]);
      $('#goToCoordButton').popover('hide');
    });

    $(".ol-zoom-extent").on('click', mapviewer.map.zoomToHome);
  },

  /**
   * Swap to cesium or ol map
   * @param {string} mapType
   */
  swapToMap: function (mapType) {
    if ((mapType !== "ol" && mapType !== "cs") || mapviewer.map.currentMap === mapType) {
      return;
    }
    mapviewer.map.gfi.closePanel();
    var defaultBgLayer, defaultOverviewBgLayer;
    var defaultProj = _.find(mapviewer.config.projections, { code: mapviewer.config.defaultProjection });
    if (defaultProj) {
      defaultBgLayer = _.find(mapviewer.config.bgLayers, { name: defaultProj.defaultBgLayer });
      defaultOverviewBgLayer = _.find(mapviewer.config.bgLayers, { name: defaultProj.defaultBackgroundOverview });
    }
    if (!defaultBgLayer) {
      defaultBgLayer = mapviewer.config.bgLayers[0];
    }
    if (!defaultOverviewBgLayer) {
      defaultOverviewBgLayer = defaultBgLayer;
    }
    if (mapviewer.map.currentMap == "ol") {
      mapviewer.monitoring.track("map_swap", "From planar to globe", "From planar to globe");
      mapviewer.olMap.destroyMap();
      mapviewer.csMap.init(mapviewer.config.bgLayers);
      $('#scalesZoom').hide();
    } else {
      mapviewer.monitoring.track("map_swap", "From globe to planar", "From globe to planar");
      mapviewer.csMap.destroyMap();
      mapviewer.olMap.init(mapviewer.config.bgLayers, defaultOverviewBgLayer);
      $('#scalesZoom').show();
    }
    mapviewer.map.currentMap = mapType;
    mapviewer.map.updateViewProjection(mapviewer.config.defaultProjection);
    measurement.handleMapMode();
    generateUrl.handleMapMode();
    exportContext.handleMapMode();
    externalOGC.handleMapMode();
    layerswitcher.handleMapMode();
  },

  /**
   * Adds a bunch of layers to the map, with warning/errors if already added or failed
   * @param {Object[]} layersData - list of layers data to set map layer
   * @return {jQuery.Deferred}
   */
  addLayers: function (layersData, noAlerts) {
    var promises = [];
    var alreadyAddedLayers = [];
    var failedLayers = [];
    var wfsFailedLayers = [];
    var layersDataReversed = layersData.reverse();
    _.each(layersDataReversed, function (layerData) {
      promises.push(mapviewer.map.addLayer(layerData, mapviewer.map.lastIdx++)
        .done(function (result) {
          switch (result.errorType) {
            case 'fail':
              failedLayers.push(layerData);
              break;
            case 'wfsfail':
              wfsFailedLayers.push(layerData);
              break;
            case 'found':
              alreadyAddedLayers.push(layerData);
              if (!layerData.title) {
                layerData.title = result.layerTitle;
              }
              break;
          }
        }));
    });

    return $.when.apply($, promises)
      .always(function () {
        if (!noAlerts && failedLayers.length > 0) {
          var error = i18next.t('addlayer.errorMsg1') + "<br /> " + i18next.t('addlayer.errorMsg2') + "<br /><ul>";
          for (var i = 0, len = failedLayers.length; i < len; ++i) {
            error += "<li>" + (failedLayers[i].title || failedLayers[i].layername) + "</li>"
          }
          error += "</ul>";
          toastr.error(error);
        }
        if (!noAlerts && wfsFailedLayers.length > 0) {
          var error = i18next.t('addlayer.wfsError') + "<br /><ul>";
          for (var i = 0, len = wfsFailedLayers.length; i < len; ++i) {
            error += "<li>" + (wfsFailedLayers[i].title || wfsFailedLayers[i].layername) + "</li>"
          }
          error += "</ul>";
          toastr.error(error);
        }
        if (!noAlerts && alreadyAddedLayers.length > 0) {
          var warning = i18next.t('addlayer.warningMsg') + "<br /><ul>";
          for (var j = 0, l = alreadyAddedLayers.length; j < l; ++j) {
            warning += "<li>" + (alreadyAddedLayers[j].title || alreadyAddedLayers[j].layername) + "</li>"
          }
          warning += "</ul>";

          toastr.warning(warning);
        }
        if (mapviewer.config.layersOptions.thematic && mapviewer.config.tools.legendPanel.enable) {
          $('.layerSwitcherLayer').each(function () {
            layerswitcher.manageDragLayer(null, { item: $(this) });
          });
        }
        var currentProj = mapviewer.map.getCurrentProjection();
        mapviewer.map.checkSRSLayer(currentProj, currentProj);
        // layerswitcher.handleMapMode();
        _.each(mapviewer.map.layers, function (layer) {
          if (layer.disabled) {
            $("#layerSwitcher" + layer.idx + " .layerSwitcherLayerSRS").show();
            $("#layerSwitcher" + layer.idx + " .layerSwitcherLayerShowHide").hide();
            $("#layerSwitcher" + layer.idx + ' .toolsContainer .layerSwitcherLayerLoader').hide();
          } else {
            $("#layerSwitcher" + layer.idx + " .layerSwitcherLayerSRS").hide();
          }
        });
      });
  },

  /**
   * Adds layer to map. Return deferred always resolve because errors kills "always" chain
   * @param {Object} layerData - data to set layer
   * @param {number} idx - idx to set to layer in map
   * @return {jQuery.Deferred}
   */
  addLayer: function (layerData, idx) {
    var defer = $.Deferred();

    var extent = null;
    if (layerData.extent) {
      extent = layerData.extent;
    } else if (layerData.serviceType === 'WCS') {
      extent = layerData.extentWcs;
    }

    if (mapviewer.map.getCurrentProjection() !== "EPSG:4326") {
      layerData.extent = ol.proj.transformExtent(extent, 'EPSG:4326', mapviewer.map.getCurrentProjection());
    }

    if (layerData.wfsUrl && layerData.wfsUrl == "undefined") {
      delete layerData.wfsUrl;
    }
    if (layerData.wfsUrlType && layerData.wfsUrlType == "undefined") {
      delete layerData.wfsUrlType;
    }
    layerData.layername = layerData.layername.toString();
    var found = _.find(mapviewer.map.layers, function (e) {
      return (e.url.replace(/\?$/, "") === layerData.url.replace(/\?$/, "")) && e.name === layerData.layername && e.sourceParams.type === layerData.serviceType;
    });
    if (!found) {
      mapviewer.tools.getCapabilities(layerData.url, layerData.serviceType, layerData.version, layerData.layername)
        .done(function (capabilities) {
          var layerToAdd;
          if (!layerData.autolayer || $("#active-basic-datasets").prop('checked')) {
            if (capabilities.FeatureTypeList) { // WFS
              layerToAdd = mapviewer.map.generateWFSLayer(layerData, capabilities, idx);
            } else if (capabilities.Contents) { // WCS
              layerToAdd = mapviewer.map.generateWCSLayer(layerData, capabilities, idx);
            } else if (capabilities.Capability) { // WMS
              layerToAdd = mapviewer.map.generateWMSLayer(layerData, capabilities, idx);
            }
          }

          // dblClick security
          found = _.find(mapviewer.map.layers, function (e) {
            return (e.url.replace(/\?$/, "") === layerData.url.replace(/\?$/, "")) && e.name === layerData.layername && e.sourceParams.type === layerData.serviceType;
          });

          if (layerToAdd) {
            layerToAdd.layerData = layerData;
          }

          if (layerToAdd && $("#layerSwitcher" + layerToAdd.idx).length === 0 && !found) {
            layerToAdd.onImageLoadStart = function () {
              $("#layerSwitcher" + layerToAdd.idx + ' .toolsContainer .layerSwitcherLayerShowHide').hide();
              $("#layerSwitcher" + layerToAdd.idx + ' .sidebar-pane-subpane .showHideContainer').hide();
              $("#layerSwitcher" + layerToAdd.idx + ' .toolsContainer .layerSwitcherLayerLoader').show();
              $("#layerSwitcher" + layerToAdd.idx + ' .sidebar-pane-subpane .subpaneLoader').show();
            };

            layerToAdd.onImageLoadEnd = function () {
              $("#layerSwitcher" + layerToAdd.idx + ' .toolsContainer .layerSwitcherLayerLoader').hide();
              $("#layerSwitcher" + layerToAdd.idx + ' .sidebar-pane-subpane .subpaneLoader').hide();
              $("#layerSwitcher" + layerToAdd.idx + ' .toolsContainer .layerSwitcherLayerShowHide').show();
              $("#layerSwitcher" + layerToAdd.idx + ' .sidebar-pane-subpane .showHideContainer').show();
            };
            if (!layerToAdd.autolayer) {
              layerToAdd.onImageLoadError = function () {
                mapviewer.map.removeLayer(layerToAdd);
                toastr.error(i18next.t('addlayer.imageError', { layerTitle: layerToAdd.title }));
              };
            }

            if (layerToAdd.sourceParams.type === 'WFS') {
              mapviewer.tools.getWFSFeatureType(layerToAdd)
                .done(function (params) {
                  layerToAdd.wfsParams = params;
                  actionOnSuccess();
                })
                .fail(function (e) {
                  defer.resolve({ errorType: 'wfsfail' });
                })
            } else {
              actionOnSuccess();
            }

            function actionOnSuccess() {
              mapviewer.map.layers.push(layerToAdd);

              mapviewer.olMap.addLayer(layerToAdd);
              if (mapviewer.map.currentMap !== 'ol') {
                mapviewer.csMap.addLayer(layerToAdd);
              }

              layerswitcher.drawLayer(layerToAdd);
              layerswitcher.countLayer();
              defer.resolve({});
              if (!layerData.autolayer) {
                mapviewer.monitoring.track("add_layer", layerToAdd.title, layerToAdd.name);
              }
            }

          } else if (layerToAdd) {
            defer.resolve({});
          } else {
            defer.resolve({ errorType: 'fail' });
          }
        })
        .fail(function (e) {
          console.error(e);
          defer.resolve({ errorType: 'fail' });
        });
    } else {
      defer.resolve({ errorType: 'found', layerTitle: found.title });
    }

    return defer;
  },

  /**
   * Generate WMS layer data to add it
   * @param {Object} layerData - data to set layer
   * @param {Object} capabilities - result of global GetCapabilities
   * @param {number} idx - idx to set to layer in map
   * @return {*|Null}
   */
  generateWMSLayer: function (layerData, capabilities, idx) {
    var layerCapabilities;
    if (capabilities.Capability.Layer) {
      if (capabilities.Capability.Layer.Name && capabilities.Capability.Layer.Name.toLowerCase() == layerData.layername.toLowerCase()) {
        layerCapabilities = capabilities.Capability.Layer;
      } else if (capabilities.Capability.Layer.Layer) {
        layerCapabilities = mapviewer.tools.getLayerCapabilities(capabilities.Capability.Layer.Layer, layerData.layername);
      }
    }
    if (layerCapabilities) {
      var title = layerData.title || layerCapabilities.Title || "No name";
      if (layerData.titleAdd) {
        title += " " + layerData.titleAdd;
      }

      var layerToAdd = {
        title: title,
        name: layerData.layername,
        displayInLayerSwitcher: (layerData.type == 'layer'),
        type: layerData.type,
        idx: idx,
        id: layerData.id,
        extent: layerData.extent || layerCapabilities.EX_GeographicBoundingBox,
        visible: layerData.visible != undefined ? layerData.visible : true,
        opacity: layerData.opacity || 1,
        queryable: layerCapabilities.queryable,
        bbox: layerCapabilities.EX_GeographicBoundingBox,
        autolayer: layerData.autolayer || false,
        url: layerData.url,
        wfs: {
          url: layerData.wfsUrl,
          urlType: layerData.wfsUrlType
        },
        metadata: {
          serviceUrl: layerData.url,
          serviceAccessConstraint: capabilities.Service.AccessConstraints,
          serviceTitle: capabilities.Service.Title,
          layerAbstract: layerCapabilities.Abstract,
          metadataURL: layerCapabilities.MetadataURL,
          dataURL: layerCapabilities.DataURL,
          legendURL: layerCapabilities.LegendURL,
          minScale: layerData.minScale,
          maxScale: layerData.maxScale,
          keywords: layerCapabilities.keywords,
          downloadFeatureUrl: capabilities.downloadFeatureUrl
        },
        sourceParams: {
          type: 'WMS',
          url: capabilities.Capability.Request.GetMap.DCPType[0].HTTP.Get.OnlineResource,
          version: layerData.version || '1.3.0',
          params: {
            'LAYERS': layerData.layername,
            'VERSION': layerData.version || '1.3.0'
          }
        }
      };

      if (!layerData.autolayer) {
        //adding CRS from service because sometimes it is not written into CRS layer
        if (capabilities.Capability.Layer.CRS) {
          if (!layerCapabilities.srs) {
            layerCapabilities.srs = [];
          }
          for (var i = 0, len = capabilities.Capability.Layer.CRS.length; i < len; ++i) {
            if (capabilities.Capability.Layer.CRS[i] == "CRS:84") {
              capabilities.Capability.Layer.CRS[i] = "EPSG:4326";
            }
            if (layerCapabilities.srs.indexOf(capabilities.Capability.Layer.CRS[i]) < 0) {
              layerCapabilities.srs.push(capabilities.Capability.Layer.CRS[i]);
            }
          }
        }
        layerToAdd.srs = layerCapabilities.srs;
      }
      if (capabilities.Service.ContactInformation && _.keys(capabilities.Service.ContactInformation).length > 0) {
        layerToAdd.metadata.contactPerson = capabilities.Service.ContactInformation.ContactPersonPrimary.ContactPerson;
        layerToAdd.metadata.contactOrganization = capabilities.Service.ContactInformation.ContactPersonPrimary.ContactOrganization;
        layerToAdd.metadata.contactEmail = capabilities.Service.ContactInformation.ContactElectronicMailAddress;
        if (capabilities.Service.ContactInformation.ContactAddress) {
          layerToAdd.metadata.contactAddress = capabilities.Service.ContactInformation.ContactAddress.Address;
          layerToAdd.metadata.contactPostCode = capabilities.Service.ContactInformation.ContactAddress.PostCode;
          layerToAdd.metadata.contactCity = capabilities.Service.ContactInformation.ContactAddress.City;
          layerToAdd.metadata.contactCountry = capabilities.Service.ContactInformation.ContactAddress.Country;
        }
      }

      return layerToAdd;
    }
    return null;
  },

  /**
   * Add WMS layer to map
   * @param {Object} layerData - data to set layer
   * @param {Object} capabilities - result of global GetCapabilities
   * @param {number} idx - idx to set to layer in map
   * @return {ol.Layer}
   */
  generateWFSLayer: function (layerData, capabilities, idx) {
    let layerCapabilities = _.find(capabilities.FeatureTypeList.FeatureType, { Name: layerData.layername });
    if (layerCapabilities) {
      var layerToAdd = {
        title: (layerData.title || layerCapabilities.Title || "No name") + ' (Feature)',
        name: layerData.layername,
        displayInLayerSwitcher: (layerData.type == 'layer'),
        type: layerData.type,
        idx: idx,
        id: layerData.id,
        extent: layerData.extent,
        originalExtent: layerData.extent,
        visible: layerData.visible != undefined ? layerData.visible : true,
        opacity: layerData.opacity || 1,
        bbox: layerData.extent,
        autolayer: layerData.autolayer || false,
        url: layerData.url,
        metadata: {
          serviceUrl: layerData.url,
          serviceAccessConstraint: capabilities.ServiceIdentification.AccessConstraints,
          serviceTitle: capabilities.ServiceIdentification.Title,
          layerAbstract: layerCapabilities.Abstract,
          keywords: mapviewer.tools.parseCapabilitiesKeywords(layerCapabilities.Keywords.Keyword)
        },
        sourceParams: {
          type: 'WFS',
          version: capabilities.ServiceIdentification.ServiceTypeVersion || "2.0.0",
          filters: [],
          features: []
        }
      };

      if (capabilities.ServiceProvider.ServiceContact) {
        layerToAdd.metadata.contactPerson = capabilities.ServiceProvider.ServiceContact.IndividualName;
        if (capabilities.ServiceProvider.ServiceContact.ContactInfo && capabilities.ServiceProvider.ServiceContact.ContactInfo.Address) {
          layerToAdd.metadata.contactEmail = capabilities.ServiceProvider.ServiceContact.ContactInfo.Address.ElectronicMailAddress;
          layerToAdd.metadata.contactAddress = capabilities.ServiceProvider.ServiceContact.ContactInfo.Address.DeliveryPoint;
          layerToAdd.metadata.contactPostCode = capabilities.ServiceProvider.ServiceContact.ContactInfo.Address.PostalCode;
          layerToAdd.metadata.contactCity = capabilities.ServiceProvider.ServiceContact.ContactInfo.Address.City;
          layerToAdd.metadata.contactCountry = capabilities.ServiceProvider.ServiceContact.ContactInfo.Address.Country;
        }
      }

      return layerToAdd;
    }
    return null;
  },

  /**
   * Add WMS layer to map
   * @param {Object} layerData - data to set layer
   * @param {Object} capabilities - result of global GetCapabilities
   * @param {number} idx - idx to set to layer in map
   * @return {ol.Layer}
   */
  generateWCSLayer: function (layerData, capabilities, idx) {
    if (capabilities) {

      var coverages = capabilities.Contents.CoverageSummary;
      var extentWcs = layerData.extentWcs;
      var currentCoverage = _.find(coverages, { CoverageId: layerData.layername });
      if (!currentCoverage) { // Transition from 1.0.0 to 2.0.1 names
        currentCoverage = _.find(coverages, { CoverageId: layerData.layername.replace(':', '__') });
        if (currentCoverage) {
          layerData.layername = layerData.layername.replace(':', '__');
        }
      }

      if (currentCoverage) {
        if (!extentWcs) {
          var lowerCorner = currentCoverage.BoundingBox.LowerCorner.split(' ').map(parseFloat);
          var upperCorner = currentCoverage.BoundingBox.UpperCorner.split(' ').map(parseFloat);
          extentWcs = [
            lowerCorner[0],
            lowerCorner[1],
            upperCorner[0],
            upperCorner[1]
          ];
        }

        var imgUrl = layerData.url;
        if (imgUrl.indexOf('?') < 0) {
          imgUrl += '?';
        }

        var labelX = 'Long', labelY = 'Lat';
        if (capabilities.DescribeCoverage && capabilities.DescribeCoverage.CoverageDescription && capabilities.DescribeCoverage.CoverageDescription.boundedBy) {
          var xy = capabilities.DescribeCoverage.CoverageDescription.boundedBy.Envelope.attributes.axisLabels.split(' ');
          if (xy.length === 2) {
            labelX = xy[1];
            labelY = xy[0];
          }
        }

        imgUrl += '&service=WCS&version=2.0.1&CoverageId=' +
          layerData.layername + '&request=GetCoverage&format=image/png' +
          '&SUBSETTINGCRS=epsg:4326&subset=' + labelX + '(' + extentWcs[0] + ',' + extentWcs[2] + ')' +
          '&subset=' + labelY + '(' + extentWcs[1] + ',' + extentWcs[3] + ')';


        var title = layerData.title || "(WCS) " + currentCoverage.Title || "(WCS) No name";
        if (layerData.titleAdd) {
          title += " " + layerData.titleAdd;
        }

        layerToAdd = {
          title: title,
          name: layerData.layername,
          displayInLayerSwitcher: (layerData.type == 'layer'),
          type: layerData.type,
          idx: idx,
          id: layerData.id,
          extent: extentWcs,
          visible: layerData.visible != undefined ? layerData.visible : true,
          opacity: layerData.opacity || 1,
          bbox: extentWcs,
          url: layerData.url,
          metadata: {
            serviceUrl: layerData.dataUrl || layerData.url,
            serviceAccessConstraint: capabilities.ServiceIdentification.AccessConstraints,
            serviceTitle: currentCoverage.Title,
            layerAbstract: currentCoverage.Abstract,
            keywords: mapviewer.tools.parseCapabilitiesKeywords(currentCoverage.Keywords.Keyword),
          },
          sourceParams: {
            type: 'WCS',
            url: imgUrl,
            imageExtent: extentWcs
          }
        };

        var srs = mapviewer.tools.searchKeyword(layerToAdd.metadata.keywords, 'CRS_SUPPORTED');
        if (srs && srs.length > 1 && srs[1] && _.isString(srs[1])) {
          layerToAdd.srs = srs[1].split(" ");
        }

        if (capabilities.ServiceProvider.ServiceContact) {
          layerToAdd.metadata.contactPerson = capabilities.ServiceProvider.ServiceContact.IndividualName;
          if (capabilities.ServiceProvider.ServiceContact.PositionName) {
            layerToAdd.metadata.contactPerson += ", " + capabilities.ServiceProvider.ServiceContact.PositionName;
          }
          layerToAdd.metadata.contactOrganization = capabilities.ServiceProvider.ProviderName;
          if (capabilities.ServiceProvider.ServiceContact.ContactInfo) {
            layerToAdd.metadata.contactAddress = capabilities.ServiceProvider.ServiceContact.ContactInfo.Address.DeliveryPoint;
            layerToAdd.metadata.contactPostCode = capabilities.ServiceProvider.ServiceContact.ContactInfo.Address.PostalCode;
            layerToAdd.metadata.contactCity = capabilities.ServiceProvider.ServiceContact.ContactInfo.Address.City;
            layerToAdd.metadata.contactCountry = capabilities.ServiceProvider.ServiceContact.ContactInfo.Address.Country;
            layerToAdd.metadata.contactEmail = capabilities.ServiceProvider.ServiceContact.ContactInfo.Address.ElectronicMailAddress;

          }
        }

        return layerToAdd;
      }
      return null;

    }
    return null;

  },

  markGfiPosition: function (coords) {
    if (mapviewer.map.currentMap == 'ol') {
      mapviewer.olMap.markGfiPosition(coords);
    } else {
      mapviewer.csMap.markGfiPosition(coords);
    }
  },

  /**
   * Removes given layer from maps and layer list
   * @param {*} layer - layer to remove, from layer list
   */
  removeLayer: function (layer) {
    if (mapviewer.map.currentMap == 'ol') {
      mapviewer.olMap.removeLayer(layer);
    } else {
      mapviewer.csMap.removeLayer(layer);
    }
    var $layer = $("#layerSwitcher" + layer.idx);
    if (mapviewer.config.layersOptions.thematic && $layer.closest('.layerSwitcherLayerThematic').find('.layerSwitcherLayer').length === 1) {
      $layer.closest('.layerSwitcherLayerThematic').remove();
    } else {
      $layer.remove();
    }
    $("#layerSwitcherLegend" + layer.idx).remove();
    var index = _.findIndex(mapviewer.map.layers, { idx: layer.idx });
    if (index >= 0) {
      mapviewer.map.layers.splice(index, 1);
    }
    layerswitcher.countLayer();
    layerswitcher.updateResetPortrayableButton();
  },

  /**
   * Removes all layers from maps and layer list
   */
  cleanMap: function () {
    _.each(mapviewer.map.layers, function (layer) {
      if (mapviewer.map.currentMap == 'ol') {
        mapviewer.olMap.removeLayer(layer);
      } else {
        mapviewer.csMap.removeLayer(layer);
      }
    });
    mapviewer.map.lastIdx = 0;
    mapviewer.map.layers = [];
    $('.layerSwitcherLayer').remove();
    $('.layerSwitcherLegend').remove();
    layerswitcher.countLayer();
  },

  /**
   * Gets current map projection
   * @return {string}
   */
  getCurrentProjection: function () {
    if (mapviewer.map.currentMap == 'ol') {
      return mapviewer.olMap.getCurrentProjection();
    } else {
      return 'EPSG:4326';
    }
  },

  /**
   * Gets current map extent
   * @return {number[]}
   */
  getCurrentExtent: function () {
    if (mapviewer.map.currentMap == 'ol') {
      return mapviewer.olMap.getCurrentExtent();
    } else {
      return mapviewer.csMap.getCurrentExtent();
    }
  },

  /**
   * Gets current map scale
   * @return {number}
   */
  getCurrentScale: function () {
    if (mapviewer.map.currentMap == 'ol') {
      return mapviewer.olMap.getCurrentScale();
    } else {
      return mapviewer.csMap.getCurrentScale();
    }
  },

  /**
   * Gets current map scale
   * @return {number}
   */
  getCurrentResolution: function () {
    if (mapviewer.map.currentMap == 'ol') {
      return mapviewer.olMap.getCurrentResolution();
    }
    return 1;
  },

  /**
   * Changes current map projection with new projection
   * @param {string} newProjection - new projection to apply
   */
  updateViewProjection: function (newProjection) {
    var currentProj = mapviewer.map.getCurrentProjection();
    mapviewer.map.checkSRSLayer(newProjection, currentProj);
    if (mapviewer.map.currentMap == 'ol') {
      mapviewer.olMap.updateViewProjection(newProjection);
      layerswitcher.handleMapMode();
    }
  },

  /**
   * Changes current background layer displayed on current map
   * @param {*} bgLayer - background layer to display, from background layers list
   */
  updateBgLayers: function (bgLayer) {
    _.each(mapviewer.config.bgLayers, function (bgl) {
      bgl.visible = (bgLayer == bgl);
    });
    if (mapviewer.map.currentMap == 'ol') {
      mapviewer.olMap.updateBgLayers();
    } else {
      mapviewer.csMap.updateBgLayers();
    }
  },

  /**
   * Checks if the displayed layers (not autolayers) are compliant with the new projection system, if not they are hidden and an icon appears is the layer switcher
   * @param {string} newSRS - new projection system set
   * @param {string} oldSRS - previous projection system
   */
  checkSRSLayer: function (newSRS, oldSRS) {
    _.each(mapviewer.map.layers, function (layer) {
      layer.extent = ol.proj.transformExtent(layer.extent, oldSRS, newSRS);
      if (layer.originalExtent) {
        layer.originalExtent = ol.proj.transformExtent(layer.originalExtent, oldSRS, newSRS);
      }
      if (!layer.autolayer) {
        if (layer.srs) {
          if (layer.srs.indexOf(newSRS) >= 0) {
            layer.disabled = false;
          } else {
            layer.disabled = true;
          }
        }
        if (layer.sourceParams.type === "WFS") {
          if (mapviewer.map.currentMap === 'ol') {
            layer.disabled = false;
          } else {
            layer.disabled = true;
          }
        }
      }
    });
  },

  /**
   * Sets map view center to new coordinates
   * @param {number[]} lonLat - new coordinates to go to
   * @param {boolean} closeZoom - if true, zoom closer than default goto zoom
   */
  goToCoord: function (lonLat, closeZoom) {
    if (mapviewer.map.currentMap == 'ol') {
      return mapviewer.olMap.goToCoord(lonLat, closeZoom);
    } else {
      return mapviewer.csMap.goToCoord(lonLat, closeZoom);
    }
  },

  /**
   * Zooms to predefined extent of the map
   */
  zoomToHome: function () {
    if (mapviewer.map.currentMap == 'ol') {
      return mapviewer.olMap.zoomToHome();
    } else {
      return mapviewer.csMap.zoomToHome();
    }
  },

  /**
   * Zooms to given layer extent
   * @param {*} layer - layer to zoom, from layers list
   */
  zoomToLayer: function (layer) {
    if (!layer.extent) {
      return;
    }
    mapviewer.map.zoomToExtent(layer.extent);
  },

  /**
   * Zooms to given extent
   * @param {number[]} extent - extent to zoom
   */
  zoomToExtent: function (extent) {
    if (!extent || extent.length !== 4) {
      return;
    }
    if (mapviewer.map.currentMap == 'ol') {
      mapviewer.olMap.zoomToExtent(extent);
    } else {
      mapviewer.csMap.zoomToExtent(extent);
    }
  },

  /**
   * Zooms to given scale
   * @param {number[]} scale scale
   */
  zoomToScale: function (scale) {
    if (!scale || !_.isFinite(scale)) {
      return;
    }
    if (mapviewer.map.currentMap == 'ol') {
      mapviewer.olMap.zoomToScale(scale);
    }
  },

  /**
   * Changes layer position in layer list
   * @param {number} from - initial layer index in list
   * @param {number} to - destination index in list
   */
  moveLayer: function (from, to) {
    var layer = mapviewer.map.layers[from];
    mapviewer.map.layers.splice(from, 1);
    mapviewer.map.layers.splice(to, 0, layer);
    $layerLegend = $('#layerSwitcherLegend' + layer.idx).eq(0).detach();
    $legendList = $('.layerSwitcherLegend');

    if (mapviewer.map.layers.length === 1) {
      $layerLegend.appendTo($('#legends .panel-group'));
    } else if (to > 0) {
      $layerLegend.insertBefore($legendList.eq($legendList.length - to));
    } else {
      $layerLegend.insertAfter($legendList.eq($legendList.length - 1));
    }

    if (mapviewer.map.currentMap == 'ol') {
      mapviewer.olMap.moveLayer(layer, to);
    } else {
      mapviewer.csMap.moveLayer(layer, from, to);
    }
  },

  /**
   * Sets given layer visibility
   * @param {*} layer - layer to zoom, from layers list
   * @param {boolean} isVisible - visibility
   */
  setVisible: function (layer, isVisible) {
    layer.visible = isVisible;
    if (mapviewer.map.currentMap == 'ol') {
      return mapviewer.olMap.setVisible(layer, isVisible);
    } else {
      return mapviewer.csMap.setVisible(layer, isVisible);
    }
  },

  /**
   * Sets given layer opacity
   * @param {*} layer - layer to zoom, from layers list
   * @param {number} opacity - opacity
   */
  setOpacity: function (layer, opacity) {
    if (isNaN(opacity) || opacity < 0 || opacity > 1) {
      return;
    }
    layer.opacity = opacity;
    if (mapviewer.map.currentMap == 'ol') {
      mapviewer.olMap.setOpacity(layer, opacity);
    } else {
      mapviewer.csMap.setOpacity(layer, opacity);
    }
  },

  /**
   * Apply SLD filter to layer
   * @param {*} layer layer to zoom, from layers list
   * @param {string} sldUrl SLD url
   * @param {string} filterType Type of filter (lithology, etc)
   * @param {string} filterName Name of the filter
   */
  filterLayer: function (layer, sldUrl, filterType, filterName) {
    if (mapviewer.map.currentMap == 'ol' && sldUrl) {
      var filterNames = null;
      if (_.isArray(filterName)) {
        filterNames = filterName;
        filterName = i18next.t('gazetteer.analysisFilterName');
      }
      layer.filter = {
        sld: sldUrl,
        type: filterType,
        name: filterName,
        names: filterNames,
        enabled: false
      };
      mapviewer.map.enableLayerFilter(layer);
      layerswitcher.enableLayerFiltering(layer);
    }
  },

  /**
   * Enable SLD filter for layer
   * @param {*} layer Layer to filter
   */
  enableLayerFilter: function (layer) {
    if (mapviewer.map.currentMap == 'ol' && layer.olLayer && layer.filter && !layer.filter.enabled) {
      layer.filter.enabled = true;
      mapviewer.map.updateSourceParams(layer, { 'SLD': layer.filter.sld });
      layerswitcher.showResetPortrayableButton();
    }
  },

  /**
   * Reset layer at its default filter state
   * @param {*} layer Layer to reset
   */
  disableLayerFilter: function (layer) {
    if (layer.olLayer && layer.filter && layer.filter.enabled) {
      layer.filter.enabled = false;
      if (layer.sourceParams.params.SLD) {
        delete layer.sourceParams.params.SLD;
      }
      mapviewer.map.updateSource(layer, {
        url: layer.url,
        params: {
          'LAYERS': layer.name,
        }
      });
      layerswitcher.updateResetPortrayableButton();
    }
  },

  /**
   * Updates given layer source params without overwrite no given params
   * @param {*} layer - layer to zoom, from layers list
   * @param {Object} params - new params to apply
   */
  updateSourceParams: function (layer, params) {
    if (mapviewer.map.currentMap == 'ol') {
      mapviewer.olMap.updateSourceParams(layer, params);
    }
  },

  /**
   * Overwrites given layer source
   * @param {*} layer - layer to zoom, from layers list
   * @param {Object} sourceParams - new params for new source created
   */
  updateSource: function (layer, sourceParams) {
    if (mapviewer.map.currentMap == 'ol') {
      mapviewer.olMap.updateSource(layer, sourceParams);
    }
  },

  /**
   * Replaces all layer features
   * @param {*} layer layer to update
   * @param {*} featureCollection GeoJSON which contains the feature collection
   */
  updateWfsFeatures: function (layer, featureCollection) {
    if (layer.sourceParams.type !== 'WFS') {
      return;
    }
    layer.sourceParams.featureCollection = featureCollection;
    if (featureCollection) {
      var finalExtent;
      var format = new ol.format.GeoJSON();
      var collectionProj = format.readProjection(featureCollection);
      _.each(format.readFeatures(featureCollection), function (feature) {
        if (!finalExtent) {
          finalExtent = feature.getGeometry().getExtent();
        } else {
          finalExtent = ol.extent.extend(finalExtent, feature.getGeometry().getExtent());
        }
      });
      if (finalExtent) {
        finalExtent = ol.proj.transformExtent(finalExtent, collectionProj, mapviewer.map.getCurrentProjection());
        layer.extent = finalExtent;
      } else {
        layer.extent = layer.originalExtent;
      }
    } else {
      layer.extent = layer.originalExtent;
    }

    if (mapviewer.map.currentMap == 'ol') {
      mapviewer.olMap.updateWfsFeatures(layer);
    }

    layerswitcher.updateLayerSwitcherWfsFilters(layer);
  },

  /**
   * Check if there is at least one layer capable of given type portrayal
   * @param {string} type Type of portrayal searched
   * @return Boolean
   */
  hasPortrayableLayers: function (type) {
    var analysisTypeKeyword;
    switch (type) {
      case 'geosciml':
        analysisTypeKeyword = 'Geosciml_portrayal_age_or_litho_queryable';
        break;
      case 'erml':
        analysisTypeKeyword = 'Erml_lite_queryable';
        break;
    }
    if (analysisTypeKeyword) {
      for (var i = 0; i < mapviewer.map.layers.length; i++) {
        if (mapviewer.tools.searchKeyword(mapviewer.map.layers[i].metadata.keywords, analysisTypeKeyword)) {
          return true;
        }
      }
    }
    return false;
  }
}
