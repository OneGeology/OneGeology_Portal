 JSDoc: Class: gazetteer 

Class: gazetteer
================

# gazetteer()

Header search form widget

Source:

* [script.js](../../../../src/main/webapp/widget/gazetteer/script.js), [line 5](../../../../src/main/webapp/widget/gazetteer/script.js#L5)

# Members

## (static) lastResult :Object

Last result from the geonames call

### Type:

* Object

Source:

* [script.js](../../../../src/main/webapp/widget/gazetteer/script.js), [line 10](../../../../src/main/webapp/widget/gazetteer/script.js#L10)

# Methods

## (static) addFilterToResults(list, typeLabel)

Adds filter list to search results

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `list` | *   | List of filters |
| `typeLabel` | *   | Translated label for filter type |

Source:

* [script.js](../../../../src/main/webapp/widget/gazetteer/script.js), [line 223](../../../../src/main/webapp/widget/gazetteer/script.js#L223)

## (static) addListeners()

Creates widget listeners

Source:

* [script.js](../../../../src/main/webapp/widget/gazetteer/script.js), [line 47](../../../../src/main/webapp/widget/gazetteer/script.js#L47)

## (static) addSelectedLayer(layer, forceload)

Adds given layer to map

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | *   |     |
| `forceload` | boolean | Force the layer to load ? (WFS) |

Source:

* [script.js](../../../../src/main/webapp/widget/gazetteer/script.js), [line 744](../../../../src/main/webapp/widget/gazetteer/script.js#L744)

## (static) autocompleteSearch(request)

Proceed the search from autocomplete field

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `request` | any | Request from autocomplete field |

Source:

* [script.js](../../../../src/main/webapp/widget/gazetteer/script.js), [line 85](../../../../src/main/webapp/widget/gazetteer/script.js#L85)

## (static) findMyLocation()

Zoom to navigator/device location

Source:

* [script.js](../../../../src/main/webapp/widget/gazetteer/script.js), [line 706](../../../../src/main/webapp/widget/gazetteer/script.js#L706)

## (static) generateResultList(list, sectionTitle, itemName, classname)

Generate result list html for given list

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `list` | Array.&lt;any&gt; | List to show |
| `sectionTitle` | string | Title of the result section |
| `itemName` | string | Name of the item type for button display |
| `classname` | string | Class name of the list |

Source:

* [script.js](../../../../src/main/webapp/widget/gazetteer/script.js), [line 557](../../../../src/main/webapp/widget/gazetteer/script.js#L557)

### Returns:

String

## (static) generateSldFilters(vocab, propertyName)

(Recursive) Generates filter for sld call

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `vocab` | *   | Vocabulary to generate filter |
| `propertyName` | *   | Property name of the filter |

Source:

* [script.js](../../../../src/main/webapp/widget/gazetteer/script.js), [line 904](../../../../src/main/webapp/widget/gazetteer/script.js#L904)

## (static) getResultIcon(resultType)

Generates search result icon

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `resultType` | string | Type of result |

Source:

* [script.js](../../../../src/main/webapp/widget/gazetteer/script.js), [line 606](../../../../src/main/webapp/widget/gazetteer/script.js#L606)

## (static) getUrlResults(url, layerToAdd)

Get layer list from url

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `url` | string | Service url |
| `layerToAdd` | string | Layer to directly open instead of show results |

Source:

* [script.js](../../../../src/main/webapp/widget/gazetteer/script.js), [line 348](../../../../src/main/webapp/widget/gazetteer/script.js#L348)

## (static) getUrlResultsWFS(url)

Get layer list from wfs url

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `url` | string | Service url |

Source:

* [script.js](../../../../src/main/webapp/widget/gazetteer/script.js), [line 372](../../../../src/main/webapp/widget/gazetteer/script.js#L372)

## (static) getUrlResultsWMS(url)

Get layer list from wms url

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `url` | string | Service url |

Source:

* [script.js](../../../../src/main/webapp/widget/gazetteer/script.js), [line 417](../../../../src/main/webapp/widget/gazetteer/script.js#L417)

## (static) hasResults()

Check if there is results from last search

Source:

* [script.js](../../../../src/main/webapp/widget/gazetteer/script.js), [line 540](../../../../src/main/webapp/widget/gazetteer/script.js#L540)

## (static) hideHelp()

Hides gazetteer help panel if clicked out of it

Source:

* [script.js](../../../../src/main/webapp/widget/gazetteer/script.js), [line 941](../../../../src/main/webapp/widget/gazetteer/script.js#L941)

## (static) hideResult()

Hides results list

Source:

* [script.js](../../../../src/main/webapp/widget/gazetteer/script.js), [line 927](../../../../src/main/webapp/widget/gazetteer/script.js#L927)

## (static) highlightVocabulary(vocab, type, analysisType)

Generates SLD file for highlight vocabulary on map

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `vocab` | *   | Vocabulary to highlight |
| `type` | string | Type of vocabulary |
| `analysisType` | string | Type of standard analysis query |

Source:

* [script.js](../../../../src/main/webapp/widget/gazetteer/script.js), [line 808](../../../../src/main/webapp/widget/gazetteer/script.js#L808)

## (static) init()

Initialize widget

Source:

* [script.js](../../../../src/main/webapp/widget/gazetteer/script.js), [line 19](../../../../src/main/webapp/widget/gazetteer/script.js#L19)

## (static) manageResultClick()

Displays clicked geoname by centering to its lat/lng coordinates or add layer

Source:

* [script.js](../../../../src/main/webapp/widget/gazetteer/script.js), [line 645](../../../../src/main/webapp/widget/gazetteer/script.js#L645)

## (static) openCatalog()

Opens catalog page

Source:

* [script.js](../../../../src/main/webapp/widget/gazetteer/script.js), [line 693](../../../../src/main/webapp/widget/gazetteer/script.js#L693)

## (static) searchGeonames(term)

Make research in OSM geonames if allowed

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `term` | string | Term to research |

Source:

* [script.js](../../../../src/main/webapp/widget/gazetteer/script.js), [line 239](../../../../src/main/webapp/widget/gazetteer/script.js#L239)

## (static) searchLayers(term)

Make research in catalog if allowed

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `term` | string | Term to research |

Source:

* [script.js](../../../../src/main/webapp/widget/gazetteer/script.js), [line 168](../../../../src/main/webapp/widget/gazetteer/script.js#L168)

## (static) searchLayersForVocab(searchBoth)

Makes a search of portrayable layers

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `searchBoth` | *   | Must search on both geosciml and erml ? |

Source:

* [script.js](../../../../src/main/webapp/widget/gazetteer/script.js), [line 719](../../../../src/main/webapp/widget/gazetteer/script.js#L719)

## (static) searchPortrayable(term)

Make research in vocabularies if allowed

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `term` | string | Term to research |

Source:

* [script.js](../../../../src/main/webapp/widget/gazetteer/script.js), [line 202](../../../../src/main/webapp/widget/gazetteer/script.js#L202)

## (static) searchSpecificLocations(term)

Make research in specific location if allowed

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `term` | string | Term to research |

Source:

* [script.js](../../../../src/main/webapp/widget/gazetteer/script.js), [line 147](../../../../src/main/webapp/widget/gazetteer/script.js#L147)

## (static) searchTermInVocabularies(term, vocabularies, parentName)

(Recursive) Return vocabularies that match term from the given list

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `term` | string | Term to search |
| `vocabularies` | Array.&lt;any&gt; | List of nested vocabularies |
| `parentName` | string | (optional) Label of the parent vocabulary |

Source:

* [script.js](../../../../src/main/webapp/widget/gazetteer/script.js), [line 290](../../../../src/main/webapp/widget/gazetteer/script.js#L290)

## (static) searchThematics(term)

Make research in thematics if allowed

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `term` | string | Term to research |

Source:

* [script.js](../../../../src/main/webapp/widget/gazetteer/script.js), [line 321](../../../../src/main/webapp/widget/gazetteer/script.js#L321)

## (static) showResult(layername)

Renders search result HTML

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layername` | string | Layer to directly open instead of show results |

Source:

* [script.js](../../../../src/main/webapp/widget/gazetteer/script.js), [line 457](../../../../src/main/webapp/widget/gazetteer/script.js#L457)

## (static) sortResultsWithTerm(results, term)

Sorts results, beginning with results that starts with term

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `results` | Array.&lt;any&gt; | Results to sort |
| `term` | string | Term to check |

Source:

* [script.js](../../../../src/main/webapp/widget/gazetteer/script.js), [line 135](../../../../src/main/webapp/widget/gazetteer/script.js#L135)

## (static) toggleShowAllResults()

Displays or not all the results

Source:

* [script.js](../../../../src/main/webapp/widget/gazetteer/script.js), [line 631](../../../../src/main/webapp/widget/gazetteer/script.js#L631)

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

Documentation generated by [JSDoc 3.6.7](https://github.com/jsdoc/jsdoc) on Thu Dec 23 2021 15:45:34 GMT+0100 (heure normale d’Europe centrale)

Converted from HTML by [convert-simple.com](https://www.convertsimple.com/convert-html-to-markdown/)