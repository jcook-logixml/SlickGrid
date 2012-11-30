(function ($) {
	$.extend(true, window, {
		"Slick": {
			"ColumnReorder": ColumnReorder
		}
	});

	function ColumnReorder(options, defaults) {
		return $.extend(true, {}, defaults, options.columnReorder);
	}

})(jQuery);