/**
 * Common tools for the portal
 * @constructor
 */
mapviewer.tools = {

  getCapabilitiesCache: {},

  /**
   * Does given layer GetCapabilites, update infos in layerswitcher and parses result in JSON type
   * @param {string} url - url where do GetCapabilities
   * @param {string} serviceType - service type (WMS, WCS, etc)
   * @param {string} wmsVersion - WMS query version
   * @param {string} wcsLayername - WCS layername to retrieve DescribeCoverage
   * @return {jQuery.Deferred}
   */
  getCapabilities: function (url, serviceType, wmsVersion, wcsLayername) {
    if (!wmsVersion) {
      wmsVersion = "1.3.0";
    }
    var defer = $.Deferred();
    var format;
    if (!serviceType) {
      serviceType = "WMS";
    }
    switch (serviceType.toLowerCase()) {
      case 'wms':
        format = new ol.format.WMSCapabilities({
          version: wmsVersion
        });
        break;
      case 'wmts':
        format = new ol.format.WMTSCapabilities()
        break;
      case 'wfs':
        format = new ol.format.WFS();
        break;
    }

    if (url.indexOf("?") === -1) {
      url = url + "?";
    }
    if (url.toLowerCase().indexOf("service=") === -1) {
      url = url + "service=" + serviceType + "&";
    }
    if (url.toLowerCase().indexOf("request=") === -1) {
      url = url + "request=GetCapabilities&";
    }
    if (url.toLowerCase().indexOf("version=") === -1) {
      if (serviceType === "WCS") {
        url = url + "version=2.0.1&";
      } else if (serviceType === "WMS") {
        url = url + "version=1.3.0&";
      }
    }

    if (!mapviewer.tools.getCapabilitiesCache[url]) {
      mapviewer.tools.getCapabilitiesCache[url] = $.ajax({
        type: 'GET',
        url: "proxyxml?url=" + encodeURIComponent(url),
        dataType: "text",
        timeout: 60000
      });
    }

    mapviewer.tools.getCapabilitiesCache[url]
      .done(function (result) {
        var capabilities;
        try {
          if (window.DOMParser) {
            var parser = new DOMParser();
            result = parser.parseFromString(result, "text/xml");
          } else { // Internet Explorer
            var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(result);
            result = xmlDoc;
          }
          if (serviceType == "WCS" || serviceType == "WFS") {
            capabilities = mapviewer.tools.parseXML(result.documentElement);
            if (serviceType === "WFS") {
              if (capabilities && capabilities.FeatureTypeList && capabilities.FeatureTypeList.FeatureType && !_.isArray(capabilities.FeatureTypeList.FeatureType)) {
                capabilities.FeatureTypeList.FeatureType = [capabilities.FeatureTypeList.FeatureType];
              }
            }
          } else {
            capabilities = format.read(result);
            if (serviceType === "WMS") {
              if (!capabilities.Capability.Layer.Layer) {
                capabilities.Capability.Layer.Layer = [Object.assign({}, capabilities.Capability.Layer)];
              }
              mapviewer.tools.updateAllLayersTitles(capabilities.Capability.Layer.Layer);
            }
          }
        } catch (e) {
          defer.reject(e);
        }
        if (capabilities) {
          if (serviceType === 'WCS' && wcsLayername) {
            mapviewer.tools.getWCSCoverageDescription({ url: url, layername: wcsLayername })
              .done(function (descResult) {
                capabilities.DescribeCoverage = descResult;
                defer.resolve(capabilities);
              })
              .fail(function () {
                defer.resolve(capabilities);
              });
          } else if (serviceType === 'WMS') {
            mapviewer.tools.getCapabilities(url.split('?')[0], 'WFS')
              .done(function (r) {
                if (r && r.FeatureTypeList && r.FeatureTypeList.FeatureType && r.FeatureTypeList.FeatureType.length > 0) {
                  capabilities.downloadFeatureUrl = url.split('?')[0] + '?request=GetCapabilities&service=WFS';
                } else {
                  capabilities.downloadFeatureUrl = false;
                }
                defer.resolve(capabilities);
              })
              .fail(function (e) {
                capabilities.downloadFeatureUrl = false;
                defer.resolve(capabilities);
              });
          } else {
            defer.resolve(capabilities);
          }
        }
      })
      .fail(function (e) {
        mapviewer.tools.getCapabilitiesCache[url] = null;
        defer.reject(e);
      });

    return defer;
  },

  getWCSCoverageDescription: function (layer) {
    var defer = $.Deferred();
    var url = layer.url.split('?')[0];
    url += "?service=WCS&request=DescribeCoverage&version=2.0.1&CoverageId=" + layer.layername.replace(':', '__');

    if (!mapviewer.tools.getCapabilitiesCache[url]) {
      mapviewer.tools.getCapabilitiesCache[url] = $.ajax({
        type: 'GET',
        url: "proxyxml?url=" + encodeURIComponent(url),
        dataType: "text"
      });
    }

    mapviewer.tools.getCapabilitiesCache[url]
      .done(function (result) {
        var description;
        try {
          if (window.DOMParser) {
            var parser = new DOMParser();
            result = parser.parseFromString(result, "text/xml");
          } else { // Internet Explorer
            var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(result);
            result = xmlDoc;
          }
          description = mapviewer.tools.parseXML(result.documentElement, { Envelope: true });
          defer.resolve(description);
        } catch (e) {
          console.error(e);
          defer.reject(e);
        }
      })
      .fail(function (e) {
        mapviewer.tools.getCapabilitiesCache[url] = null;
        defer.reject(e);
      });

    return defer;
  },

  /**
   * Gets parameters of a WFS layer
   * @param {*} layer WFS layer data
   */
  getWFSFeatureType: function (layer) {
    var defer = $.Deferred();
    var url = layer.url.split('?')[0];
    url += "?service=WFS&request=DescribeFeatureType&version=" + layer.sourceParams.version;
    url += "&TYPENAMES=" + layer.name;

    if (!mapviewer.tools.getCapabilitiesCache[url]) {
      mapviewer.tools.getCapabilitiesCache[url] = $.ajax({
        type: 'GET',
        url: "proxyxml?url=" + encodeURIComponent(url),
        dataType: "text"
      });
    }

    mapviewer.tools.getCapabilitiesCache[url]
      .done(function (result) {
        var featureType;
        try {
          if (window.DOMParser) {
            var parser = new DOMParser();
            result = parser.parseFromString(result, "text/xml");
          } else { // Internet Explorer
            var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(result);
            result = xmlDoc;
          }
          featureType = mapviewer.tools.parseXML(result.documentElement, { element: true });
        } catch (e) {
          console.error(e);
          defer.reject(e);
        }
        if (featureType && featureType.complexType) {
          // fix non array to array
          if (!_.isArray(featureType.complexType.complexContent.extension.sequence.element)) {
            featureType.complexType.complexContent.extension.sequence.element = [featureType.complexType.complexContent.extension.sequence.element];
          }
          var parameters = [];
          _.each(featureType.complexType.complexContent.extension.sequence.element, function (el) {
            el.attributes.type = el.attributes.type.replace('xsd:', '');
            if (["string", "int", "date", "boolean", "decimal", "dateTime", "double", "long"].indexOf(el.attributes.type) >= 0) {
              parameters.push({
                name: el.attributes.name,
                type: el.attributes.type
              });
            }
          });
          if (parameters.length === 0) {
            defer.reject({ error: 'WFS service unavailable' });
          } else {
            defer.resolve(_.sortBy(parameters, 'name'));
          }
        } else if (featureType) {
          defer.reject({ error: 'WFS service unavailable' });
        }
      })
      .fail(function (e) {
        mapviewer.tools.getCapabilitiesCache[url] = null;
        defer.reject(e);
      });

    return defer;
  },

  /**
   * Gets all values possibilities of a feature type
   * @param {*} layer WFS layer data
   * @param {string} propertyName Feature type name
   */
  getPropertyValues: function (layer, propertyName) {
    var defer = $.Deferred();
    var url = layer.url.split('?')[0];
    url += "?service=WFS&request=GetPropertyValue&version=" + layer.sourceParams.version;
    url += "&TYPENAMES=" + layer.name;
    url += "&VALUEREFERENCE=" + propertyName;

    if (mapviewer.tools.getCapabilitiesCache[url]) {
      defer.resolve(mapviewer.tools.getCapabilitiesCache[url]);
    } else {
      $.ajax({
        type: 'GET',
        url: "proxyxml?url=" + encodeURIComponent(url),
        dataType: "text"
      })
        .done(function (result) {
          var valuesResult;
          try {
            if (window.DOMParser) {
              var parser = new DOMParser();
              result = parser.parseFromString(result, "text/xml");
            } else { // Internet Explorer
              var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
              xmlDoc.async = false;
              xmlDoc.loadXML(result);
              result = xmlDoc;
            }
            valuesResult = mapviewer.tools.parseXML(result.documentElement);
          } catch (e) {
            console.error(e);
            defer.reject(e);
          }
          if (valuesResult) {
            var values = [];
            if (!_.isArray(valuesResult.member)) {
              valuesResult.member = [valuesResult.member];
            }
            _.each(valuesResult.member, obj => {
              if (obj[propertyName]) {
                if (obj[propertyName].indexOf(',') >= 0) {
                  var split = obj[propertyName].split(',');
                  _.each(split, value => {
                    if (values.indexOf(value.trim(' ')) < 0) {
                      values.push(value.trim(' '));
                    }
                  });
                } else if (values.indexOf(obj[propertyName]) < 0) {
                  values.push(obj[propertyName]);
                }
              }
            });
            mapviewer.tools.getCapabilitiesCache[url] = values;
            defer.resolve(values);
          } else {
            defer.resolve([]);
          }
        })
        .fail(function (e) {
          mapviewer.tools.getCapabilitiesCache[url] = null;
          defer.reject(e);
        });
    }

    return defer;
  },

  /**
   * Gets WFS features from filters
   * @param {any} layer Layer to filter
   * @param {any[]} filters Filters to apply
   */
  getWfsFeatures: function (layer) {
    var defer = $.Deferred();
    var url = layer.url.split('?')[0];
    url += "?service=WFS&request=GetFeature&version=" + layer.sourceParams.version;
    url += "&sortby=" + layer.wfsParams[0].name;
    url += "&STARTINDEX=0&COUNT=1000000&SRSNAME=EPSG:4326&outputformat=json";
    url += "&TYPENAMES=" + layer.name;
    if (layer.sourceParams.filters.length > 0) {
      url += "&cql_filter=";
      var filterQuery = "";
      _.each(layer.sourceParams.filters, function (filter, i) {
        var paramType = "string";
        var param = _.find(layer.wfsParams, { name: filter.param });
        if (param) {
          paramType = param.type;
        }
        if (i > 0) {
          filterQuery += " And ";
        }
        filterQuery += "(";
        _.each(filter.values, function (value, j) {
          if (j > 0) {
            filterQuery += " Or ";
          }
          if (paramType === "string") {
            filterQuery += filter.param + " ILIKE '%" + value + "%'";
          } else {
            filterQuery += filter.param + "=" + value;
          }
        });
        filterQuery += ")";
      });
      url += encodeURIComponent(filterQuery)
    }

    $.ajax({
      type: 'GET',
      url: "proxyxml?url=" + encodeURIComponent(url),
      dataType: 'json'
    })
      .done(function (result) {
        defer.resolve(result);
      })
      .fail(function (e) {
        console.error(e);
        defer.reject(e);
      });

    return defer;
  },

  /**
   * (Recursive) Rename all layer capabilities for portrayal
   * @param {any[]} layerList
   */
  updateAllLayersTitles: function (layerList) {
    _.each(layerList, function (layer) {
      if (layer.Layer) {
        mapviewer.tools.updateAllLayersTitles(layer.Layer);
      } else if (layer.KeywordList) {
        var stringKeywords = layer.KeywordList.join(';').toLowerCase();
        if (stringKeywords.indexOf('wfs_age_or_litho_queryable') >= 0) {
          layer.Title += " (GeoSciML WFS)";
        }
        if (stringKeywords.indexOf('erml_lite_queryable') >= 0) {
          layer.Title += ' (Erml-Lite Portrayal)'
        }
        if (stringKeywords.indexOf('geosciml_portrayal_age_or_litho_queryable') >= 0) {
          layer.Title += ' (GeoSciML Portrayal)'
        }
      } else if (layer.Dimension && layer.Dimension.length > 0) {
        if (layer.Dimension[0].name === 'time' || _.isDate(layer.Dimension[0].default)) {
          layer.Title += ' (with time)';
        }
      }
    });
  },

  /**
   * Parses XML object to Json
   * @param {XML} xml
   * @param {any} parseAttributes Faut-il parser les attributs ?
   * @return {JSON}
   */
  parseXML: function (xml, parseAttributes) {
    if (!parseAttributes) {
      parseAttributes = {};
    }
    var content;
    if (xml.childNodes && xml.childNodes.length > 0) {
      if (xml.childNodes.length === 1 && xml.childNodes[0].nodeName === "#text") {
        content = xml.childNodes[0].textContent.trim();
      } else {
        var obj = {};
        _.each(xml.childNodes, function (child) {
          if (child.nodeName !== "#text") {
            var localName = child.nodeName.replace(/^.+:/, "");
            if (obj[localName] !== undefined) {
              if (!_.isArray(obj[localName])) {
                obj[localName] = [obj[localName]];
              }
              obj[localName].push(mapviewer.tools.parseXML(child, parseAttributes));
            } else {
              obj[localName] = mapviewer.tools.parseXML(child, parseAttributes);
            }
          }
        });
        content = obj;
      }
    } else {
      content = xml.textContent.trim();
    }
    var xmlName = xml.nodeName.replace(/^.+:/, "");
    if (parseAttributes[xmlName]) {
      return {
        attributes: mapviewer.tools.parseXMLAttributes(xml),
        content: content
      };
    }
    return content;
  },

  /**
   * Parses XML Node attributes
   * @param {*} node XML node which parse attributes 
   * @return {any}
   */
  parseXMLAttributes: function (node) {
    var attributes = {};
    for (const i in node.attributes) {
      if (Object.hasOwnProperty.call(node.attributes, i)) {
        var value = node.attributes[i].nodeValue;
        var name = node.attributes[i].name.replace(/^.+:/, "");
        if (value === "true") {
          value = true;
        } else if (value === "false") {
          value = false;
        } else if (!isNaN(value) && _.isFinite(parseFloat(value))) {
          value = parseFloat(value);
        }
        attributes[name] = value;
      }
    }
    return attributes;
  },

  /**
   * (recursive) Flattens the in-depth layer list from GetCapabilities
   * @param {any[]} layerList layerList
   * @returns {any[]} Flattened layer capabilities list
   */
  flattenLayerCapabilities: function (layerList) {
    var finalList = [];
    _.each(layerList, function (layer) {
      finalList.push(layer);
      if (layer.Layer) {
        finalList = finalList.concat(mapviewer.tools.flattenLayerCapabilities(layer.Layer));
      }
    });
    return finalList;
  },

  /**
   * Gets a precise layer in service GetCapabilities return
   * @param {Object[]} LayerList - layer list form GetCapabilities Layer/sublayers
   * @param {string} layerName - layer name in geoserver
   * @return {Object|Null}
   */
  getLayerCapabilities: function (layerList, layerName) {
    for (var i = 0, len = layerList.length; i < len; ++i) {
      var layerListItemName = layerList[i].Name;
      if (layerListItemName && layerName.indexOf(':') < 0 && layerListItemName.indexOf(':') >= 0) {
        layerListItemName = layerListItemName.split(':')[1];
      }
      if (layerListItemName == layerName) {
        var layerCapabilities = Object.assign({}, layerList[i]);
        if (layerList[i].CRS) {
          var srs = [];
          for (var j = 0, len2 = layerList[i].CRS.length; j < len2; ++j) {
            if (layerList[i].CRS[j] == "CRS:84") {
              layerList[i].CRS[j] = "EPSG:4326";
            }
            if (srs.indexOf(layerList[i].CRS[j]) < 0) {
              srs.push(layerList[i].CRS[j]);
            }
          }
          layerCapabilities.srs = srs;
        }

        if (layerList[i].KeywordList) {
          layerCapabilities.keywords = mapviewer.tools.parseCapabilitiesKeywords(layerList[i].KeywordList);
        } else {
          layerCapabilities.keywords = {};
        }
        if (layerList[i].MetadataURL) {
          layerCapabilities.MetadataURL = layerList[i].MetadataURL[0].OnlineResource;
        }
        if (layerList[i].DataURL) {
          layerCapabilities.DataURL = layerList[i].DataURL[0].OnlineResource;
        }
        if (layerList[i].Style) {
          if (layerList[i].Style[0].LegendURL) {
            layerCapabilities.LegendURL = layerList[i].Style[0].LegendURL[0].OnlineResource;
          }
        }

        if (mapviewer.config.catalog.type === "json" && !mapviewer.tools.searchKeyword(layerCapabilities.keywords, 'thematic')) {
          var catalogLayer = _.find(mapviewer.config.catalog.content, { layerName: layerName });
          if (catalogLayer && catalogLayer.thematicKwList && catalogLayer.thematicKwList.length > 0) {
            layerCapabilities.keywords.thematic = catalogLayer.thematicKwList[0];
          }

        }
        return layerCapabilities;
      } else if (layerList[i].Layer) {
        var layerCapabilities = mapviewer.tools.getLayerCapabilities(layerList[i].Layer, layerName);
        if (layerCapabilities) {
          return layerCapabilities;
        }
      }
    }
    return null;
  },

  /**
   * Parses keywords from 'key@value' to {key: value}
   * @param {Object} keywordList - original GetCapabilities keyword list
   * @return {Object}
   */
  parseCapabilitiesKeywords: function (keywordList) {
    var keywordsObject = {};
    for (var i = 0, len = keywordList.length; i < len; ++i) {
      var split = keywordList[i].split('@');
      if (split.length == 1) {
        keywordsObject[split[0]] = null;
      } else {
        keywordsObject[split[0]] = split[1];
      }
    }
    return keywordsObject;
  },

  /**
   * Searches a keyword in layer keywords from partial text and return it as key-value pair
   * @param {any[]} keywords - layer keywords object
   * @param {string} keywordName - partial searched keyword name
   * @return {Array|Null}
   */
  searchKeyword: function (keywords, keywordName) {
    keywordName = keywordName.toLocaleLowerCase();
    if (keywords && keywordName) {
      for (var i in keywords) {
        if (keywords.hasOwnProperty(i) && i.toLowerCase().indexOf(keywordName) >= 0) {
          return [i, keywords[i]];
        }
      }
    }
    return null;
  },

  /**
   * Removes all HTML entities. Recursive if decoding give other entities
   * @param {string} html - text to decode
   * @return {string}
   */
  decodeHTMLEntitites: function (html) {
    try {
      var txt = document.createElement('textarea');
      txt.innerHTML = html;
      if (txt.value.search(/&[^\s]*;/m) >= 0) {
        return mapviewer.tools.decodeHTMLEntitites(txt.value);
      } else {
        return txt.value;
      }
    } catch (e) {
      console.error(e);
      return html;
    }
  },

  /**
   * Get image data from url, using proxy
   * @param {string} url
   * @return Promise with dataurl
   */
  getImage: function (url) {
    var defer = $.Deferred();
    if (!url) {
      defer.resolve("");
    } else {
      url = url.replace(/true/gi, 'TRUE').replace(/false/gi, 'FALSE');
      $.ajax({
        method: 'GET',
        url: 'proxycesium?url=' + encodeURIComponent(url),
        cache: false,
        xhr: function () {// Seems like the only way to get access to the xhr object
          var xhr = new XMLHttpRequest();
          xhr.responseType = 'blob'
          return xhr;
        }
      }).then(function (data) {
        var reader = new FileReader();
        reader.addEventListener("load", function () {
          defer.resolve(reader.result);
        }, false);
        if (data) {
          reader.readAsDataURL(data);
        } else {
          defer.reject();
        }
      }, function (error) {
        console.error(error);
        defer.reject();
      });
    }
    return defer;
  },

  /**
   * Calls the url validator
   * @param {string} url 
   * @return {Promise}
   */
  validateWMSUrl: function (url) {
    var defer = $.Deferred();

    if (mapviewer.tools.isUrl(url)) {
      $.ajax({
        method: 'POST',
        url: "api/wms/validation/",
        data: url,
        dataType: 'json'
      })
        .done(function (result) {
          if (result.errors) {
            for (const i in result.errors) {
              if (result.errors.hasOwnProperty(i)) {
                var errors = [];
                _.each(result.errors[i], function (e) {
                  errors.push(e.error);
                });
                result.errors[i] = errors;
              }
            }
          }
          defer.resolve(result);
        })
        .fail(function (error) {
          defer.reject(error);
        })
    } else {
      defer.reject("url");
    }

    return defer;
  },

  sortByProximityOfTerm: function (term, list, nameTag) {
    var proximityList = [];
    var alphaList = [];

    term = term.toLowerCase();

    _.each(list, function (item) {
      if (mapviewer.tools.strStartsWith(term, item[nameTag])) {
        proximityList.push(item);
      } else {
        alphaList.push(item);
      }
    });

    return proximityList.concat(alphaList);
  },

  strStartsWith: function (search, text) {
    return text.toLowerCase().slice(0, search.length) === search;
  },

  /**
   * Checks if the string is an url
   * @param {string} text 
   * @return {boolean}
   */
  isUrl: function (text) {
    // https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
    if (_.isString(text) && text.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)) {
      return true;
    }
    return false;
  },

  /**
   * Converts hexa color to rgb
   * @param {string} hex Hexa color code
   */
  hexToRgb: function (hex) {
    if (!hex) {
      return null;
    }
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  /**
   * Filters the list with given text, priorizing pertinent results
   * @param {any[]} list List to filter
   * @param {string} fieldName Field used to priorize (send "" if list of string data)
   * @param {string} searchText Text used to filter and priorize
   * @return {any[]}
   */
  searchInList: function (list, fieldName, searchText) {
    if (_.isString(searchText) && searchText !== "" && list.length > 0 && _.isString(fieldName)) {
      var simpleSearchText = mapviewer.tools.stripCaseAndAccents(searchText);
      list = _.filter(list, function (i) {
        return mapviewer.tools.stripCaseAndAccents(mapviewer.tools.getFieldValue(i, fieldName)).indexOf(simpleSearchText) >= 0
      });
      return mapviewer.tools.sortByPertinence(list, fieldName, searchText);
    }
    return list.slice();
  },

  /**
   * (Recursive) Returns field value with depth management
   * @param {any} object Object from which get the value
   * @param {string} fieldName Field name to retrieve (ex: 'label', 'lithology.label')
   * @return {string}
   */
  getFieldValue: function (object, fieldName) {
    if (fieldName === "" && _.isString(object)) {
      return object;
    }
    var nameSplit = fieldName.split('.');
    if (object.hasOwnProperty(nameSplit[0])) {
      var value = object[nameSplit[0]];
      if (nameSplit.length > 1) {
        nameSplit.shift();
        return mapviewer.tools.getFieldValue(value, nameSplit.join('.'));
      }
      return value;
    }
    return "";
  },

  /**
   * Replace all special letters with its simple letters
   * @param {string} value Text to transform
   * @return {string}
   */
  stripCaseAndAccents: function (value) {
    if (_.isString(value)) {
      return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }
    return "";
  },

  /**
   * Sort a list priorizing those which begins by the search text
   * @param {any[]} list List to sort
   * @param {string} fieldName Field name used to sort (send "" if it's string list)
   * @param {string} searchText Text used to priorize the sorting
   * @return {any[]}
   */
  sortByPertinence: function (list, fieldName, searchText) {
    if (!_.isString(searchText) || searchText === "" || !_.isString(fieldName)) {
      return list;
    }
    var firstList = [], secondList = [], lastList = [];
    searchText = searchText.toLowerCase();
    const simpleSearchText = mapviewer.tools.stripCaseAndAccents(searchText);
    _.each(list, function (item) {
      if (mapviewer.tools.getFieldValue(item, fieldName).toLowerCase().indexOf(searchText) === 0) {
        firstList.push(item);
      } else if (mapviewer.tools.stripCaseAndAccents(mapviewer.tools.getFieldValue(item, fieldName)).indexOf(simpleSearchText) === 0) {
        secondList.push(item);
      } else {
        lastList.push(item);
      }
    });
    firstList = _.sortBy(firstList, fieldName);
    secondList = _.sortBy(secondList, fieldName);
    lastList = _.sortBy(lastList, fieldName);

    return firstList.concat(secondList).concat(lastList);
  },

  /**
   * Converts interval time code to milliseconds
   * @param {string} code Interval time code
   * @returns {number} milliseconds for the interval
   */
  getTimeStepFromStandard: function (code) {
    // https://docs.microsoft.com/en-us/windows/win32/taskschd/taskschedulerschema-interval-restarttype-element
    // P<days>DT<hours>H<minutes>M<seconds>S
    var step = 0; // milliseconds
    var times = code.match(/[0-9]+[DHMS]/);
    if (times && times.length > 0) {
      for (let i = 0; i < times.length; i++) {
        if (times[i].indexOf('D') >= 0) {
          step += parseInt(times[i].replace('D', ''), 10) * 24 * 3600000;
        } else if (times[i].indexOf('H') >= 0) {
          step += parseInt(times[i].replace('H', ''), 10) * 3600000;
        } else if (times[i].indexOf('M') >= 0) {
          step += parseInt(times[i].replace('M', ''), 10) * 60000;
        } else if (times[i].indexOf('S') >= 0) {
          step += parseInt(times[i].replace('S', ''), 10) * 1000;
        }
      }
    }
    return step;
  },

  /**
   * Transforms a number from time unit to milliseconds
   * @param {number} value Number to transform
   * @param {string} unit Time unit
   * @returns {number} Converted number to milliseconds
   */
  transformToTime(value, unit) {
    var factor = 0;
    switch (unit) {
      case 'D': factor = 3600000 * 24;
        break;
      case 'H': factor = 3600000;
        break;
      case 'M': factor = 60000;
        break;
    }
    return value * factor;
  }
}
