 JSDoc: Class: map 

Class: map
==========

[mapviewer](mapviewer.md).map()
---------------------------------

# map()

Map manager

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 5](../../../../src/main/webapp/js/mapviewer.map.js#L5)

# Members

## (static) currentMap :string

Current active map indicator

### Type:

* string

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 10](../../../../src/main/webapp/js/mapviewer.map.js#L10)

## (static) lastIdx :number

Last layer id used

### Type:

* number

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 22](../../../../src/main/webapp/js/mapviewer.map.js#L22)

## (static) layers :Array.&lt;any&gt;

Current displayed layers configurations

### Type:

* Array.&lt;any&gt;

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 16](../../../../src/main/webapp/js/mapviewer.map.js#L16)

# Methods

## (static) addLayer(layerData, idx) → {jQuery.Deferred}

Adds layer to map. Return deferred always resolve because errors kills "always" chain

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layerData` | Object | data to set layer |
| `idx` | number | idx to set to layer in map |

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 253](../../../../src/main/webapp/js/mapviewer.map.js#L253)

### Returns:

Type

jQuery.Deferred

## (static) addLayers(layersData) → {jQuery.Deferred}

Adds a bunch of layers to the map, with warning/errors if already added or failed

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layersData` | Array.&lt;Object&gt; | list of layers data to set map layer |

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 174](../../../../src/main/webapp/js/mapviewer.map.js#L174)

### Returns:

Type

jQuery.Deferred

## (static) checkSRSLayer(newSRS, oldSRS)

Checks if the displayed layers (not autolayers) are compliant with the new projection system, if not they are hidden and an icon appears is the layer switcher

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `newSRS` | string | new projection system set |
| `oldSRS` | string | previous projection system |

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 764](../../../../src/main/webapp/js/mapviewer.map.js#L764)

## (static) cleanMap()

Removes all layers from maps and layer list

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 669](../../../../src/main/webapp/js/mapviewer.map.js#L669)

## (static) disableLayerFilter(layer)

Reset layer at its default filter state

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | *   | Layer to reset |

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 952](../../../../src/main/webapp/js/mapviewer.map.js#L952)

## (static) enableLayerFilter(layer)

Enable SLD filter for layer

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | *   | Layer to filter |

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 940](../../../../src/main/webapp/js/mapviewer.map.js#L940)

## (static) filterLayer(layer, sldUrl, filterType, filterName)

Apply SLD filter to layer

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | *   | layer to zoom, from layers list |
| `sldUrl` | string | SLD url |
| `filterType` | string | Type of filter (lithology, etc) |
| `filterName` | string | Name of the filter |

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 917](../../../../src/main/webapp/js/mapviewer.map.js#L917)

## (static) generateWCSLayer(layerData, capabilities, idx) → {ol.Layer}

Add WMS layer to map

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layerData` | Object | data to set layer |
| `capabilities` | Object | result of global GetCapabilities |
| `idx` | number | idx to set to layer in map |

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 527](../../../../src/main/webapp/js/mapviewer.map.js#L527)

### Returns:

Type

ol.Layer

## (static) generateWFSLayer(layerData, capabilities, idx) → {ol.Layer}

Add WMS layer to map

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layerData` | Object | data to set layer |
| `capabilities` | Object | result of global GetCapabilities |
| `idx` | number | idx to set to layer in map |

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 472](../../../../src/main/webapp/js/mapviewer.map.js#L472)

### Returns:

Type

ol.Layer

## (static) generateWMSLayer(layerData, capabilities, idx) → {*|Null}

Generate WMS layer data to add it

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layerData` | Object | data to set layer |
| `capabilities` | Object | result of global GetCapabilities |
| `idx` | number | idx to set to layer in map |

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 374](../../../../src/main/webapp/js/mapviewer.map.js#L374)

### Returns:

Type

* | Null

## (static) getCurrentExtent() → {Array.&lt;number&gt;}

Gets current map extent

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 700](../../../../src/main/webapp/js/mapviewer.map.js#L700)

### Returns:

Type

Array.&lt;number&gt;

## (static) getCurrentProjection() → {string}

Gets current map projection

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 688](../../../../src/main/webapp/js/mapviewer.map.js#L688)

### Returns:

Type

string

## (static) getCurrentResolution() → {number}

Gets current map scale

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 724](../../../../src/main/webapp/js/mapviewer.map.js#L724)

### Returns:

Type

number

## (static) getCurrentScale() → {number}

Gets current map scale

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 712](../../../../src/main/webapp/js/mapviewer.map.js#L712)

### Returns:

Type

number

## (static) goToCoord(lonLat, closeZoom)

Sets map view center to new coordinates

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `lonLat` | Array.&lt;number&gt; | new coordinates to go to |
| `closeZoom` | boolean | if true, zoom closer than default goto zoom |

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 794](../../../../src/main/webapp/js/mapviewer.map.js#L794)

## (static) hasPortrayableLayers(type)

Check if there is at least one layer capable of given type portrayal

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `type` | string | Type of portrayal searched |

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 1033](../../../../src/main/webapp/js/mapviewer.map.js#L1033)

### Returns:

Boolean

## (static) init()

Initializes map

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 27](../../../../src/main/webapp/js/mapviewer.map.js#L27)

## (static) initEvents()

Creates map and document listeners for map functionality

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 79](../../../../src/main/webapp/js/mapviewer.map.js#L79)

## (static) moveLayer(from, to)

Changes layer position in layer list

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `from` | number | initial layer index in list |
| `to` | number | destination index in list |

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 857](../../../../src/main/webapp/js/mapviewer.map.js#L857)

## (static) removeLayer(layer)

Removes given layer from maps and layer list

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | *   | layer to remove, from layer list |

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 645](../../../../src/main/webapp/js/mapviewer.map.js#L645)

## (static) setOpacity(layer, opacity)

Sets given layer opacity

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | *   | layer to zoom, from layers list |
| `opacity` | number | opacity |

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 898](../../../../src/main/webapp/js/mapviewer.map.js#L898)

## (static) setVisible(layer, isVisible)

Sets given layer visibility

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | *   | layer to zoom, from layers list |
| `isVisible` | boolean | visibility |

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 884](../../../../src/main/webapp/js/mapviewer.map.js#L884)

## (static) swapToMap(mapType)

Swap to cesium or ol map

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `mapType` | string |     |

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 132](../../../../src/main/webapp/js/mapviewer.map.js#L132)

## (static) updateBgLayers(bgLayer)

Changes current background layer displayed on current map

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `bgLayer` | *   | background layer to display, from background layers list |

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 748](../../../../src/main/webapp/js/mapviewer.map.js#L748)

## (static) updateSource(layer, sourceParams)

Overwrites given layer source

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | *   | layer to zoom, from layers list |
| `sourceParams` | Object | new params for new source created |

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 984](../../../../src/main/webapp/js/mapviewer.map.js#L984)

## (static) updateSourceParams(layer, params)

Updates given layer source params without overwrite no given params

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | *   | layer to zoom, from layers list |
| `params` | Object | new params to apply |

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 973](../../../../src/main/webapp/js/mapviewer.map.js#L973)

## (static) updateViewProjection(newProjection)

Changes current map projection with new projection

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `newProjection` | string | new projection to apply |

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 735](../../../../src/main/webapp/js/mapviewer.map.js#L735)

## (static) updateWfsFeatures(layer, featureCollection)

Replaces all layer features

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | *   | layer to update |
| `featureCollection` | *   | GeoJSON which contains the feature collection |

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 995](../../../../src/main/webapp/js/mapviewer.map.js#L995)

## (static) zoomToExtent(extent)

Zooms to given extent

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `extent` | Array.&lt;number&gt; | extent to zoom |

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 828](../../../../src/main/webapp/js/mapviewer.map.js#L828)

## (static) zoomToHome()

Zooms to predefined extent of the map

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 805](../../../../src/main/webapp/js/mapviewer.map.js#L805)

## (static) zoomToLayer(layer)

Zooms to given layer extent

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | *   | layer to zoom, from layers list |

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 817](../../../../src/main/webapp/js/mapviewer.map.js#L817)

## (static) zoomToScale(scale)

Zooms to given scale

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `scale` | Array.&lt;number&gt; | scale |

Source:

- [mapviewer.map.js](../../../../src/main/webapp/js/mapviewer.map.js), [line 843](../../../../src/main/webapp/js/mapviewer.map.js#L843)

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