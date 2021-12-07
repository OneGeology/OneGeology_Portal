/**
 * layer switcher widget
 */
var layerswitcher = {

  /**
   * Template pages
   * @type {string}
   */
  layerModelPage: "./widget/layerswitcher/defaultModels/layer2.html?1gg-no-cache",

  /**
   * Legend partial template
   * @type {string}
   */
  legendModel: "./widget/layerswitcher/defaultModels/legend.html?1gg-no-cache",

  /**
   * Thematic partial template
   * @type {string}
   */
  thematicModel: "./widget/layerswitcher/defaultModels/thematic.html?1gg-no-cache",

  /**
   * WFS parameters partial template
   * @type {string}
   */
  wfsParamsModel: "./widget/layerswitcher/defaultModels/wfs-params.html?1gg-no-cache",

  /**
   * Debouncer for filter parameters values
   */
  debounceWfsFilterTimeout: null,

  /**
   * Jquery ui slider options
   * @type {Object}
   */
  sliderOptions: {
    min: 0,
    max: 100,
    step: 10,
    value: 100,
    range: "max"
  },

  /**
   * Initialize widget
   */
  init: function () {
    layerswitcher.addClickEvents();

    if (layerswitcher.layerModelPage) {
      $(".layerSwitcherModelContainer").append(mapviewer.load(layerswitcher.layerModelPage));
      $(".layerSwitcherModelContainer").append(mapviewer.load(layerswitcher.wfsParamsModel));
      layerswitcher.constructColorChoices();
    }
    if (layerswitcher.thematicModel && mapviewer.config.layersOptions.thematic) {
      $(".layerSwitcherModelContainer").append(mapviewer.load(layerswitcher.thematicModel));
    }
    if (layerswitcher.legendModel && mapviewer.config.tools.legendPanel.enable) {
      $("#legends .panel-group").append(mapviewer.load(layerswitcher.legendModel));
    }

    $("#sortable").sortable({
      handle: '.sortable-anchor', // to limit the drag anchor
    });
  },


  /**
   * Creates widget listeners
   */
  addClickEvents: function () {
    $(".layerSwitcherLayersList")
      .on("change", ".layerSwitcherLayerShowHide input", this.manageLayerShowHide.bind(this))
      .on("change", ".layerSwitcherFilters input", this.toggleLayerFilter.bind(this))
      .on("click", ".layerSwitcherLayerTools", this.toggleLayerTools.bind(this))
      .on("click", ".layerSwitcherLayerDelete", this.manageLayerDelete.bind(this))
      .on("click", ".layerSwitcherLayerZoomTo", this.manageLayerZoomTo.bind(this))
      .on("dblclick", ".toolsContainer .layerSwitcherLayerTitle", this.manageLayerZoomTo.bind(this))
      .on("click", ".subpanelLink, .toolsContainer .layerSwitcherLayerTitle, .layerSwitcherWfsFilters .filter-label", this.openLayerPanel.bind(this))
      .on("click", ".closeSubpanel", this.closeLayerPanel.bind(this))
      .on("click", ".layerInfos .copy-btn", this.copyServiceUrl.bind(this))
      .on('show.bs.tab', '.nav-tabs a[href^="#layerAnalysis"]', this.activeThematicAnalysis)
      .on('click', '.layerSwitcherLayerWFSParams .add-param-btn', this.addWFSParameter.bind(this))
      .on('change', '.layerSwitcherLayerWFSParams .param-choice', this.getWFSParamValues.bind(this))
      .on('click', '.layerSwitcherLayerWFSParams .remove-param-btn', this.removeWFSParameter.bind(this))
      .on('submit', '.layerSwitcherLayerWFSParams .wfs-params-form', this.filterWfsLayer.bind(this))
      .on('click', '.layerSwitcherLayerWFSParams .reset-btn', this.resetWFSParameters.bind(this))
      .on("click", ".wfs-colors-dropdown a", this.chooseColor.bind(this))
      .on("change", ".layerSwitcherLayerWFSParams .param-values-filter .classic-checkbox input", this.filterWFSValues.bind(this))
      .on("keyup", ".layerSwitcherLayerWFSParams .param-values-filter .search-filter-value input", this.debouncedFilterWFSValues.bind(this));

    $('.layer-management > .nav-tabs a').on('show.bs.tab', function () {
      if ($(this).attr('href') == "#import-layer") {
        $(this).closest('.nav-tabs').siblings('.tab-content').eq(0).addClass('without-bottom-button');
      } else {
        $(this).closest('.nav-tabs').siblings('.tab-content').eq(0).removeClass('without-bottom-button');
      }
    });

    $("#sortable").on("sortstop", this.manageDragLayer.bind(this));

    //change the base layer
    $('#base-layers').change(function () {
      var bgLayerName = $('#base-layers').val();
      var bgLayer = _.find(mapviewer.config.bgLayers, { name: bgLayerName });
      if (bgLayer) {
        mapviewer.map.updateBgLayers(bgLayer);
      }
      $('.base-layer-selector').removeClass('active');
    });

    $('#layer-switcher .add-button').click(function () {
      $('.layer-management a[href="#add-layer"]').click();
    });
    $('#layer-switcher .reset-button').click(layerswitcher.resetAllPortrayableLayers);

    $('#menu-datasets .basic-dataset-labels').tooltip();
  },

  /**
   * Renders colors dropdown
   */
  constructColorChoices: function () {
    var colors = [
      "FFFFFF", "808080", "000000", "FF0000", "FF6A00", "FFD800", "B6FF00", "00FF00", "00FFFF",
      "0094FF", "0026FF", "4800FF", "B200FF", "FF00DC", "FF006E"
    ];
    var $dropdownMenu = $('.layerSwitcherLayerWFSParamsModel').find('.wfs-colors-dropdown .dropdown-menu');
    var colorClass;
    for (var i = 0; i < colors.length; i++) {
      colorClass = "";
      if (colors[i] == "FFFFFF") {
        colorClass = "bordered ";
      }
      if (colors[i] == $('.layerSwitcherLayerWFSParamsModel').find('.wfs-colors-dropdown .color-choice').data('value')) {
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
   * Handle layers compatibility on map mode change
   */
  handleMapMode: function () {
    _.each(mapviewer.map.layers, function (layer) {
      if (layer.disabled) {
        $("#layerSwitcher" + layer.idx + " .layerSwitcherLayerSRS").show();
        $("#layerSwitcher" + layer.idx + " .layerSwitcherLayerShowHide").hide();
      } else {
        $("#layerSwitcher" + layer.idx + " .layerSwitcherLayerSRS").hide();
        $("#layerSwitcher" + layer.idx + " .layerSwitcherLayerShowHide").show();
      }
    });
    if (mapviewer.map.currentMap === "ol") {
      $('.active-analysis').show();
      $('.no-analysis').hide();
    } else {
      $('.active-analysis').hide();
      $('.no-analysis').show();
    }
  },

  /**
   * Display current layer number
   */
  countLayer: function () {
    $(".layerCount").text(mapviewer.map.layers.length);
  },

  /**
   * Handler when drag end a layer
   * @param event
   * @param ui
   */
  manageDragLayer: function (event, ui) {
    var layers = mapviewer.map.layers;


    if (ui.item.hasClass('layerSwitcherLayerThematic')) {
      ui.item.find('.layerSwitcherLayer').each(function () {
        layerswitcher.manageDragLayer(null, { item: $(this) });
      });
    } else {
      var layerIndex = _.findIndex(layers, { idx: layerswitcher.extractDomLayerIdx($(ui.item)) });
      if (layerIndex >= 0) {
        var newIndex = (layers.length - 1 - ui.item.index('.layerSwitcherLayer'));
        mapviewer.map.moveLayer(layerIndex, newIndex);
      }
    }

  },

  /**
   * Renders layer
   * @param {ol.Layer} layer
   * @return {string}
   */
  drawLayer: function (layer) {
    if (layer.displayInLayerSwitcher) {
      layerswitcher.drawLegend(layer);

      var layerDiv = $(".layerSwitcherLayerModel").clone();
      layerDiv.attr("id", "layerSwitcher" + layer.idx);
      layerDiv.html(layerDiv.html().replace(/__ID__/gim, layer.idx));

      // === Layer line ===
      if (layer.autolayer) {
        layerDiv.find("a.layerSwitcherLayerTitle").addClass('autolayer');
        layerDiv.find('.layerSwitcherLayerLoader').hide();
      }

      layerDiv.find(".layerSwitcherLayerTitle").html(layer.title);
      layerDiv.find(".sidebar-pane-subpane h2")
        .html(layer.title)
        .attr('title', layer.title);

      if (layer.visible) {
        layerDiv.find(".layerSwitcherLayerShowHide input").attr("checked", "checked");
      }

      layerDiv.show();
      layerDiv.removeClass("layerSwitcherLayerModel").addClass("layerSwitcherLayer").show();


      layerDiv.find(".layerOpacity").text(layer.opacity * 100);

      // === Layer popover ===
      if (layer.metadata.dataURL) {
        layerDiv.find(".dataURLButton").attr("href", layer.metadata.dataURL);
      } else {
        layerDiv.find(".dataURLButton").remove();
      }

      if (layer.id && layer.id.length > 15) { //quick and dirty trick to be sure id is from geonetwork
        layerDiv.find(".catalogMetadataURLButton").attr("href", "http://onegeology-geonetwork.brgm.fr/geonetwork3/srv/api/records/" + layer.id + "/formatters/xml");
      } else {
        layerDiv.find(".catalogMetadataURLButton").remove();
      }


      if (layer.metadata.metadataURL && layer.metadata.metadataURL != "NA") {
        layerDiv.find(".metadataURLButton").attr("href", layer.metadata.metadataURL);
      } else {
        layerDiv.find(".metadataURLButton").remove();
        if (!layer.metadata.dataURL && (!layer.id || !layer.id.length > 15)) {
          layerDiv.find('.layerLinks').remove();
        }
      }

      // === Layer subpanel ===
      if (layer.metadata.legendURL) {
        layerDiv.find(".layerCaptions img").attr('src', layer.metadata.legendURL);
      } else {
        layerDiv.find(".layerCaptions").remove();
        layerDiv.find('a[href^="#layerCaptions"]').closest('li').remove();
      }

      if (layer.metadata.serviceAccessConstraint) {
        layerDiv.find(".metadataAccessConstraint").text(layer.metadata.serviceAccessConstraint);
      } else {
        layerDiv.find(".metadataAccessConstraint").prev('dt').remove();
        layerDiv.find(".metadataAccessConstraint").remove();
      }

      layerDiv.find(".metadataTitle").text(layer.metadata.serviceTitle);

      if (layer.metadata.serviceUrl) {
        var serviceUrl = layer.metadata.serviceUrl;
        layerDiv.find(".metadataServiceUrl a")
          .text(serviceUrl.length < 50 ? serviceUrl : serviceUrl.substring(0, 50) + '...')
          .attr('href', serviceUrl)
          .attr('title', serviceUrl);
      }

      if (layer.metadata.legendURL) {
        var legendURL = layer.metadata.legendURL;
        layerDiv.find(".metadataLegendUrl a")
          .text(legendURL.length < 50 ? legendURL : legendURL.substring(0, 50) + '...')
          .attr('href', legendURL)
          .attr('title', legendURL);
      } else {
        layerDiv.find(".metadataLegendUrl").prev('dt').remove();
        layerDiv.find(".metadataLegendUrl").remove();
      }

      if (layer.metadata.downloadFeatureUrl) {
        var downloadFeatureUrl = layer.metadata.downloadFeatureUrl;
        layerDiv.find(".metadataDownloadFeatureUrl a")
          .text(downloadFeatureUrl.length < 50 ? downloadFeatureUrl : downloadFeatureUrl.substring(0, 50) + '...')
          .attr('href', downloadFeatureUrl)
          .attr('title', downloadFeatureUrl);
      } else {
        layerDiv.find(".metadataLegendUrl").prev('dt').remove();
        layerDiv.find(".metadataLegendUrl").remove();
      }

      if (layer.wfs && layer.wfs.url) {
        layerDiv.find(".metadataWfsUrl a")
          .text(layer.wfs.url.length < 50 ? layer.wfs.url : layer.wfs.url.substring(0, 50) + '...')
          .attr('href', layer.wfs.url)
          .attr('title', layer.wfs.url);
      } else {
        layerDiv.find(".metadataWfsUrl").prev('dt').remove();
        layerDiv.find(".metadataWfsUrl").remove();
      }

      layerDiv.find(".metadataAbstract").html(layer.metadata.layerAbstract);

      var lastUpdate = mapviewer.tools.searchKeyword(layer.metadata.keywords, 'DS_DATE');
      if (lastUpdate && lastUpdate[1]) {
        layerDiv.find(".metadataLastUpdate").html(lastUpdate[1]);
      } else {
        layerDiv.find(".metadataLastUpdate").prev('dt').remove();
        layerDiv.find(".metadataLastUpdate").remove();
      }

      var topicCategory = mapviewer.tools.searchKeyword(layer.metadata.keywords, 'DS_TOPIC');
      if (topicCategory && topicCategory[1]) {
        layerDiv.find(".metadataTopicCategory").html(topicCategory[1] + '&nbsp;<a href="http://gcmd.nasa.gov/User/difguide/iso_topics.html" target="_blank"><i class="fa fa-question-circle"></i></a>');
      } else {
        layerDiv.find(".metadataTopicCategory").prev('dt').remove();
        layerDiv.find(".metadataTopicCategory").remove();
      }

      var owner = mapviewer.tools.searchKeyword(layer.metadata.keywords, 'dataprovider');
      if (!owner) {
        owner = mapviewer.tools.searchKeyword(layer.metadata.keywords, 'dataowner');
      }
      if (owner && owner[1]) {
        layerDiv.find(".metadataOwner").html(owner[1]);
      } else {
        layerDiv.find(".metadataOwner").prev('dt').remove();
        layerDiv.find(".metadataOwner").remove();
      }

      //Display Scale visibility
      if (layer.metadata.minScale || layer.metadata.maxScale) {
        var scaleToDisplay;
        if (!layer.metadata.maxScale) {
          scaleToDisplay = i18next.t('layerswitcher.scale') + " < 1/" + layer.metadata.minScale;
        } else {
          scaleToDisplay = "1/" + layer.metadata.maxScale + " < " + i18next.t('layerswitcher.scale');
          if (layer.metadata.minScale) {
            scaleToDisplay += " < 1/" + layer.metadata.minScale;
          }
        }
        layerDiv.find(".metadataVisibility").html(scaleToDisplay);
      } else {
        layerDiv.find(".metadataVisibility").prev('dt').remove();
        layerDiv.find(".metadataVisibility").remove();
      }

      //contact Information
      if (layer.metadata.contactPerson) {
        layerDiv.find(".contactPerson").text(layer.metadata.contactPerson).after($("<br />"));
      } else {
        layerDiv.find(".contactPerson").replaceWith("");
      }
      if (layer.metadata.contactOrganization) {
        layerDiv.find(".contactOrganization").text(layer.metadata.contactOrganization).after($("<br />"));
      } else {
        layerDiv.find(".contactOrganization").replaceWith("");
      }
      if (layer.metadata.contactAddress) {
        layerDiv.find(".contactAddress").replaceWith(layer.metadata.contactAddress + "<br />");
      } else {
        layerDiv.find(".contactAddress").replaceWith("");
      }
      if (layer.metadata.contactPostCode || layer.metadata.contactCity) {
        layerDiv.find(".contactPostCode").replaceWith(layer.metadata.contactPostCode + " " + layer.metadata.contactCity + "<br />");
      } else {
        layerDiv.find(".contactPostCode").replaceWith("");
      }
      if (layer.metadata.contactCountry) {
        layerDiv.find(".contactCountry").replaceWith(layer.metadata.contactCountry + "<br />");
      } else {
        layerDiv.find(".contactCountry").replaceWith("");
      }
      if (layer.metadata.contactEmail) {
        layerDiv.find(".contactEmail")
          .attr('href', 'mailto:' + layer.metadata.contactEmail)
          .text(layer.metadata.contactEmail);
      } else {
        layerDiv.find(".contactEmail").replaceWith("");
      }

      //Layer extent
      if (layer.bbox) {
        layerDiv.find(".twest").html(layer.bbox[0].toFixed(3));
        layerDiv.find(".tsouth").html(layer.bbox[1].toFixed(3));
        layerDiv.find(".teast").html(layer.bbox[2].toFixed(3));
        layerDiv.find(".tnorth").html(layer.bbox[3].toFixed(3));
      }

      var portrayal = mapviewer.tools.searchKeyword(layer.metadata.keywords, 'portrayal_age_or_litho_queryable') || mapviewer.tools.searchKeyword(layer.metadata.keywords, 'Erml_lite_queryable');
      var geosciml = mapviewer.tools.searchKeyword(layer.metadata.keywords, 'wfs_age_or_litho_queryable');

      if (layer.sourceParams.type === "WMS" && (portrayal || geosciml)) {
        thematicAnalysis.generateLayerThematicAnalysisContents(layer, layerDiv.find('.layerAnalysis'));
      } else {
        layerDiv.find(".thematicAnalysisButton, .analysisLink").remove();
        layerDiv.find('a[href^="#layerAnalysis"]').closest('li').remove();
      }

      // draw thematic if option is active
      if (mapviewer.config.layersOptions.thematic) {
        layerDiv.find('.sortable-anchor').removeClass('sortable-anchor').addClass('sublist-sortable-anchor');
        var thematicKw = mapviewer.tools.searchKeyword(layer.metadata.keywords, 'thematic');
        var thematic = i18next.t('layerswitcher.noThematic');
        if (thematicKw) {
          thematic = thematicKw[1];
        }
        var $thematicBlock = null;
        $('.layerSwitcherLayerThematic .thematic-title').each(function () {
          if ($(this).text() === thematic) {
            $thematicBlock = $(this).closest('.layerSwitcherLayerThematic');
          }
        });
        if (!$thematicBlock) {
          $thematicBlock = $('.layerSwitcherLayerThematicModel').clone();
          $thematicBlock.removeClass('layerSwitcherLayerThematicModel').addClass('layerSwitcherLayerThematic');
          $thematicBlock.find('.thematic-title').text(thematic);
          $('.layerSwitcherLayersList').prepend($thematicBlock);
          $thematicBlock.show();
          $thematicBlock.find('.thematic-content').sortable({
            handle: '.sublist-sortable-anchor', // to limit the drag anchor
          });
        }
        $thematicBlock.find('.thematic-content').prepend(layerDiv);
        layerswitcher.manageDragLayer(null, { item: layerDiv });
      } else {
        $('.layerSwitcherLayersList').prepend(layerDiv);
      }

      // wfs parameters
      if (layer.sourceParams.type === "WFS") {
        layerswitcher.drawWfsParameters(layer, layerDiv);
      } else {
        layerDiv.find(".wfsParamsLink").remove();
        layerDiv.find('a[href^="#layerWfsParams"]').closest('li').remove();
      }

      // localization avant d'activer les options slider et tooltip
      layerDiv.localize();

      var layerSliderOptions = _.clone(layerswitcher.sliderOptions);
      layerSliderOptions.slide = layerswitcher.manageLayerTransparency;
      layerSliderOptions.value = Number(layerDiv.find('.layerSwitcherLayerTransparency').eq(0).siblings('p').find('.layerOpacity').text());

      layerDiv.find('.layerSwitcherLayerTransparency').slider(layerSliderOptions);
      layerDiv.find('.layerSwitcherLayerSRS').tooltip({ placement: 'right' });
      layerDiv.find('.layerSwitcherLayerDelete').tooltip({ placement: 'left' });

      if (layer.sourceParams.type === "WFS" && layer.wfsParams.length > 0) {
        layerswitcher.addWFSParameter({ target: layerDiv.find('.add-param-btn')[0] });
        layerDiv.find('.param-choice').val(layer.wfsParams[0].name);
        layerswitcher.getWFSParamValues({ target: layerDiv.find('.param-choice')[0] });
      }
    }
    return "";
  },

  /**
   * Renders layer legend in legends panel
   * @param {ol.Layer} layer
   */
  drawLegend: function (layer) {
    if (mapviewer.config.tools.legendPanel.enable) {
      var $legendDiv = $('.layerSwitcherLegendModel').clone();
      $legendDiv.attr("id", "layerSwitcherLegend" + layer.idx);
      $legendDiv.html($legendDiv.html().replace(/__ID__/gim, layer.idx));

      $legendDiv.find('.panel-title a').text(layer.title);
      if (layer.metadata.legendURL) {
        $legendDiv.find('.panel-body img').attr('src', layer.metadata.legendURL);
        $legendDiv.find('.panel-body p').remove();
      } else {
        $legendDiv.find('.panel-body img').remove();
      }

      $('#legends .panel-group').prepend($legendDiv);
      $legendDiv.find('.collapse').collapse();
      $legendDiv.removeClass('layerSwitcherLegendModel').addClass('layerSwitcherLegend').show();
    }
  },

  /**
   * Draws WFS parameter tab content
   * @param {any} layer Layer 
   * @param {jQuery} $layerDiv jQuery container of layer row
   */
  drawWfsParameters: function (layer, $layerDiv) {
    if (layer.sourceParams.type === "WFS") {
      var $wfsParamsDiv = $('.layerSwitcherLayerWFSParamsModel').clone();
      $wfsParamsDiv.attr('id', "layerSwitcherWFSParams" + layer.idx);
      $wfsParamsDiv.html($wfsParamsDiv.html().replace(/__ID__/gim, layer.idx));

      $layerDiv.find('.layerWfsParams').append($wfsParamsDiv);
      $wfsParamsDiv.removeClass('layerSwitcherLayerWFSParamsModel').addClass('layerSwitcherLayerWFSParams').show();

      layerswitcher.updateLayerSwitcherWfsFilters(layer);
    }
  },

  /**
   * Handle color change
   */
  chooseColor: function (event) {
    var $el = $(event.target);
    var color = $el.data('value');

    $el.closest('.dropdown-menu').find('.checked').removeClass('checked');
    $el.addClass('checked');

    var colorsChoice = $el.closest('.wfs-colors-dropdown').find('.color-choice');
    if ($el.hasClass('bordered')) {
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
   * Toggle layer visibility
   * @param {Event} event
   */
  manageLayerShowHide: function (event) {
    var el = $(event.target);
    var idx = Number(el.attr('id').replace(/layerSwitcherShowHide(Sub)?/, ""));
    $("#layerSwitcherShowHide" + idx + ", #layerSwitcherShowHideSub" + idx).prop('checked', el.prop('checked'));
    var layer = _.find(mapviewer.map.layers, { idx: idx });
    if (layer) {
      if (layer.autolayer) {
        $('#active-basic-datasets').prop('checked', false);
      }
      mapviewer.map.setVisible(layer, !layer.visible);

      if (layer.visible) {
        mapviewer.monitoring.track("show_layer", layer.title, layer.name);
      } else {
        var autoLayerLabel = "";
        if (layer.autolayer) {
          autoLayerLabel = "[autolayer] ";
        }
        mapviewer.monitoring.track("hide_layer", autoLayerLabel + layer.title, layer.name);
      }
    }
  },

  /**
   * Toggle layer popover
   * @param {Event} event
   */
  toggleLayerTools: function (event) {
    var el = $(event.target);
    var popover = el.siblings('.popover');
    if (popover.css('display') === 'none') {
      var popoverBottom = popover.css('left', '-1000px').show().height() + el.offset().top + 25;
      if (popoverBottom > $(window).height()) {
        popover
          .removeClass('bottom').addClass('top')
          .css({
            top: el.offset().top - popover.height(),
            left: el.offset().left - 14
          });
      } else {
        popover
          .removeClass('top').addClass('bottom')
          .css({
            top: el.offset().top + 25,
            left: el.offset().left - 14
          });
      }
      popover.show();
    } else {
      popover.hide();
    }
  },

  /**
   * Go to layer extent
   * @param {Event} event
   */
  manageLayerZoomTo: function (event) {
    var $el = $(event.target);
    var layer = _.find(mapviewer.map.layers, { idx: layerswitcher.extractDomLayerIdx($el) });
    if (layer) {
      mapviewer.map.zoomToLayer(layer);
    }
  },

  /**
   * Change layer opacity
   * @param {Event} event
   * @param ui
   */
  manageLayerTransparency: function (event, ui) {
    var $el = $(event.target);
    var transparencyValue = ui.value;

    $el.closest('.layerSwitcherLayer').find(".layerSwitcherLayerTransparency").slider('value', transparencyValue);
    $el.closest('.layerSwitcherLayer').find(".layerOpacity").text(transparencyValue);

    var layer = _.find(mapviewer.map.layers, { idx: layerswitcher.extractDomLayerIdx($el) });
    if (layer) {
      mapviewer.map.setOpacity(layer, transparencyValue / 100);
    }
  },

  /**
   * Delete layer
   * @param {Event} event
   */
  manageLayerDelete: function (event) {
    var $el = $(event.target);
    var layer = _.find(mapviewer.map.layers, { idx: layerswitcher.extractDomLayerIdx($el) });
    if (layer) {
      var autoLayerLabel = "";
      if (layer.autolayer) {
        autoLayerLabel = "[autolayer] ";
        $('#active-basic-datasets').prop('checked', false);
      }

      mapviewer.map.removeLayer(layer);

      mapviewer.monitoring.track("remove_layer", autoLayerLabel + layer.title, layer.name);
    }
  },

  /**
   * Open layer informations subpanel according to which link has been clicked
   * @param {Event} event
   */
  openLayerPanel: function (event) {
    event.preventDefault();
    event.stopPropagation();
    $('.popover').hide();
    layerswitcher.closeLayerPanel();
    var el = $(event.target);

    if (el.closest('.filter-label').length > 0) {
      el = el.closest('.filter-label');
    }

    var target = el.data('target');
    if (el.hasClass('captionLink')) {
      $(target).find('.nav-tabs a[href^="#layerCaptions"]').click();
    }
    if (el.hasClass('infoLink') || el.hasClass('layerSwitcherLayerTitle')) {
      $(target).find('.nav-tabs a[href^="#layerInfos"]').click();
    }
    if (el.hasClass('analysisLink')) {
      $(target).find('.nav-tabs a[href^="#layerAnalysis"]').click();
    }
    if (el.hasClass('wfsParamsLink') || el.hasClass('filter-label')) {
      $(target).find('.nav-tabs a[href^="#layerWfsParams"]').click();
    }

    $(target).addClass('active');
  },

  /**
   * Close layer information subpanel
   */
  closeLayerPanel: function () {
    $('.sidebar-pane-subpane').removeClass('active');
  },

  /**
   * Adds a parameter
   * @param {*} event 
   */
  addWFSParameter: function (event) {
    var $el = $(event.target).closest('.layerSwitcherLayerWFSParams');
    var idx = Number($el.attr('id').replace(/layerSwitcherWFSParams/, ""));
    var layer = _.find(mapviewer.map.layers, { idx: idx });
    if (layer) {
      var idSuffix = idx + "-" + $el.find('.param-choice').length;
      var $paramDiv = $('.layerSwitcherLayerWFSParamsRowModel').clone();
      var $select = $paramDiv.find('.param-choice');
      $select.attr('name', 'param-choice-' + idSuffix);
      _.each(layer.wfsParams, function (wfsParam) {
        $('<option>').val(wfsParam.name)
          .text(wfsParam.name)
          .appendTo($paramDiv.find('select'));
      });

      var $filterForm = $paramDiv.find('.param-values-filter');
      $filterForm.on('submit', function (e) { e.preventDefault(); e.stopPropagation(); });
      $filterForm.find('.classic-checkbox input')
        .attr('id', 'param-value-filter-selected-' + idSuffix);
      $filterForm.find('.classic-checkbox label')
        .attr('for', 'param-value-filter-selected-' + idSuffix);
      $filterForm.find('.search-filter-value input')
        .attr('name', 'param-value-filter-' + idSuffix)
        .attr('id', 'param-value-filter-' + idSuffix);

      $paramDiv.removeClass('layerSwitcherLayerWFSParamsRowModel')
        .addClass('layerSwitcherLayerWFSParamsRow')
        .show();
      $el.find('.wfs-params-form-content').prepend($paramDiv);
    }
  },

  /**
   * Removes a parameter
   * @param {*} event 
   */
  removeWFSParameter: function (event) {
    event.stopPropagation();
    $(event.target).closest('.layerSwitcherLayerWFSParamsRow').remove();
  },

  /**
   * Reset layer parameters
   * @param {*} event 
   */
  resetWFSParameters: function (event) {
    var $el = $(event.target).closest('.layerSwitcherLayerWFSParams');
    var idx = Number($el.attr('id').replace(/layerSwitcherWFSParams/, ""));
    var layer = _.find(mapviewer.map.layers, { idx: idx });
    if (layer) {
      $el.find('.layerSwitcherLayerWFSParamsRow').remove();
      layer.sourceParams.filters = [];
      mapviewer.map.updateWfsFeatures(layer, null);
    }
  },

  /**
   * Gets all values of a parameter
   * @param {*} event 
   */
  getWFSParamValues: function (event) {
    var $el = $(event.target).closest('.layerSwitcherLayerWFSParams');
    var idx = Number($el.attr('id').replace(/layerSwitcherWFSParams/, ""));
    var layer = _.find(mapviewer.map.layers, { idx: idx });
    if (layer) {
      var $row = $(event.target).closest('.layerSwitcherLayerWFSParamsRow');
      var $select = $row.find('.param-choice');
      var $loader = $row.find('.param-loader');
      var $valuesDiv = $row.find('.param-values');
      var $noResult = $row.find('.alert');
      var $valuesFilters = $row.find('.param-values-filter');

      $valuesDiv.hide();
      $valuesFilters.hide();
      $valuesFilters.find('.classic-checkbox input').prop('checked', false);
      $valuesFilters.find('.search-filter-value input').val('');
      $noResult.hide();
      $loader.show();

      var param = _.find(layer.wfsParams, { name: $select.val() });
      mapviewer.tools.getPropertyValues(layer, param.name)
        .done(function (values) {
          values = _.sortBy(values, function (v) { return mapviewer.tools.stripCaseAndAccents(v); });
          if (values.length > 20) {
            $valuesFilters.show();
          }
          layerswitcher.drawWfsValues($row, param, values);
          $loader.hide();
        })
        .fail(function (e) {
          console.error(e);
          toastr.error(i18next.t('layerswitcher.getParamValuesError'), layer.title);
        });
    }
  },

  /**
   * Call filter WFS values with au debounce time
   * @param {*} event 
   */
  debouncedFilterWFSValues: function (event) {
    if (layerswitcher.debounceWfsFilterTimeout) {
      clearTimeout(layerswitcher.debounceWfsFilterTimeout);
      layerswitcher.debounceWfsFilterTimeout = null;
    }
    layerswitcher.debounceWfsFilterTimeout = setTimeout(function () {
      layerswitcher.filterWFSValues(event);
    }, 500);
  },

  /**
   * Filters values of WFS parameters
   * @param {*} event
   */
  filterWFSValues: function (event) {
    var idx = Number($(event.target).closest('.layerSwitcherLayerWFSParams').attr('id').replace(/layerSwitcherWFSParams/, ""));
    var layer = _.find(mapviewer.map.layers, { idx: idx });

    if (layer) {
      var $row = $(event.target).closest('.layerSwitcherLayerWFSParamsRow');
      var $select = $row.find('.param-choice');
      var $valuesDiv = $row.find('.param-values');

      var seeSelected = $row.find('.param-values-filter .classic-checkbox input').prop('checked');
      var searchText = $row.find('.param-values-filter .search-filter-value input').val();
      var selectedValues = [];
      $valuesDiv.find('input:checked').each(function () {
        selectedValues.push($(this).data('name'));
      });


      var param = _.find(layer.wfsParams, { name: $select.val() });
      mapviewer.tools.getPropertyValues(layer, param.name)
        .done(function (values) {
          values = _.sortBy(values, function (v) { return mapviewer.tools.stripCaseAndAccents(v); });
          if (seeSelected) {
            values = _.filter(values, function (v) { return selectedValues.indexOf(v) >= 0; });
          }
          if (searchText) {
            values = mapviewer.tools.searchInList(values, "", searchText);
          }
          $valuesDiv.find('input').each(function () {
            if (values.indexOf($(this).data('name')) >= 0) {
              $(this).closest('.classic-checkbox').show();
            } else {
              $(this).closest('.classic-checkbox').hide();
            }
          });
        })
        .fail(function (e) {
          console.error(e);
          toastr.error(i18next.t('layerswitcher.getParamValuesError'), layer.title);
        });
    }
  },

  /**
   * Draw WFS values checkboxes
   * @param {jQuery} $row jQuery object of the row to update 
   * @param {any} param WFS parameter which owns values
   * @param {string} values Values to draw
   * @param {string[]} selectedValues (optionnal) List of selected values
   */
  drawWfsValues: function ($row, param, values, selectedValues) {
    if (!selectedValues) {
      selectedValues = [];
    }
    var $select = $row.find('.param-choice');
    var $valuesDiv = $row.find('.param-values');
    var $noResult = $row.find('.alert');

    var rowId = $select.attr('name').replace(/param-choice-/, "");

    $valuesDiv.html('');
    if (values.length > 0) {
      _.each(values, function (value, i) {
        var $checkbox = $('<input type="checkbox" />')
          .attr('id', 'value-' + rowId + '-' + i)
          .attr('name', 'value-' + rowId + '-' + i)
          .data('name', value);
        if (selectedValues.indexOf(value) >= 0) {
          $checkbox.prop('checked', true);
        }
        var $label = $('<label>')
          .attr('for', 'value-' + rowId + '-' + i);

        if (param.type === "date" || param.type === "dateTime") {
          $label.text(value.replace("T", " ").replace("Z", ""));
        } else {
          $label.text(value);
        }

        if (value.indexOf('http') === 0) {
          $label.addClass('word-break');
        }
        $('<div>')
          .addClass('classic-checkbox')
          .append($checkbox)
          .append($label)
          .appendTo($valuesDiv);
      });
      $valuesDiv.show();
      $noResult.hide();
    } else {
      $valuesDiv.hide();
      $noResult.show();
    }
  },

  /**
   * Filters a WFS layer
   * @param {*} event 
   */
  filterWfsLayer: function (event) {
    event.stopPropagation();
    event.preventDefault();

    var $el = $(event.target).closest('.layerSwitcherLayerWFSParams');
    var idx = Number($el.attr('id').replace(/layerSwitcherWFSParams/, ""));
    var layer = _.find(mapviewer.map.layers, { idx: idx });
    if (layer) {
      layer.onImageLoadStart();
      $el.find('input, select, button').prop('disabled', true);

      layer.sourceParams.filters = [];
      $el.find('.layerSwitcherLayerWFSParamsRow').each(function () {
        var filter = {
          param: $(this).find('.param-choice').val(),
          values: []
        };
        if (filter.param) {
          $(this).find('.param-values input:checked').each(function () {
            filter.values.push($(this).data('name'));
          });
        }
        if (filter.values.length > 0) {
          layer.sourceParams.filters.push(filter);
        }
      });

      layer.sourceParams.color = $el.find('.color-choice').data('value');

      mapviewer.tools.getWfsFeatures(layer)
        .done(function (result) {
          layer.onImageLoadEnd();
          $el.find('input, select, button').prop('disabled', false);
          mapviewer.map.updateWfsFeatures(layer, result);
        })
        .fail(function (e) {
          layer.onImageLoadEnd();
          $el.find('input, select, button').prop('disabled', false);
          console.error(e);
          toastr.error(i18next.t('layerswitcher.getFeaturesError'), layer.title);
        });
    }
  },

  /**
   * Shows WFS layer checkbox filter
   * @param {*} layer 
   */
  updateLayerSwitcherWfsFilters: function (layer) {
    var $filterContainer = $('#layerSwitcher' + layer.idx + ' .layerSwitcherWfsFilters');
    $filterContainer.find('.filter-name').tooltip('destroy');
    $filterContainer.html('');

    if (layer.sourceParams.filters && layer.sourceParams.filters.length > 0) {
      _.each(layer.sourceParams.filters, function (filter) {
        var $label = $('<a>')
          .addClass('clearfix filter-label')
          .data('target', '#layerInfoSubpanel' + layer.idx);

        $('<i>').addClass('fa fa-filter')
          .appendTo($label);

        $('<span>').addClass('squared-type')
          .text(filter.param)
          .appendTo($label);

        $filterText = $('<span>').addClass('filter-name');
        if (filter.values.length > 1) {
          $filterText.text(filter.values.length + ' ' + i18next.t('layerswitcher.wfsFilterValues'))
            .prepend($('<i>').addClass('fa fa-eye'));
        } else {
          $filterText.text(filter.values[0]);
        }
        if (filter.values[0].indexOf('http') >= 0) {
          $filterText.addClass('word-break');
        }
        $filterText.appendTo($label);

        $('<div>').addClass('classic-checkbox')
          .append($label)
          .appendTo($filterContainer);

        if (filter.values.length > 1) {
          $filterText.attr('title', filter.values.join(', '));
          $filterText.tooltip({ placement: 'left', container: 'body' });
        }
      });
    } else {
      var $label = $('<a>')
        .addClass('clearfix filter-label')
        .data('target', '#layerInfoSubpanel' + layer.idx);

      $filterText = $('<span>').addClass('filter-name');

      if (layer.sourceParams.featureCollection) {
        $('<i>').addClass('fa fa-filter')
          .appendTo($label);
        $filterText.text(i18next.t('layerswitcher.wfsNoParams'));
      } else {
        $('<i>').addClass('fa fa-wrench')
          .appendTo($label);
        $filterText.text(i18next.t('layerswitcher.wfsGoToParamsLink'));
      }

      $filterText.appendTo($label);
      $('<div>').addClass('classic-checkbox')
        .append($label)
        .appendTo($filterContainer);
    }
    $filterContainer.show();
  },

  /**
   * Triggers thematic analysis init
   */
  activeThematicAnalysis: function () {
    thematicAnalysis.openThematicAnalysis(Number($(this).data('id')));
  },

  /**
   * Copy service url to clipboard
   */
  copyServiceUrl: function (event) {
    var el = $(event.target);
    var serviceUrl = el.siblings('a').attr('href');

    //copy to clipboard
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(serviceUrl).select();
    document.execCommand("copy");
    $temp.remove();

    el.addClass('ok');

    setTimeout(function () { el.removeClass('ok') }, 500);
  },

  /**
   * Extract layer idx from an object DOM
   * @param {jQuery} $objDom - jquery DOM object where extract id
   * @return {Number|Null}
   */
  extractDomLayerIdx: function ($objDom) {
    var $layerDom = $objDom;
    if (!$layerDom.hasClass("layerSwitcherLayer")) {
      $layerDom = $objDom.closest(".layerSwitcherLayer");
    }
    var domId = $layerDom.attr("id");
    if (domId) {
      return Number(domId.replace("layerSwitcher", ""));
    }
    return null;
  },

  /**
   * Reset all portrayable filters
   */
  resetAllPortrayableLayers: function () {
    _.each(mapviewer.map.layers, function (layer) {
      mapviewer.map.disableLayerFilter(layer);
    });
    layerswitcher.hideResetPortrayableButton();
    $('.layerSwitcherFilters input').prop('checked', false);
  },

  /**
   * Shows layer checkbox filter
   * @param {*} layer 
   */
  enableLayerFiltering: function (layer) {
    if (layer.filter) {
      var $filterContainer = $('#layerSwitcherFilter' + layer.idx).closest('.layerSwitcherFilters');
      $filterContainer.find('.squared-type').text(layer.filter.type);
      $filterContainer.find('.filter-name').text(layer.filter.name);
      $filterContainer.find('.filter-name').tooltip('destroy');
      if (layer.filter.names && layer.filter.names.length > 0) {
        $filterContainer.find('.filter-name').attr('title', layer.filter.names.join(', '));
        $filterContainer.find('.filter-name').tooltip({ placement: 'left', container: 'body' });
      }
      $filterContainer.show();
    }
  },

  /**
   * Enable/disable current layer filter
   * @param {*} event Event from 'change'
   */
  toggleLayerFilter: function (event) {
    var $checkbox = $(event.target);

    var idx = parseInt($checkbox.attr('id').replace('layerSwitcherFilter', ''), 10);

    var layer = _.find(mapviewer.map.layers, { idx: idx });
    if (layer && layer.filter) {
      if (layer.filter.enabled) {
        mapviewer.map.disableLayerFilter(layer);
      } else {
        mapviewer.map.enableLayerFilter(layer);
      }
      layerswitcher.updateResetPortrayableButton();
    }
  },

  /**
   * Show/hide reset portrayable button if necessary
   */
  updateResetPortrayableButton: function () {
    var hasFilter = false;
    for (let i = 0; i < mapviewer.map.layers.length; i++) {
      var layer = mapviewer.map.layers[i];
      if (layer.olLayer && layer.filter && layer.filter.enabled) {
        hasFilter = true;
        break;
      }
    }
    if (hasFilter) {
      layerswitcher.showResetPortrayableButton();
    } else {
      layerswitcher.hideResetPortrayableButton();
    }
  },

  /**
   * Hide reset portrayable button
   */
  hideResetPortrayableButton: function () {
    $resetContainer = $('.reset-button').closest('.col-xs-12');
    $resetContainer.hide();
    $resetContainer.siblings('.col-xs-12').removeClass('col-sm-6');
  },

  /**
   * Show reset portrayable button
   */
  showResetPortrayableButton: function () {
    $resetContainer = $('.reset-button').closest('.col-xs-12');
    $resetContainer.siblings('.col-xs-12').addClass('col-sm-6');
    $resetContainer.show();
  }
};
