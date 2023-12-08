/**
 * Widget manager
 * @constructor
 */
mapviewer.widget = {
  /**
   * List of the loaded widget instance
   * @type {Object[]}
   */
  widgetList: [],

  /**
   * Initializes and loads all the widgets
   */
  init: function () {
    if (mapviewer.widgets) {
      for (var i = 0; i < mapviewer.widgets.length; i++) {
        var currentWidget = mapviewer.widgets[i];
        mapviewer.widget.load(currentWidget);

        var widgetInstance = window[currentWidget.name];
        if (widgetInstance) {
          widgetInstance.containerDiv = currentWidget.div;
          widgetInstance.name = currentWidget.name;
          mapviewer.widget.widgetList.push(widgetInstance);
        }
      }
    }
  },

  /**
   * Loads js, html and css from a widget
   * @param {Object} widget - widget config object
   */
  load: function (widget) {
    if (!widget.div) {
      //add a div if not set
      widget.div = OpenLayers.Util.createUniqueID(widget.name + "_");
      var d = document.createElement("div");
      d.id = widget.div;
      $("body").append(d);
    } else if ($("#" + widget.div).length === 0) {
      return;
    }

    mapviewer.addJSFile("./widget/" + widget.name + "/script.js?1gg-no-cache");

    var templateName = widget.template || 'page';
    $("#" + widget.div).html(mapviewer.load("./widget/" + widget.name + "/" + templateName + ".html?1gg-no-cache"));
    $("#" + widget.div).localize();
    //launch the init function
    mapviewer.stringToFunction(widget.name + ".init")(widget.parameters);
  }

};
