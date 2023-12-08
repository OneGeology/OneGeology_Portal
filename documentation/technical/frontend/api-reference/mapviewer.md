 JSDoc: Class: mapviewer 

Class: mapviewer
================

# mapviewer()

app core & bootstrap

Source:

- [mapviewer.js](../../../../src/main/webapp/js/mapviewer.js), [line 5](../../../../src/main/webapp/js/mapviewer.js#L5)

# Members

## (static) config :JSON

Configuration file contents parsed in JSON type

### Type:

* JSON

Source:

- [mapviewer.js](../../../../src/main/webapp/js/mapviewer.js), [line 24](../../../../src/main/webapp/js/mapviewer.js#L24)

## (static) CONFIG_FILE :string

Configuration file path

### Type:

* string

Source:

- [mapviewer.js](../../../../src/main/webapp/js/mapviewer.js), [line 17](../../../../src/main/webapp/js/mapviewer.js#L17)

## (static) urlParams :JSON

Params from url

### Type:

* JSON

Source:

- [mapviewer.js](../../../../src/main/webapp/js/mapviewer.js), [line 36](../../../../src/main/webapp/js/mapviewer.js#L36)

## (static) WIDGET\_CONFIG\_FILE :string

Widget configuration file path

### Type:

* string

Source:

- [mapviewer.js](../../../../src/main/webapp/js/mapviewer.js), [line 11](../../../../src/main/webapp/js/mapviewer.js#L11)

## (static) widgets :JSON

Configuration widget file contents parsed in JSON type

### Type:

* JSON

Source:

- [mapviewer.js](../../../../src/main/webapp/js/mapviewer.js), [line 30](../../../../src/main/webapp/js/mapviewer.js#L30)

# Methods

## (static) addCSSFile(fileURL)

Adds given css file to the document's head

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `fileURL` | string | url of the css source to add |

Source:

- [mapviewer.js](../../../../src/main/webapp/js/mapviewer.js), [line 469](../../../../src/main/webapp/js/mapviewer.js#L469)

## (static) addEvents()

Creates global app listeners

Source:

- [mapviewer.js](../../../../src/main/webapp/js/mapviewer.js), [line 280](../../../../src/main/webapp/js/mapviewer.js#L280)

## (static) addJSFile(fileURL)

Adds given js file at the end of document's body

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `fileURL` | string | url of the js source to add |

Source:

- [mapviewer.js](../../../../src/main/webapp/js/mapviewer.js), [line 460](../../../../src/main/webapp/js/mapviewer.js#L460)

## (static) applyConfig()

Removes disabled modules from configuration and launch generations about configuration

Source:

- [mapviewer.js](../../../../src/main/webapp/js/mapviewer.js), [line 135](../../../../src/main/webapp/js/mapviewer.js#L135)

## (static) configureProjections()

Configures projections from configuration in OpenLayers

Source:

- [mapviewer.js](../../../../src/main/webapp/js/mapviewer.js), [line 257](../../../../src/main/webapp/js/mapviewer.js#L257)

## (static) generateLayerSelector()

Generates the background layer dropdown content with the configuration's bgLayers

Source:

- [mapviewer.js](../../../../src/main/webapp/js/mapviewer.js), [line 196](../../../../src/main/webapp/js/mapviewer.js#L196)

## (static) generateScaleSelector()

Generates the scales selector content

Source:

- [mapviewer.js](../../../../src/main/webapp/js/mapviewer.js), [line 241](../../../../src/main/webapp/js/mapviewer.js#L241)

## (static) generateSRSSelector()

Generates the SRS dropdown content with the configuration's projections

Source:

- [mapviewer.js](../../../../src/main/webapp/js/mapviewer.js), [line 218](../../../../src/main/webapp/js/mapviewer.js#L218)

## (static) getConfig() → {Promise}

Retrieve configuration file and complete it

Source:

- [mapviewer.js](../../../../src/main/webapp/js/mapviewer.js), [line 88](../../../../src/main/webapp/js/mapviewer.js#L88)

### Returns:

ajax promise

Type

Promise

## (static) init()

Mapviewer initialization function

Source:

- [mapviewer.js](../../../../src/main/webapp/js/mapviewer.js), [line 41](../../../../src/main/webapp/js/mapviewer.js#L41)

## (static) load(url) → {string}

Gets url content synchronously

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `url` | string | url where get content |

Source:

- [mapviewer.js](../../../../src/main/webapp/js/mapviewer.js), [line 415](../../../../src/main/webapp/js/mapviewer.js#L415)

### Returns:

Type

string

## (static) loadLocalization(lang) → {Promise}

Loads localization file

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `lang` | string | (optional) language to use |

Source:

- [mapviewer.js](../../../../src/main/webapp/js/mapviewer.js), [line 428](../../../../src/main/webapp/js/mapviewer.js#L428)

### Returns:

Type

Promise

## (static) parseUrlParams()

Parses url params into a configuration object

Source:

- [mapviewer.js](../../../../src/main/webapp/js/mapviewer.js), [line 110](../../../../src/main/webapp/js/mapviewer.js#L110)

## (static) sortProperties(obj) → {Array.&lt;Array&gt;}

Converts object to an array of key-value pairs sorted by key

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `obj` | Object | : object to convert |

Source:

- [mapviewer.js](../../../../src/main/webapp/js/mapviewer.js), [line 499](../../../../src/main/webapp/js/mapviewer.js#L499)

### Returns:

Type

Array.&lt;Array&gt;

## (static) stringToFunction(str) → {string}

Gets a function by its name

### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `str` | string | function name |

Source:

- [mapviewer.js](../../../../src/main/webapp/js/mapviewer.js), [line 479](../../../../src/main/webapp/js/mapviewer.js#L479)

### Returns:

Type

string

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

Documentation generated by [JSDoc 3.6.7](https://github.com/jsdoc/jsdoc) on Thu Dec 23 2021 14:58:48 GMT+0100 (heure normale d’Europe centrale)

Converted from HTML by [convert-simple.com](https://www.convertsimple.com/convert-html-to-markdown/)