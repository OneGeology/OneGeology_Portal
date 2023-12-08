# Files structure

All the front files are located in *src/main/webapp*.

## Summary

- [Main files](#main-files)
  - [Main file list](#main-file-:list)
  - [Map system](#map-system)
- [Widgets: module files](#widgets-module-files)
  - [Current widget list](#current-widget-list)


## Main files

The main files of the applications are located in the *js* folder. These files contains all the js wode which manage the application, its map and its data, across all modules. They are altogether under the same global variable "mapviewer".

### Main file list

- [mapviewer](./api-reference/mapviewer.md): Application configuration and bootstrap,
- [mapviewer.map](./api-reference/mapviewer.map.md): Map management,
- [mapviewer.csMap](./api-reference/mapviewer.csMap.md): Cesium globe map management,
- [mapviewer.olMap](./api-reference/mapviewer.olMap.md): OpenLayers map management,
- [mapviewer.map.gfi](./api-reference/mapviewer.map.gfi.md): Clicked point popup information management,
- [mapviewer.autolayers](./api-reference/mapviewer.autolayers.md): Autolayers management,
- [mapviewer.monitoring](./api-reference/mapviewer.monitoring.md): Monitoring (Matomo & Google Analytics),
- [mapviewer.tools](./api-reference/mapviewer.tools.md): Various tools used across the application,
- [mapviewer.widget](./api-reference/mapviewer.widget.md): Widgets (modules) management.

### Map system

The map can be displayed as regular map or a globe. To achieve that, two libraries must be used: OpenLayers for the regular map, Cesium for the globe.

Because of this, there is 3 main files dedicated to the map management: one for OpenLayers, another for Cesium, and the last to manage the two firsts.

Each map interaction, from adding layers to get projection is send beforehand to [mapviewer.map](./api-reference/mapviewer.map.md), which will send instructions to the current displayed map.

*Note*: When one map is displayed, the other doesn't exists. When switching from a display to another, the old display is destroyed and the new is created.

## Widgets: module files

Modules, named as widgets, are managed through a configuration file in [widgets.json](../../../src/main/webapp/conf/widgets.json), defined in [mapviewer.js](../../../src/main/webapp/js/mapviewer.js#L11) like the conf.json.

Each widget is defined like this:

    {
      "name": "gazetteer",
      "div": "gazetteer"
    }

- **name**: widget's unique name in the list,
- **div**: ID of the HTML element where the widget must be injected. The target element must exist in [index.html](../../../src/main/webapp/index.html).

Each widget must have a folder named after it in the [widget](../../../src/main/webapp/widget) folder, and this folder must contain at least two files named *page.html* and *script.js*.

All the widgets are synchronously loaded at application bootstrap, just after getting the configuration. HTML is injected in the HTML with the ID defined in configuration, while the js is injected at the end of the HTML body, and its *init* method is triggered.

### Current widget list

- [exportContext](./api-reference/exportContext.md): Export view as PDF, WMC, KML, etc,
- [externalOGC](./api-reference/externalOGC.md): Layer importation by service URL, KML or WMC,
- [generateUrl](./api-reference/generateUrl.md): Help tool to generate a configured url for sharing,
- [gazetteer](./api-reference/gazetteer.md): Search tool for destinations, layers, filters, etc,
- [help](./api-reference/help.md): Help page module,
- [layerOneGeology](./api-reference/layerOneGeology.md): Layer catalog,
- [layerswitcher](./api-reference/layerswitcher.md): Layer switcher,
- [measurement](./api-reference/measurement.md): Tool allowing to measure distances or areas,
- [thematicAnalysis](./api-reference/thematicAnalysis.md): Tool to filter information of portrayable layers.