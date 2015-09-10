/**
 *  管理中心框架
 *   基本元素：顶部，左侧菜单，中心
 */
define(function(require, exports, module) {
	
	var $ = require("jquery/jquery");
	var bootstrap = require('bootstrap/bootstrap');
	var utils = require("syl/utils/utils");
	var template = require("art/template");

	/**
	 * 默认配置
	 */
	var defaults = {
        
        // 创建目标
        target_selector : null,

		// 样式表路径
		path_style : utils.getCdnBasePath() + "lib/syl/wx/ui/preview/preview.css",
        
        // 菜单模板路径
        path_tmpl : utils.getCdnBasePath() + "lib/syl/wx/ui/preview/preview.tmpl",
        
        // 菜单数据路径
        path_data : utils.getCdnBasePath() + "lib/syl/wx/ui/preview/demo/demo.json",
        
        // CDN基础路径
        path_cdn_base : utils.getCdnBasePath() + "lib/syl/wx/ui/preview/demo/",
        
        // RES CDN基础路径
        path_res_base : utils.getCdnBasePath() + "lib/syl/wx/ui/preview/res/",
        
        // 菜单数据（优先）
        data : undefined,
		
		// ajax加载完成事件
		on_data_load : function(data) {return data;},
        
        // 绑定菜单事件
        event : function(preview) {},
        
        // 完成回调
        callback : function() {}

	};
	
	/**
	 * 初始化方法，为body初始化frcenter框架
	 */
	var init = function(options) {
		var opt = $.extend({}, defaults, options);
		if (!opt.target_selector) {
			console.warn("not found configure [target_selector]");
		}
        // 执行初始化
        var doinit = function(tmpl, data) {
            // 
            opt.data = data;
            //
            var style = $('<link href="" rel="stylesheet">').attr('href', opt.path_style);
            var html = $(template.render(tmpl)(opt));
            opt.event(html);
            // 向页面追加
            $(opt.target_selector)
                .append(style)
                .append(html);
			var imageChange = function(img) {
				var box_width = $(img).parent().width();
				var box_height = $(img).parent().height();
				var img_width = $(img).width();
				var img_height = $(img).height();
				if (box_width / box_height > img_width / img_height) {
					$(img).parent().find(".loading").remove();
					$(img).css("width", "100%").css("height", "auto").show();
				} else {
					$(img).parent().find(".loading").remove();
					$(img).css("width", "auto").css("height", "100%").show();
				}
			};
			// imagebox 初始化
			$.each($(opt.target_selector).find(".image_box img"), function(k, v) {
				var src = $(v).attr("src");
				if (src && src != '') {
					var loading = $('<img src="'+opt.path_res_base+'loading.gif" class="loading" />');
					$(v).hide().after(loading).bind("load", function() {
						(function(tag) {
							window.setTimeout(function() {
								imageChange(tag);
							});
						})(this);
					});
				} else {
				} 
			});
			$(window).resize(function(event) {
				$.each($(opt.target_selector).find(".image_box img"), function(k, v) {
					imageChange($(v));
				});
			});
            // 回调
            opt.callback();
        };
        if (!opt.data) {
            // 使用ajax菜单数据初始化
            $.when( 
                $.ajax({ url : opt.path_tmpl, dataType : 'text', error : function(s, e) {console.log(s, e);} }),
                $.ajax({ url : opt.path_data, dataType : 'json', error : function(s, e) {console.log(s, e);} })
            ).done(function (tmpl, data) {
				var data = opt.on_data_load(data[0]);
                doinit(tmpl[0], data);
            });         
            
        } else {
            // 使用js参数菜单数据初始化
            $.when( 
                $.ajax({ url : opt.path_tmpl, dataType : 'text' })
            ).done(function (tmpl) {
                doinit(tmpl, opt.data);
            });         
            
        }
	};
	
	module.exports = {
		init : init
	};
	
});