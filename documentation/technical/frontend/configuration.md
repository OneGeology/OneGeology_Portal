# Configuration

## Summary

- [Application configuration](#application-configuration)
  - [Analytics](#analytics)
  - [Map configuration](#map-configuration)
    - [Background layers](#background-layers)
    - [Catalog configuration](#catalog-configuration)
    - [Projections](#projections)
    - [Gazetteer](#gazetteer)
    - [Tools](#tools)
- [Url params](#url-params)
- [Catalog](#catalog)

## Application configuration

Most of the application's features are driven by a configuration JSON which enables tools, configures the map, defines languages and so on.

OneGeology uses the file [conf.json](../../../src/main/webapp/conf/conf.json), but you can create another JSON file for your own application. The file loaded is defined in [mapviewer.js](../../../src/main/webapp/js/mapviewer.js#L16).

### General configuration

    "lang": "en",
    "appName": "OneGeology Portal",
    "logo": {
      "imgUrl": null,
      "imgAlt": "One Geology",
      "url": null,
      "linkTitle": "Go to OneGeology website",
      "favicon": null
    }

The first part of the file is the general configuration: 
- **lang:** the language of the application. Currently supported: en and fr.
- **appName:** the title of your navigator tab.
- **logo:**
  - **imgUrl:** Url of your logo image (relative path begins from webapp folder).
    - if null, use `images/header/baniere2.png`.
  - **imgAlt:** Alternative text for your logo.
  - **url:** Url for the logo hyperlink.
  - **linkTitle:** Title of the logo hyperlink.
  - **favicon:** Relative path to your favicon.

### Analytics

    "piwik": {
      "url": "wwwstats.brgm-rec.fr",
      "appId": 9
    },
    "googleAnalytics": {
      "trackerId": "G-HX7HVK2D9R"
    }

This parts defines the trackers configurations. Currently supports [Matomo](https://fr.matomo.org/) (former piwik) and [Google Analytics](https://analytics.google.com/)

- **piwik:** Matomo configuration.
  - **url:** Url for tracking.
  - **appId:** ID used by Matomo as identifier
- googleAnalytics.
  - **trackerId:** Your GA identifier to tracking.

### Map configuration

The main part of the configuration file defines how your map is displayed, from background layers to various tools to manipulated map data.

#### Background layers

    "bgLayers": [
      {
        "name": "world1GG",
        "label": "OneGeology",
        "url": "http://mapsref.brgm.fr/wxs/1GG/monde1GG?",
        "type": "WMS",
        "visibleInSelector": true,
        "params": {
          "LAYERS": "MONDE_ONEGEOLOGY_PROJECT",
          "VERSION": "1.1.1"
        }
      },
      {
        "name": "worldOSM",
        "label": "OpenStreetMap",
        "url": "//{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "type": "OSM",
        "visibleInSelector": true
      }
    ],

This part defines all the background layers which are available in your application. It doesn't matter if some are not meant to be displayed out of certain projection context, this is configured later.

- **WFS layers:**
  - **name:** name of your layer, must be unique in the list.
  - **label:** Display name of your layer in the background selector.
  - **url:** Url of the WFS service.
  - **type:** "WMS" there.
  - **visibleInSelector:** true if you want the layer displays in background selector, false otherwise.
  - **params:** raw parameters injected in WMS call:
    - **LAYERS:** comma separated layers name of the geoserver WMS service.
    - **VERSION:** WMS service version used (1.1.1 and 1.3.0 supported).
- **OpenStreetMap layers:**
  - **name:** Same as WMS.
  - **label:** Same as WMS.
  - **url:** Url of OSM map, without http or https starter.
  - **type:** "OSM" there.
  - **visibleInSelector:** same as WMS.

#### Catalog configuration

    "catalog": {
      "type": "geonetwork",
      "enableTabs": true,
      "url": "http://onegeology-geonetwork.brgm.fr/geonetwork3/srv/fre/csw",
      "thematicSrcUrl": "http://onegeology-europe.brgm.fr/eXist/rest//db/1GG_client_registry/thematic_keywords_sauv.xml",
      "content": []
    }

This part configures your catalog of layers, which are avalable in a list in the "+Add" tab in Datasets, and allows the user to search some layers in the catalog and add them to the map.

- **type:** must be "geonetwork" or "json".
  - "geonetwork" use XML requests to get a distant catalog.
  - "json" use JSON and js requests to get a [local catalog](#catalog).
- **enableTabs:** set to true if you want to display the tree view and the thematic view of your catalog. If false, only the tree view will be displayed.
- **url:** Url to your geonetwork service or your JSON file.
- **thematicsUrl:** Url to your XML file which references your thematics
- **content:** only initialised as an empty array, will be filled by the application.

#### Projections

    "projections": [
      {
        "code": "EPSG:2154",
        "label": "RGF93 / Lambert-93 -- France",
        "initialZoom": 2.75,
        "defaultBgLayer": "worldOSM",
        "proj4def": "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
        "homeExtent": [
          -378305.81,
          6093283.21,
          1212610.74,
          7186901.68
        ]
      },
      {
        "code": "EPSG:27572",
        "label": "Lambert 2 etendu",
        "initialZoom": 2.75,
        "defaultBgLayer": "worldOSM",
        "proj4def": "+proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=0 +k_0=0.99987742 +x_0=600000 +y_0=2200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs",
        "homeExtent": [
          5168.43,
          1730142.53,
          1013247.20,
          2698564.20
        ]
      }
    ],
    "defaultProjection": "EPSG:4326",
    "initialExtent": null,

There you define all the available projections of the map, which will be available in the projection selector.

- projections:
  - **code:** Usual EPSG code of the projection.
  - **label:** Name of the projection used in the projection selector.
  - **initialZoom:** OpenLayers zoom initial level when switching to this projection. 1 is world view, 26 is millimeter view.
  - **defaultBgLayer:** name of the background layers which must be automatically displayed when switching to this projection. It can be a layer which is not displayed in the background selector.
  - **proj4def:** Except for EPSG:4326 and EPSG:3857, you must define the projection definition to support it in the application. See <https://epsg.io>. The definition is in the PROJ.4 tab.
  - **homeExtent:** Defines an "home" extent which the application zooms when home button is pressed.
- **defaultProjection:** projection code of the initial projection at launch.
- **initialExtent:** extent to zoom the map at launch. Must be expressed in the default projection. Set to null to do nothing.

#### Gazetteer

    "gazetteer": {
      "enableGeonames": true,
      "geonamesRestrictions": null,
      "apiIdentifier": "onegeology",
      "enableAddLayer": true,
      "enablePortrayable": true,
      "enableThematics": true,
      "enableSpecificLocations": false,
      "specificLocations": [
        {
          "label": "France métropolitaine",
          "extent": [
            -911129.3772,
            5269874.4781,
            1416225.2601,
            6390135.5646
          ]
        }
      ]
    },

Defines all features of the gazetteer field.

- **enableGeonames:** true to enable location search through [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org).
- **geonamesRestrictions:** array of strings for [country limitation](https://nominatim.org/release-docs/develop/api/Search/#result-limitation) of Nominatim.
- **apiIdentifier:** Nominatim API Identifier.
- **enableAddLayer:** Allows the gazetteer to search in catalog et add layers through its results.
- **enablePortrayable:** Allows the gazetteer to search in the vocabularies for portrayable layers.
- **enableThematics:** Allows the gazetteer to search in the thematics list.
- **enableSpecificLocations:** Enables the specific locations search feature.
- **specificLocations:** list of the specific location for quicksearch.
  - **label:** Name of the location, used for search.
  - **extent:** Extent of the location, defined in the application default projection.

#### Tools

    "layersOptions": {
      "thematic": false
    },
    "tools": {
      "wfsLayers": {
        "enable": true
      },
      "advancedSearch": {
        "enable": true
      },
      "autolayers": {
        "enable": true,
        "url": "http://onegeology-europe.brgm.fr/eXist/rest//db//1GG_client_registry/AutoLayer.xml"
      },
      "measure": {
        "enable": true
      },
      "saveView": {
        "enable": true
      },
      "catalogLink": {
        "enable": true,
        "url": "http://onegeology-geonetwork.brgm.fr/geonetwork3/srv/eng/catalog.search#/home"
      },
      "globeView": {
        "enable": true
      },
      "legendPanel": {
        "enable": true
      },
      "export": {
        "enable": true
      },
      "urlGenerator": {
        "enable": true
      },
      "scalesZoom": {
        "enable": true,
        "scales": [
          100000000,
          50000000,
          10000000,
          500000,
          100000,
          50000,
          1000
        ]
      },
      "help": {
        "enable": true,
        "quickHelp": true,
        "wmsValidator": true,
        "contact": {
          "mail": "onegeology@bgs.ac.uk"
        },
        "survey": {
          "enable": true,
          "text": "Please take a moment to complete a short survey about the OneGeology Portal:",
          "alertText": "Your opinion matters to us, give us your feedback!",
          "url": "https://docs.google.com/forms/d/e/1FAIpQLSdMmYDJLgpCpILz4POrmGDHuRNKuQo3I-rJMTNdpshDLJ7MuQ/viewform"
        },
        "links": [
          {
            "url": "https://github.com/OneGeology/OneGeology_Portal/wiki/Changelogs",
            "label": "Portal v2020.0.1 - see changelog"
          },
          {
            "url": "http://www.geoportal.org",
            "label": "GEOSS Discovery and Access Broker"
          },
          {
            "url": "http://www.onegeology.org",
            "label": "OneGeology website"
          },
          {
            "url": "https://onegeology.github.io/documentation/portal.html",
            "label": "Go to documentation",
            "type": "button"
          }
        ]
      }
    }

This parts enables/disables and configure the various available tools for the user. They all must exist, event if you disable it.

- **layersOptions:**
  - **thematic:** Enables grouping layers by thematic in the layer switcher.
- **tools:**
  - **wfsLayers:** set "enable" to true to enable the WFS features (configurable layers).
  - **advancedSearch:** set "enable" to true to enable the advanced search in the catalog tab.
  - **autolayers:**
    - **enable:** true to enable automatic layers.
    - **url:** url to the xml which defines automatic layers.
  - **measure:** set "enable" to true to enable length and area measurement tools.
  - **saveView:** set "enable" to true to enable the map export tools.
  - **catalogLink:**
    - **enable:** true to display the catalog link in the sidebar
    - **url:** url to the catalog.
  - **globeView:** set "enable" to true to display the globe view button.
  - **legendPanel:** set "enable" to true to display the legend panel paired with the layer switcher.
  - **export:** set "enable" to true to allow PDF export from "Save View".
  - **urlGenerator:** set "enable" to true to enable the url generator tools, used to [preconfigure the application with url parameters](#url-params).
  - **scalesZoom:**
    - **enable:** true to display the scales selector.
    - **scales:** list of the scales to display, in descending order.
  - **help:**
    - **enable:** true to enable the help panel.
    - **quickHelp:** true to allow the quick help overlay to display once at launch.
    - **wmsValidator:** true to enable the WMS validator tab, used to ensure that a WMS service is online and works.
    - **contact:**
      - **email:** Contact email.
    - **survey:** OneGeology specific option, set enable to false for your own application.
    - **links:** List of hyperlinks to display in help panel.
      - **url:** Url of the hyperlink.
      - **label:** Label to display in hyperlink text.
      - **type:** (optionnal) set to "button" to display the link as a button.

## Url params

OneGeology allows some url parameters to alterate its configuration at startup. These parameters overwrite the JSON configuration startup options, such as initialExtent or initalZoom.

An url with these parameters can be generated in the urlGenerator tool.

- **Configuration overwrites:**
  - **id:** name of another JSON configuration file (without the .json extension) hosted by your server. Must be under "conf" folder. `(e.g. conf_geothermie)`
  - **autolayer:** set it to false to check off autolayers toggle.
  - **al:** used to overwrite the autolayers url defined in conf.json
  - **extent:** comma-separated extent coordinates, to overwrite .configuration initialExtent and initialZoom. Must be expressed in default projection.
- **Autosearch/autoload:**
  - **serviceUrl:** filled with a geoserver service url to automatically interrogate it and display a choice of layers in the gazetteer.
  - **serviceType:** must be paired with serviceUrl, types are WMS or WFS to display a list of layers, or WMC to load a map context directly in the map.
  - **layername:** paired with serviceUrl and serviceType, if filled with a layer name, override the layer list display to automatically add the layer to the map.
  - **forceLoad:** paired with the 3 previous parameters when serviceType is WFS. If filled, it forces the WFS layers newly added to display without configuration parameters (may be heavy for the navigator).

## Catalog

If you have configured your catalog to "json" in the configuration file, you'll need to use a JSON file which contains all the layers configurations of your catalog. This file is linked with the catalog "url" parameter.

The JSON catalog contains a list of layers configured as this: 

    [
      {
        "id": "169",
        "title": "Tests de réponse thermique (TRT)",
        "layerName": "TRT",
        "serviceUrl": "http://mapsrefrec.brgm.fr/wxs/geothermie/testsReponseThermique?",
        "description": "",
        "version": "1.3.0",
        "continent": "Géothermie de surface (≤ 200 m)",
        "subcontinent": "Ressource",
        "geographicarea": "France métropolitaine",
        "extent": "-5.75536996406659895,41.1136709181028124,11.1290586799048956,51.0605517872376993",
        "portrayal": false,
        "geosciml": false,
        "serviceWfsUrl": null,
        "serviceWfsUrlType": null,
        "thematicKwList": [
          "Ressources"
        ]
      },
      {...}
    ]

- **id:** Unique id of the layer in the list.
- **title:** name to be displayed in layer switcher.
- **layername:** name of the layer in its geoserver service.
- **serviceUrl:** url to the geoserver service.
- **description:** (optionnal) short description of the layer.
- **version:** version of the geoserver service.
- **continent:** (historical naming) top category of the layer, used for tree view.
- **subcontinent:** (historical naming) second top category of the layer, used for tree view.
- **geographicarea:** (historical naming) direct parent category of the layer, used for tree view.
- **extent:** comma-separated extent coordinates of the layers, expressed in **EPSG:**4326 projection.
- **portrayal:** set to true if the layer supports portrayal configuration. Enables analytics tab for the layer.
- **geosciml:** set to true if the layer supports portrayal configuration with GeoSciMl standard.
- **serviceWfsUrl:** set only if the layers has a WFS counterpart.
- **serviceWfsType:** url to WFS GetCapabilities.
- **thematicKwList:** list of keywords related to the thematics, if you use thematics grouping of the layers.