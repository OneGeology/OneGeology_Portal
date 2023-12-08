 JSDoc: Class: layerOneGeology 

Class: layerOneGeology
======================

# layerOneGeology()

Search and add layer manager

Source:

* [script.js](../../../../src/main/webapp/widget/layerOneGeology/script.js), [line 5](../../../../src/main/webapp/widget/layerOneGeology/script.js#L5)

# Members

## (static) currentCall :Promise|Null

Current Ajax call to this.url

### Type:

* Promise | Null

Source:

* [script.js](../../../../src/main/webapp/widget/layerOneGeology/script.js), [line 28](../../../../src/main/webapp/widget/layerOneGeology/script.js#L28)

## (static) currentSelectAllId :number

Current id for "select all" checkbox

### Type:

* number

Source:

* [script.js](../../../../src/main/webapp/widget/layerOneGeology/script.js), [line 34](../../../../src/main/webapp/widget/layerOneGeology/script.js#L34)

## (static) firstLoadRunning

Is the first loading running ?

Source:

* [script.js](../../../../src/main/webapp/widget/layerOneGeology/script.js), [line 39](../../../../src/main/webapp/widget/layerOneGeology/script.js#L39)

## (static) thematicKeywordList :string

?

### Type:

* string

Source:

* [script.js](../../../../src/main/webapp/widget/layerOneGeology/script.js), [line 22](../../../../src/main/webapp/widget/layerOneGeology/script.js#L22)

## (static) url :string

Url to call to get layers list

### Type:

* string

Source:

* [script.js](../../../../src/main/webapp/widget/layerOneGeology/script.js), [line 10](../../../../src/main/webapp/widget/layerOneGeology/script.js#L10)

## (static) urlMappingCountriesM49File

JSON file to get standard country or area codes for statistical use (M49)

Source:

* [script.js](../../../../src/main/webapp/widget/layerOneGeology/script.js), [line 44](../../../../src/main/webapp/widget/layerOneGeology/script.js#L44)

## (static) urlThematicKw :string

?

### Type:

* string

Source:

* [script.js](../../../../src/main/webapp/widget/layerOneGeology/script.js), [line 16](../../../../src/main/webapp/widget/layerOneGeology/script.js#L16)

# Methods

## (static) addEvents()

Creates widget listeners

Source:

* [script.js](../../../../src/main/webapp/widget/layerOneGeology/script.js), [line 75](../../../../src/main/webapp/widget/layerOneGeology/script.js#L75)

## (static) buildGeographicTree(recordList)

Build the layer tree sorted by geographic Area

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `recordList` | Array.&lt;Object&gt; | : layer list from research |

Source:

* [script.js](../../../../src/main/webapp/widget/layerOneGeology/script.js), [line 527](../../../../src/main/webapp/widget/layerOneGeology/script.js#L527)

## (static) buildThematicTree(recordList)

Build the layer tree sorted by thematic

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `recordList` | Array.&lt;Object&gt; | : layer list from research |

Source:

* [script.js](../../../../src/main/webapp/widget/layerOneGeology/script.js), [line 493](../../../../src/main/webapp/widget/layerOneGeology/script.js#L493)

## (static) checkMonitoringService(recordList)

Set recommandation in each records if its monitoring score is enougth

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `recordList` | Array.&lt;Object&gt; | : layer list from research |

Source:

* [script.js](../../../../src/main/webapp/widget/layerOneGeology/script.js), [line 476](../../../../src/main/webapp/widget/layerOneGeology/script.js#L476)

## (static) countDirectChildren(item)

Count treenode direct children (not with sublists)

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `item` | *   |     |

Source:

* [script.js](../../../../src/main/webapp/widget/layerOneGeology/script.js), [line 789](../../../../src/main/webapp/widget/layerOneGeology/script.js#L789)

### Returns:

number

## (static) doJsonSearchRecords(firstLoad)

Get filtered datasets from configuration's json catalog

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `firstLoad` | boolean |     |

Source:

* [script.js](../../../../src/main/webapp/widget/layerOneGeology/script.js), [line 377](../../../../src/main/webapp/widget/layerOneGeology/script.js#L377)

## (static) getGeonetworkRecords(firstLoad)

Get filtered datasets from geonetwork

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `firstLoad` | boolean | true on loading portal, false from search engine |

Source:

* [script.js](../../../../src/main/webapp/widget/layerOneGeology/script.js), [line 140](../../../../src/main/webapp/widget/layerOneGeology/script.js#L140)

## (static) getJsonRecords(firstLoad)

Load json catalog then do the search

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `firstLoad` | boolean | true on loading portal, false from search engine |

Source:

* [script.js](../../../../src/main/webapp/widget/layerOneGeology/script.js), [line 353](../../../../src/main/webapp/widget/layerOneGeology/script.js#L353)

## (static) getRecords(firstLoad)

Get all dataset with configuration's method

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `firstLoad` | boolean | true on loading portal, false from search engine |

Source:

* [script.js](../../../../src/main/webapp/widget/layerOneGeology/script.js), [line 122](../../../../src/main/webapp/widget/layerOneGeology/script.js#L122)

## (static) getThematicKw(recordList)

Get the thematic keyword for xml file in eXist count the number of keyword occurence for the geonetwork layer list

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `recordList` |     | : layer list from geonetwork |

Source:

* [script.js](../../../../src/main/webapp/widget/layerOneGeology/script.js), [line 833](../../../../src/main/webapp/widget/layerOneGeology/script.js#L833)

## (static) init()

Initialize widget

Source:

* [script.js](../../../../src/main/webapp/widget/layerOneGeology/script.js), [line 49](../../../../src/main/webapp/widget/layerOneGeology/script.js#L49)

## (static) manageAddLayer()

Add/remove a layer when click in the layer tree

Source:

* [script.js](../../../../src/main/webapp/widget/layerOneGeology/script.js), [line 802](../../../../src/main/webapp/widget/layerOneGeology/script.js#L802)

## (static) parcoursNoeud(treeNode, level) → {string}

Recursive function to build the final tree

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `treeNode` |     |     |
| `level` |     |     |

Source:

* [script.js](../../../../src/main/webapp/widget/layerOneGeology/script.js), [line 735](../../../../src/main/webapp/widget/layerOneGeology/script.js#L735)

### Returns:

Type

string

## (static) parseCSWGetRecords(result, firstLoad)

Get all dataset in geonetwork catalog

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `result` | string | csw xml result |
| `firstLoad` | boolean | true on loading portal, false from search engine |

Source:

* [script.js](../../../../src/main/webapp/widget/layerOneGeology/script.js), [line 261](../../../../src/main/webapp/widget/layerOneGeology/script.js#L261)

## (static) resetSearchOptions()

Reset all search form to its default value and trigger search

Source:

* [script.js](../../../../src/main/webapp/widget/layerOneGeology/script.js), [line 896](../../../../src/main/webapp/widget/layerOneGeology/script.js#L896)

## (static) showHideSearchOptions()

Show/hide advanced options in search engine

Source:

* [script.js](../../../../src/main/webapp/widget/layerOneGeology/script.js), [line 889](../../../../src/main/webapp/widget/layerOneGeology/script.js#L889)

## (static) showHideSubLayers()

Expand or collapse tree list subitems

Source:

* [script.js](../../../../src/main/webapp/widget/layerOneGeology/script.js), [line 107](../../../../src/main/webapp/widget/layerOneGeology/script.js#L107)

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

Documentation generated by [JSDoc 3.6.7](https://github.com/jsdoc/jsdoc) on Thu Dec 23 2021 15:51:03 GMT+0100 (heure normale d’Europe centrale)

Converted from HTML by [convert-simple.com](https://www.convertsimple.com/convert-html-to-markdown/)