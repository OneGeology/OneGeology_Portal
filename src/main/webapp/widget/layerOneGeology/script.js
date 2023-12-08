
/**
 * Search and add layer manager
 * @constructor
 */
var layerOneGeology = {

  /**
   * La précédente valeur de freetext
   */
  oldFreeText: "",

  /**
   * Les mot-clés disponibles pour l'autocompletion
   */
  availableTags: [],

  /**
   * Tableau de correspondance des chaines de caractères 
   */
  charMap: [
    {oldValue:"á",newValue: "a"},
    {oldValue:"à",newValue: "a"},
    {oldValue:"â",newValue: "a"},
    {oldValue:"á",newValue: "a"},
    {oldValue:"é",newValue: "e"},
    {oldValue:"è",newValue: "e"},
    {oldValue:"ê",newValue: "e"},
    {oldValue:"ë",newValue: "e"},
    {oldValue:"ï",newValue: "i"},
    {oldValue:"î",newValue: "i"},
    {oldValue:"ô",newValue: "o"},
    {oldValue:"ö",newValue: "o"},
    {oldValue:"û",newValue: "u"},
    {oldValue:"ù",newValue: "u"}
  ],
  /**
   * Url to call to get layers list
   * @type {string}
   */
  url: "http://onegeology-geonetwork.brgm.fr/geonetwork3/srv/fre/csw",

  /**
   * ?
   * @type {string}
   */
  urlThematicKw: "",

  /**
   * ?
   * @type {string}
   */
  thematicKeywordList: [],

  /**
   * Current Ajax call to this.url
   * @type {Promise|Null}
   */
  currentCall: null,

  /**
   * Current id for "select all" checkbox
   * @type {number}
   */
  currentSelectAllId: 1,

  /**
   * Is the first loading running ?
   */
  firstLoadRunning: true,

  /**
   * JSON file to get standard country or area codes for statistical use (M49)
   */
  urlMappingCountriesM49File: "conf/mapping_countries_m49.json",  

  /**
   * Initialize widget
   */
  init: function (options) {
    if (mapviewer.config.catalog.url) {
      layerOneGeology.url = mapviewer.config.catalog.url;
    }
    if (mapviewer.config.catalog.thematicSrcUrl) {
      layerOneGeology.urlThematicKw = mapviewer.config.catalog.thematicSrcUrl;
    } else {
      $('#thematicKeywords').val('none')
        .closest('.form-group').hide();
    }
    if (!mapviewer.config.catalog.enableTabs) {
      $('#layerOneGeology .addLayerTab .nav-tabs').remove();
    }
    if (!mapviewer.config.tools.advancedSearch.enable) {
      $('#advancedSearch').remove();
    }
    if (!mapviewer.config.tools.selectTheme.enable) {      
      $('#thematicKeywords').closest('div').remove();
    }
    setTimeout(function () {
      layerOneGeology.getRecords(true);
    }, 200);
    layerOneGeology.addEvents();

    /* Déplacement de la légende */
    const dragElement = (element, dragzone) => {
      
      let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      
      const dragMouseUp = () => {
        if(element.classList.contains("expanded")){
          return;
        }
        document.onmouseup = null;
        document.onmousemove = null;
        element.classList.remove("drag");
      };
  
      const dragMouseMove = (event) => {
        if(element.classList.contains("expanded")){
          return;
        }

        event.preventDefault();
        pos1 = pos3 - event.clientX;
        pos2 = pos4 - event.clientY;
        pos3 = event.clientX;
        pos4 = event.clientY;
        
        element.style.top = `${element.offsetTop - pos2}px`;
        element.style.left = `${element.offsetLeft - pos1}px`;
        
      };
  
      const dragMouseDown = (event) => {        
        if(element.classList.contains("expanded")){
          return;
        }

        event.preventDefault();
        pos3 = event.clientX;
        pos4 = event.clientY;
        element.classList.add("drag");
        document.onmouseup = dragMouseUp;
        document.onmousemove = dragMouseMove;
        if(element.classList.contains("fixed")){
          element.style.bottom = `auto`;
          element.style.right = `auto`;
          element.style.top = `${document.body.clientHeight - element.offsetHeight}px`;
          element.style.left = `${(document.body.clientWidth - element.offsetWidth) / 2}px`;
        }
        element.classList.remove("fixed");
      };
  
      dragzone.onmousedown = dragMouseDown;
    };
  
    const dragable = document.getElementById("dragable"), dragzone = document.getElementById("dragzone");
    dragElement(dragable, dragzone);    
  },

  /**
   * Autocompletion
   * - inp : l'input auquel on applique l'autocompletion
   * - arr : le tableau de string, qui liste les chaines de caractère à prendre dans l'autocompletion
   * return : rien
   */
  autocomplete: function(inp, arr){
    var currentFocus;
  
    /* Trigger sur la modification de l'input */
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;      
        /* On ferme à chaque fois la liste déroulante */
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        
        /* Création de la liste déroulante */
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");      
        this.parentNode.appendChild(a);
  
        /* Pour chaque élément de la liste...*/
        for (i = 0; i < arr.length; i++) {          
          /* On recherche les éléments qui commence par la chaine de caractère saisie */ 
          if (normalize(arr[i].substr(0, val.length).toLowerCase()) == normalize(val.toLowerCase())) {          
            /* Si l'élément correspond aux critères, on le rajoute dans la liste */          
            b = document.createElement("DIV");
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);          
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
  
            /* Au clic d'un élément, on l'insert dans l'input */
            b.addEventListener("click", function(e) {
                inp.value = this.getElementsByTagName("input")[0].value;              
                $('#layerOneGeology .filterForm').trigger('submit');
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
  
    /* Trigger sur la saisie au clavier dans l'input */  
    inp.addEventListener("keyup", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {        
          currentFocus++;
          addActive(x);
        } else if (e.keyCode == 38) { // touche UP        
          currentFocus--;
          addActive(x);
        } else if (e.keyCode == 13) { // touche Entrée        
          e.preventDefault();
          if (currentFocus > -1) {          
            if (x) x[currentFocus].click();
          }
        }
        $('#layerOneGeology .filterForm').trigger('submit');
    });
  
    /* Fonction qui affiche */
    function addActive(x) {    
      if (!x) return false;    
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);    
      x[currentFocus].classList.add("autocomplete-active");
    }
  
    /* Fonction qui masque un élément du tableau */
    function removeActive(x) {
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
  
    /* Fonction qui ferme la liste déroulante */ 
    function closeAllLists(elmnt) {
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
  
    /**
     * Suppression des accents dans les chaines de caractère 
     * - str : la chaine de caractère en entrée
     * return : la chaine de caractère modifiée
     */
    var normalize = function (str) {
      let normalizedStr = str;      
      layerOneGeology.charMap.forEach(charObject =>{
        normalizedStr = normalizedStr.replace(charObject.oldValue, charObject.newValue);        
      });
      return normalizedStr;
    }
  
    /* Trigger qui ferme la liste déroulante si on clique à l'exterieur */
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
  },

  /**
   * Creates widget listeners
   */
  addEvents: function () {
    $("#layerOneGeology .addLayerTab").on("click", ".tree-list .item-title", layerOneGeology.showHideSubLayers);
    $("#layerOneGeology .add-button").on("click", layerOneGeology.manageAddLayer.bind(this));
    $('#layerOneGeology .addLayerTab').on("change", '.tree-list input[type=checkbox]', function () {
      if ($(this).closest('li').hasClass('select-all-checkbox')) {
        $(this).closest('li').siblings('li').find("> input").prop('checked', $(this).prop('checked')).trigger('change');
      } else {
        if (!$(this).prop('checked')) {
          $(this).closest('li').siblings('.select-all-checkbox').find('input').prop('checked', false);
          $('[name="' + $(this).attr('name') + '"]').closest('li').siblings('.select-all-checkbox').find('input').prop('checked', false);
        }
        $('[name="' + $(this).attr('name') + '"]').prop('checked', $(this).prop('checked'));
      }

      $('#layerOneGeology .add-button').prop('disabled', $('#layerOneGeology .addLayerTab .tree-list input[type=checkbox]:checked').length === 0);

    });

    $(".filterForm").on("submit", function (e) {
      e.preventDefault();
      e.stopPropagation();
      layerOneGeology.currentSelectAllId = 1;
      layerOneGeology.getRecords(false);
      $('#layerOneGeology .add-button').prop('disabled', true);
    });
    $("#resetSearch").on("click", layerOneGeology.resetSearchOptions);
    $("#advancedSearch").on("click", layerOneGeology.showHideSearchOptions);

    if(mapviewer.config.tools.hideSearchButton.enable){
      $("#filterOnBBOX").on("click", function(){
        $(".filterForm").submit();
      });
      $(".filterButtons > button[type=submit]").hide();
      $(".filterButtons").addClass("absolute");
    }
  },

  /**
   * Expand or collapse tree list subitems
   */
  showHideSubLayers: function () {
    var $subList = $(this).siblings('ul');
    $subList.toggle();

    if ($subList.css('display') === 'none') {
      $(this).find('.fa').removeClass('fa-minus').addClass('fa-plus');
    } else {
      $(this).find('.fa').removeClass('fa-plus').addClass('fa-minus');
    }
  },

  /**
   * Get all dataset with configuration's method
   * @param {boolean} firstLoad - true on loading portal, false from search engine
   */
  getRecords: function (firstLoad) {
    $("#loadingGetRecords").show();
    //Clear page
    $('#page-content').html("");
    $('#layer1GGAreaResult').html("");
    $('#layer1GGThematicResult').html("");

    if (mapviewer.config.catalog.type === "geonetwork") {
      layerOneGeology.getGeonetworkRecords(firstLoad);
    } else {
      layerOneGeology.getJsonRecords(firstLoad);
    }
  },

  /**
   * Get filtered datasets from geonetwork
   * @param {boolean} firstLoad  - true on loading portal, false from search engine
   */
  getGeonetworkRecords: function (firstLoad) {
    //var freeText = jQuery(".layerOneGeologyInput").val();
    var constraint, freeText, bboxFilter, wfsDefined, wmsPortrayal, wcsSearch, thematic;
    if (layerOneGeology.currentCall) {
      layerOneGeology.currentCall.abort();
    }

    if (firstLoad) {

      constraint = "<PropertyIsEqualTo>"
        + "<PropertyName>dc:type</PropertyName>"
        + "<Literal>dataset</Literal>"
        + "</PropertyIsEqualTo>";
    } else {
      freeText = $("#freeTxt").val();
      if ($("#filterOnBBOX").is(":checked"))
        bboxFilter = mapviewer.map.getCurrentExtent();
      thematic = $("#thematicKeywords").val();
      constraint = "<And>"
        + "<PropertyIsEqualTo>"
        + "<PropertyName>dc:type</PropertyName>"
        + "<Literal>dataset</Literal>"
        + "</PropertyIsEqualTo>";
      var phraseConstraint = "";

      if (freeText) {
        var phrase = freeText;

        if (freeText.startsWith("\"") && freeText.endsWith("\"")) {
          phrase = phrase.replaceAll("\"", "*");
          phrase = phrase.replaceAll("\\s", "?");
          phraseConstraint +=
            "<PropertyIsLike matchCase='false' escapeChar=\"\\\" singleChar=\"?\" wildCard=\"*\">"
            + "<PropertyName>Subject</PropertyName>"
            + "<Literal>" + phrase + "</Literal>"
            + "</PropertyIsLike>";
        } else {
          constraint +=
            "<PropertyIsLike matchCase=\"false\" escapeChar=\"\\\" singleChar=\"?\" wildCard=\"*\">"
            + "<PropertyName>AnyText</PropertyName>"
            + "<Literal>" + freeText.replaceAll("\\s", " ") + "</Literal>"
            + "</PropertyIsLike>";
        }
      }

      if (bboxFilter) {
        lowerCorner = bboxFilter[0] + " " + bboxFilter[1];
        upperCorner = bboxFilter[2] + " " + bboxFilter[3];
        constraint += "<BBOX>"
          + "<PropertyName>ows:BoundingBox</PropertyName>"
          + "<gml:Envelope><gml:lowerCorner>" + lowerCorner + "</gml:lowerCorner><gml:upperCorner>" + upperCorner + "</gml:upperCorner></gml:Envelope>"
          + "</BBOX>";
      }
      if (thematic && thematic != "none") {
        constraint += "<PropertyIsLike matchCase='false' wildCard=\"%\" singleChar='_' escapeChar='\\'>"
          + "<PropertyName>Subject</PropertyName>"
          + "<Literal>thematic@" + thematic.replaceAll("\\s", "*") + "</Literal>"
          + "</PropertyIsLike>";
      }

      var orConstraint = "", countOrConstraint = 0;
      if ($("#wfsDefined").is(":checked")) {
        countOrConstraint++;
        orConstraint += "<PropertyIsLike escapeChar='\' singleChar='?' wildCard='*'>"
          + "<PropertyName>Anytext</PropertyName><Literal>*wfs_age_or_litho_queryable*</Literal>"
          + "</PropertyIsLike>";
      }
      if ($("#wmsPortrayalGeosciml").is(":checked")) {
        countOrConstraint++;
        orConstraint += "<PropertyIsLike escapeChar='\' singleChar='?' wildCard='*'>"
          + "<PropertyName>Anytext</PropertyName><Literal>*portrayal_age_or_litho_queryable*</Literal>"
          + "</PropertyIsLike>";
      }
      if ($("#wmsPortrayalErml").is(":checked")) {
        countOrConstraint++;
        orConstraint += "<PropertyIsLike escapeChar='\' singleChar='?' wildCard='*'>"
          + "<PropertyName>Anytext</PropertyName><Literal>*Erml_lite_queryable*</Literal>"
          + "</PropertyIsLike>";
      }
      if ($("#wcsSearch").is(":checked")) {
        countOrConstraint++;
        orConstraint += "<PropertyIsLike escapeChar='\' singleChar='?' wildCard='*'>"
          + "<PropertyName>Anytext</PropertyName><Literal>*wcs*</Literal>"
          + "</PropertyIsLike>";
      }
      if (countOrConstraint > 1) {
        constraint += "<Or>" + orConstraint + "</Or>";
      } else {
        constraint += orConstraint;
      }

      constraint += phraseConstraint;
      constraint += "</And>";
    }

    var emptyRequest = constraint.search(/<\/PropertyIsEqualTo>(<\/And>)?$/);
    if (emptyRequest > 0) {
      constraint = constraint.replace(/^<And>/, '').replace(/<\/And>$/, '');
    }

    var query = "<csw:GetRecords xmlns:csw=\"http://www.opengis.net/cat/csw/2.0.2\" service=\"CSW\" version=\"2.0.2\" resultType=\"results\" maxRecords=\"1000\" startPosition=\"1\">"
      + "<csw:Query typeNames=\"csw:Record\">"
      + "<csw:ElementSetName>full</csw:ElementSetName>"
      + "<csw:Constraint version=\"1.1.0\">"
      + "<Filter xmlns=\"http://www.opengis.net/ogc\" xmlns:gml=\"http://www.opengis.net/gml\">"
      + constraint
      + "</Filter>"
      + "</csw:Constraint>"
      + "</csw:Query>"
      + "</csw:GetRecords>";

    layerOneGeology.currentCall = $.ajax({
      type: "POST",
      url: "./proxycatalog?url=" + layerOneGeology.url,
      headers: { 'use-catalog-cache': (emptyRequest > 0) },
      data: query,
      contentType: "text/xml",
      dataType: "text",
      crossDomain: true,
      cache: false,
      error: function (jqXHR, textStatus, errorThrown) {
        currentCall = null;
      }.bind(this),
      success: function (result) {
        layerOneGeology.parseCSWGetRecords(result, firstLoad);
        $("#loadingGetRecords").hide();
        layerOneGeology.currentCall = null;
      }.bind(this)
    });
  },

  /**
   * Get all dataset in geonetwork catalog
   * @param {string} result - csw xml result
   * @param {boolean} firstLoad - true on loading portal, false from search engine
   */
  parseCSWGetRecords: function (result, firstLoad) {
    var recordList = [];

    $(result).find("csw\\:Record ").each(function () {
      var record = {};
      var onlineResourceList = [];
      var keywordList = [];
      record.id = $(this).find("dc\\:identifier").text();
      record.title = $(this).find("dc\\:title").text();
      record.description = $(this).find("dc\\:description").text();

      var thematicKwList = [];
      $(this).find("dc\\:subject").each(function () {
        if ($(this).text().indexOf("continent@") == 0) {
          record.continent = $(this).text().split('@')[1];
        }
        if ($(this).text().indexOf("subcontinent@") > -1) {
          record.subcontinent = $(this).text().split('@')[1];//.replace(/\n/g, " ").replace(/\s*$/,"");
        }
        if ($(this).text().indexOf("geographicarea@") > -1)
          record.geographicarea = $(this).text().split('@')[1];
        if ($(this).text().indexOf("subarea@") > -1)
          record.subarea = $(this).text().split('@')[1];
        if ($(this).text().indexOf("portrayal_age_or_litho_queryable") > -1) {
          record.portrayal = true;
          record.portrayalType = 'geosciml';
        }
        if ($(this).text().toLowerCase().indexOf("erml_lite_queryable") > -1) {
          record.portrayal = true;
          record.portrayalType = 'erml';
        }
        if ($(this).text().indexOf("wfs_age_or_litho_queryable") > -1) {
          record.geosciml = true;
        }
        if ($(this).text().indexOf("thematic@") > -1)
          thematicKwList.push($(this).text().split('@')[1]);

      });
      record.thematicKwList = thematicKwList;
      /*if(record.continent==undefined)
        record.continent="World";*/
      if (record.geographicarea == undefined)
        record.geographicarea = "Undefined Area";

      $(this).find("dc\\:URI").each(function () {
        if ($(this).attr("protocol").indexOf("OGC:WMS") > -1 || $(this).attr("protocol").indexOf("OGC:WCS") > -1) {
          record.serviceUrl = $(this).text();
          record.layerName = $(this).attr("name");
          if ($(this).attr("protocol").indexOf("OGC:WCS") > -1) {
            record.title = "(WCS) " + record.title;
            record.serviceType = "WCS";
          }

          if ($(this).attr("protocol").indexOf("1.3.0") > -1) {
            record.version = "1.3.0";
          } else {
            record.version = "1.1.1";
          }
        }
        if ($(this).attr("protocol").indexOf("OGC:WFS") > -1) {
          record.serviceWfsUrl = $(this).text();
          record.serviceWfsUrlType = $(this).attr("name");
        }
      });

      var extent = $(this).find("ows\\:LowerCorner").text().replace(" ", ",") + "," + $(this).find("ows\\:UpperCorner").text().replace(" ", ",");
      record.extent = extent.split(",")[2] + ',' + extent.split(",")[1] + ',' + extent.split(",")[0] + ',' + extent.split(",")[3];
      recordList.push(record);

    });

    var numberOfRecordsReturned = $(result).find("csw\\:SearchResults").attr("numberOfRecordsReturned");
    var totalPages = Math.ceil(numberOfRecordsReturned / 10);

    var nbRecordsMatched = $(result).find("csw\\:SearchResults").attr("numberOfRecordsMatched");
    $('#nbResultsFound').html(nbRecordsMatched + " " + i18next.t("addlayer.datasetsFound", { count: Number(nbRecordsMatched) }));

    if (firstLoad && mapviewer.config.catalog.thematicSrcUrl)
      layerOneGeology.getThematicKw(recordList);

    layerOneGeology.checkMonitoringService(recordList);
    layerOneGeology.buildGeographicTree(recordList);
    layerOneGeology.buildThematicTree(recordList);
    if (layerOneGeology.firstLoadRunning) {
      layerOneGeology.cacheFirstLoad(recordList);
    }
  },

  /**
   * Load json catalog then do the search
   * @param {boolean} firstLoad - true on loading portal, false from search engine
   */
  getJsonRecords: function (firstLoad) {
    if (firstLoad) {
      $.ajax({
        method: 'GET',
        url: "proxy?url=" + encodeURIComponent(mapviewer.config.catalog.url),
        dataType: 'json'
      })
        .done(function (records) {
          mapviewer.config.catalog.content = records;

          layerOneGeology.doJsonSearchRecords(firstLoad);
        })
        .fail(function (e) {
          console.error(e);
        });
    } else {
      layerOneGeology.doJsonSearchRecords(firstLoad);
    }
  },

  /**
   * Get filtered datasets from configuration's json catalog
   * @param {boolean} firstLoad
   */
  doJsonSearchRecords: function (firstLoad) {
    var freeText = $("#freeTxt").val();
    if (freeText) {
      freeText = freeText.toLowerCase();
    }
    var filterToExtent = $("#filterOnBBOX").prop('checked');
    var bboxFilter = ol.proj.transformExtent(mapviewer.map.getCurrentExtent(), mapviewer.map.getCurrentProjection(), 'EPSG:4326');
    var thematicWord = $("#thematicKeywords").val();
    var withGeosciml = $("#wfsDefined").prop('checked');
    var withPortrayalGeosciml = $("#wmsPortrayalGeosciml").prop('checked');
    var withPortrayalErml = $("#wmsPortrayalErml").prop('checked');
    var withWcs = $("#wcsSearch").prop('checked');

    var recordList = [];


    _.each(mapviewer.config.catalog.content, function (item) {
      var eligible = true;
      if (freeText) {
        var subcontinentValid = item.subcontinent ? true : false;
        if (item.subcontinent && item.geographicarea.toLowerCase().indexOf(freeText) < 0) {
          subcontinentValid = false;
        }
        if (item.geographicarea.toLowerCase().indexOf(freeText) < 0 &&
          item.title.toLowerCase().indexOf(freeText) < 0 &&
          item.description.toLowerCase().indexOf(freeText) < 0 &&
          item.layerName.toLowerCase().indexOf(freeText) < 0 &&
          item.continent.toLowerCase().indexOf(freeText) < 0 && !subcontinentValid
        ) {
          eligible = false;
        }
      }
      if (filterToExtent) {
        var itemExtent = item.extent.split(',');

        if (itemExtent.indexOf("") >= 0 || itemExtent.indexOf("undefined") >= 0) {
          eligible = false;
        } else {
          itemExtent = itemExtent.map(Number);

          if (!ol.extent.intersects(bboxFilter, itemExtent)) {
            eligible = false;
          }
        }
      }

      if (thematicWord && thematicWord !== "none" && item.thematicKwList.indexOf(thematicWord) < 0) {
        eligible = false;
      }

      if (withGeosciml || withPortrayalGeosciml || withWcs) {
        var geoscimlValid = (withGeosciml && item.geosciml);
        var portrayalGeoscimlValid = (withPortrayalGeosciml && item.portrayal && item.portrayalType === 'geosciml');
        var portrayalErmlValid = (withPortrayalErml && item.portrayal && item.portrayalType === 'erml');
        var wcsValid = withWcs;
        if (
          withWcs && item.title.toLowerCase().indexOf("wcs") < 0 &&
          item.layerName.toLowerCase().indexOf("wcs") < 0 &&
          item.serviceUrl.toLowerCase().indexOf("wcs") < 0 &&
          item.description.toLowerCase().indexOf("wcs") < 0
        ) {
          wcsValid = false;
        }

        if (!geoscimlValid && !portrayalGeoscimlValid && !wcsValid && !portrayalErmlValid) {
          eligible = false;
        }
      }


      if (eligible) {
        recordList.push(item);
      }
    });

    $("#loadingGetRecords").hide();

    if (firstLoad && mapviewer.config.catalog.thematicSrcUrl) {
      layerOneGeology.getThematicKw(recordList);
    }

    layerOneGeology.checkMonitoringService(recordList);
    layerOneGeology.buildGeographicTree(recordList);
    layerOneGeology.buildThematicTree(recordList);
    if (layerOneGeology.firstLoadRunning) {
      layerOneGeology.cacheFirstLoad(recordList);
    }
  },

  cacheFirstLoad: function (recordList) {
    layerOneGeology.firstLoadRunning = false;
    $('.filterForm [disabled]').attr('disabled', false);
    mapviewer.config.catalog.content = recordList;
  },

  /**
   * Set recommandation in each records if its monitoring score is enougth
   * @param {Object[]} recordList : layer list from research
   */
  checkMonitoringService: function (recordList) {
    _.each(recordList, function (record) {
      var recordUrl = record.serviceUrl.split('?')[0].toLowerCase();
      var urlMonitoring = _.find(mapviewer.config.monitoring, { name: recordUrl });
      if (urlMonitoring && urlMonitoring.sla >= 80) {
        record.recommended = true;
      }
      if (urlMonitoring && urlMonitoring.sla < 50) {
        record.malfunction = true;
      }
    });
  },

  /**
   * Build the layer tree sorted by thematic
   * @param {Object[]} recordList : layer list from research
   */
  buildThematicTree: function (recordList) {
    var thematicObj = [];
    for (var i = 0; i < recordList.length; i++) {
      if (recordList[i].thematicKwList.length > 0) {
        for (var j = 0; j < recordList[i].thematicKwList.length; j++) {
          var kw = recordList[i].thematicKwList[j];
          if (!thematicObj[kw])
            thematicObj[kw] = [];
          thematicObj[kw].push(recordList[i]);
        }
      } else {
        if (!thematicObj["Thematic not Defined"])
          thematicObj["Thematic not Defined"] = [];
        thematicObj["Thematic not Defined"].push(recordList[i]);
      }
    }

    var sortArray = mapviewer.sortProperties(thematicObj);
    var thematicKW = sortArray;

    var html = "<ul class='tree-list'>";
    for (var key in thematicKW) {
      html += "<li><span class='item-title'><i class='fa fa-plus'></i>" + thematicKW[key][0] + "</span><ul>";
      html += layerOneGeology.parcoursNoeud(thematicKW[key][1], 1);
      html += "</ul></li>";
    }
    html += "</ul>";
    $('#layer1GGThematicResult').append(html);
  },

  /**
   * Build the layer tree sorted by geographic Area
   * @param {Object[]} recordList : layer list from research
   */
  buildGeographicTree: function (recordList) {
    // As of April 2021, we no longer use Sub-region nor Region from each services, we get it by looking the content from https://unstats.un.org/unsd/methodology/m49/overview/
    var countryInformationsResponseText = $.ajax({
      type: "GET",
      url: "./methodology/m49/",
      async: false,
      cache: false
    }).responseText;

    // Parsing JSON text
    var countryInformationsM49 = JSON.parse(countryInformationsResponseText);

    // From service to M49 code
    var mapCountriesM49Text = $.ajax({
      url: layerOneGeology.urlMappingCountriesM49File,
      async: false,
      cache: false
    }).responseText;
    var mapCountriesM49 = JSON.parse(mapCountriesM49Text);

    recordList.forEach(function (record) {
      var subarea = record.subarea;
      var country = record.geographicarea;
      var subcontinent = record.subcontinent;
      var continent = record.continent;
      // We map services with M49 labels
      if (mapCountriesM49[country] != undefined) {
        country = mapCountriesM49[country];
      }
      var m49Country = _.find(countryInformationsM49, function (e) { return e["Country or Area"] === country });
      if (!m49Country && (country === subcontinent || country === continent)) {
        m49Country = _.find(countryInformationsM49, function (e) { return e["Sub-region Name"] === country });
        subarea = undefined;
      }
      if (m49Country) {
        continent = m49Country['Region Name'] || continent;
        subcontinent = m49Country['Sub-region Name'] || subcontinent;

        // if there is a subdivision
        if (!subarea && m49Country['Intermediate Region Name'] && m49Country['Intermediate Region Name'] !== subcontinent && country !== subcontinent) {
          subarea = country;
          country = m49Country['Intermediate Region Name'];
        }
      } else if (country === continent) {
        subcontinent = undefined;
        // country is not set to undefined in order to keep the algo below unchanged
        subarea = undefined;
      }

      // M49 JSON may contain "" instead of null
      if (!subcontinent) subcontinent = undefined;
      if (!continent) continent = undefined;

      if (continent == undefined) {
        continent = "World";
      }

      record.continent = continent;
      record.subcontinent = subcontinent;
      record.geographicarea = country;
      record.subarea = subarea;

      // Fixes some problems for sorting
      if (record.geographicarea && !record.subcontinent) {
        record.subcontinent = record.geographicarea;
      }
      if (record.subarea && !record.geographicarea) {
        record.geographicarea = record.subarea;
      }
    });

    recordList = _.sortBy(recordList, ['orderPriority', 'continent', 'subcontinent', 'geographicarea', 'subarea', 'innerOrder', 'title']);

    var continentsObj = [],
      continent,
      subcontinent,
      subarea,
      country;

    for (var i = 0; i < recordList.length; i++) {
      continent = recordList[i].continent;
      subcontinent = recordList[i].subcontinent;
      country = recordList[i].geographicarea;
      subarea = recordList[i].subarea;

      if (!continentsObj[continent]) {
        continentsObj[continent] = [];
      }

      if (country == continent) {
        continentsObj[continent].push(recordList[i]);
      } else if (subcontinent != undefined) {
        if (!continentsObj[continent][subcontinent]) {
          continentsObj[continent][subcontinent] = [];
          continentsObj[continent][subcontinent].push({ level: 2 });
        }
        if (subcontinent == country) {
          continentsObj[continent][subcontinent].push(recordList[i]);
        } else {
          if (!continentsObj[continent][subcontinent][country]) {
            continentsObj[continent][subcontinent][country] = [];
            continentsObj[continent][subcontinent][country].push({ level: 3 });
          }
          if (subarea != undefined) {
            if (!continentsObj[continent][subcontinent][country][subarea]) {
              continentsObj[continent][subcontinent][country][subarea] = [];
              continentsObj[continent][subcontinent][country][subarea].push({ level: 4 });
            }

            continentsObj[continent][subcontinent][country][subarea].push(recordList[i]);

          } else {
            continentsObj[continent][subcontinent][country].push(recordList[i]);
          }
        }
      } else {
        if (!continentsObj[continent][country]) {
          continentsObj[continent][country] = [];
          continentsObj[continent][country].push({ level: 2 });
        }
        if (subarea != undefined) {
          if (!continentsObj[continent][country][subarea]) {
            continentsObj[continent][country][subarea] = [];
            continentsObj[continent][country][subarea].push({ level: 3 });
          }
          continentsObj[continent][country][subarea].push(recordList[i]);
        } else {
          continentsObj[continent][country].push(recordList[i]);

        }
      }
    }


    var subcontinentObjList = [];
    if (Object.hasOwnProperty.call(continentsObj, 'World')) {
      // Sets all continents under 'World'
      var worldObj = continentsObj['World'];
      delete continentsObj['World'];
      subcontinentObjList['World'] = [];

      var keys = [];

      for (const key in worldObj) {
        if (Object.hasOwnProperty.call(worldObj, key)) {
          if (isNaN(key)) {
            keys.push(key);
          } else {
            subcontinentObjList['World'].push(worldObj[key]);
          }
        }
      }

      for (const key in continentsObj) {
        if (Object.hasOwnProperty.call(continentsObj, key)) {
          keys.push(key);
        }
      }

      keys.sort();

      keys.forEach(function (key) {
        subcontinentObjList['World'][key] = worldObj[key] || continentsObj[key];
      });
    } else {
      subcontinentObjList = continentsObj;
    }


    // Display catalog
    var html = "<ul class='tree-list'>";
    for (var key in subcontinentObjList) {            
      if(subcontinentObjList[key][0] && subcontinentObjList[key][0].title && !subcontinentObjList[key][0].level){        
        html += "<li><span class='item-title'><i class='fa fa-plus'></i>" + key + "</span><ul style='display: none'>";
        html += layerOneGeology.parcoursNoeud(subcontinentObjList[key], 1);  
      }
      else{
        html += "<li><span class='item-title'><i class='fa fa-minus'></i>" + key + "</span><ul style='display: block'>";
        html += layerOneGeology.parcoursNoeud(subcontinentObjList[key], 1);
      }      
      
      html += "</ul></li>";
    }
    html += "</ul>"
    $('#layer1GGAreaResult').append(html);
    
    
    // Ajout de l'autocompletion :
    if (mapviewer.config.tools.autocompleteKeyword.enable){
      if($.isEmptyObject(layerOneGeology.availableTags)){        
        // Récupération de tous les labels
        labels = $("#layer1GGAreaResult li>span, #layer1GGAreaResult li>label");        
        for (let li of labels) {                 
          // Pour chaque label, on récupère tous les mots et on l'ajoute dans le tableau availableTags
          words = $(li).text().split(/[,.\s\(\)\'\n:]/);      
          words.forEach(function(item){
            if(item.length>2 && !item.match(/^\d/)){
              layerOneGeology.availableTags.push(item);
            }
          })                
        }     
        
        // On affine la liste :
        //   - On supprime les doublons
        //   - On élimine les mots à moins de 2 caractères
        //   - On élimine les mots commençant par des chiffres
        layerOneGeology.availableTags = layerOneGeology.availableTags.filter(function(elem, index, self) {
          return index === self.indexOf(elem);
        });        
        layerOneGeology.availableTags.sort(function (a, b) {
          return a.toLowerCase().localeCompare(b.toLowerCase());
        });
        var dataList = $("#freeTxtResults");
        dataList.empty();
        layerOneGeology.availableTags.forEach(function(item){
          var opt = $("<option></option>").attr("value", item);
          dataList.append(opt);
        });     
        layerOneGeology.autocomplete(document.getElementById("freeTxt"), layerOneGeology.availableTags);        
      }
    }
  },

  /**
   * Recursive function to build the final tree
   * @param treeNode
   * @param level
   * @return {string}
   */
  parcoursNoeud: function (treeNode, level) {
    var html = "";
    var hasAllCheckbox = false;
    let isUniqueChild = layerOneGeology.countDirectChildren(treeNode) === 1;
    for (var key in treeNode) {
      if (treeNode[key][0]) {
        level = treeNode[key][0].level;
      }
      if (treeNode[key] && !treeNode[key].title && !treeNode[key].level) { // has childs        
        html += "<li><span class='item-title'><i class='fa fa-plus'></i>" + key + "</span><ul>";
        html += layerOneGeology.parcoursNoeud(treeNode[key], level);
        html += "</ul></li>";
      } else if (treeNode[key].title) {
        if (!hasAllCheckbox && !isUniqueChild) {
          var id = "all-" + (layerOneGeology.currentSelectAllId++);
          html += '<li class="classic-checkbox select-all-checkbox">' +
            "<input type='checkbox' id='" + id + "' />" +
            "<label for='" + id + "'>" + i18next.t('addlayer.selectAll') + "</label>" +
            "</li>";
          hasAllCheckbox = true;
        }
        var title = treeNode[key].title;
        if (treeNode[key].serviceType === "WFS") {
          title += " (Feature)";
        }
        if (treeNode[key].geosciml) {
          title += " (GeoSciML WFS)";
        }
        if (treeNode[key].portrayal) {
          if (treeNode[key].portrayalType === 'erml') {
            title += " (Erml-Lite Portrayal)";
          } else {
            title += " (GeoSciML Portrayal)";
          }
        }
        html += "<li class='classic-checkbox'>" +
          "<input type='checkbox' data-version='" + treeNode[key].version + "' id='" + treeNode[key].id + "' " +
          "name='" + treeNode[key].id + "' data-url='" + treeNode[key].serviceUrl + "' " +
          "data-layername='" + treeNode[key].layerName + "' data-extent='" + treeNode[key].extent + "' " +
          "data-service-type='" + (treeNode[key].serviceType || "WMS") + "'" +
          "data-wfs-url='" + (treeNode[key].serviceWfsUrl || "") + "' data-wfs-url-type='" + (treeNode[key].serviceWfsUrlType || "") + "' " +
          (treeNode[key].serviceUrlGfi ? "data-service-url-gfi='" + treeNode[key].serviceUrlGfi + "'" : "") +
          "value='" + treeNode[key].serviceUrl + ";" + treeNode[key].layerName + "'/>" +
          "<label for='" + treeNode[key].id + "'>" + title + "</label>" +
          "</li>";
      }
    }
    return html;
  },

  /**
   * Count treenode direct children (not with sublists)
   * @param {*} item
   * @return number
   */
  countDirectChildren: function (item) {
    var count = 0;
    for (var key in item) {
      if (item[key].title) {
        count++;
      }
    }
    return count;
  },

  /**
   * Add/remove a layer when click in the layer tree
   */
  manageAddLayer: function () {
    $('.menuLayerCounter .layerCount').addClass('loading');
    var layersData = [];
    var addedIds = [];
    $('#layerOneGeology .addLayerTab .tree-list input[type=checkbox]:checked').each(function () {
      if (!$(this).closest('li').hasClass('select-all-checkbox')) {
        var layerData = Object.assign({}, $(this).data());
        layerData.id = $(this).attr('id');
        // layerData.title = $(this).siblings('label').text();
        layerData.extent = layerData.extent.split(",").map(Number);
        layerData.type = 'layer';
        layerData.opacity = 0.7;
        if (addedIds.indexOf(layerData.id) < 0) {
          layersData.push(layerData);
          addedIds.push(layerData.id);
        }
      }
    });
    mapviewer.map.addLayers(layersData)
      .done(function () {
        $('a[href="#layer-switcher"]').click();
        $('.menuLayerCounter .layerCount').removeClass('loading');
        $('#layerOneGeology .addLayerTab .tree-list input[type=checkbox]:checked').prop('checked', false);
      });
  },

  /**
   * Get the thematic keyword for xml file in eXist
   * count the number of keyword occurence for the geonetwork layer list
   * @param recordList : layer list from geonetwork
   */
  getThematicKw: function (recordList) {
    var xml = mapviewer.load("./proxyxml?url=" + escape(layerOneGeology.urlThematicKw));
    var currentCategory = null;
    $(xml).find("thematic_keyword").each(function () {
      var kw = {};
      kw.category = Number($(this).find("category").text());
      kw.term = $(this).find("term").text();
      kw.definition = $(this).find("definition").text();
      kw.nbOccurence = 0;
      if (kw.category === 1) {
        currentCategory = kw.term;
      } else if (currentCategory) {
        kw.categoryName = currentCategory;
      }
      layerOneGeology.thematicKeywordList.push(kw);
    });

    recordList.forEach(function (record) {
      for (var j = 0; j < record.thematicKwList.length; j++) {
        layerOneGeology.thematicKeywordList.forEach(function (kw) {
          if (kw.term.toLowerCase() == record.thematicKwList[j].toLowerCase())
            kw.nbOccurence = kw.nbOccurence + 1;
        });
      }
    });

    //for(kw in layerOneGeology.thematicKeywordList){
    var html = "<option value=\"none\">" + i18next.t('addlayer.thematicDefaultOption') + "</option>";
    layerOneGeology.thematicKeywordList.forEach(function (kw) {

      var value = kw.term.charAt(0).toUpperCase() + kw.term.slice(1).toLowerCase();
      if (kw.nbOccurence > 0) {
        if (kw.category == 1) {
          html += "<option style=\"font-weight:bold\" value=\"" + value + "\">" + value + " (" + kw.nbOccurence + ")</option>";
        }
        if (kw.category == 2) {
          html += "<option value=\"" + value + "\">......" + value + " (" + kw.nbOccurence + ")</option>";
        }
      } else {
        if (kw.category == 1) {
          html += "<option disabled style=\"font-weight:bold\" value=\"" + value + "\">" + value + " (" + kw.nbOccurence + ")</option>";
        }
        if (kw.category == 2) {
          html += "<option disabled value=\"" + value + "\">......" + value + " (" + kw.nbOccurence + ")</option>";
        }
      }

    });
    $('[name="thematicKeywords"]').html(html);

  },


  /**
   * Show/hide advanced options in search engine
   */
  showHideSearchOptions: function () {
    $("#advancedOptions").toggle();
  },

  /**
   * Reset all search form to its default value and trigger search
   */
  resetSearchOptions: function () {
    $('#freeTxt').val('');
    $('#thematicKeywords').val('none');
    $('#advancedOptions input').prop('checked', false);
    $('#layerOneGeology .filterForm').trigger('submit');
  },

  makeSearchForVocab: function (vocabType) {
    if (layerOneGeology.firstLoadRunning) {
      setTimeout(function () {
        layerOneGeology.makeSearchForVocab(vocabType);
      }, 500);
    } else {
      $('#freeTxt').val('');
      $('#thematicKeywords').val('none');
      $('#advancedOptions input').prop('checked', false);
      if (!vocabType) {
        $('#wmsPortrayalErml').prop('checked', true);
        $('#wmsPortrayalGeosciml').prop('checked', true);
      } else if (vocabType === 'erml') {
        $('#wmsPortrayalErml').prop('checked', true);
      } else {
        $('#wmsPortrayalGeosciml').prop('checked', true);
      }
      $('#advancedOptions').show();
      $('#layerOneGeology .filterForm').trigger('submit');
    }
  },

  makeSearchForThematic: function (thematic) {
    $('#freeTxt').val('');
    $('#thematicKeywords').val(thematic.term);
    $('#advancedOptions input').prop('checked', false);
    $('#advancedOptions').hide();
    $('#layerOneGeology .filterForm').trigger('submit');
  }
}
