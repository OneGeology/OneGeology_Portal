 JSDoc: Class: generateUrl 

Class: generateUrl
==================

generateUrl()
-------------

# generateUrl()

Generate url page

Source:

* [script.js](../../../../src/main/webapp/widget/generateUrl/script.js), [line 6](../../../../src/main/webapp/widget/generateUrl/script.js#L6)

# Members

## (static) dragboxInteraction :ol.interaction.DragBox|Null

Memorization of map dragbox interaction

### Type:

* ol.interaction.DragBox | Null

Source:

* [script.js](../../../../src/main/webapp/widget/generateUrl/script.js), [line 17](../../../../src/main/webapp/widget/generateUrl/script.js#L17)

## (static) extentLayer :ol.layer.Vector|Null

Vector layer where selected extent is displayed

### Type:

* ol.layer.Vector | Null

Source:

* [script.js](../../../../src/main/webapp/widget/generateUrl/script.js), [line 11](../../../../src/main/webapp/widget/generateUrl/script.js#L11)

## (static) selectedExtent :Array.&lt;number&gt;|Null

Current selected extent

### Type:

* Array.&lt;number&gt; | Null

Source:

* [script.js](../../../../src/main/webapp/widget/generateUrl/script.js), [line 23](../../../../src/main/webapp/widget/generateUrl/script.js#L23)

# Methods

## (static) clearExtent()

Clears extent from generated url and map

Source:

* [script.js](../../../../src/main/webapp/widget/generateUrl/script.js), [line 184](../../../../src/main/webapp/widget/generateUrl/script.js#L184)

## (static) copyUrl()

Copy generated url to clipboard

Source:

* [script.js](../../../../src/main/webapp/widget/generateUrl/script.js), [line 245](../../../../src/main/webapp/widget/generateUrl/script.js#L245)

## (static) disableExtentDraw()

Disables and hide extent selection

Source:

* [script.js](../../../../src/main/webapp/widget/generateUrl/script.js), [line 157](../../../../src/main/webapp/widget/generateUrl/script.js#L157)

## (static) drawExtent(e)

Draw selected extent

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `e` | ol.interaction.DragBox.DragBoxEvent |     |

Source:

* [script.js](../../../../src/main/webapp/widget/generateUrl/script.js), [line 166](../../../../src/main/webapp/widget/generateUrl/script.js#L166)

## (static) enableExtentDraw()

Enables and displays extent selection

Source:

* [script.js](../../../../src/main/webapp/widget/generateUrl/script.js), [line 124](../../../../src/main/webapp/widget/generateUrl/script.js#L124)

## (static) generateLayersList()

Generates layer list for service/layer autoload

Source:

* [script.js](../../../../src/main/webapp/widget/generateUrl/script.js), [line 94](../../../../src/main/webapp/widget/generateUrl/script.js#L94)

## (static) generateShareUrl()

Generate the share link for selected options

Source:

* [script.js](../../../../src/main/webapp/widget/generateUrl/script.js), [line 196](../../../../src/main/webapp/widget/generateUrl/script.js#L196)

## (static) handleMapMode()

Disables extent selection in 3D mode, enables it for 2D mode

Source:

* [script.js](../../../../src/main/webapp/widget/generateUrl/script.js), [line 57](../../../../src/main/webapp/widget/generateUrl/script.js#L57)

## (static) init()

Initializes widget

Source:

* [script.js](../../../../src/main/webapp/widget/generateUrl/script.js), [line 28](../../../../src/main/webapp/widget/generateUrl/script.js#L28)

## (static) initEvents()

Binds all events of this page

Source:

* [script.js](../../../../src/main/webapp/widget/generateUrl/script.js), [line 37](../../../../src/main/webapp/widget/generateUrl/script.js#L37)

## (static) onPanelChange()

Enables or disables extent selection and display when active panel change

Source:

* [script.js](../../../../src/main/webapp/widget/generateUrl/script.js), [line 77](../../../../src/main/webapp/widget/generateUrl/script.js#L77)

## (static) selectLayer(e)

Updates autoadd service and layer from selection

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `e` | *   | Event from jQuery click listener |

Source:

* [script.js](../../../../src/main/webapp/widget/generateUrl/script.js), [line 303](../../../../src/main/webapp/widget/generateUrl/script.js#L303)

## (static) toggleFieldsFromServiceType()

Toggles forceload field depending service type

Source:

* [script.js](../../../../src/main/webapp/widget/generateUrl/script.js), [line 277](../../../../src/main/webapp/widget/generateUrl/script.js#L277)

## (static) toggleFieldsFromServiceUrl()

Toggles layername field depending serviceUrl

Source:

* [script.js](../../../../src/main/webapp/widget/generateUrl/script.js), [line 264](../../../../src/main/webapp/widget/generateUrl/script.js#L264)

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

Documentation generated by [JSDoc 3.6.7](https://github.com/jsdoc/jsdoc) on Thu Dec 23 2021 15:47:37 GMT+0100 (heure normale d’Europe centrale)

Converted from HTML by [convert-simple.com](https://www.convertsimple.com/convert-html-to-markdown/)