/**
 * Help page
 * @constructor
 */
var help = {
  init: function () {
    if (!mapviewer.config.tools.help.enable) {
      $('a[href="#menu-help"]').closest('li').remove();
      $('#menu-help').remove();
    } else {
      help.generateHelpPage();
      help.addEvents();

      if (mapviewer.config.tools.help.quickHelp && !localStorage.getItem('quickHelpDisplayed')) {
        setTimeout(function () {
          help.openQuickHelp();
        }, 500);
      }

      if (mapviewer.config.tools.help.enable && mapviewer.config.tools.help.survey.enable && !localStorage.getItem("surveyHasBeenViewed")) {
        setTimeout(function () {
          toastr.info(mapviewer.config.tools.help.survey.alertText, null, {
            closeButton: true,
            positionClass: "toast-bottom-right",
            extendedTimeOut: 0,
            timeOut: 0,
            onclick: function () {
              $('.sidebar-tabs a[href="#menu-help"]').click();
              localStorage.setItem("surveyHasBeenViewed", true);
            }
          });
        }, 45000);
      }  
    }
  },

  /**
   * Adds events of help panel
   */
  addEvents: function () {
    $('.quick-help').on('click', help.closeQuickHelp.bind(this));
    $('#help .btn-quick-help').on('click', help.closeQuickHelp.bind(this));
    $('#help .wms-validator-form').on('submit', help.validateUrl.bind(this));
  },

  /**
   * Generates the help page links and replace contact and info texts with configuration's help params
   */
  generateHelpPage: function () {
    if (!mapviewer.config.tools.help.wmsValidator) {
      $('#help .nav-tabs').remove();
    }


    var $linksContainer = $('#help .help-links');
    var $buttonsContainer = $('#help .btn-quick-help-container');

    var link;
    for (var i = mapviewer.config.tools.help.links.length - 1; i >= 0; i--) {
      link = mapviewer.config.tools.help.links[i];
      if (link.type === "button") {
        $('<a href="' + link.url + '" target="_blank">' + link.label + ' </a>')
          .addClass('btn btn-primary')
          .append($('<i class="fa fa-external-link-alt"></i>'))
          .insertAfter($buttonsContainer.find('.btn-quick-help'));
      } else {
        $('<a href="' + link.url + '" target="_blank">' + link.label + ' </a>')
          .addClass('standard-link')
          .append($('<i class="fa fa-external-link-alt"></i>'))
          .prependTo($linksContainer);
      }
    }

    $('#help .contact-link').attr('href', 'mailto:' + mapviewer.config.tools.help.contact.mail);

    if (mapviewer.config.tools.help.survey.enable) {
      if (mapviewer.config.tools.help.survey.text) {
        $('#help .bg-info p').text(mapviewer.config.tools.help.survey.text);
      }
      if (mapviewer.config.tools.help.survey.url) {
        $('#help .bg-info a').attr('href', mapviewer.config.tools.help.survey.url);
      }
    } else {
      $('#help .bg-info').remove();
    }

    if (!mapviewer.config.tools.help.quickHelp) {
      $('.btn-quick-help').remove();
    }
  },

  /**
   * Opens the quick help overlay
   */
  openQuickHelp: function () {
    if (!mapviewer.config.tools.showMenuByDefault.enable){
      if ($('.sidebar-content.active').length > 0) {
        $('.panel-toggle-btn').trigger('click');
      }
    }
    help.replaceHelpTexts();
    $('.quick-help').show();
  },

  /**
   * Closes the quick help overlay
   */
  closeQuickHelp: function () {
    $('.quick-help').hide();
    localStorage.setItem('quickHelpDisplayed', true);
  },

  /**
   * Replace some of the quick help texts
   */
  replaceHelpTexts: function () {
    let selectorOffset = $('.base-layer-selector').offset();
    $('.background-help').css('left', (selectorOffset.left - 2) + 'px');
  },

  /**
   * Validate WMS url
   * @param {*} event 
   */
  validateUrl: function (event) {
    event.preventDefault();
    event.stopPropagation();

    var $loader = $('#help .validator-loader');
    var $results = $('#help .wms-validator-results');
    var $successBox = $('#wms-validator .bg-success');
    var $errorBox = $('#wms-validator .bg-danger');


    $loader.show();
    $successBox.hide();
    $errorBox.hide();
    $results.hide().html('');

    var url = $('#wms-validator-url').val();

    mapviewer.tools.validateWMSUrl(url)
      .done(function (result) {
        if (result.valid) {
          $successBox.show();
        } else {
          if (result.error) {
            $results.append($('<li>').text(result.error));
          }
          if (result.errors) {
            for (const i in result.errors) {
              if (result.errors.hasOwnProperty(i)) {
                var $li = $('<li>').addClass('result-category').text(i);
                var $ul = $('<ul>');
                _.each(result.errors[i], function (error) {
                  $ul.append($('<li>').text(error));
                });
                $li.append($ul);
                $results.append($li);
              }
            }
          }
          $errorBox.show();
          $results.show();
        }
        $loader.hide();
      })
      .fail(function (error) {
        console.error(error);
        $loader.hide();
        if (error === "url") {
          toastr.error(i18next.t('help.urlError'));
        } else {
          toastr.error(i18next.t('help.validateError'));
        }
      });
  }
}