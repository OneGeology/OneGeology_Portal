/**
 * thematic analysis widget
 * @constructor
 */
var thematicAnalysis = {
  /**
   * Id of the currently displayed layer
   * @type {number}
   */
  thematicLayerId: 0,

  /**
   * Thematic container of the currently displayed layer
   * @type {jQuery}
   */
  $container: null,

  /**
   * Statistics table object
   * @type {Object}
   */
  statsTable: null,

  /**
   * ?
   * @type {string}
   */
  wfstoolsTable: '',

  /**
   * ?
   * @type {string}
   */
  lithoToolsTable: "",

  /**
   * ? erml or geosciml
   * @type {string}
   */
  queryableThematic: "",

  /**
   * Is thematics lists loading ?
   * @type {Promise}
   */
  thematicsLoaded: $.Deferred(),

  /**
   * Initialize widget
   */
  init: function () {
    thematicAnalysis.loadThematics();
    thematicAnalysis.constructColorChoices();
    thematicAnalysis.addListeners();
  },

  generateLayerThematicAnalysisContents: function (layer, $container) {
    $container.html($('#thematicAnalysis').html().replace(/__ID__/gim, layer.idx));
    if (!layer.wfs.url || !layer.wfs.urlType) {
      $container.find('.statistics-btn').remove();
    }
  },

  /**
   * Loads all thematics for analysis
   */
  loadThematics: function () {
    mapviewer.config.analysis = {};
    var calls = [];
    _.each(['ga_mineral-occurrence-type_v0-1', 'ga_commodity-code_v0-2', 'litho', 'ages'], function (vocabName) {
      calls.push($.ajax({
        method: 'GET',
        url: 'vocabulary/?name=' + vocabName,
        success: function (list) {
          mapviewer.config.analysis[vocabName] = list
        }
      }))
    });

    $.when.apply(undefined, calls).then(function () {
      thematicAnalysis.thematicsLoaded.resolve(true);
    }, function (e) {
      console.error(e);
      thematicAnalysis.thematicsLoaded.reject(e);
    });
  },

  /**
   * Creates widget listeners
   */
  addListeners: function () {
    $('#menu-datasets').on("click", ".colors-dropdown a", thematicAnalysis.chooseColor);

    $('#menu-datasets').on("click", '.reset-btn', thematicAnalysis.portrayalReset);
    $('#menu-datasets').on("click", '.portrayal-btn', function () { thematicAnalysis.portrayalSubmit() });
    $('#menu-datasets').on("click", '.statistics-btn', { download: false }, thematicAnalysis.validateWfsTool);
    $('#menu-datasets').on("click", '.download-wdl-btn', function () { thematicAnalysis.portrayalSubmit(true) });

  },

  /**
   * Renders colors dropdown
   */
  constructColorChoices: function () {
    var colors = [
      "FFFFFF", "808080", "000000", "FF0000", "FF6A00", "FFD800", "B6FF00", "00FF00", "00FFFF",
      "0094FF", "0026FF", "4800FF", "B200FF", "FF00DC", "FF006E"
    ];
    var $dropdownMenu = $('#thematicAnalysis').find('.colors-dropdown .dropdown-menu');
    var colorClass;
    for (var i = 0; i < colors.length; i++) {
      colorClass = "";
      if (colors[i] == "FFFFFF") {
        colorClass = "bordered ";
      }
      if (colors[i] == $('#thematicAnalysis').find('.colors-dropdown .color-choice').data('value')) {
        colorClass += "checked";
      }
      $dropdownMenu.append(
        '<li>' +
        '<a data-value="' + colors[i] + '" style="background: #' + colors[i] + '"' +
        (colorClass ? 'class="' + colorClass + '"' : '') + '>' +
        '<span class="sr-only">' + colors[i] + '</span>' +
        '</a>' +
        '</li>'
      );
    }
  },

  /**
   * Handle color change
   */
  chooseColor: function () {
    var color = $(this).data('value');

    $(this).closest('.dropdown-menu').find('.checked').removeClass('checked');
    $(this).addClass('checked');

    var colorsChoice = $(this).closest('.colors-dropdown').find('.color-choice');
    if ($(this).hasClass('bordered')) {
      colorsChoice.addClass('bordered');
    } else {
      colorsChoice.removeClass('bordered');
    }
    colorsChoice
      .data('value', color)
      .css('background', '#' + color)
      .find('span').text(color);
  },

  /**
   * Activate thematic analysis for current layer
   * @param {number} layerId - current layer id
   */
  openThematicAnalysis: function (layerId) {
    thematicAnalysis.thematicLayerId = layerId;
    thematicAnalysis.$container = $('#layerAnalysis' + layerId);

    var gclayer = _.find(mapviewer.map.layers, { idx: thematicAnalysis.thematicLayerId });

    if (mapviewer.tools.searchKeyword(gclayer.metadata.keywords, 'Erml_lite_queryable')) {
      thematicAnalysis.queryableThematic = "erml";
    } else if (mapviewer.tools.searchKeyword(gclayer.metadata.keywords, 'Geosciml_portrayal_age_or_litho_queryable')) {
      thematicAnalysis.queryableThematic = "geosciml";
    }
    $('.analysis-panel').hide();
    //remove all tab titles styles
    if (thematicAnalysis.queryableThematic === "erml") {
      $('#commodityAnalysisPanel-' + layerId).show();
      $('#mineralOccurenceAnalysisPanel-' + layerId).show();
      thematicAnalysis.thematicsLoaded.then(function () {
        thematicAnalysis.initializeTree("ga_mineral-occurrence-type_v0-1", "#portrayalMineralOccurence" + layerId);
        thematicAnalysis.initializeTree("ga_commodity-code_v0-2", "#portrayalCommodity" + layerId);
      });
    } else if (thematicAnalysis.queryableThematic === "geosciml") {
      $('#lithologyAnalysisPanel-' + layerId).show();
      $('#ageAnalysisPanel-' + layerId).show();
      thematicAnalysis.thematicsLoaded.then(function () {
        thematicAnalysis.initializeTree("litho", "#portrayalLitho" + layerId);
        thematicAnalysis.initializeTree("ages", "#portrayalAge" + layerId);
      });
    }
  },

  /**
   * Build vocabularies tree at tag position
   * @param vocab => type of vocabulary (ages or litho)
   * @param tag => where to build the tree
   */
  initializeTree: function (vocab, tag) {
    thematicAnalysis.$container.find(tag + "Result").jstree({
      "checkbox": {
        "keep_selected_style": true
      },
      "plugins": ["checkbox", "search"],
      'core': {
        "themes": {
          "icons": false
        },
        'data': mapviewer.config.analysis[vocab]
      }
    });
    var to = false;
    thematicAnalysis.$container.find(tag + "Search").keyup(function () {
      var $that = $(this);
      if (to) { clearTimeout(to); }
      to = setTimeout(function () {
        var v = $that.val();
        thematicAnalysis.$container.find(tag + "Result").jstree(true).search(v);
      }, 250);
    });
    thematicAnalysis.$container.find(tag + "Result").on('search.jstree', function (e, data) {
      $(this).find('.jstree-search:eq(0)')[0].scrollIntoView();
    });

  },

  portrayalSubmit: function (isDownload) {
    var color = thematicAnalysis.$container.find('.color-choice').data('value');
    var gclayer = _.find(mapviewer.map.layers, { idx: thematicAnalysis.thematicLayerId });
    if (gclayer) {
      $('#wfstools2Loading').show();

      var sld_name = gclayer.name;

      // if this is a group layer, we take only the first one
      sld_name = sld_name.split(",")[0];

        var filters = [];
        var filterType;
        var filterNames = [];
        if(thematicAnalysis.queryableThematic === "geosciml") {
            // GEOSCIML
            var filterLitho = {
                "propertyName": "representativeLithology_uri",
                "values": []
            };
            $.each($("#portrayalLitho" + thematicAnalysis.thematicLayerId + "Result").jstree("get_checked", true), function () {
              filterNames.push(this.text);
              
              if (_.isArray(this.original.synonyms)) {
                   filterLitho.values.push(this.original.uri);
                     $.each(this.original.synonyms, function () {
                         filterLitho.values.push(this);
                     });
                   }
            });

            var filterAge = {
                "propertyName": "representativeAge_uri",
                "values": []
            };
            //Filtre Ages
            $.each($("#portrayalAge" + thematicAnalysis.thematicLayerId + "Result").jstree("get_checked", true), function () {
              filterNames.push(this.text);
              
              if (_.isArray(this.original.synonyms)) {
                filterAge.values.push(this.original.uri);
                $.each(this.original.synonyms, function () {
                  filterAge.values.push(this);
                });
              }
            });
            var hasLithos;
            var hasAge;
            if (filterLitho.values.length > 0) {
                filters.push(filterLitho);
                hasLithos = true;
            }
            if (filterAge.values.length > 0) {
                filters.push(filterAge);
                hasAge = true;
            }

          if (hasLithos && hasAge) {
            filterType = i18next.t('gazetteer.lithoTag') + ' & ' + i18next.t('gazetteer.ageTag');
          } else if (hasLithos) {
            filterType = i18next.t('gazetteer.lithoTag');
          } else {
            filterType = i18next.t('gazetteer.ageTag');
          }
        } else if (thematicAnalysis.queryableThematic === "erml") {
            var filterCommodity = {
                "propertyName": "representativeCommodity_uri",
                "values": []
            };
            // ERML
            $.each($("#portrayalCommodity" + thematicAnalysis.thematicLayerId + "Result").jstree("get_checked", true), function () {
              filterNames.push(this.text);
              
              if (this.original.uri) {
                filterCommodity.values.push(this.original.uri);
              }
            });

            var filterMineralOccurence = {
                "propertyName": "mineralOccurrenceType_uri",
                "values": []
            };
            //Filtre MineralOccurences
            $.each($("#portrayalMineralOccurence" + thematicAnalysis.thematicLayerId + "Result").jstree("get_checked", true), function () {
              filterNames.push(this.text);
              
              if (this.original.uri) {
                filterMineralOccurence.values.push(this.original.uri);
              }
            });

            var hasMineral;
            var hasCommodity;
            if (filterCommodity.values.length > 0) {
                filters.push(filterCommodity);
            }
            if (filterCommodity.values.length > 0) {
                filters.push(filterMineralOccurence);
            }

            if (hasMineral && hasCommodity) {
              filterType = i18next.t('gazetteer.mineralTag') + ' & ' + i18next.t('gazetteer.commodityTag');
            } else if (hasMineral) {
              filterType = i18next.t('gazetteer.mineralTag');
            } else {
              filterType = i18next.t('gazetteer.commodityTag');
            }
        }


      $.ajax({
        type: "POST",
        url: "./sld/",
        data: {
          "layerid": gclayer.idx,
          "color": color,
          "queryableThematic": thematicAnalysis.queryableThematic,
          "sldName": sld_name,
          "filters": JSON.stringify(filters)
        },
        error: function (jqXHR, textStatus, errorThrown) {
          toastr.error(errorThrown, "/// " + jqXHR + " ///" + textStatus);
          $('#wfstools2Loading').hide();
        },
        success: function (result) {
          var test = result;
          //use SLD_BODY param for direct sld xml and SLD for external url sld
          if (isDownload) {
            window.location.href = document.location.href + test.sld;
          } else {
            if (mapviewer.tools.searchKeyword(gclayer.metadata.keywords, 'queryable_geoserver')) {
              delete gclayer.sourceParams.params.LAYERS;
            }

            var finalName;
            if(filterNames.length > 1) {
              finalName = filterNames;
            } else {
              finalName = filterNames[0];
            }

            mapviewer.map.filterLayer(gclayer, document.location.href + test.sld, filterType, finalName);
          }

          $('#wfstools2Loading').hide();
        }

      });
    }
  },

  portrayalReset: function () {
    var gclayer = _.find(mapviewer.map.layers, { idx: thematicAnalysis.thematicLayerId });
    if (gclayer) {
      mapviewer.map.disableLayerFilter(gclayer);
      $("#portrayalLitho" + thematicAnalysis.thematicLayerId + "Result, #portrayalAge" + thematicAnalysis.thematicLayerId + "Result").jstree("uncheck_all");
    }
  },

  // TODO: Check existance pour supprimer la partie ProxyWFSTools.jsp
  validateWfsTool: function (event) {
    //build litho filter
    var selectedLayer = _.find(mapviewer.map.layers, { idx: thematicAnalysis.thematicLayerId });
    if (!selectedLayer) {
      return;
    }

    var cpt = 0;
    var filtreLitho = "";
    $.each($("#portrayalLitho" + thematicAnalysis.thematicLayerId + "Result").jstree("get_checked", true), function () {
      cpt++;
      filtreLitho += "<fes:PropertyIsEqualTo>";
      filtreLitho += "<fes:ValueReference>gsmlb:specification/gsmlb:GeologicUnit/gsmlb:composition/gsmlb:CompositionPart/gsmlb:material/gsmlb:RockMaterial/gsmlb:lithology/@xlink:href</fes:ValueReference>";

      filtreLitho += "<fes:Literal>" + this.original.uri + "</fes:Literal>";
      filtreLitho += "</fes:PropertyIsEqualTo>";
      $.each(this.original.synonyms, function () {
        cpt++;
        filtreLitho += "<fes:PropertyIsEqualTo>";
        filtreLitho += "<fes:ValueReference>gsmlb:specification/gsmlb:GeologicUnit/gsmlb:composition/gsmlb:CompositionPart/gsmlb:material/gsmlb:RockMaterial/gsmlb:lithology/@xlink:href</fes:ValueReference>";
        filtreLitho += "<fes:Literal>" + this + "</fes:Literal>";
        filtreLitho += "</fes:PropertyIsEqualTo>";
      });
    });

    if (cpt > 1) {
      filtreLitho = "<fes:Or>" + filtreLitho + "</fes:Or>";
      cpt = 1;
    }

    //build ages filter

    var cpt2 = 0;
    var filtreAges = "";
    $.each($("#portrayalAge" + thematicAnalysis.thematicLayerId + "Result").jstree("get_checked", true), function () {
      cpt2++;
      filtreAges += "<fes:PropertyIsEqualTo>";
      filtreAges += "<fes:ValueReference>gsmlb:specification/gsmlb:GeologicUnit/gsmlb:geologicHistory/gsmlb:GeologicEvent/gsmlb:olderNamedAge/@xlink:href</fes:ValueReference>";

      filtreAges += "<fes:Literal>" + this.original.uri + "</fes:Literal>";
      filtreAges += "</fes:PropertyIsEqualTo>";
      $.each(this.original.synonyms, function () {
        cpt2++;
        filtreAges += "<fes:PropertyIsEqualTo>";
        filtreAges += "<fes:ValueReference>gsmlb:specification/gsmlb:GeologicUnit/gsmlb:geologicHistory/gsmlb:GeologicEvent/gsmlb:olderNamedAge/@xlink:href</fes:ValueReference>";
        filtreAges += "<fes:Literal>" + this + "</fes:Literal>";
        filtreAges += "</fes:PropertyIsEqualTo>";
      });
    });

    if (cpt2 > 1) {
      filtreAges = "<fes:Or>" + filtreAges + "</fes:Or>";
      cpt2 = 1;
    }

    // Combine the two filter: Litho & Ages
    var filtreTotal = filtreLitho + filtreAges;
    if (cpt + cpt2 > 1)
      filtreTotal = "<fes:And>" + filtreTotal + "</fes:And>";

    if (event.data.download) {
      if (mapviewer.map.getCurrentResolution() < 0.0015) {
        var version = "2.0.0";
        var wfsURL = selectedLayer.wfs.url;
        var wfsURLType = selectedLayer.wfs.urlType;
        if (wfsURL.indexOf('?') == -1)
          wfsURL += "?";

        var extent = mapviewer.map.getCurrentExtent();
        var bbox = extent.join();

        //extent array = east, south, west, north
        if (version == "2.0.0")
          bbox = extent[1] + "," + extent[0] + "," + extent[3] + "," + extent[2];

        var srs = mapviewer.map.getCurrentProjection();
        if (filtreTotal === undefined)
          filtreTotal = "";
        var gsmlVersion = this.getGsmlVersion();
        var proxyurl = "./ProxyWFSTools.jsp";
        var params = "request=gsmlbbox&bbox=" + bbox + "&srs=" + srs + "&url=" + escape(wfsURL) + "&typename=" + escape(wfsURLType) + "&version=" + version + "&filter=" + escape(filtreTotal) + "&gsmlVersion=" + escape(gsmlVersion);

        window.open(proxyurl + "?" + params);


      } else {
        toastr.error(i18next.t('analysis.noStatisticsError'));
      }

    } else {
      thematicAnalysis.openwfstoolsWindow(selectedLayer, filtreTotal, "wfstools" + thematicAnalysis.thematicLayerId)
    }
  },

  getGsmlVersion: function () {
    var gsmlVersion = 4;
    var selectedLayer = _.find(mapviewer.map.layers, { idx: thematicAnalysis.thematicLayerId });
    if (selectedLayer) {
      var gsmlKeyword = mapviewer.tools.searchKeyword(selectedLayer.metadata.keywords, 'wfs_age_or_litho_queryable');
      if (gsmlKeyword) {
        var version = Number(gsmlKeyword[0].replace(/GeoSciML(\d+)_wfs_age_or_litho_queryable/i, "$1"));
        if (version && !isNaN(version)) {
          gsmlVersion = version;
        }
      }
    }
    return gsmlVersion;
  },

  openwfstoolsWindow: function (selectedLayer, wfsFilter, tag) {

    if (mapviewer.map.getCurrentResolution() < 0.0015) {
      //var version = "1.1.0";

      var version = "2.0.0";
      var wfsURL = selectedLayer.wfs.url;
      var wfsURLType = selectedLayer.wfs.urlType;

      if (wfsURL.indexOf('?') == -1) {
        wfsURL += "?";
      }
      wfsURL += "1=1&";

      var extent = mapviewer.map.getCurrentExtent();
      var bbox = extent.join();
      //extent array = east, south, west, north
      if (version == "2.0.0") {
        bbox = extent[1] + "," + extent[0] + "," + extent[3] + "," + extent[2];
      }
      var srs = mapviewer.map.getCurrentProjection();
      if (wfsFilter == undefined) {
        wfsFilter = "";
      }

      $("#" + tag + "Loading").show();
      $('#' + tag + "-win-content").hide();

      $("#" + tag + "CBoxOptions").html("");
      $("#" + tag + "-win-content-info").html("");

      var gsmlVersion = thematicAnalysis.getGsmlVersion();
      $.ajax({
        type: "POST",
        url: "./wfs/",
        data: {
          "request": "stats",
          "bbox": bbox,
          "lang": "en",
          "srs": srs,
          "url": wfsURL,
          "typename": wfsURLType,
          "version": version,
          "filter": wfsFilter,
          "gsmlVersion": gsmlVersion
        },
        error: function (jqXHR, textStatus, errorThrown) {
          toastr.error("error=" + errorThrown, "/// " + jqXHR + " ///" + textStatus)
          $("#" + tag + "Loading").hide();
        },
        success: function (result) {
          $("#" + tag + "Loading").hide();

          var thingsInResponse = 0;
          var selectedchoice = "";

          for (var value in JSON.parse(result)) {
            thingsInResponse++;
            if (selectedchoice == "") {
              selectedchoice = value;
              $("#" + tag + "CBoxOptions").append('<option value="' + value + '" selected>' + value + '</option>');
            } else {
              $("#" + tag + "CBoxOptions").append('<option value="' + value + '">' + value + '</option>');
            }
          }

          //add event on on change on the list
          $("#" + tag + "CBoxOptions").on("change", function (event) {
            thematicAnalysis.wfstoolsDisplayStats($(this).val(), JSON.parse(result), tag);
          });
          if (thingsInResponse > 0) {
            $("#" + tag + "CBox").show();
            thematicAnalysis.wfstoolsDisplayStats(selectedchoice, JSON.parse(result), tag);
          } else {
            $("#" + tag + "-win-content-info").html(i18next.t('analysis.nothingFound'));
          }
          $('#' + tag + "-win-content").show();
        }

      });
    } else {
      toastr.error(i18next.t('analysis.noStatisticsError'));
    }
  },

  wfstoolsDisplayStats: function (selectedChoice, result, tag) {
    //need to destroy the datatable and rebuilt it
    if (thematicAnalysis.statsTable) {
      thematicAnalysis.statsTable.destroy();
    }
    $("#" + tag + "-win-content-info").html(''); //remove HTML from DOM
    $("#" + tag + "-win-content-info").html('<table id="' + tag + '-statsTable"><thead><tbody></tbody></thead></table>'); //build table

    var thead = "";
    var tbody = "";
    var entete = [];
    //debugger;
    for (var property in result[selectedChoice][0]) {
      thead += "<td>" + property + "</td>\n";
      entete.push(property);
    }
    for (var i = 0; i < result[selectedChoice].length; i++) {
      tbody += "<tr>";
      for (var j = 0; j < entete.length; j++) {
        tbody += "<td>" + result[selectedChoice][i][entete[j]] + "</td>";
      }
      tbody += "</tr>";
    }

    $("#" + tag + "-statsTable >thead").html("<tr>" + thead + "</tr>");
    $("#" + tag + "-statsTable >tbody").html(tbody);

    thematicAnalysis.statsTable = $("#" + tag + "-statsTable").DataTable({ "bFilter": false, "bLengthChange": false });
    if (!$("#" + tag + "-win-content-info").is("visible")) {
      $("#" + tag + "-win-content-info").show();
    }
  }
}
