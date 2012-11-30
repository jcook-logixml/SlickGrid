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
    this.options = options;
  }
  Templating.prototype = {
    getMarkup: function (name) {
      return this.defaultMarkup[name];
    },
    getClass: function (name) {
      return this.getSelector(name).replace(/\.([a-z]*)/,"$1");
    },
    getSelector: function (name) {
      return this.selectors[name] ? this.selectors[name] : name;
    },
    appendTo: function ($element, stop) {
      return $element;
    },
    createElement: function (name) {
      var markup = this.getMarkup(name);
      var element = $(markup);
      return element;
    },
    createMarkup: function (name, data) {
      var markup = this.getMarkup(name);
      var args = Array.prototype.slice.apply(arguments);
      args.splice(0, 1, markup);
      markup = sprintf.apply(this, args);
      return markup;
    },
    defaultMarkup: {
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

      // formatted for use with sprintf, use createMarkup to access 
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