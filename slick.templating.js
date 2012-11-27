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

  function Templating (options) {
    this.init(options);
  }
  Templating.prototype = {
    init: function (options) {
      this.options = options;
      this.plugin = options.templatingPlugin;
      this.decorations = $.extend(true, {}, this.decorations, this.options.templatingDecorations);
      this.selectors = $.extend(true, {}, this.selectors, this.options.templatingSelectors);
    },
    getMarkup: function (name) {
      return this.plugin && this.plugin.getMarkup ? this.plugin.getMarkup(name) : this.defaultMarkup[name];
    },
    getDecorations: function (name) {
      if (this.plugin && this.plugin.getDecorations) {
        return this.plugin.getDecorations(name);
      } else {
        var decor = this.decorations[name];
        decor = $.isArray(decor) ? decor : (decor ? [decor] : []);
        return decor;
      }
    },
    getClass: function (name) {
      if (this.plugin && this.plugin.getClass) {
        return this.plugin.getClass(name);
      } else {
        return this.getSelector(name).replace(/\.([a-z]*)/,"$1");
      }
    },
    getSelector: function (name) {
      return this.plugin && this.plugin.getSelector ? this.plugin.getSelector(name) : (this.selectors[name] ? this.selectors[name] : name);
    },
    addDecoration: function (name, decoration) {
      if (this.plugin && this.plugin.addDecoration) {
        this.plugin.addDecoration(name, decoration);
      } else {
        this.decorations[name] = this.getDecorations(name).push(decoration);
      }
    },
    decorateElement: function (element, name) {
      if (this.plugin && this.plugin.decorateElement) {
        this.plugin.decorateElement(element, name);
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
    createElement: function (name) {
      if (this.plugin && this.plugin.createElement) {
        return this.plugin.createElement(name);
      } else {
        var markup = this.getMarkup(name);
        var element = $(markup);
        this.decorateElement(element, name);
        return element;
      }
    },
    createMarkup: function (name, data) {
      if (this.plugin && this.plugin.createMarkup) {
        return this.plugin.createMarkup.apply(this, arguments);
      } else {
        var markup = this.getMarkup(name);
        var args = Array.prototype.slice.apply(arguments);
        args.splice(0, 1, markup);
        markup = sprintf.apply(this, args);
        return markup;
      }
    },
    defaultMarkup: {
      focusSink: "<div tabIndex='0' hideFocus style='position:fixed;width:0;height:0;top:0;left:0;outline:0;'></div>",
      headerScroller: "<div class='ui-state-default' style='overflow:hidden;position:relative;' />",
      headers: "<div style='left:-1000px' />",
      headerRowScroller: "<div class='ui-state-default' style='overflow:hidden;position:relative;' />",
      headerRow: "<div />",
      headerRowSpacer: "<div style='display:block;height:1px;position:absolute;top:0;left:0;'></div>",
      headerRowCell: "<div class='ui-state-default' />",
      topPanelScroller: "<div class='ui-state-default' style='overflow:hidden;position:relative;' />",
      topPanel: "<div style='width:10000px' />",
      viewport: "<div style='width:100%;overflow:auto;outline:0;position:relative;;'>",
      canvas: "<div />",

      header: "<div class='ui-state-default' />",
      "column-name": "<span />",
      "sort-indicator": "<span />",
      resizableHandle: "<div />",

      "row-start": "<div class='ui-widget-content {0}' style='top:{1}px'>",
      "row-end": "</div>",
      "cell-start": "<div class='{0}'>",
      "cell-end": "</div>",

      measureScrollbar: "<div style='position:absolute; top:-10000px; left:-10000px; width:100px; height:100px; overflow:scroll;'></div>",
      measureCellPaddingAndBorder: "<div class='ui-state-default' style='visibility:hidden'>-</div>",
      "measureCellPaddingAndBorder-row": "<div />",
      "measureCellPaddingAndBorder-cell": "<div id='' style='visibility:hidden'>-</div>",
      getMaxSupportedCssHeight: "<div style='display:none' />",
      createCssRules: "<style type='text/css' rel='stylesheet' />"
    },
    decorations: {
      viewport: {
        "css": function () { return { "overflow-y": this.options.autoHeight ? "hidden" : "auto" }; },
        "addClass": function () {
          return this.getClass("viewport");
        }
      },
      headerScroller: {
        "addClass": function () {
          return this.getClass("header");
        }
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
        }
      },
      "measureCellPaddingAndBorder-cell": {
        "addClass": function () {
          return this.getClass("cell");
        }
      },
      "measureCellPaddingAndBorder-row": {
        "addClass": function () {
          return this.getClass("row");
        }
      },
      headers: {
        "addClass": function () {
          return this.getClass("header-columns");
        }
      },
      headerRowScroller: {
        "addClass": function () {
          return this.getClass("headerrow");
        }
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
      topPanelScroller: {
        "addClass": function () {
          return this.getClass("top-panel-scroller");
        }
      },
      topPanel: {
        "addClass": function () {
          return this.getClass("top-panel");
        }
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

      "sortable-placeholder": ".slick-sortable-placeholder",
      "sort-indicator": ".slick-sort-indicator",
      "sort-indicator:asc": ".slick-sort-indicator-asc",
      "sort-indicator:desc": ".slick-sort-indicator-desc",

      "placeholder-state": ".ui-state-default"
    }

  };

})(jQuery);