 JSDoc: Class: tools 

Class: tools
============

[mapviewer](mapviewer.md).tools()
-----------------------------------

# tools()

Common tools for the portal

Source:

- [mapviewer.tools.js](../../../../src/main/webapp/js/mapviewer.tools.js), [line 5](../../../../src/main/webapp/js/mapviewer.tools.js#L5)

# Methods

## (static) decodeHTMLEntitites(html) → {string}

Removes all HTML entities. Recursive if decoding give other entities

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `html` | string | text to decode |

Source:

- [mapviewer.tools.js](../../../../src/main/webapp/js/mapviewer.tools.js), [line 555](../../../../src/main/webapp/js/mapviewer.tools.js#L555)

### Returns:

Type

string

## (static) getCapabilities(url, serviceType, wmsVersion, wcsLayername) → {jQuery.Deferred}

Does given layer GetCapabilites, update infos in layerswitcher and parses result in JSON type

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `url` | string | url where do GetCapabilities |
| `serviceType` | string | service type (WMS, WCS, etc) |
| `wmsVersion` | string | WMS query version |
| `wcsLayername` | string | WCS layername to retrieve DescribeCoverage |

Source:

- [mapviewer.tools.js](../../../../src/main/webapp/js/mapviewer.tools.js), [line 17](../../../../src/main/webapp/js/mapviewer.tools.js#L17)

### Returns:

Type

jQuery.Deferred

## (static) getFieldValue(object, fieldName) → {string}

(Recursive) Returns field value with depth management

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `object` | any | Object from which get the value |
| `fieldName` | string | Field name to retrieve (ex: 'label', 'lithology.label') |

Source:

- [mapviewer.tools.js](../../../../src/main/webapp/js/mapviewer.tools.js), [line 727](../../../../src/main/webapp/js/mapviewer.tools.js#L727)

### Returns:

Type

string

## (static) getImage(url)

Get image data from url, using proxy

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `url` | string |     |

Source:

- [mapviewer.tools.js](../../../../src/main/webapp/js/mapviewer.tools.js), [line 575](../../../../src/main/webapp/js/mapviewer.tools.js#L575)

### Returns:

Promise with dataurl

## (static) getLayerCapabilities(LayerList, layerName) → {Object|Null}

Gets a precise layer in service GetCapabilities return

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `LayerList` | Array.&lt;Object&gt; | layer list form GetCapabilities Layer/sublayers |
| `layerName` | string | layer name in geoserver |

Source:

- [mapviewer.tools.js](../../../../src/main/webapp/js/mapviewer.tools.js), [line 458](../../../../src/main/webapp/js/mapviewer.tools.js#L458)

### Returns:

Type

Object | Null

## (static) getPropertyValues(layer, propertyName)

Gets all values possibilities of a feature type

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | *   | WFS layer data |
| `propertyName` | string | Feature type name |

Source:

- [mapviewer.tools.js](../../../../src/main/webapp/js/mapviewer.tools.js), [line 239](../../../../src/main/webapp/js/mapviewer.tools.js#L239)

## (static) getWfsFeatures(layer, filters)

Gets WFS features from filters

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | any | Layer to filter |
| `filters` | Array.&lt;any&gt; | Filters to apply |

Source:

- [mapviewer.tools.js](../../../../src/main/webapp/js/mapviewer.tools.js), [line 310](../../../../src/main/webapp/js/mapviewer.tools.js#L310)

## (static) getWFSFeatureType(layer)

Gets parameters of a WFS layer

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layer` | *   | WFS layer data |

Source:

- [mapviewer.tools.js](../../../../src/main/webapp/js/mapviewer.tools.js), [line 170](../../../../src/main/webapp/js/mapviewer.tools.js#L170)

## (static) hexToRgb(hex)

Converts hexa color to rgb

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `hex` | string | Hexa color code |

Source:

- [mapviewer.tools.js](../../../../src/main/webapp/js/mapviewer.tools.js), [line 685](../../../../src/main/webapp/js/mapviewer.tools.js#L685)

## (static) isUrl(text) → {boolean}

Checks if the string is an url

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `text` | string |     |

Source:

- [mapviewer.tools.js](../../../../src/main/webapp/js/mapviewer.tools.js), [line 673](../../../../src/main/webapp/js/mapviewer.tools.js#L673)

### Returns:

Type

boolean

## (static) parseCapabilitiesKeywords(keywordList) → {Object}

Parses keywords from 'key@value' to {key: value}

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `keywordList` | Object | original GetCapabilities keyword list |

Source:

- [mapviewer.tools.js](../../../../src/main/webapp/js/mapviewer.tools.js), [line 519](../../../../src/main/webapp/js/mapviewer.tools.js#L519)

### Returns:

Type

Object

## (static) parseXML(xml, parseAttributes) → {JSON}

Parses XML object to Json

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `xml` | XML |     |
| `parseAttributes` | any | Faut-il parser les attributs ? |

Source:

- [mapviewer.tools.js](../../../../src/main/webapp/js/mapviewer.tools.js), [line 390](../../../../src/main/webapp/js/mapviewer.tools.js#L390)

### Returns:

Type

JSON

## (static) parseXMLAttributes(node) → {any}

Parses XML Node attributes

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `node` | *   | XML node which parse attributes |

Source:

- [mapviewer.tools.js](../../../../src/main/webapp/js/mapviewer.tools.js), [line 433](../../../../src/main/webapp/js/mapviewer.tools.js#L433)

### Returns:

Type

any

## (static) searchInList(list, fieldName, searchText) → {Array.&lt;any&gt;}

Filters the list with given text, priorizing pertinent results

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `list` | Array.&lt;any&gt; | List to filter |
| `fieldName` | string | Field used to priorize (send "" if list of string data) |
| `searchText` | string | Text used to filter and priorize |

Source:

- [mapviewer.tools.js](../../../../src/main/webapp/js/mapviewer.tools.js), [line 710](../../../../src/main/webapp/js/mapviewer.tools.js#L710)

### Returns:

Type

Array.&lt;any&gt;

## (static) searchKeyword(keywords, keywordName) → {Array|Null}

Searches a keyword in layer keywords from partial text and return it as key-value pair

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `keywords` | Array.&lt;any&gt; | layer keywords object |
| `keywordName` | string | partial searched keyword name |

Source:

- [mapviewer.tools.js](../../../../src/main/webapp/js/mapviewer.tools.js), [line 538](../../../../src/main/webapp/js/mapviewer.tools.js#L538)

### Returns:

Type

Array | Null

## (static) sortByPertinence(list, fieldName, searchText) → {Array.&lt;any&gt;}

Sort a list priorizing those which begins by the search text

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `list` | Array.&lt;any&gt; | List to sort |
| `fieldName` | string | Field name used to sort (send "" if it's string list) |
| `searchText` | string | Text used to priorize the sorting |

Source:

- [mapviewer.tools.js](../../../../src/main/webapp/js/mapviewer.tools.js), [line 762](../../../../src/main/webapp/js/mapviewer.tools.js#L762)

### Returns:

Type

Array.&lt;any&gt;

## (static) stripCaseAndAccents(value) → {string}

Replace all special letters with its simple letters

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `value` | string | Text to transform |

Source:

- [mapviewer.tools.js](../../../../src/main/webapp/js/mapviewer.tools.js), [line 748](../../../../src/main/webapp/js/mapviewer.tools.js#L748)

### Returns:

Type

string

## (static) updateAllLayersTitles(layerList)

(Recursive) Rename all layer capabilities for portrayal

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `layerList` | Array.&lt;any&gt; |     |

Source:

- [mapviewer.tools.js](../../../../src/main/webapp/js/mapviewer.tools.js), [line 365](../../../../src/main/webapp/js/mapviewer.tools.js#L365)

## (static) validateWMSUrl(url) → {Promise}

Calls the url validator

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `url` | string |     |

Source:

- [mapviewer.tools.js](../../../../src/main/webapp/js/mapviewer.tools.js), [line 613](../../../../src/main/webapp/js/mapviewer.tools.js#L613)

### Returns:

Type

Promise

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