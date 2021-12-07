/**
 * Header search form widget
 */
var gazetteer = {
  /**
   * Last result from the geonames call
   * @type {Object}
   */
  lastResult: {},

  currentSearchCall: null,

  geonamesRunning: false,

  /**
   * Initialize widget
   */
  init: function (options) {
    //hide the containers
    $("div.gazetteerResult").hide();

    //plug the events
    gazetteer.addListeners();

    if (mapviewer.urlParams.serviceUrl && mapviewer.urlParams.serviceType !== 'WMC') {
      setTimeout(function () {
        if (!mapviewer.urlParams.layername) {
          $('.gazetteerSearchInput').val(mapviewer.urlParams.serviceUrl);
          gazetteer.autocompleteSearch({ term: mapviewer.urlParams.serviceUrl });
        } else {
          gazetteer.lastResult = {
            specificLocations: [],
            locations: [],
            results: [],
            searchType: 'url'
          };
          gazetteer.getUrlResults(mapviewer.urlParams.serviceUrl, mapviewer.urlParams.layername);
        }
      }, 500);
    }
  },

  /**
   * Creates widget listeners
   */
  addListeners: function () {
    $(".gazetteerSearchInput").autocomplete({
      source: gazetteer.autocompleteSearch,
      delay: 500,
      minLength: 2,
      select: function (event, ui) {
        log("Selected: " + ui.item.value + " aka " + ui.item.id);
      }
    });

    if (mapviewer.config.gazetteer.specificLocations) {
      gazetteer.lastResult.specificLocations = mapviewer.config.gazetteer.specificLocations.slice(0);
      gazetteer.lastResult.specificLocations = _.sortBy(gazetteer.lastResult.specificLocations, 'label');
    }

    $(".gazetteerSearchInput").on('focus', function () {
      if ($('.gazetteerResult').css('display') === 'none') {
        $('.gazetteerHelp').show();
      }
    });

    $(".gazetteerResult").on("click", "ul li", gazetteer.manageResultClick);
    $(".gazetteerResult").on("click", ".gazetteerMore", gazetteer.toggleShowAllResults);
    $(".gazetteerResult").on("click", ".add-vocab-layer-btn", gazetteer.searchLayersForVocab);
    $(".gazetteerHelp").on("click", ".search-vocab-btn", function () { gazetteer.searchLayersForVocab(true) });
    $(".gazetteerHelp").on("click", ".catalog-btn", gazetteer.openCatalog);
    $(".gazetteerHelp").on("click", ".location-btn", gazetteer.findMyLocation);
    $(".gazetteerHelp").on("click", ".btn-close", function () { $(".gazetteerHelp").hide() });
    $(".gazetteerCloseResult").on("click", gazetteer.hideResult);
    $(".locatorIcon").on("click", function () { gazetteer.showResult() });

    $("body").on("click", gazetteer.hideHelp);
  },

  /**
   * Proceed the search from autocomplete field
   * @param {any} request Request from autocomplete field
   */
  autocompleteSearch: function (request) {
    if (gazetteer.currentSearchCall) {
      gazetteer.currentSearchCall.abort();
    }
    gazetteer.lastResult = {
      specificLocations: [],
      locations: [],
      results: [],
      searchType: 'search'
    };
    var term = request.term;
    $(".gazetteerLoader").show();
    $(".gazetteerResult").hide();
    $('.gazetteerHelp').hide();

    if (mapviewer.tools.isUrl(term)) {
      gazetteer.lastResult.searchType = 'url';
      gazetteer.getUrlResults(term);
    } else {
      if (_.isString(term)) {
        term = term.toLowerCase();
      }

      gazetteer.searchSpecificLocations(term);
      gazetteer.searchLayers(term);
      gazetteer.searchPortrayable(term);
      gazetteer.searchThematics(term);

      gazetteer.geonamesRunning = true;

      gazetteer.lastResult.specificLocations = gazetteer.sortResultsWithTerm(gazetteer.lastResult.specificLocations, term);
      var results = gazetteer.sortResultsWithTerm(gazetteer.lastResult.results, term);
      gazetteer.lastResult.results = mapviewer.tools.sortByProximityOfTerm(term, results, 'label');

      gazetteer.showResult();

      gazetteer.searchGeonames(term)
        .then(function () {
          gazetteer.lastResult.locations = gazetteer.sortResultsWithTerm(gazetteer.lastResult.locations, term);
          gazetteer.geonamesRunning = false;
          gazetteer.showResult();
        });
    }
  },

  /**
   * Sorts results, beginning with results that starts with term
   * @param {any[]} results Results to sort
   * @param {string} term Term to check
   */
  sortResultsWithTerm: function (results, term) {
    return _.sortBy(results, ['label'])
      .map(function (r, i) {
        r.id = i;
        return r;
      });
  },

  /**
   * Make research in specific location if allowed
   * @param {string} term Term to research
   */
  searchSpecificLocations: function (term) {
    if (mapviewer.config.gazetteer.enableSpecificLocations) {
      var specificLocations = _.filter(mapviewer.config.gazetteer.specificLocations, function (item) {
        return !term || item.label.toLowerCase().indexOf(term) >= 0;
      });

      _.each(specificLocations, function (location) {
        gazetteer.lastResult.specificLocations.push({
          label: location.label,
          type: 'location',
          typeLabel: null,
          value: location
        });
      });
    }
  },

  /**
   * Make research in catalog if allowed
   * @param {string} term Term to research
   */
  searchLayers: function (term) {
    if (mapviewer.config.gazetteer.enableAddLayer && mapviewer.config.catalog.content) {
      _.each(mapviewer.config.catalog.content, function (item) {
        if (
          !term || item.title.toLowerCase().indexOf(term) >= 0 ||
          (item.geographicarea && item.geographicarea.toLowerCase().indexOf(term) >= 0) ||
          (item.continent && item.continent.toLowerCase().indexOf(term) >= 0)
        ) {
          var foundItem = _.clone(item);
          if (foundItem.geosciml) {
            foundItem.title += " (GeoSciML WFS)";
          }
          if (foundItem.portrayal) {
            if (foundItem.portrayalType === 'erml') {
              foundItem.title += " (Erml-Lite Portrayal)";
            } else {
              foundItem.title += " (GeoSciML Portrayal)"
            }
          }
          gazetteer.lastResult.results.push({
            label: foundItem.title,
            type: 'layer',
            typeLabel: i18next.t('gazetteer.layerTag'),
            value: foundItem
          });
        }
      });
    }
  },

  /**
   * Make research in vocabularies if allowed
   * @param {string} term Term to research
   */
  searchPortrayable: function (term) {
    if (mapviewer.config.gazetteer.enablePortrayable && thematicAnalysis.thematicsLoaded.state() === "resolved") {
      var minerals = gazetteer.searchTermInVocabularies(term, mapviewer.config.analysis['ga_mineral-occurrence-type_v0-1']);
      gazetteer.addFilterToResults(minerals, i18next.t('gazetteer.mineralTag'), 'mineral');

      var commodities = gazetteer.searchTermInVocabularies(term, mapviewer.config.analysis['ga_commodity-code_v0-2']);
      gazetteer.addFilterToResults(commodities, i18next.t('gazetteer.commodityTag'), 'commodity');

      var lithos = gazetteer.searchTermInVocabularies(term, mapviewer.config.analysis.litho);
      gazetteer.addFilterToResults(lithos, i18next.t('gazetteer.lithoTag'), 'litho');

      var ages = gazetteer.searchTermInVocabularies(term, mapviewer.config.analysis.ages);
      gazetteer.addFilterToResults(ages, i18next.t('gazetteer.ageTag'), 'age');
    }
  },

  /**
   * Adds filter list to search results
   * @param {*} list List of filters
   * @param {*} typeLabel Translated label for filter type
   */
  addFilterToResults: function (list, typeLabel, filterType) {
    _.each(list, function (item) {
      gazetteer.lastResult.results.push({
        label: item.text,
        type: 'filter',
        typeLabel: typeLabel,
        filterType: filterType,
        value: item
      });
    });
  },

  /**
   * Make research in OSM geonames if allowed
   * @param {string} term Term to research
   */
  searchGeonames: function (term) {
    var defer = $.Deferred();
    if (mapviewer.config.gazetteer.enableGeonames) {
      gazetteer.lastResult.geonames = [];

      var data = {
        q: term,
        format: "json",
        addressdetails: 1,
        limit: 50
      };

      if(mapviewer.config.gazetteer.geonamesRestrictions) {
        data.countrycodes = mapviewer.config.gazetteer.geonamesRestrictions.join(',');
      }

      gazetteer.currentSearchCall = $.ajax({
        url: 'https://nominatim.openstreetmap.org/search',
        dataType: "json",
        data: data,
        success: function (results) {
          _.each(results, function (location) {
            var bbox = location.boundingbox.map(Number);
            bbox = [bbox[2], bbox[0], bbox[3], bbox[1]];
            gazetteer.lastResult.locations.push({
              label: location.display_name,
              type: 'location',
              typeLabel: null,
              value: {
                extent: bbox
              }
            });
          });
          gazetteer.currentSearchCall = null;

          defer.resolve();
        }
      });
    } else {
      defer.resolve();
    }

    return defer;
  },

  /**
   * (Recursive) Return vocabularies that match term from the given list
   * @param {string} term Term to search
   * @param {any[]} vocabularies List of nested vocabularies
   * @param {string} parentName (optional) Label of the parent vocabulary
   */
  searchTermInVocabularies: function (term, vocabularies, parentName) {
    if (!vocabularies) {
      return [];
    }
    var found = [];
    _.each(vocabularies, function (vocab) {
      if (vocab.text && vocab.text.toLowerCase().indexOf(term) >= 0) {
        var foundVocab = _.clone(vocab);
        if (parentName) {
          foundVocab.text += " (" + parentName + ")";
        }
        found.push(foundVocab);
      }
      if (vocab.children) {
        var hierarchy = parentName ? parentName.split(' - ') : [];
        hierarchy.push(vocab.text);
        if (hierarchy.length > 3) {
          hierarchy.shift();
        }
        parentName = hierarchy.join(' - ');

        found = found.concat(gazetteer.searchTermInVocabularies(term, vocab.children, parentName));
      }
    });
    return found;
  },

  /**
   * Make research in thematics if allowed
   * @param {string} term Term to research
   */
  searchThematics: function (term) {
    if (mapviewer.config.gazetteer.enableThematics) {
      _.each(layerOneGeology.thematicKeywordList, function (kw) {
        if (kw.nbOccurence > 0 && kw.term.toLowerCase().indexOf(term) >= 0) {
          var found = _.clone(kw);
          found.label = kw.term;
          if (kw.categoryName) {
            found.label += ' (' + kw.categoryName + ')';
          }
          found.label += ' (' + kw.nbOccurence + ')';

          gazetteer.lastResult.results.push({
            label: found.label,
            type: 'thematic',
            typeLabel: i18next.t('gazetteer.thematicTag'),
            value: found
          });
        }
      });
    }
  },

  /**
   * Get layer list from url
   * @param {string} url Service url
   * @param {string} layerToAdd Layer to directly open instead of show results 
   */
  getUrlResults: function (url, layerToAdd) {
    var calls = [];
    calls.push(gazetteer.getUrlResultsWMS(url));
    if (mapviewer.config.tools.wfsLayers.enable) {
      calls.push(gazetteer.getUrlResultsWFS(url));
    }

    $.when.apply($, calls)
      .done(function (wmsResults, wfsResults) {
        if (!wfsResults) {
          wfsResults = [];
        }
        gazetteer.lastResult.results = _.sortBy(wmsResults.concat(wfsResults), function (v) {
          return mapviewer.tools.stripCaseAndAccents(v.label);
        });
        gazetteer.showResult(layerToAdd);
      });

  },

  /**
   * Get layer list from wfs url
   * @param {string} url Service url
   */
  getUrlResultsWFS: function (url) {
    var defer = $.Deferred();
    mapviewer.tools.getCapabilities(url, "WFS")
      .done(function (capabilities) {
        if (capabilities && capabilities.FeatureTypeList && capabilities.FeatureTypeList.FeatureType && capabilities.FeatureTypeList.FeatureType.length > 0) {
          var results = [];
          _.each(capabilities.FeatureTypeList.FeatureType, function (featureType, i) {
            if (!featureType.OutputFormats || featureType.OutputFormats.Format.indexOf('application/json') >= 0) {
              var upperCorner = featureType.WGS84BoundingBox.UpperCorner.split(" ").map(parseFloat);
              var lowerCorner = featureType.WGS84BoundingBox.LowerCorner.split(" ").map(parseFloat);
              var extent = [lowerCorner[0], lowerCorner[1], upperCorner[0], upperCorner[1]];
              results.push({
                label: featureType.Title,
                type: 'layer',
                typeLabel: i18next.t('gazetteer.featureTag'),
                id: 'gazeteer-wfs-' + i,
                value: {
                  id: 'gazeteer-wfs-' + i,
                  title: featureType.Title,
                  serviceType: "WFS",
                  extent: extent.join(','),
                  layerName: featureType.Name,
                  serviceUrl: url,
                  version: capabilities.ServiceIdentification.ServiceTypeVersion.version
                }
              });
            }
          });
          defer.resolve(results);
        } else {
          defer.resolve([]);
        }
      })
      .fail(function (e) {
        console.error(e);
        defer.resolve([]);
      });

    return defer;
  },

  /**
   * Get layer list from wms url
   * @param {string} url Service url
   */
  getUrlResultsWMS: function (url) {
    var defer = $.Deferred();
    mapviewer.tools.getCapabilities(url, "WMS")
      .done(function (capabilities) {
        if (capabilities && capabilities.Capability && capabilities.Capability.Layer && capabilities.Capability.Layer.Layer && capabilities.Capability.Layer.Layer.length > 0) {
          var results = [];
          _.each(capabilities.Capability.Layer.Layer, function (layer, i) {
            var extent = layer.EX_GeographicBoundingBox || layer.LatLonBoundingBox || [];
            results.push({
              label: layer.Title,
              type: 'layer',
              typeLabel: i18next.t('gazetteer.layerTag'),
              id: 'gazeteer-wms-' + i,
              value: {
                id: 'gazeteer-wms-' + i,
                title: layer.Title,
                serviceType: "WMS",
                extent: extent.join(','),
                layerName: layer.Name,
                serviceUrl: url,
                version: capabilities.version
              }
            });
          });
          defer.resolve(results);
        } else {
          defer.resolve([]);
        }
      })
      .fail(function (e) {
        console.error(e);
        defer.resolve([]);
      });
    return defer;
  },

  /**
   * Renders search result HTML
   * @param {string} layername Layer to directly open instead of show results 
   */
  showResult: function (layername) {
    if (layername) {
      var resultsList = _.filter(gazetteer.lastResult.results, function (r) {
        return r.value && r.value.layerName === layername;
      });
      if (resultsList.length > 0) {
        if (resultsList.length === 1) {
          gazetteer.addSelectedLayer(resultsList[0].value, mapviewer.urlParams.forceload);
        } else {
          var serviceType = mapviewer.urlParams.serviceType || "WMS";
          var result = _.find(resultsList, function (r) {
            return r.value && r.value.serviceType === serviceType.toUpperCase()
          });
          if (result) {
            gazetteer.addSelectedLayer(result.value, mapviewer.urlParams.forceload);
          }
        }
      }
      return;
    }
    $(".gazetteerLoader").hide();
    $('.gazetteerHelp').hide();
    var html = '';
    if (!gazetteer.hasResults() && !gazetteer.geonamesRunning) {
      html = '<p>' + i18next.t('gazetteer.noResult') + '</p>';
      if ((mapviewer.config.gazetteer.enableAddLayer || mapviewer.config.gazetteer.enableThematics) && layerOneGeology.firstLoadRunning) {
        html += '<p class="alert alert-info mx-2 mb-2">' + i18next.t('gazetteer.catalogLoading') + '</p>';
      }

      if (mapviewer.config.gazetteer.enablePortrayable && thematicAnalysis.thematicsLoaded.state() !== "resolved") {
        html += '<p class="alert alert-info mx-2">' + i18next.t('gazetteer.analysisLoading') + '</p>';
      }
      $(".gazetteerResult").html(html);
      $(".gazetteerResult").show();
      return;
    }

    if (gazetteer.lastResult.searchType !== 'url') {
      if (mapviewer.config.gazetteer.enableSpecificLocations && gazetteer.lastResult.specificLocations) {
        html += gazetteer.generateResultList(
          gazetteer.lastResult.specificLocations,
          i18next.t('gazetteer.specificLocationsResults'),
          i18next.t('gazetteer.specificLocations'),
          'specific-locations-result'
        );
      }

      if (mapviewer.config.gazetteer.enableGeonames) {
        if (gazetteer.geonamesRunning) {
          html += '<div class="result-section geonames-result">';
          html += '<h6 class="gazetteerResultCategory">' + i18next.t('gazetteer.locationResults') + '</h6>';
          html += '<p>' +
            '<img src="images/loading.gif"  />' +
            i18next.t('gazetteer.loading') +
            '</p>';
          html += '</div>';
        } else {
          html += gazetteer.generateResultList(
            gazetteer.lastResult.locations,
            i18next.t('gazetteer.locationResults'),
            i18next.t('gazetteer.locations'),
            'locations-result'
          );
        }
      }
    }

    if (mapviewer.config.gazetteer.enableAddLayer || mapviewer.config.gazetteer.enableThematics || mapviewer.config.gazetteer.enablePortrayable) {
      html += gazetteer.generateResultList(
        gazetteer.lastResult.results,
        i18next.t('gazetteer.resultsResults'),
        i18next.t('gazetteer.results'),
        'allresults-result'
      );
    }

    $("div.gazetteerResult").html(html);
    $("div.gazetteerResult").show();
  },

  /**
   * Check if there is results from last search
   */
  hasResults: function () {
    for (var i in gazetteer.lastResult) {
      if (gazetteer.lastResult.hasOwnProperty(i) && gazetteer.lastResult[i].length > 0) {
        return true;
      }
    }
    return false;
  },

  /**
   * Generate result list html for given list
   * @param {any[]} list List to show
   * @param {string} sectionTitle Title of the result section
   * @param {string} itemName Name of the item type for button display
   * @param {string} classname Class name of the list
   * @return String
   */
  generateResultList: function (list, sectionTitle, itemName, className) {
    var html = '<div class="result-section">';
    html += '<h6 class="gazetteerResultCategory">';
    html += sectionTitle;
    html += '</h6>';

    if (className === 'allresults-result' && gazetteer.lastResult.searchType !== 'url') {
      if ((mapviewer.config.gazetteer.enableAddLayer || mapviewer.config.gazetteer.enableThematics) && layerOneGeology.firstLoadRunning) {
        html += '<p class="alert alert-info">' + i18next.t('gazetteer.catalogLoading') + '</p>';
      }

      if (mapviewer.config.gazetteer.enablePortrayable && thematicAnalysis.thematicsLoaded.state() !== "resolved") {
        html += '<p class="alert alert-info">' + i18next.t('gazetteer.analysisLoading') + '</p>';
      }
    }

    if (list && list.length > 0) {
      html += '<ul class="gazetteerResultList ' + className + '">';
      _.each(list, function (item, i) {
        var displayClass = "";
        if (className === 'locations-result' && i > 3) {
          displayClass = ' exceedingItem';
        }
        html += '<li class="gazetteerResultItem' + displayClass + '" data-id="' + item.id + '">';
        html += gazetteer.getResultIcon(item.type);
        if (item.typeLabel) {
          html += '<span class="squared-type">' + item.typeLabel + '</span>';
        }
        html += item.label;
        html += "</li>";
      });
      html += '</ul>';
      if (className === 'locations-result' && list.length > 6) {
        html += '<div class="text-right">';
        html += '<button type="button" class="btn btn-primary btn-link gazetteerMore">' + i18next.t('gazetteer.moreResults') + '</button>';
        html += '</div>';
      }
    } else {
      html += '<p class="alert alert-info">' + i18next.t('gazetteer.noFound').replace('%s', itemName) + '</p>';
    }
    html += '</div>';

    return html;
  },

  /**
   * Generates search result icon
   * @param {string} resultType Type of result
   */
  getResultIcon: function (resultType) {
    var iconClass;
    switch (resultType) {
      case 'location':
        iconClass = 'expand';
        break;
      case 'layer':
        iconClass = 'plus';
        break;
      case 'filter':
        iconClass = 'filter';
        break;
      case 'thematic':
        iconClass = 'search';
        break;
    }
    if (iconClass) {
      return '<i class="fa fa-' + iconClass + '"></i>';
    }
    return "";
  },

  /**
   * Displays or not all the results
   */
  toggleShowAllResults: function () {
    var $list = $(this).siblings('.gazetteerResultList').eq(0);
    if ($list.hasClass('show-all')) {
      $list.removeClass('show-all');
      $(this).text($(this).text().replace(i18next.t('gazetteer.lessResults'), i18next.t('gazetteer.moreResults')));
    } else {
      $list.addClass('show-all');
      $(this).text($(this).text().replace(i18next.t('gazetteer.moreResults'), i18next.t('gazetteer.lessResults')));
    }
  },

  /**
   * Displays clicked geoname by centering to its lat/lng coordinates or add layer
   */
  manageResultClick: function () {
    var id = $(this).data('id');
    if (_.isFinite(parseInt(id), 10)) {
      id = parseInt(id, 10);
    }
    var resultObj;
    var extent;
    var $list = $(this).closest('ul');
    if ($list.hasClass('allresults-result')) {
      resultObj = _.find(gazetteer.lastResult.results, { id: id });
      if (resultObj) {
        switch (resultObj.type) {
          case 'layer':
            gazetteer.addSelectedLayer(resultObj.value);
            break;
          case 'thematic':
            gazetteer.searchSelectedThematic(resultObj.value);
            break;
          case 'filter':
            if (resultObj.filterType === 'litho' || resultObj.filterType === 'age') {
              gazetteer.highlightVocabulary(resultObj.value, resultObj.filterType, 'geosciml');
            } else {
              gazetteer.highlightVocabulary(resultObj.value, resultObj.filterType, 'erml');
            }
            break;
        }
      }
    } else {
      if ($list.hasClass('locations-result')) {
        resultObj = _.find(gazetteer.lastResult.locations, { id: id });
        if (resultObj) {
          extent = ol.proj.transformExtent(resultObj.value.extent, 'EPSG:4326', mapviewer.config.defaultProjection);
        }
      } else {
        resultObj = _.find(gazetteer.lastResult.specificLocations, { id: id });
        extent = resultObj.value.extent;
      }

      if (resultObj && extent) {
        mapviewer.map.zoomToExtent(extent);
        gazetteer.hideResult();
      }
    }
  },

  /**
   * Opens catalog page
   */
  openCatalog: function () {
    if (!$('a[href="#menu-datasets"]').closest('li').hasClass('active')) {
      $('a[href="#menu-datasets"]').click();
    }
    if (!$('a[href="#add-layer"]').closest('li').hasClass('active')) {
      $('a[href="#add-layer"]').click();
    }
    $('.gazetteerHelp').hide();
  },

  /**
   * Zoom to navigator/device location
   */
  findMyLocation: function () {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        mapviewer.map.goToCoord([position.coords.longitude, position.coords.latitude], true);
        $('.gazetteerHelp').hide();
      });
    }
  },

  /**
   * Makes a search of portrayable layers
   * @param {*} searchBoth Must search on both geosciml and erml ?
   */
  searchLayersForVocab: function (searchBoth) {
    if (searchBoth) {
      layerOneGeology.makeSearchForVocab();
    } else {
      var type = 'geosciml'
      if ($(this).hasClass('add-erml-btn')) {
        type = 'erml';
      }
      layerOneGeology.makeSearchForVocab(type);
    }
    if (!$('a[href="#menu-datasets"]').closest('li').hasClass('active')) {
      $('a[href="#menu-datasets"]').click();
    }
    if (!$('a[href="#add-layer"]').closest('li').hasClass('active')) {
      $('a[href="#add-layer"]').click();
    }
    $('.gazetteerHelp').hide();
    gazetteer.hideResult();
  },

  /**
   * Adds given layer to map
   * @param {*} layer 
   * @param {boolean} forceload Force the layer to load ? (WFS) 
   */
  addSelectedLayer: function (layer, forceload) {
    var layerData = {
      id: layer.id,
      type: "layer",
      opacity: layer.serviceType === "WFS" ? 1 : 0.7,
      wfsUrlType: layer.serviceWfsUrlType || "",
      wfsUrl: layer.serviceWfsUrl || "",
      serviceType: layer.serviceType || "WMS",
      extent: layer.extent.split(",").map(Number),
      layername: layer.layerName,
      url: layer.serviceUrl,
      version: layer.version,
      title: layer.title
    };
    gazetteer.hideResult();
    mapviewer.map.addLayers([layerData])
      .done(function () {
        var timeout = 0;
        if (!$('a[href="#menu-datasets"]').closest('li').hasClass('active')) {
          $('a[href="#menu-datasets"]').click();
          timeout = 500;
        }
        if (!$('a[href="#layer-switcher"]').closest('li').hasClass('active')) {
          $('a[href="#layer-switcher"]').click();
        }
        if (layerData.serviceType === "WFS") {
          var addedLayer = _.find(mapviewer.map.layers, function (l) {
            return l.url === layerData.url && l.name === layerData.layername && l.sourceParams.type === layerData.serviceType;
          });
          if (addedLayer) {
            if (forceload) {
              $('#layerInfoSubpanel' + addedLayer.idx + ' .wfs-params-form').trigger('submit');
              mapviewer.map.zoomToLayer(addedLayer);
            } else {
              setTimeout(function () {
                $('#layerSwitcher' + addedLayer.idx).find('.nav-tabs a[href^="#layerWfsParams"]').click();
                $('.layerInfoSubpanel').removeClass('active');
                $('#layerInfoSubpanel' + addedLayer.idx).addClass('active');
              }, timeout);
            }
          }
        }
      });
  },

  searchSelectedThematic: function (thematic) {
    if (!$('a[href="#menu-datasets"]').closest('li').hasClass('active')) {
      $('a[href="#menu-datasets"]').click();
    }
    if (!$('a[href="#add-layer"]').closest('li').hasClass('active')) {
      $('a[href="#add-layer"]').click();
    }
    if (!$('a[href="#layer1GGThematicResult"]').closest('li').hasClass('active')) {
      $('a[href="#layer1GGThematicResult"]').click();
    }
    layerOneGeology.makeSearchForThematic(thematic);
  },

  /**
   * Generates SLD file for highlight vocabulary on map
   * @param {*} vocab Vocabulary to highlight
   * @param {string} type Type of vocabulary
   * @param {string} analysisType Type of standard analysis query
   */
  highlightVocabulary: function (vocab, type, analysisType) {
    var propertyName;
    switch (type) {
      case 'litho': propertyName = 'representativeLithology_uri';
        break;
      case 'age': propertyName = 'representativeAge_uri';
        break;
      case 'mineral': propertyName = 'mineralOccurrenceType_uri';
        break;
      case 'commodity': propertyName = 'representativeCommodity_uri';
        break;
    }
    if (!propertyName) {
      return
    }

    var analysisTypeKeyword, symboSld;
    var filterProperty = {
      "propertyName": propertyName,
      "values": gazetteer.generateSldFilters(vocab, propertyName)
    };
    var sldFilters = [filterProperty];

    if (analysisType === 'erml') {
      analysisTypeKeyword = 'Erml_lite_queryable';
    } else {
      analysisTypeKeyword = 'Geosciml_portrayal_age_or_litho_queryable';
    }

    if (type === 'litho') {
      type = 'lithology';
    }

    var layers = _.filter(mapviewer.map.layers, function (l) { return mapviewer.tools.searchKeyword(l.metadata.keywords, analysisTypeKeyword) });

    if (layers.length > 0) {
      toastr.info(i18next.t('gazetteer.beginSldApply'));
      _.each(layers, function (layer) {
        var sldName = layer.name;
        // if this is a group layer, we take only the first one
        sldName = sldName.split(",")[0];

        $.ajax({
          type: "POST",
          url: './sld/',
          data: {
            "layerid": 0,
            "color": "#00FF00",
            "queryableThematic": analysisType,
            "sldName": sldName,
            "filters": JSON.stringify(sldFilters)
          }
        }).then(function (result) {
          if (!_.isObject(result) || !result.sld) {
            result = null
          }
          if (result) {
            if (mapviewer.tools.searchKeyword(layer.metadata.keywords, 'queryable_geoserver')) {
              delete layer.sourceParams.params.LAYERS;
            }
            mapviewer.map.filterLayer(layer, document.location.href + result.sld, type, vocab.text);
            toastr.success(i18next.t('gazetteer.endSldApply'), layer.title);
          }
        }, function (e) {
          console.error(e);
          toastr.error(i18next.t('gazetteer.errorSld'), layer.title);
        });

      });

      gazetteer.hideResult();
    } else {
      toastr.warning(i18next.t('gazetteer.analysisNoLayer'), null, {
        timeOut: 15000,
        extendedTimeOut: 3000,
        closeButton: true,
        tapToDismiss: false,
        onclick: function () {
          layerOneGeology.makeSearchForVocab(analysisType);
          if (!$('a[href="#menu-datasets"]').closest('li').hasClass('active')) {
            $('a[href="#menu-datasets"]').click();
          }
          if (!$('a[href="#add-layer"]').closest('li').hasClass('active')) {
            $('a[href="#add-layer"]').click();
          }
          gazetteer.hideResult();
        }
      });
    }
  },

  /**
   * (Recursive) Generates filter for sld call
   * @param {*} vocab Vocabulary to generate filter
   * @param {*} propertyName Property name of the filter
   */
  generateSldFilters: function (vocab, propertyName) {
    var filters = [];

    if (propertyName) {
      filters.push(vocab.uri);

      if (_.isArray(vocab.synonyms)) {
        _.each(vocab.synonyms, function (uri) {
          filters.push(uri);
        });
      }
      if (vocab.children) {
        _.each(vocab.children, function (child) {
          filters = filters.concat(gazetteer.generateSldFilters(child, propertyName));
        });
      }
    }
    return filters;
  },

  /**
   * Hides results list
   */
  hideResult: function () {
    if (mapviewer.config.gazetteer.specificLocations) {
      gazetteer.lastResult.specificLocations = mapviewer.config.gazetteer.specificLocations.slice(0);
      gazetteer.lastResult.specificLocations = _.sortBy(gazetteer.lastResult.specificLocations, 'label');
    }
    $('.gazetteerSearchInput').val('');
    $(".gazetteerResult").html("");
    $(".gazetteerResult").hide();
    $(".gazetteerLoader").hide();
  },

  /**
   * Hides gazetteer help panel if clicked out of it
   */
  hideHelp: function (e) {
    var $el = $(e.target);
    if ($('.gazetteerHelp').css('display') !== 'none' && $el.attr('id') !== 'gazetteer' && $el.closest('#gazetteer').length === 0) {
      $('.gazetteerHelp').hide();
    }
  }
};
