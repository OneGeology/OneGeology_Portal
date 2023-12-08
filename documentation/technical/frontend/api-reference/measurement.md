 JSDoc: Class: measurement 

Class: measurement
==================

# measurement()

Measurement tools widget

Source:

* [script.js](../../../../src/main/webapp/widget/measurement/script.js), [line 5](../../../../src/main/webapp/widget/measurement/script.js#L5)

# Members

## (static) currentDrawId :number

Current feature id

### Type:

* number

Source:

* [script.js](../../../../src/main/webapp/widget/measurement/script.js), [line 41](../../../../src/main/webapp/widget/measurement/script.js#L41)

## (static) drawInteraction :ol.interaction.Draw|Null

Memorization of map draw interaction

### Type:

* ol.interaction.Draw | Null

Source:

* [script.js](../../../../src/main/webapp/widget/measurement/script.js), [line 17](../../../../src/main/webapp/widget/measurement/script.js#L17)

## (static) drawListener :Object|Null

Current draw feature change listener

### Type:

* Object | Null

Source:

* [script.js](../../../../src/main/webapp/widget/measurement/script.js), [line 29](../../../../src/main/webapp/widget/measurement/script.js#L29)

## (static) isActive :boolean

Is measure tools currently active

### Type:

* boolean

Source:

* [script.js](../../../../src/main/webapp/widget/measurement/script.js), [line 35](../../../../src/main/webapp/widget/measurement/script.js#L35)

## (static) measureLayer :ol.layer.Vector|Null

Vector layer where measures are drawn

### Type:

* ol.layer.Vector | Null

Source:

* [script.js](../../../../src/main/webapp/widget/measurement/script.js), [line 11](../../../../src/main/webapp/widget/measurement/script.js#L11)

# Methods

## (static) changeInteraction()

Changes current interaction type

Source:

* [script.js](../../../../src/main/webapp/widget/measurement/script.js), [line 123](../../../../src/main/webapp/widget/measurement/script.js#L123)

## (static) clear()

Clears draw layer and list

Source:

* [script.js](../../../../src/main/webapp/widget/measurement/script.js), [line 266](../../../../src/main/webapp/widget/measurement/script.js#L266)

## (static) disableMeasurement()

Removes measurement layer and interaction to map

Source:

* [script.js](../../../../src/main/webapp/widget/measurement/script.js), [line 114](../../../../src/main/webapp/widget/measurement/script.js#L114)

## (static) enableMeasurement()

Adds measurement layer and interaction to map

Source:

* [script.js](../../../../src/main/webapp/widget/measurement/script.js), [line 95](../../../../src/main/webapp/widget/measurement/script.js#L95)

## (static) formatArea(polygon) → {string}

Calculates and formats area to display

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `polygon` | ol.geom.Polygon | currently drawn polygon geometry |

Source:

* [script.js](../../../../src/main/webapp/widget/measurement/script.js), [line 250](../../../../src/main/webapp/widget/measurement/script.js#L250)

### Returns:

Type

string

## (static) formatLength(line) → {string}

Calculates and formats length to display

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `line` | ol.geom.LineString | currently drawn line geometry |

Source:

* [script.js](../../../../src/main/webapp/widget/measurement/script.js), [line 233](../../../../src/main/webapp/widget/measurement/script.js#L233)

### Returns:

Type

string

## (static) handleMapMode()

Disables drawing for 3D mode, enables it for 2D mode

Source:

* [script.js](../../../../src/main/webapp/widget/measurement/script.js), [line 62](../../../../src/main/webapp/widget/measurement/script.js#L62)

## (static) init()

Initializes widget

Source:

* [script.js](../../../../src/main/webapp/widget/measurement/script.js), [line 46](../../../../src/main/webapp/widget/measurement/script.js#L46)

## (static) initEvents()

Binds measurement widget listeners

Source:

* [script.js](../../../../src/main/webapp/widget/measurement/script.js), [line 53](../../../../src/main/webapp/widget/measurement/script.js#L53)

## (static) measureEnd()

At draw end, unbinds feature change listener and draws final figure

Source:

* [script.js](../../../../src/main/webapp/widget/measurement/script.js), [line 180](../../../../src/main/webapp/widget/measurement/script.js#L180)

## (static) measureStart(e)

At new draw, adds draw data to list and binds change listener

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `e` | Event | event from drawstart |

Source:

* [script.js](../../../../src/main/webapp/widget/measurement/script.js), [line 168](../../../../src/main/webapp/widget/measurement/script.js#L168)

## (static) onPanelChange()

Enables or disables measurement layers and interactions when active panel change

Source:

* [script.js](../../../../src/main/webapp/widget/measurement/script.js), [line 79](../../../../src/main/webapp/widget/measurement/script.js#L79)

## (static) updateCurrentMeasure(e)

At draw feature change, updates displayed data

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `e` | Event | event from feature change |

Source:

* [script.js](../../../../src/main/webapp/widget/measurement/script.js), [line 216](../../../../src/main/webapp/widget/measurement/script.js#L216)

## (static) updateInteraction()

Updates draw interaction type according to current selection

Source:

* [script.js](../../../../src/main/webapp/widget/measurement/script.js), [line 132](../../../../src/main/webapp/widget/measurement/script.js#L132)

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

Documentation generated by [JSDoc 3.6.7](https://github.com/jsdoc/jsdoc) on Thu Dec 23 2021 15:52:36 GMT+0100 (heure normale d’Europe centrale)

Converted from HTML by [convert-simple.com](https://www.convertsimple.com/convert-html-to-markdown/)