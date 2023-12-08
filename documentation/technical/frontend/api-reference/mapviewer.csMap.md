 JSDoc: Class: csMap 

Class: csMap
============

[mapviewer](mapviewer.md).csMap()
-----------------------------------

# csMap()

Cesium map service

Source:

- [mapviewer.csMap.js](../../../../src/main/webapp/js/mapviewer.csMap.js), [line 5](../../../../src/main/webapp/js/mapviewer.csMap.js#L5)

# Members

## (static) map :Cesium.Viewer

cesium map object

### Type:

* Cesium.Viewer

Source:

- [mapviewer.csMap.js](../../../../src/main/webapp/js/mapviewer.csMap.js), [line 10](../../../../src/main/webapp/js/mapviewer.csMap.js#L10)

## (static) proxy :Cesium.DefaultProxy

cesium map object

### Type:

* Cesium.DefaultProxy

Source:

- [mapviewer.csMap.js](../../../../src/main/webapp/js/mapviewer.csMap.js), [line 16](../../../../src/main/webapp/js/mapviewer.csMap.js#L16)

# Methods

## (static) addControlsListeners()

Adds listeners to cesium controls buttons

Source:

- [mapviewer.csMap.js](../../../../src/main/webapp/js/mapviewer.csMap.js), [line 157](../../../../src/main/webapp/js/mapviewer.csMap.js#L157)

## (static) addLayer(layer)

Adds layer to map and sets it in layer data

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | JSON | layer data |

Source:

- [mapviewer.csMap.js](../../../../src/main/webapp/js/mapviewer.csMap.js), [line 190](../../../../src/main/webapp/js/mapviewer.csMap.js#L190)

## (static) destroyMap()

Destroys OL map

Source:

- [mapviewer.csMap.js](../../../../src/main/webapp/js/mapviewer.csMap.js), [line 146](../../../../src/main/webapp/js/mapviewer.csMap.js#L146)

## (static) enableFullScreen()

Activate navigator full screen for cesium map

Source:

- [mapviewer.csMap.js](../../../../src/main/webapp/js/mapviewer.csMap.js), [line 182](../../../../src/main/webapp/js/mapviewer.csMap.js#L182)

## (static) getCurrentExtent() → {Array.&lt;number&gt;}

Gets current map extent

Source:

- [mapviewer.csMap.js](../../../../src/main/webapp/js/mapviewer.csMap.js), [line 223](../../../../src/main/webapp/js/mapviewer.csMap.js#L223)

### Returns:

Type

Array.&lt;number&gt;

## (static) getCurrentScale() → {number}

Gets current map scale

Source:

- [mapviewer.csMap.js](../../../../src/main/webapp/js/mapviewer.csMap.js), [line 238](../../../../src/main/webapp/js/mapviewer.csMap.js#L238)

### Returns:

Type

number

## (static) goToCoord(lonLat, closeZoom)

Sets map view center to new coordinates

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `lonLat` | Array.&lt;number&gt; | new coordinates to go to |
| `closeZoom` | boolean | if true, set zoom to 9 instead of 5 |

Source:

- [mapviewer.csMap.js](../../../../src/main/webapp/js/mapviewer.csMap.js), [line 274](../../../../src/main/webapp/js/mapviewer.csMap.js#L274)

## (static) init(bgLayers)

initializes map

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `bgLayers` |     | background layers to set |

Source:

- [mapviewer.csMap.js](../../../../src/main/webapp/js/mapviewer.csMap.js), [line 22](../../../../src/main/webapp/js/mapviewer.csMap.js#L22)

## (static) moveLayer(layer, from, to)

Changes layer position map layer list

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | JSON | layer to zoom, from layers list |
| `from` | number | origin index in list |
| `to` | number | destination index in list |

Source:

- [mapviewer.csMap.js](../../../../src/main/webapp/js/mapviewer.csMap.js), [line 309](../../../../src/main/webapp/js/mapviewer.csMap.js#L309)

## (static) removeLayer(layer)

Removes given layer from map

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | JSON | layer to remove, from layer list |

Source:

- [mapviewer.csMap.js](../../../../src/main/webapp/js/mapviewer.csMap.js), [line 213](../../../../src/main/webapp/js/mapviewer.csMap.js#L213)

## (static) setOpacity(layer, opacity)

Sets given layer opacity

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | JSON | layer to zoom, from layers list |
| `opacity` | number | opacity |

Source:

- [mapviewer.csMap.js](../../../../src/main/webapp/js/mapviewer.csMap.js), [line 337](../../../../src/main/webapp/js/mapviewer.csMap.js#L337)

## (static) setVisible(layer, isVisible)

Sets given layer visibility

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | JSON | layer to zoom, from layers list |
| `isVisible` | boolean | visibility |

Source:

- [mapviewer.csMap.js](../../../../src/main/webapp/js/mapviewer.csMap.js), [line 328](../../../../src/main/webapp/js/mapviewer.csMap.js#L328)

## (static) updateBgLayers()

Changes current background layer displayed

Source:

- [mapviewer.csMap.js](../../../../src/main/webapp/js/mapviewer.csMap.js), [line 263](../../../../src/main/webapp/js/mapviewer.csMap.js#L263)

## (static) zoomIn()

Zooms cesium map in

Source:

- [mapviewer.csMap.js](../../../../src/main/webapp/js/mapviewer.csMap.js), [line 168](../../../../src/main/webapp/js/mapviewer.csMap.js#L168)

## (static) zoomOut()

Zooms cesium map out

Source:

- [mapviewer.csMap.js](../../../../src/main/webapp/js/mapviewer.csMap.js), [line 175](../../../../src/main/webapp/js/mapviewer.csMap.js#L175)

## (static) zoomToExtent(extent)

Zooms to given layer extent

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `extent` | Array.&lt;number&gt; | extent to zoom |

Source:

- [mapviewer.csMap.js](../../../../src/main/webapp/js/mapviewer.csMap.js), [line 296](../../../../src/main/webapp/js/mapviewer.csMap.js#L296)

## (static) zoomToHome()

Zooms to cesium home (whole planet)

Source:

- [mapviewer.csMap.js](../../../../src/main/webapp/js/mapviewer.csMap.js), [line 288](../../../../src/main/webapp/js/mapviewer.csMap.js#L288)

[Return to files structure](../files-structure.md)
------------------

# Classes

- Main files
  - [mapviewer](mapviewer.md)
  - [mapviewer.map](mapviewer.map.md)
  - [mapviewer.csMap](mapviewer.csMap.md)
  - [mapviewer.olMap](mapviewer.olMap.md)
  - [mapviewer.map.gfi](mapviewer.map.gfi.md)
  - [mapviewer.autolayers](mapviewer.autolayers.md)
  - [mapviewer.monitoring](mapviewer.monitoring.md)
  - [mapviewer.tools](mapviewer.tools.md)
  - [mapviewer.widget](mapviewer.widget.md)
- Widgets
  - [exportContext](exportContext.md)
  - [externalOGC](externalOGC.md)
  - [generateUrl](generateUrl.md)
  - [gazetteer](gazetteer.md)
  - [help](help.md)
  - [layerOneGeology](layerOneGeology.md)
  - [layerswitcher](layerswitcher.md)
  - [measurement](measurement.md)
  - [thematicAnalysis](thematicAnalysis.md)

Documentation generated by [JSDoc 3.6.7](https://github.com/jsdoc/jsdoc) on Thu Dec 23 2021 15:05:24 GMT+0100 (heure normale d’Europe centrale)

Converted from HTML by [convert-simple.com](https://www.convertsimple.com/convert-html-to-markdown/)