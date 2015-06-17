

/**
 *  管理中心框架
 */
define(function(require, exports, module) {
	
	var $ = require("jquery/jquery");
	var utils = require("syl/utils/utils");
	var template = require("art/template-native");

	/**
	 * 默认配置
	 */
	var defaults = {
		
		// 写入的元素
		element : '',
		
		// 样式表路径
		path_style : utils.getCdnBasePath() + "lib/syl/fpageutil/fpageutil.css",
        
        // 菜单模板路径
        path_tmpl : utils.getCdnBasePath() + "lib/syl/fpageutil/fpageutil.tmpl",
		
		// 页长度选项
		page_size_opt : [10, 20, 30],
		
		// 当前页长度
		page_size : 10,
		
		// 页码工具栏两侧显示个数
		page_index_size_edge : 5,
		
		// 页码工具栏中间在当前页两侧显示个数
		page_index_size_mid_edge : 2,
		
		// 页码（1～n）
		page_index : 1,
		
		// 总页数
		page_count : 20,
		
		// 状态变更通知
		onstatechange : function(page, pagesize) {}
		
	};
	
	
	/**
	 * 计算页码
	 */
	var pagecel = function(count, pagesize) {
		return Math.ceil(count / pagesize);
	};
	
	
	
	/**
	 * 初始化方法
	 */
	var init = function(options) {
		var opt = $.extend({}, defaults, options);
		$.ajax({
			url : opt.path_tmpl, 
			dataType : 'text',
			success : function(tmpl) {
				var style = $('<link href="" rel="stylesheet">').attr('href', opt.path_style);
				var fpageutil = $(template.render(tmpl)(opt));
				var reload = function() {
					// 刷新
					var html = $(template.render(tmpl)(opt));
					fpageutil.empty().append(html.children());
					fpageutil.attr("page_index", html.attr("page_index"));
					
				};
				// 注册事件
				fpageutil.on("click", ".page_index", function() {
					opt.page_index = Number($(this).attr("page_index"));
					opt.onstatechange(opt.page_size, opt.page_index);
					reload();
					
				}).on("click", ".page_last", function() {
					opt.page_index = Number(opt.page_index) - 1;
					opt.onstatechange(opt.page_size, opt.page_index);
					reload();
					
				}).on("click", ".page_next", function() {
					opt.page_index = Number(opt.page_index) + 1;
					opt.onstatechange(opt.page_size, opt.page_index);
					reload();
					
				}).on("click", ".page_size", function() {
					var page_size = Number($(this).attr("page_size"));
					opt.page_size = page_size;
					opt.onstatechange(opt.page_size, opt.page_index);
					reload();
					
				});
				// 追加
				$(opt.element)
					.empty()
					.append(style)
					.append(fpageutil)
					.on("select", function() {
						return false;
					});
			}
		});
	};
	
	
	
	module.exports = {
		init : init,
		pagecel : pagecel
	};
	
});


