
define(function(require, exports, module) {
	
	var $ = require("jquery/jquery");
	var jQuery = $;
	var template = require("art/template");
	var base64 = require('syl/base64');
	
	
	/**
	 * 将tmplname转换为URL
	 */
	var resolveUrl = function(tmplname) {
		return tmplname.replace(/\\/g, "");
	};
	
	
	/**
	 * 将tmplname转换为URL
	 */
	var resolveDomid = function(tmplname) {
		return tmplname.replace(/\//g, "\\/").replace(/\./g, "\\.");
	};
	
	
	/**
	 * 加载模板文件
	 */
	var loadtmpl = function(tmplurls, callback) {
		var nocachetmpl = [];
		$.each(tmplurls, function(k, tmplname) {
			var cache = $("#" + tmplname);
			if (cache.length <= 0) {
				nocachetmpl.push(tmplname);
			}
		});
		//
		if (nocachetmpl.length > 0) {
			var ajaxHandler = [];
			$.each(nocachetmpl, function(k, v) {
				ajaxHandler.push($.get(resolveUrl(v)));
			});
			$.when.apply($, ajaxHandler).then(function() {
				// 保存模板依赖
				var dependTmplUrls = [];
				// 处理加载结果
				if (typeof(arguments[0]) == 'string') {
					arguments = [arguments];
				}
				$.each(arguments, function(k, argument) {
					// 模板名称
					var tmpl = argument[0];
					var tmplname = nocachetmpl[k];
					// 父模板地址
					var parenturl = resolveUrl(tmplname);
					var baseurl = parenturl.substring(0, parenturl.lastIndexOf('/')+1);
					// 缓存模板
					var cache = $("#" + tmplname);
					cache.remove();
					cache = $("<script></script>");
					cache.attr("id", tmplname)
						.attr("type", "text/html")
						.append(tmpl.replace(/{{\s*include\s*\'(.*?)\'/g, "{{include '"+resolveDomid(baseurl).replace(/\\/g, "\\\\")+"$1'"));
					$("body").append(cache);
					// 预处理模板
					var re = /{{\s*include\s*\'(.*?)\'/ig;
					var r = "";   
					while(r = re.exec(tmpl)) {   
						var url = r[1];
						dependTmplUrls.push(resolveDomid(baseurl) + url);
					}  
				});
				// 是否需要递归加载
				var noCacheDependTmplUrls = [];
				$.each(dependTmplUrls.unique(), function(index, cacheid) {
					cacheid = cacheid.replace(/\\\\/g, "\\");
					var cache = $("#" + cacheid);
					if (cache.length <= 0) {
						noCacheDependTmplUrls.push(cacheid);
					}
				});
				if (noCacheDependTmplUrls.length > 0) {
					loadtmpl(noCacheDependTmplUrls, callback);
				} else {
					if (callback && typeof(callback) == 'function') {
						callback();
					}
				}
				
			}, function(e) {
				console.log("template load faild.", e);
			});
		}
	};
	
	
	/**
	 * 模板加载器
	 */
	var tmpl = function(tmplname, data, callback) {
		loadtmpl([tmplname], function() {
			var html = template(tmplname, data);
			if (callback && typeof(callback) == 'function') {
				callback(html);
			}
		}); 
	};
	
	
	module.exports = {
			tmpl : tmpl
	};
	
});