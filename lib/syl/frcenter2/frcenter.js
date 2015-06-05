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
        
        // 资源基本路径
        path_resbase : utils.getCdnBasePath() + "lib/syl/frcenter2/res/",
        
        // LOGO图片
        path_logo : utils.getCdnBasePath() + "lib/syl/frcenter2/res/logo.png",

		// 样式表路径
		path_style : utils.getCdnBasePath() + "lib/syl/frcenter2/res/css/style.css",
        
        // 菜单模板路径
        path_tmpl : utils.getCdnBasePath() + "lib/syl/frcenter2/frcenter.tmpl",
        
        // 菜单数据路径
        path_data : utils.getCdnBasePath() + "lib/syl/frcenter2/menus.json",
        
        // 菜单数据（优先）
        data : undefined,
        
        // 绑定菜单事件
        event : function(frcenter) {},
        
        // 完成回调
        callback : function() {}

	};
	
	/**
	 * 当前页面相对URL，以此判断当前所处菜单
	 */
	var pageurl = function() {
		var pageurl = window.location.href.substring(utils.getPageBasePath().length, window.location.href.length);
		if (pageurl.indexOf("#") != -1) pageurl = pageurl.substring(0, pageurl.indexOf("#"));
		if (pageurl.indexOf("?") == pageurl.length-1) pageurl = pageurl.substring(0, pageurl.indexOf("?"));
		return pageurl;
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
			opt.pageurl = pageurl();
            //
            var style = $('<link href="" rel="stylesheet">').attr('href', opt.path_style);
            var frcenter = $(template.render(tmpl_frcenter)(opt));
            frcenter.on("click", ".menuitem", function(e) {
				if ($(this).hasClass("menu1")) {
					$(".menuitem.menu1").parents("li").removeClass("lihover");
					$(this).parents("li").addClass("lihover");
					$(".menu1group").hide().eq(
						Number($(this).parents("li").attr("index_menu1"))
					).show();
					return false;
					
				} else if ($(this).hasClass("menu2")) {
					var ul = $(this).parent().find("ul");
					if (ul.length > 0) {
						if (ul.is(":visible")) {
							ul.hide();
							$(this).parent().removeClass("ddhover");
						} else {
							ul.show();
							$(this).parent().addClass("ddhover");
						}
					}
					
				} else {
					var clientevent = $(this).attr("clientevent");
					var linkurl = $(this).attr("href");
					if (clientevent && clientevent != "") {
						return frcenter.triggerHandler(clientevent);
					} else {
						return true;
					}
					
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
			// 如果不包含激活的菜单，触发第一个
			if (frcenter.find(".menuaction").length <= 0) {
				// 触发第一个菜单
				$(".menuitem.menu1").first().click();
				if ($(".menuitem.menu2").first().parent().find("ul").length <=0) {
					// 三级菜单不存在
					$(".menuitem.menu2").first().children().click();
				} else {
					// 三级菜单存在
					$(".menuitem.menu2").first().parent().find("ul").find(".menuitem").first().children().click();
				} 
			} else {
				frcenter.find(".menuaction").first().parents(".menu1group").show();
				$(".menuitem.menu1").parents("li").removeClass("lihover");
				var index_menu1 = Number(frcenter.find(".menuaction").first().parents(".menu1group").attr("index_menu1"));
				$(".menuitem.menu1").parents("li[index_menu1="+index_menu1+"]").addClass("lihover");
			}
			// 设置当前路径
			if (frcenter.find(".menuaction").first().children().hasClass("menu3")) {
				// 三级菜单
				var m1 = $('.menuitem.menu1').parent('li.lihover').find('.tdmid').text();
				var m2 = frcenter.find(".menuaction").first().parents("ul").parent().find('.menu2').find("h1").text();
				var m3 = frcenter.find(".menuaction").first().find("p.lin").text();
				var html = '<span class="yellow">'+m1+'</span>' + '&nbsp;/&nbsp;' 
						+ '<span class="yellow">'+m2+'</span>' + '&nbsp;/&nbsp;' 
						+ '<span class="yellow">'+m3+'</span>';
				$(".frcenter_local").empty().append(html);
			} else {
				// 二级菜单
				var m1 = $('.menuitem.menu1').parent('li.lihover').find('.tdmid').text();
				var m2 = frcenter.find(".menuaction").first().find("h1").text();
				var html = '<span class="yellow">'+m1+'</span>' + '&nbsp;/&nbsp;' + '<span class="yellow">'+m2+'</span>';
				$(".frcenter_local").empty().append(html);
			}
        };
        if (!opt.data) {
            // 使用ajax菜单数据初始化
            $.when( 
                $.ajax({ url : opt.path_tmpl, dataType : 'text', error : function(e,s) {console.warn(e, s); } }),
                $.ajax({ url : opt.path_data, dataType : 'json', error : function(e,s) {console.warn(e, s); } })
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