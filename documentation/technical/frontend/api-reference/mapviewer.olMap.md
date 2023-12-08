 JSDoc: Class: olMap 

Class: olMap
============

[mapviewer](mapviewer.md).olMap()
-----------------------------------

# olMap()

Openlayers map service

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 5](../../../../src/main/webapp/js/mapviewer.olMap.js#L5)

# Members

## (static) gfiPointLayer :ol.layer.Vector

Layer for display gfi point

### Type:

* ol.layer.Vector

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 34](../../../../src/main/webapp/js/mapviewer.olMap.js#L34)

## (static) map :ol.Map

Openlayers map object

### Type:

* ol.Map

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 10](../../../../src/main/webapp/js/mapviewer.olMap.js#L10)

## (static) mousePositionControl :ol.Control.MousePosition

Mouse position control

### Type:

* ol.Control.MousePosition

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 16](../../../../src/main/webapp/js/mapviewer.olMap.js#L16)

## (static) overviewManualMode :boolean

Is overview visibility in manual mode ?

### Type:

* boolean

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 28](../../../../src/main/webapp/js/mapviewer.olMap.js#L28)

## (static) overViewMap :ol.Control.OverviewMap

Overview map control

### Type:

* ol.Control.OverviewMap

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 22](../../../../src/main/webapp/js/mapviewer.olMap.js#L22)

# Methods

## (static) addLayer(layer)

Adds layer to map and sets it in layer data

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | JSON | layer data |

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 272](../../../../src/main/webapp/js/mapviewer.olMap.js#L272)

## (static) destroyMap()

Destroys OL map

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 149](../../../../src/main/webapp/js/mapviewer.olMap.js#L149)

## (static) exportToPdf(resolution, withLegends)

Exports OL map to PDF

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `resolution` | number | Resolution to export |
| `withLegends` | boolean | Export legends too ? |

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 716](../../../../src/main/webapp/js/mapviewer.olMap.js#L716)

## (static) generateBackgroundLayers(bgLayers) → {Array.&lt;ol.layer&gt;}

Generates the list of OpenLayers' layers for given background layers

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `bgLayers` | Array.&lt;JSON&gt; | Background layers to set in OpenLayers |

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 184](../../../../src/main/webapp/js/mapviewer.olMap.js#L184)

### Returns:

Type

Array.&lt;ol.layer&gt;

## (static) generateFeaturesStyle(features, color)

Generates the styles of the feature list

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `features` | Array.&lt;ol.Feature&gt; | Features to style |
| `color` | *   | Color to apply |

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 631](../../../../src/main/webapp/js/mapviewer.olMap.js#L631)

## (static) generateGfiPointLayer() → {ol.layer.Vector}

Generates the gfi point display layer

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 252](../../../../src/main/webapp/js/mapviewer.olMap.js#L252)

### Returns:

Type

ol.layer.Vector

## (static) getCurrentExtent() → {Array.&lt;number&gt;}

Gets current map extent

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 332](../../../../src/main/webapp/js/mapviewer.olMap.js#L332)

### Returns:

Type

Array.&lt;number&gt;

## (static) getCurrentProjection() → {string}

Gets current map projection

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 162](../../../../src/main/webapp/js/mapviewer.olMap.js#L162)

### Returns:

Type

string

## (static) getCurrentResolution() → {number}

Gets current map scale

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 377](../../../../src/main/webapp/js/mapviewer.olMap.js#L377)

### Returns:

Type

number

## (static) getCurrentScale() → {number}

Gets current map scale

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 340](../../../../src/main/webapp/js/mapviewer.olMap.js#L340)

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

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 490](../../../../src/main/webapp/js/mapviewer.olMap.js#L490)

## (static) imageLoadFromProxy(image, url)

Load image replacer for image layers, use proxy

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `image` | *   |     |
| `url` | string |     |

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 830](../../../../src/main/webapp/js/mapviewer.olMap.js#L830)

## (static) init(bgLayers, overviewBgLayer)

Initializes map

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `bgLayers` | JSON | background layers to set |
| `overviewBgLayer` | JSON | default overview background layer to display |

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 41](../../../../src/main/webapp/js/mapviewer.olMap.js#L41)

## (static) markGfiPosition()

Marks position of current displayed gfi

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 702](../../../../src/main/webapp/js/mapviewer.olMap.js#L702)

## (static) moveLayer(layer, to)

Changes layer position map layer list

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | JSON | layer to move, from layers list |
| `to` | number | destination index in list |

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 556](../../../../src/main/webapp/js/mapviewer.olMap.js#L556)

## (static) removeLayer(layer)

Removes given layer from map

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | JSON | layer to remove, from layer list |

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 173](../../../../src/main/webapp/js/mapviewer.olMap.js#L173)

## (static) setOpacity(layer, opacity)

Sets given layer opacity

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | JSON | layer to zoom, from layers list |
| `opacity` | number | opacity |

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 575](../../../../src/main/webapp/js/mapviewer.olMap.js#L575)

## (static) setVisible(layer, isVisible)

Sets given layer visibility

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | JSON | layer to zoom, from layers list |
| `isVisible` | boolean | visibility |

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 566](../../../../src/main/webapp/js/mapviewer.olMap.js#L566)

## (static) updateBgLayers()

Changes current background layer displayed

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 479](../../../../src/main/webapp/js/mapviewer.olMap.js#L479)

## (static) updateOverviewVisibility()

Updates overview visibility in proportion to current zoom

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 689](../../../../src/main/webapp/js/mapviewer.olMap.js#L689)

## (static) updateSource(layer, sourceParams)

Overwrites given layer source

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | JSON | layer to zoom, from layers list |
| `sourceParams` | Object | new params for new source created |

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 594](../../../../src/main/webapp/js/mapviewer.olMap.js#L594)

## (static) updateSourceParams(layer, params)

Updates given layer source params without overwrite no given params

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | JSON | layer to zoom, from layers list |
| `params` | Object | new params to apply |

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 584](../../../../src/main/webapp/js/mapviewer.olMap.js#L584)

## (static) updateViewProjection(proj)

Changes map projection with new projection

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `proj` | string | new projection to apply |

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 385](../../../../src/main/webapp/js/mapviewer.olMap.js#L385)

## (static) updateWfsFeatures(layer, featureCollection)

Replaces all layer features

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | *   | layer to update |
| `featureCollection` | *   | GeoJSON which contains the feature collection |

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 610](../../../../src/main/webapp/js/mapviewer.olMap.js#L610)

## (static) zoomToExtent(extent)

Zooms to given extent

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `extent` | Array.&lt;number&gt; | extent to zoom |

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 519](../../../../src/main/webapp/js/mapviewer.olMap.js#L519)

## (static) zoomToHome()

Zooms to predefined extent according to current projection

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 499](../../../../src/main/webapp/js/mapviewer.olMap.js#L499)

## (static) zoomToScale(scale)

Zooms to given scale

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `scale` | number | Scale to zoom in (ex: 1000 for '1:1000') |

Source:

- [mapviewer.olMap.js](../../../../src/main/webapp/js/mapviewer.olMap.js), [line 536](../../../../src/main/webapp/js/mapviewer.olMap.js#L536)

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