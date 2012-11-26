(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "Templating": Templating
    }
  });

  function sprintf (str, data) {
    var args = arguments;
    return str.replace(/{(\d+)}/g, function(match, number) {
        number = parseInt(number,10); 
        return args[number+1] !== undefined ? args[number+1] : match;
    });
  }

  var defaultMarkup = {
    focusSink: "<div tabIndex='0' hideFocus style='position:fixed;width:0;height:0;top:0;left:0;outline:0;'></div>",
    headerScroller: "<div class='slick-header ui-state-default' style='overflow:hidden;position:relative;' />",
    headers: "<div class='slick-header-columns' style='left:-1000px' />",
    headerRowScroller: "<div class='slick-headerrow ui-state-default' style='overflow:hidden;position:relative;' />",
    headerRow: "<div class='slick-headerrow-columns' />",
    headerRowSpacer: "<div style='display:block;height:1px;position:absolute;top:0;left:0;'></div>",
    headerRowCell: "<div class='ui-state-default slick-headerrow-column' />",
    topPanelScroller: "<div class='slick-top-panel-scroller ui-state-default' style='overflow:hidden;position:relative;' />",
    topPanel: "<div class='slick-top-panel' style='width:10000px' />",
    viewport: "<div class='slick-viewport' style='width:100%;overflow:auto;outline:0;position:relative;;'>",
    canvas: "<div class='grid-canvas' />",

    header: "<div class='ui-state-default slick-header-column' />",
    "column-name": "<span class='slick-column-name' />",
    "sort-indicator": "<span class='slick-sort-indicator' />",
    resizableHandle: "<div class='slick-resizable-handle' />",

    "row-start": "<div class='ui-widget-content {0}' style='top:{1}px'>",
    "row-end": "</div>",
    "cell-start": "<div class='{0}'>",
    "cell-end": "</div>",

    measureScrollbar: "<div style='position:absolute; top:-10000px; left:-10000px; width:100px; height:100px; overflow:scroll;'></div>",
    measureCellPaddingAndBorder: "<div class='ui-state-default slick-header-column' style='visibility:hidden'>-</div>",
    "measureCellPaddingAndBorder-row": "<div class='slick-row' />",
    "measureCellPaddingAndBorder-cell": "<div class='slick-cell' id='' style='visibility:hidden'>-</div>",
    getMaxSupportedCssHeight: "<div style='display:none' />",
    createCssRules: "<style type='text/css' rel='stylesheet' />"
  };

  var decorations = {
    viewport: {
      "css": function () { return { "overflow-y": this.options.autoHeight ? "hidden" : "auto" }; }
    }
  };

  function Templating (options) {
    this.options = options;
    this.plugin = options.templatingPlugin;
    this.decorations = $.extend(true, {}, decorations, this.options.templatingDecorations);
  }
  Templating.prototype = {
    getMarkup: function (name) {
      return this.plugin ? this.plugin.getMarkup(name) : defaultMarkup[name];
    },
    getDecorations: function (name) {
      var decor = this.decorations[name];
      decor = $.isArray(decor) ? decor : (decor ? [decor] : []);
      return decor;
    },
    addDecoration: function (name, decoration) {
      this.decorations[name] = this.getDecorations(name).push(decoration);
    },
    decorateElement: function (element, name) {
      var decorations = this.getDecorations(name);
      for (var i = 0, l = decorations.length; i < l; i++) {
        switch (typeof decorations[i]) {
          // an object containing jquery calls as "call": optionsObject
          // e.g. "addClass": "foobar"
          case "object":
            for (var p in decorations[i]) {
              var setter = decorations[i][p];
              switch (typeof setter) {
                case "function":
                  element[p](setter());
                  break;
                default:
                  element[p](decorations[i][p]);
                  break;
                }
            }
            break;
          case "function":
            decorations[i](element, name);
            break;
          // shortcut for addClass call
          case "string":
            element.addClass(decorations[i]);
            break;
        }
      }
    },
    createElement: function (name) {
      var markup = this.getMarkup(name);
      var element = $(markup);
      this.decorateElement(element, name);
      return element;
    },
    createMarkup: function (name, data) {
      var markup = this.getMarkup(name);
      var args = Array.prototype.slice.apply(arguments);
      args.splice(0, 1, markup);
      markup = sprintf.apply(this, args);
      return markup;
    }

  };

})(jQuery);