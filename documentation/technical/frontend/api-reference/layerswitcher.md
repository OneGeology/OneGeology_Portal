 JSDoc: Class: layerswitcher 

Class: layerswitcher
====================

# layerswitcher()

layer switcher widget

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 5](../../../../src/main/webapp/widget/layerswitcher/script.js#L5)

# Members

## (static) debounceWfsFilterTimeout

Debouncer for filter parameters values

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 34](../../../../src/main/webapp/widget/layerswitcher/script.js#L34)

## (static) layerModelPage :string

Template pages

### Type:

* string

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 11](../../../../src/main/webapp/widget/layerswitcher/script.js#L11)

## (static) legendModel :string

Legend partial template

### Type:

* string

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 17](../../../../src/main/webapp/widget/layerswitcher/script.js#L17)

## (static) sliderOptions :Object

Jquery ui slider options

### Type:

* Object

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 40](../../../../src/main/webapp/widget/layerswitcher/script.js#L40)

## (static) thematicModel :string

Thematic partial template

### Type:

* string

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 23](../../../../src/main/webapp/widget/layerswitcher/script.js#L23)

## (static) wfsParamsModel :string

WFS parameters partial template

### Type:

* string

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 29](../../../../src/main/webapp/widget/layerswitcher/script.js#L29)

# Methods

## (static) activeThematicAnalysis()

Triggers thematic analysis init

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 1017](../../../../src/main/webapp/widget/layerswitcher/script.js#L1017)

## (static) addClickEvents()

Creates widget listeners

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 75](../../../../src/main/webapp/widget/layerswitcher/script.js#L75)

## (static) addWFSParameter(event)

Adds a parameter

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `event` | *   |     |

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 689](../../../../src/main/webapp/widget/layerswitcher/script.js#L689)

## (static) chooseColor()

Handle color change

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 520](../../../../src/main/webapp/widget/layerswitcher/script.js#L520)

## (static) closeLayerPanel()

Close layer information subpanel

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 681](../../../../src/main/webapp/widget/layerswitcher/script.js#L681)

## (static) constructColorChoices()

Renders colors dropdown

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 127](../../../../src/main/webapp/widget/layerswitcher/script.js#L127)

## (static) copyServiceUrl()

Copy service url to clipboard

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 1024](../../../../src/main/webapp/widget/layerswitcher/script.js#L1024)

## (static) countLayer()

Display current layer number

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 178](../../../../src/main/webapp/widget/layerswitcher/script.js#L178)

## (static) debouncedFilterWFSValues(event)

Call filter WFS values with au debounce time

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `event` | *   |     |

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 789](../../../../src/main/webapp/widget/layerswitcher/script.js#L789)

## (static) drawLayer(layer) → {string}

Renders layer

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | ol.Layer |     |

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 210](../../../../src/main/webapp/widget/layerswitcher/script.js#L210)

### Returns:

Type

string

## (static) drawLegend(layer)

Renders layer legend in legends panel

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | ol.Layer |     |

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 479](../../../../src/main/webapp/widget/layerswitcher/script.js#L479)

## (static) drawWfsParameters(layer, $layerDiv)

Draws WFS parameter tab content

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | any | Layer |
| `$layerDiv` | jQuery | jQuery container of layer row |

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 504](../../../../src/main/webapp/widget/layerswitcher/script.js#L504)

## (static) drawWfsValues($row, param, values, selectedValues)

Draw WFS values checkboxes

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `$row` | jQuery | jQuery object of the row to update |
| `param` | any | WFS parameter which owns values |
| `values` | string | Values to draw |
| `selectedValues` | Array.&lt;string&gt; | (optionnal) List of selected values |

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 852](../../../../src/main/webapp/widget/layerswitcher/script.js#L852)

## (static) enableLayerFiltering(layer)

Shows layer checkbox filter

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | *   |     |

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 1072](../../../../src/main/webapp/widget/layerswitcher/script.js#L1072)

## (static) extractDomLayerIdx($objDom) → {Number|Null}

Extract layer idx from an object DOM

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `$objDom` | jQuery | jquery DOM object where extract id |

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 1045](../../../../src/main/webapp/widget/layerswitcher/script.js#L1045)

### Returns:

Type

Number | Null

## (static) filterWfsLayer(event)

Filters a WFS layer

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `event` | *   |     |

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 902](../../../../src/main/webapp/widget/layerswitcher/script.js#L902)

## (static) filterWFSValues(event)

Filters values of WFS parameters

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `event` | *   |     |

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 803](../../../../src/main/webapp/widget/layerswitcher/script.js#L803)

## (static) getWFSParamValues(event)

Gets all values of a parameter

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `event` | *   |     |

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 749](../../../../src/main/webapp/widget/layerswitcher/script.js#L749)

## (static) handleMapMode()

Handle layers compatibility on map mode change

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 156](../../../../src/main/webapp/widget/layerswitcher/script.js#L156)

## (static) hideResetPortrayableButton()

Hide reset portrayable button

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 1128](../../../../src/main/webapp/widget/layerswitcher/script.js#L1128)

## (static) init()

Initialize widget

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 51](../../../../src/main/webapp/widget/layerswitcher/script.js#L51)

## (static) manageDragLayer(event, ui)

Handler when drag end a layer

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `event` |     |     |
| `ui` |     |     |

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 187](../../../../src/main/webapp/widget/layerswitcher/script.js#L187)

## (static) manageLayerDelete(event)

Delete layer

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `event` | Event |     |

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 630](../../../../src/main/webapp/widget/layerswitcher/script.js#L630)

## (static) manageLayerShowHide(event)

Toggle layer visibility

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `event` | Event |     |

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 543](../../../../src/main/webapp/widget/layerswitcher/script.js#L543)

## (static) manageLayerTransparency(event, ui)

Change layer opacity

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `event` | Event |     |
| `ui` |     |     |

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 613](../../../../src/main/webapp/widget/layerswitcher/script.js#L613)

## (static) manageLayerZoomTo(event)

Go to layer extent

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `event` | Event |     |

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 600](../../../../src/main/webapp/widget/layerswitcher/script.js#L600)

## (static) openLayerPanel(event)

Open layer informations subpanel according to which link has been clicked

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `event` | Event |     |

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 650](../../../../src/main/webapp/widget/layerswitcher/script.js#L650)

## (static) removeWFSParameter(event)

Removes a parameter

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `event` | *   |     |

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 725](../../../../src/main/webapp/widget/layerswitcher/script.js#L725)

## (static) resetAllPortrayableLayers()

Reset all portrayable filters

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 1060](../../../../src/main/webapp/widget/layerswitcher/script.js#L1060)

## (static) resetWFSParameters(event)

Reset layer parameters

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `event` | *   |     |

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 734](../../../../src/main/webapp/widget/layerswitcher/script.js#L734)

## (static) showResetPortrayableButton()

Show reset portrayable button

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 1137](../../../../src/main/webapp/widget/layerswitcher/script.js#L1137)

## (static) toggleLayerFilter(event)

Enable/disable current layer filter

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `event` | *   | Event from 'change' |

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 1090](../../../../src/main/webapp/widget/layerswitcher/script.js#L1090)

## (static) toggleLayerTools(event)

Toggle layer popover

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `event` | Event |     |

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 570](../../../../src/main/webapp/widget/layerswitcher/script.js#L570)

## (static) updateLayerSwitcherWfsFilters(layer)

Shows WFS layer checkbox filter

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | *   |     |

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 950](../../../../src/main/webapp/widget/layerswitcher/script.js#L950)

## (static) updateResetPortrayableButton()

Show/hide reset portrayable button if necessary

Source:

- [script.js](../../../../src/main/webapp/widget/layerswitcher/script.js), [line 1109](../../../../src/main/webapp/widget/layerswitcher/script.js#L1109)

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


Documentation generated by [JSDoc 3.6.7](https://github.com/jsdoc/jsdoc) on Thu Dec 23 2021 15:30:15 GMT+0100 (heure normale d’Europe centrale)

Converted from HTML by [convert-simple.com](https://www.convertsimple.com/convert-html-to-markdown/)