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
        
        // 标题
        title : "管理中心",
        
        // LOGO图片
        path_logo : utils.getCdnBasePath() + "lib/syl/frcenter/res/logo.png",

		// 样式表路径
		path_style : utils.getCdnBasePath() + "lib/syl/frcenter/frcenter.css",
        
        // 菜单模板路径
        path_tmpl : utils.getCdnBasePath() + "lib/syl/frcenter/frcenter.tmpl",
        
        // 菜单数据路径
        path_data : utils.getCdnBasePath() + "lib/syl/frcenter/frcenter.json",
        
        // 菜单数据（优先）
        data : undefined,
        
        // 绑定菜单事件
        event : function(frcenter) {},
        
        // 完成回调
        callback : function() {}

	};
	
	/**
	 * 初始化方法，为body初始化frcenter框架
	 */
	var init = function(options) {
		var opt = $.extend(defaults, options);
		$("body").addClass("frcenter");
        // 执行初始化
        var doinit = function(tmpl_frcenter, data_menus) {
            // 
            opt.data_menus = data_menus;
            //
            var style = $('<link href="" rel="stylesheet">').attr('href', opt.path_style);
            var frcenter = $(template.render(tmpl_frcenter)(opt));
            frcenter.on("click", ".menuitem", function(e) {
                var clientevent = $(this).attr("clientevent");
                var linkurl = $(this).attr("href");
                if (clientevent && clientevent != "") {
                    return frcenter.triggerHandler(clientevent);
                } else {
                    return true;
                }
            });
            opt.event(frcenter);
            // 移动页面上存在的元素
			$(".frcenter").children().appendTo(frcenter.find(".main"));
            // 向页面追加
            $(".frcenter")
                .append(style)
                .append(frcenter);
            // 回调
            opt.callback();
        };
        if (!opt.data) {
            // 使用ajax菜单数据初始化
            $.when( 
                $.ajax({ url : opt.path_tmpl, dataType : 'text' }),
                $.ajax({ url : opt.path_data, dataType : 'json' })
            ).done(function (tmpl, data_menus) {
                doinit(tmpl[0], data_menus[0]);
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