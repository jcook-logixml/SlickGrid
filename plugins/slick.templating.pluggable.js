(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "Templating": Templating
    }
  });

  function sprintf (str, data) {
    var args = arguments;
    return str.replace(/\{(\d+)\}/g, function(match, number) {
        number = parseInt(number,10);
        return args[number+1] !== undefined ? args[number+1] : match;
    });
  }

  function styleToMap (str) {
    var properties = str.split(";");
    var map = {};
    for (var p = 0, l = properties.length; p < l; p++) {
      var pv = properties[p].split(":");
      if (pv[0].length > 0) map[pv[0]] = pv[1];
    }
    return map;
  }

  function Templating (options) {
    this.init(options);
  }
  Templating.prototype = {
    init: function (options) {
      this.options = options;
      this.plugin = options.templating ? new options.templating.plugin(options) : null;
      this.decorations = options.templating ? $.extend(true, {}, this.decorations, options.templating.decorations): this.decorations;
      this.selectors = options.templating ? $.extend(true, {}, this.selectors, options.templatingSelectors) : this.selectors;
    },
    getMarkup: function (name) {
      return this.plugin && this.plugin.getMarkup ? this.plugin.getMarkup(name, this) : this.defaultMarkup[name];
    },
    getDecorations: function (name) {
      if (this.plugin && this.plugin.getDecorations) {
        return this.plugin.getDecorations(name, this);
      } else {
        var decor = this.decorations[name];
        decor = $.isArray(decor) ? decor : (decor ? [decor] : []);
        return decor;
      }
    },
    getClass: function (name) {
      if (this.plugin && this.plugin.getClass) {
        return this.plugin.getClass(name, this);
      } else {
        return this.getSelector(name).replace(/\.([a-z]*)/,"$1");
      }
    },
    getSelector: function (name) {
      return this.plugin && this.plugin.getSelector ? this.plugin.getSelector(name, this) : (this.selectors[name] ? this.selectors[name] : name);
    },
    addDecoration: function (name, decoration) {
      if (this.plugin && this.plugin.addDecoration) {
        this.plugin.addDecoration(name, decoration, this);
      } else {
        this.decorations[name] = this.getDecorations(name).push(decoration);
      }
    },
    decorateElement: function (element, name) {
      if (this.plugin && this.plugin.decorateElement) {
        this.plugin.decorateElement(element, name, this);
      } else {
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
                    element[p](setter.call(this));
                    break;
                  default:
                    element[p](decorations[i][p]);
                    break;
                  }
              }
              break;
            case "function":
              decorations[i].call(this, element, name);
              break;
            // shortcut for addClass call
            case "string":
              element.addClass(decorations[i]);
              break;
          }
        }
      }
    },
    appendTo: function ($element, stop) {
      if (this.plugin && this.plugin.appendTo) {
        return this.plugin.appendTo($element, stop);
      } else {
        return $element;
      }
    },
    createElement: function (name) {
      if (this.plugin && this.plugin.createElement) {
        return this.plugin.createElement(name, this);
      } else {
        var markup = this.getMarkup(name);
        var element = $(markup);
        this.decorateElement(element, name);
        return element;
      }
    },
    createMarkup: function (name, data) {
      if (this.plugin && this.plugin.createMarkup) {
        return this.plugin.createMarkup.apply(this.plugin, [this].concat(Array.prototype.slice.call(arguments)));
      } else {
        var markup = this.getMarkup(name);
        var args = Array.prototype.slice.apply(arguments);
        args.splice(0, 1, markup);
        markup = sprintf.apply(this, args);
        return markup;
      }
    },
    markup: {
      focusSink: "<div tabIndex='0' />",
      headerScroller: "<div class='ui-state-default' />",
      headers: "<div />",
      headerRowScroller: "<div class='ui-state-default' />",
      headerRow: "<div />",
      headerRowSpacer: "<div />",
      headerRowCell: "<div class='ui-state-default' />",
      topPanelScroller: "<div class='ui-state-default' />",
      topPanel: "<div />",
      viewport: "<div />",
      canvas: "<div />",

      header: "<div class='ui-state-default' />",
      "column-name": "<span />",
      "sort-indicator": "<span />",
      resizableHandle: "<div />",

      "row-start": "<div class='ui-widget-content {0}' style='top:{1}px'>",
      "row-end": "</div>",
      "cell-start": "<div class='{0}'>",
      "cell-end": "</div>",

      measureScrollbar: "<div />",
      measureCellPaddingAndBorder: "<div class='ui-state-default'>-</div>",
      "measureCellPaddingAndBorder-row": "<div />",
      "measureCellPaddingAndBorder-cell": "<div id=''>-</div>",
      getMaxSupportedCssHeight: "<div />",
      createCssRules: "<style type='text/css' rel='stylesheet' />"
    },
    decorations: {
      viewport: {
        "addClass": function () {
          return this.getClass("viewport");
        },
        "css": styleToMap("width:100%;overflow:auto;outline:0;position:relative;")
      },
      focusSink: {
        "css": styleToMap("position:fixed;width:0;height:0;top:0;left:0;outline:0;")
      },
      headerScroller: {
        "addClass": function () {
          return this.getClass("header");
        },
        "css": styleToMap("overflow:hidden;position:relative;")
      },
      header: {
        "addClass": function () {
          return this.getClass("header-column");
        }
      },
      "column-name": {
        "addClass": function () {
          return this.getClass("column-name");
        }
      },
      measureCellPaddingAndBorder: {
        "addClass": function () {
          return this.getClass("header-column");
        },
        "css": styleToMap("visibility:hidden")
      },
      "measureCellPaddingAndBorder-cell": {
        "addClass": function () {
          return this.getClass("cell");
        },
        "css": styleToMap("visibility:hidden")
      },
      "measureCellPaddingAndBorder-row": {
        "addClass": function () {
          return this.getClass("row");
        }
      },
      measureScrollbar: {
        "css": styleToMap("position:absolute; top:-10000px; left:-10000px; width:100px; height:100px; overflow:scroll;")
      },
      getMaxSupportedCssHeight: {
        "css": styleToMap("display:none")
      },
      headers: {
        "addClass": function () {
          return this.getClass("header-columns");
        },
        "css": styleToMap("left:-1000px")
      },
      headerRowScroller: {
        "addClass": function () {
          return this.getClass("headerrow");
        },
        "css": styleToMap("overflow:hidden;position:relative;")
      },
      headerRow: {
        "addClass": function () {
          return this.getClass("headerrow-columns");
        }
      },
      headerRowCell: {
        "addClass": function () {
          return this.getClass("headerrow-column");
        }
      },
      headerRowSpacer: {
        "css": styleToMap("display:block;height:1px;position:absolute;top:0;left:0;")
      },
      topPanelScroller: {
        "addClass": function () {
          return this.getClass("top-panel-scroller");
        },
        "css": styleToMap("overflow:hidden;position:relative;")
      },
      topPanel: {
        "addClass": function () {
          return this.getClass("top-panel");
        },
        "css": styleToMap("width:10000px")
      },
      canvas: {
        "addClass": function () {
          return this.getClass("canvas");
        }
      },
      "sort-indicator": {
        "addClass": function () {
          return this.getClass("sort-indicator");
        }
      },
      resizableHandle: {
        "addClass": function () {
          return this.getClass("resizable-handle");
        }
      }
    },
    selectors: {
      "viewport": ".slick-viewport",
      "canvas": ".grid-canvas",
      "header": ".slick-header",
      "headerrow": ".slick-headerrow",
      "header-column": ".slick-header-column",
      "header-columns": ".slick-header-columns",
      "headerrow-column": ".slick-headerrow-column",
      "headerrow-columns": ".slick-headerrow-columns",

      "column-name": ".slick-column-name",

      "top-panel": ".slick-top-panel",
      "top-panel-scroller": ".slick-top-panel-scroller",

      "cell": ".slick-cell",
      "row": ".slick-row",
      "active": ".active",
      "editable": ".editable",

      "resizable-handle": ".slick-resizable-handle",
      "header-column:hover": ".ui-state-hover",
      "header-column:active": ".slick-header-column-active",
      "header-column:sorted": ".slick-header-column-sorted",
      "header-column:sortable": ".slick-header-column",

      "sortable-placeholder": ".slick-sortable-placeholder",
      "sort-indicator": ".slick-sort-indicator",
      "sort-indicator:asc": ".slick-sort-indicator-asc",
      "sort-indicator:desc": ".slick-sort-indicator-desc",

      "placeholder-state": ".ui-state-default"
    }

  };

})(jQuery);