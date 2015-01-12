
define(function(require, exports, module) {
	
	var $ = require("jquery/jquery");
	var template = require("art/template");
	
	/**
	 * 模板加载器
	 */
	var tmpl = function(url, data, callback) {
		$.get(url, function(tmpl) {
			var cacheid = "tmpl_cache_" + url.replace(/\//g, "_").replace(/\./g, "_");
			var cache = $("#" + cacheid);
			if (cache.length <= 0) {
				cache = $("<script></script>");
				cache.attr("id", cacheid)
					.attr("type", "text/html")
					.append(tmpl);
				$("body").append(cache);
			}
			if (callback && typeof(callback) == "function") {
				var html = template(cacheid, data);
				callback(html);
			}
		});
	};
	
	module.exports = {
			tmpl : tmpl
	};
	
});