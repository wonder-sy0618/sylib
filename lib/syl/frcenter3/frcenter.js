/**
 *  管理中心框架
 *   基本元素：顶部，左侧菜单，中心
 */
define(function(require, exports, module) {
	
	var $ = require("jquery/jquery");
	var utils = require("syl/utils/utils");
	var template = require("art/template-native");
	var json = require('douglascrockford/json');
	
	 $.support.cors = true;

	/**
	 * 默认配置
	 */
	var defaults = {
        
        // 标题
        title : "管理中心",
        
        // 资源基本路径
        path_resbase : utils.getCdnBasePath() + "lib/syl/frcenter3/res/",
        
        // LOGO图片
        path_logo : utils.getCdnBasePath() + "lib/syl/frcenter3/res/logo.png",
        
        // headimg图片
        path_headimg : utils.getCdnBasePath() + "lib/syl/frcenter3/res/images/headimg.jpg",

		// 样式表路径
		path_style : utils.getCdnBasePath() + "lib/syl/frcenter3/res/css/style.css",
        
        // 菜单模板路径
        path_tmpl : utils.getCdnBasePath() + "lib/syl/frcenter3/frcenter.tmpl",
        
        // 菜单数据路径
        path_data : utils.getCdnBasePath() + "lib/syl/frcenter3/menus.json",
		
		// 用户标签
		head_target : [{
			cls : 'fwh',
			name : '服务号'
		}, {
			cls : 'yrz',
			name : '已认证'
		}],
        
        // 登录用户名
        val_loginuser : "陕西联通",
        
        // 菜单数据（优先）
        data : undefined,
        
        // 绑定菜单事件
        event : function(frcenter) {},
        
        // 完成回调
        callback : function() {},
		
		prop_name : 'name',
		
		prop_match : 'match',
		
		prop_linkurl : 'linkurl',
		
		prop_cls : 'cls',
		
		prop_icon : 'icon'

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
			// 预处理菜单
			for (var i1 = 0; i1<opt.data_menus.menus.length; i1++) {
				var m1 = opt.data_menus.menus[i1];
				if (opt.pageurl==m1[opt.prop_linkurl] || (m1[opt.prop_match] && new RegExp(m1[opt.prop_match]).test(opt.pageurl)) ) {
					m1.active = true;
				}
				if (m1.menus) {
					for (var i2 = 0; i2<m1.menus.length; i2++) {
						var m2 = m1.menus[i2];
						if (opt.pageurl==m2[opt.prop_linkurl] || (m2[opt.prop_match] && new RegExp(m2[opt.prop_match]).test(opt.pageurl)) ) {
							m1.active = true;
							m2.active = true;
						}
						if (m2.menus) {
							for (var i3 = 0; i3<m2.menus.length; i3++) {
								var m3 = m2.menus[i3];
								if (opt.pageurl==m3[opt.prop_linkurl] || (m3[opt.prop_match] && new RegExp(m3[opt.prop_match]).test(opt.pageurl)) ) {
									m1.active = true;
									m2.active = true;
									m3.active = true;
								}
							}
						}
					}
				}
			}
            //
            var style = $('<link href="" rel="stylesheet">').attr('href', opt.path_style);
            
            var temp_html = template.render(tmpl_frcenter)(opt);
            var frcenter = $('<div></div>').append(temp_html);
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
			$(".frcenter").children().appendTo(frcenter.find(".frcenter_main"));
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
			// 添加搜索支持
			var urllist = [];
			$.each(frcenter.find('.menu2, .menu3'), function(k, menu2) {
				menu2 = $(menu2);
				if (menu2.attr("href") && menu2.attr("href") != '') {
					urllist.push({
						name : menu2.children().text(),
						url : menu2.attr("href")
					});
				}
			});
			$(".frcenter_search_input").bind("input propertychange click", function() {
				// search
				var str = $(this).val();
				var html = '';
				$.each(urllist, function(index, obj) {
					if (obj.name.indexOf(str) != -1) {
						html = html + '<li linkhref="'+obj.url+'" >'+obj.name+'</li>';
					}
				});
				$(".frcenter_search_result ul").empty().append(html);
				$(".frcenter_search_result").show();
			});
			$(".frcenter_search_result ul").on("click", "li", function() {
				var linkhref = $(this).attr("linkhref");
				// $(".menu2[href='"+linkhref+"'], .menu3[href='"+linkhref+"']").click();
				// $(".frcenter_search_result").hide();
				window.location.href=linkhref;
				return false;
			});
			$(".frcenter_search").click(function() {
				return false;
			});
			$(document).click(function() {
				$(".frcenter_search_result").hide();
			});
        };
        if (!opt.data) {
            // 使用ajax菜单数据初始化
            $.ajax({
            	url : opt.path_tmpl,
            	dataType : 'text',
            	success : function(tmpl) {
            		$.ajax({
            			url : opt.path_data,
            			dataType : 'json',
            			success : function(data_menus) {
                            doinit(tmpl, data_menus);
            			},
                    	error : function(e) {
                    		alert(json.stringify(e));
                    	}
            		});
            	},
            	error : function(e, s) {
            		alert(typeof(e.statusText));
            	}
            });
        } else {
            // 使用js参数菜单数据初始化
    		$.ajax({
    			url : opt.path_tmpl,
    			dataType : 'text',
    			success : function(text) {
                    doinit(tmpl, opt.data);
    			},
            	error : function(e) {
            		alert(json.stringify(e));
            	}
    		});   
            
        }
	};
	
	module.exports = {
		init : init
	};
	
});