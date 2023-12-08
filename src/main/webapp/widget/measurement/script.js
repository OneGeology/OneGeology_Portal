/**
 * Measurement tools widget
 * @constructor
 */
var measurement = {

  /**
   * Vector layer where measures are drawn
   * @type {ol.layer.Vector|Null}
   */
  measureLayer: null,

  /**
   * Memorization of map draw interaction
   * @type {ol.interaction.Draw|Null}
   */
  drawInteraction: null,

  /**
   * Feature that is currently drawn
   * @type {ol.Feature|Null}
   */
  currentDraw: null,

  /**
   * Current draw feature change listener
   * @type {Object|Null}
   */
  drawListener: null,

  /**
   * Is measure tools currently active
   * @type {boolean}
   */
  isActive: false,

  /**
   * Current feature id
   * @type {number}
   */
  currentDrawId: 0,

  /**
   * Initializes widget
   */
  init: function () {
    measurement.initEvents();
  },

  /**
   * Binds measurement widget listeners
   */
  initEvents: function () {
    $('.sidebar-tabs a').on('click', measurement.onPanelChange);
    $('#geom-choice').on('change', measurement.changeInteraction);
    $('.clear-btn').click(measurement.clear);
  },

  /**
   * Disables drawing for 3D mode, enables it for 2D mode
   */
  handleMapMode: function () {
    if (mapviewer.map.currentMap === "ol") {
      $('.active-measurement').show();
      $('.no-measurement').hide();
      if ($('a[href="#menu-measurement"]').parent().hasClass('active')) {
        measurement.enableMeasurement();
      }
    } else {
      $('.active-measurement').hide();
      $('.no-measurement').show();
      measurement.isActive = false;
    }
  },

  /**
   * Enables or disables measurement layers and interactions when active panel change
   */
  onPanelChange: function () {
    if (mapviewer.map.currentMap === "ol") {
      if (!$(this).parent().hasClass('active') && $(this).attr('href') == '#menu-measurement') {
        measurement.enableMeasurement();
      } else if (
        ($(this).parent().hasClass('active') && $(this).attr('href') == '#menu-measurement') ||
        ($(this).attr('href') != '#menu-measurement' && $('#menu-measurement').hasClass('active'))
      ) {
        measurement.disableMeasurement();
      }
    }
  },

  /**
   * Adds measurement layer and interaction to map
   */
  enableMeasurement: function () {
    if (!measurement.measureLayer) {
      measurement.measureLayer = new ol.layer.Vector({
        source: new ol.source.Vector()
      });
    }
    mapviewer.olMap.map.addLayer(measurement.measureLayer);

    if (!measurement.drawInteraction) {
      measurement.updateInteraction();
    }

    mapviewer.olMap.map.addInteraction(measurement.drawInteraction);
    measurement.isActive = true;
  },

  /**
   * Removes measurement layer and interaction to map
   */
  disableMeasurement: function () {
    mapviewer.olMap.map.removeInteraction(measurement.drawInteraction);
    mapviewer.olMap.map.removeLayer(measurement.measureLayer);
    measurement.isActive = false;
  },

  /**
   * Changes current interaction type
   */
  changeInteraction: function () {
    measurement.updateInteraction();

    mapviewer.olMap.map.addInteraction(measurement.drawInteraction);
  },

  /**
   * Updates draw interaction type according to current selection
   */
  updateInteraction: function () {
    if (measurement.drawInteraction) {
      mapviewer.olMap.map.removeInteraction(measurement.drawInteraction);
    }
    measurement.drawInteraction = new ol.interaction.Draw({
      source: measurement.measureLayer.getSource(),
      type: $('#geom-choice').val(),
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(255, 204, 51, 0.7)',
          lineDash: [10, 10],
          width: 2
        }),
        image: new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 0, 0.7)'
          }),
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.5)'
          })
        })
      })
    });

    measurement.drawInteraction.on('drawstart', measurement.measureStart);
    measurement.drawInteraction.on('drawend', measurement.measureEnd);
  },

  /**
   * At new draw, adds draw data to list and binds change listener
   * @param {Event} e - event from drawstart
   */
  measureStart: function (e) {
    measurement.currentDraw = e.feature;
    var type = $('#geom-choice').val() == "LineString" ? i18next.t('measure.length') : i18next.t('measure.area');
    $('.draw-list').append($('<li id="draw' + measurement.currentDrawId + '">').html('<strong>' + measurement.currentDrawId + ' - ' + type + ': </strong><span></span>'));

    measurement.drawListener = measurement.currentDraw.getGeometry().on('change', measurement.updateCurrentMeasure);

  },

  /**
   * At draw end, unbinds feature change listener and draws final figure
   */
  measureEnd: function () {
    ol.Observable.unByKey(measurement.drawListener);
    measurement.currentDraw.setStyle(new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new ol.style.Stroke({
        color: '#ffcc33',
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: '#ffcc33'
        })
      }),
      text: new ol.style.Text({
        text: measurement.currentDrawId.toString(),
        font: "bold 16px Arial, sans-serif",
        textBaseline: 'bottom',
        fill: new ol.style.Fill({ color: '#444' }),
        backgroundFill: new ol.style.Fill({ color: 'rgba(255,255,255,0.9)' }),
        backgroundStroke: new ol.style.Stroke({ color: 'rgba(0,0,0,0.9)', width: 2 }),
        offsetY: 0,
        padding: [5, 7, 5, 7]
      })
    }));
    measurement.currentDraw = null;
    measurement.drawListener = null;
    measurement.currentDrawId++;
  },

  /**
   * At draw feature change, updates displayed data
   * @param {Event} e - event from feature change
   */
  updateCurrentMeasure: function (e) {
    var geom = e.target;
    var output;
    if (geom instanceof ol.geom.Polygon) {
      output = measurement.formatArea(geom);
    } else if (geom instanceof ol.geom.LineString) {
      output = measurement.formatLength(geom);
    }

    $('#draw' + measurement.currentDrawId + ' span').html(output);
  },

  /**
   * Calculates and formats length to display
   * @param {ol.geom.LineString} line - currently drawn line geometry
   * @return {string}
   */
  formatLength: function (line) {
    var length = ol.sphere.getLength(line, { projection: mapviewer.map.getCurrentProjection() });
    var output;
    if (length > 100) {
      output = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km';
    } else {
      output = (Math.round(length * 100) / 100) + ' ' + 'm';
    }

    return output;
  },

  /**
   * Calculates and formats area to display
   * @param {ol.geom.Polygon} polygon - currently drawn polygon geometry
   * @return {string}
   */
  formatArea: function (polygon) {
    var area = ol.sphere.getArea(polygon, { projection: mapviewer.map.getCurrentProjection() });
    var output;
    if (area > 10000) {
      output = (Math.round(area / 1000000 * 100) / 100) +
        ' ' + 'km<sup>2</sup>';
    } else {
      output = (Math.round(area * 100) / 100) +
        ' ' + 'm<sup>2</sup>';
    }
    return output;
  },

  /**
   * Clears draw layer and list
   */
  clear: function () {
    measurement.measureLayer.getSource().clear();
    $('.draw-list').html('');
    measurement.currentDrawId = 0;
  }

}