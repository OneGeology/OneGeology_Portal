 JSDoc: Class: externalOGC 

Class: externalOGC
==================

# externalOGC()

Import layers from files widget

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 5](../../../../src/main/webapp/widget/externalOGC/script.js#L5)

# Members

## (static) bboxCoverageExtent :Array.&lt;number&gt;

Current bbox coverage extent

### Type:

* Array.&lt;number&gt;

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 58](../../../../src/main/webapp/widget/externalOGC/script.js#L58)

## (static) bboxLayer :ol.layer.Vector|Null

WCS bbox layer

### Type:

* ol.layer.Vector | Null

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 46](../../../../src/main/webapp/widget/externalOGC/script.js#L46)

## (static) capabilities :Object

GetCapabilites result

### Type:

* Object

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 10](../../../../src/main/webapp/widget/externalOGC/script.js#L10)

## (static) draw :ol.interaction.DragBox|Null

Draw extent interaction

### Type:

* ol.interaction.DragBox | Null

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 52](../../../../src/main/webapp/widget/externalOGC/script.js#L52)

## (static) extentLayer :ol.layer.Vector|Null

WCS extent layer

### Type:

* ol.layer.Vector | Null

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 40](../../../../src/main/webapp/widget/externalOGC/script.js#L40)

## (static) kmlMapToImport :ol.Map

Imported KML map

### Type:

* ol.Map

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 70](../../../../src/main/webapp/widget/externalOGC/script.js#L70)

## (static) mapToImport :ol.Map

Imported WMC map

### Type:

* ol.Map

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 64](../../../../src/main/webapp/widget/externalOGC/script.js#L64)

## (static) xmaxFullExt :number

X max of WCS imported file full extent

### Type:

* number

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 16](../../../../src/main/webapp/widget/externalOGC/script.js#L16)

## (static) xminFullExt :number

X min of WCS imported file full extent

### Type:

* number

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 28](../../../../src/main/webapp/widget/externalOGC/script.js#L28)

## (static) ymaxFullExt :number

Y max of WCS imported file full extent

### Type:

* number

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 22](../../../../src/main/webapp/widget/externalOGC/script.js#L22)

## (static) yminFullExt :number

Y min of WCS imported file full extent

### Type:

* number

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 34](../../../../src/main/webapp/widget/externalOGC/script.js#L34)

# Methods

## (static) addInteraction()

Enable bbox draw to select extent in imported WCS selected coverage

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 322](../../../../src/main/webapp/widget/externalOGC/script.js#L322)

## (static) addListeners()

Creates widget listeners

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 117](../../../../src/main/webapp/widget/externalOGC/script.js#L117)

## (static) disableWCSImportFeatures()

Disables WCS import layers and interactions

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 689](../../../../src/main/webapp/widget/externalOGC/script.js#L689)

## (static) enableWCSImportFeatures()

Enables WCS import layers and interactions

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 704](../../../../src/main/webapp/widget/externalOGC/script.js#L704)

## (static) getCoverage()

Imports layer from coverage

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 407](../../../../src/main/webapp/widget/externalOGC/script.js#L407)

## (static) handleMapMode()

Disables drawing for 3D mode, enables it for 2D mode

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 96](../../../../src/main/webapp/widget/externalOGC/script.js#L96)

## (static) importKmlMap()

Imports map from the chosen KML file in the form and add its layers that aren't already in the map

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 771](../../../../src/main/webapp/widget/externalOGC/script.js#L771)

## (static) importMap()

Imports map from the chosen WMC file in the form and add its layers that aren't already in the map

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 719](../../../../src/main/webapp/widget/externalOGC/script.js#L719)

## (static) init()

Initializes widget

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 75](../../../../src/main/webapp/widget/externalOGC/script.js#L75)

## (static) launchGetCapabilities()

Does GetCapabilities with url to import

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 255](../../../../src/main/webapp/widget/externalOGC/script.js#L255)

## (static) manageAddLayer()

Adds checked layers in import layer list if they aren't already in the map

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 625](../../../../src/main/webapp/widget/externalOGC/script.js#L625)

## (static) onFullCoverage()

Display full extent of imported WCS selected coverage

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 289](../../../../src/main/webapp/widget/externalOGC/script.js#L289)

## (static) onPanelChange()

Toggles WCS import features on main panel change

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 673](../../../../src/main/webapp/widget/externalOGC/script.js#L673)

## (static) onSubset()

Enable bbox draw

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 309](../../../../src/main/webapp/widget/externalOGC/script.js#L309)

## (static) onTabChange()

Toggles WCS import features on main tab change

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 660](../../../../src/main/webapp/widget/externalOGC/script.js#L660)

## (static) parcoursNoeud(treeNode, id)

Creates HTML tree item (recursive)

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `treeNode` | Object | layer node of GetCapabilities |
| `id` | number | id of current item |

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 593](../../../../src/main/webapp/widget/externalOGC/script.js#L593)

## (static) setCoverageExtent(zoomTo)

Draws imported WCS selected coverage extent and zoom on it

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `zoomTo` | boolean | must zoom to extent |

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 349](../../../../src/main/webapp/widget/externalOGC/script.js#L349)

## (static) showHideSubLayers()

Expands or collapses tree list subitems

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 242](../../../../src/main/webapp/widget/externalOGC/script.js#L242)

## (static) showWCSGetCapabilities(treeContainer)

Creates HTML of import according to WCS GetCapabilities

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `treeContainer` | String | html tree container selector |

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 451](../../../../src/main/webapp/widget/externalOGC/script.js#L451)

## (static) showWMSGetCapabilities(treeContainer)

Creates HTML of import according to WMS GetCapabilities

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `treeContainer` | String | html tree container selector |

Source:

* [script.js](../../../../src/main/webapp/widget/externalOGC/script.js), [line 515](../../../../src/main/webapp/widget/externalOGC/script.js#L515)

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
  - [externalOGC](externalOGC.md)
  - [measurement](measurement.md)
  - [thematicAnalysis](thematicAnalysis.md)

  

Documentation generated by [JSDoc 3.6.7](https://github.com/jsdoc/jsdoc) on Thu Dec 23 2021 15:43:23 GMT+0100 (heure normale d’Europe centrale)

Converted from HTML by [convert-simple.com](https://www.convertsimple.com/convert-html-to-markdown/)