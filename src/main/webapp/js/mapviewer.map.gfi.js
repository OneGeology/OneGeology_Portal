/**
 * Manages GetFeatureInfo map interaction
 */
mapviewer.map.gfi = {

  /**
   * Creates popup interaction
   */
  init: function () {
    $('.gfi-panel .coordinates .copy-btn').click(mapviewer.map.gfi.copyCoordinates);
    $('.gfi-panel .close-btn').click(mapviewer.map.gfi.closePanel);
    $('.gfi-panel .expand-btn').click(mapviewer.map.gfi.expandPanel);
    $(window).resize(mapviewer.map.gfi.resizePanelContent);
  },

  /**
   * Shows information panel about coordinates clicked on the map
   * @param {[number, number]} coords Coordinates clicked on the map
   */
  displayPanel: function (evt) {
    var coords = evt.coordinate
    mapviewer.map.markGfiPosition(coords);
    if (measurement && measurement.isActive) {
      return;
    }
    var $gfiContainer = $('.gfi-panel');
    $gfiContainer.find('.loader').show();
    if (gazetteer) {
      gazetteer.hideResult();
    }
    $gfiContainer.find('.result').html('');
    $gfiContainer.find('.coordinates span').text('X: ' + coords[0] + ' Y: ' + coords[1]);

    mapviewer.map.gfi.resizePanelContent();

    $gfiContainer.addClass('opened');
    var wfsGfi = {};
    if (evt.pixel) {
      mapviewer.olMap.map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
        var idx = layer.get('idx');
        var properties = feature.getProperties();
        if (properties) {
          delete properties.geometry;
          if (_.keys(properties).length > 0) {
            if (!wfsGfi[idx]) {
              wfsGfi[idx] = [];
            }
            wfsGfi[idx].push(properties);
          }
        }
      });
    }

    setTimeout(function () { // trick to show panel without be freezed by synchronous requests
      _.each(mapviewer.map.layers, function (layer) {
        var gfiHTMLResult = "";
        if (layer.visible) {
          switch (layer.sourceParams.type) {
            case "WMS": gfiHTMLResult += mapviewer.map.gfi.generateWMSResult(layer, coords);
              break;
            case "WFS": gfiHTMLResult += mapviewer.map.gfi.generateWFSResult(layer, wfsGfi[layer.idx]);
              break;
          }
          if (gfiHTMLResult != "") {
            $gfiContainer.find('.result').append(gfiHTMLResult);
          }
        }
      });
      $gfiContainer.find('.result a').each(function () {
        if (!$(this).attr('href')) {
          $(this).remove();
        }
      });
      if ($gfiContainer.find('.result .layer').length === 0) {
        $gfiContainer.find('.result').append('<div class="GFIresponse">' + i18next.t('gfi.noPointInformation') + ' (' + coords + ')</div>');
      }
      $gfiContainer.find('.loader').hide();
      $gfiContainer.localize();
    }, 500);
  },

  generateWMSResult: function (layer, coords) {
    var gfiHTMLResult = "";
    if (ol.extent.containsXY(layer.extent, coords[0], coords[1])) {
      if (layer.olLayer.getSource().getFeatureInfoUrl) {
        var url = layer.olLayer.getSource().getFeatureInfoUrl(
          coords,
          mapviewer.map.getCurrentResolution(),
          mapviewer.map.getCurrentProjection(),
          { 'INFO_FORMAT': 'text/html' }
        );
      }
      if (url) {
        if (!layer.queryable) {
          gfiHTMLResult += '<div class="layer">';
          gfiHTMLResult += '<div class="title">' + layer.title + '</div>';
          gfiHTMLResult += '<div class="response">' + i18next.t('gfi.layerNotQueryable') + '</div>';
          gfiHTMLResult += '</div>';
        } else {
          var gfiResult = mapviewer.load("./proxyxml?url=" + escape(url));
          //exemple on autolayers Europe BGR 5M Geological Units - Onshore
          if (gfiResult) {
            if (gfiResult.indexOf("404 - File or directory not found") > -1) {
              gfiHTMLResult += '<div class="layer">';
              gfiHTMLResult += '<div class="title">' + layer.title + '</div>';
              gfiHTMLResult += '<div class="response">' + i18next.t('gfi.serviceUnavailable') + '</div>';
              gfiHTMLResult += '</div>';
            } else {
              gfiResult = gfiResult.replace(/<style>.*<\/style>/, "")
                //replace img => bidouille pour GFI couche Europe GIS1:1.5M Bedrock Age
                .replace("<!--img", "*//*").replace("}-->", "*//*");

              if (gfiResult.indexOf('<body>') >= 0) {
                var start = gfiResult.indexOf('<body>') + '<body>'.length;
                var end = gfiResult.indexOf('</body>');

                gfiResult = gfiResult.substring(start, end);
              }

              while (gfiResult.indexOf('<style>') >= 0) {
                var start = gfiResult.indexOf('<style>');
                var end = gfiResult.indexOf('</style>') + '</style>'.length;

                gfiResult = gfiResult.substring(0, start) + gfiResult.substring(end);
              }

              gfiHTMLResult += '<div class="layer">';
              gfiHTMLResult += '<div class="title">' + layer.title + '</div>';
              gfiHTMLResult += '<div class="response">' + gfiResult + '</div>';
              gfiHTMLResult += '</div>';
            }
          }
        }
      }
    }
    return gfiHTMLResult;
  },

  generateWFSResult: function (layer, gfis) {
    var gfiHTMLResult = "";
    if (gfis) {
      var gfiResult = "";

      _.each(gfis, function (properties, i) {
        gfiResult += '<table class="wfs-gfi-result">';
        gfiResult += '<tr>';
        gfiResult += '<th colspan="2">Feature ' + (i + 1) + '</th>'
        gfiResult += '</tr>';

        for (var propName in properties) {
          if (properties.hasOwnProperty(propName)) {
            gfiResult += '<tr>';
            gfiResult += '<td>' + propName + '</td>';
            var value = properties[propName];
            if (value === null || value === undefined) {
              value = "";
            }
            if (mapviewer.tools.isUrl(value)) {
              value = '<a href="' + value + '" target="_blank">' + value + '</a>'
            }

            gfiResult += '<td>' + value + '</td>';
            gfiResult += '</tr>';
          }
        }
        gfiResult += '</table>';
      });


      gfiHTMLResult += '<div class="layer">';
      gfiHTMLResult += '<div class="title">' + layer.title + '</div>';
      gfiHTMLResult += '<div class="response">' + gfiResult + '</div>';
      gfiHTMLResult += '</div>';
    }
    return gfiHTMLResult;
  },

  /**
   * Close the gfi popup
   */
  closePanel: function () {
    $('.gfi-panel').removeClass('opened').removeClass('expanded');
    mapviewer.map.markGfiPosition();
  },

  /**
   * Resize the panel content for good scrollbars (flex forbidden)
   */
  resizePanelContent: function () {
    let panelHeight = $('.gfi-panel').height();
    let headHeight = $('.gfi-panel .panel-heading').outerHeight();
    let contentPadding = $('.gfi-panel .gfi-content').outerHeight() - $('.gfi-panel .gfi-content').height();
    $('.gfi-panel .gfi-content').height(panelHeight - headHeight - contentPadding);
  },

  /**
   * Expand or reduce gfi panel
   */
  expandPanel: function () {
    let $panel = $('.gfi-panel');
    if ($panel.hasClass('expanded')) {
      $panel.removeClass('expanded');
    } else {
      $panel.addClass('expanded');
    }
    setTimeout(mapviewer.map.gfi.resizePanelContent, 300);
  },

  /**
   * Copy GFI coordinates
   */
  copyCoordinates: function (event) {
    var el = $(event.target);

    var coordinates = el.siblings('span').text();

    //copy to clipboard
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(coordinates).select();
    document.execCommand("copy");
    $temp.remove();

    el.addClass('ok');

    setTimeout(function () {
      el.removeClass('ok')
    }, 500);
  }
}
