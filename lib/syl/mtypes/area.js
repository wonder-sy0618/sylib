
/**
 *	
 *	提供地区选择联动效果
 */
define(function(require, exports, module) {
	
	var $ = require("jquery/jquery");
	var mtypes = require("syl/mtypes");
	

	/**
	 * 默认配置
	 */
	var defaults = {
		
		// 目标元素
		target : '.sel_area',
		
		// 选项元素
		elem_prov : '.sel_item_prov',
		elem_city : '.sel_item_city',
		elem_area : '.sel_item_area',
		
		// 初始值
		init_prov : '',
		init_city : '',
		init_area : ''
		
	};
	
	
	/**
	 * 初始化
	 */ 
	var init = function(option) {
		var opt = $.extend({}, defaults, option);
		var loadProvSel = function() {
			mtypes.province(function(json) {
				var html = '<option>请选择</option>';
				$.each(json, function(kp, vp) {
					html = html + '<option _value="' + vp.id + '" value="' + vp.name + '" >' + vp.name + '</option>';
				});
				$(opt.target).find(opt.elem_prov).empty().append(html);
				$(opt.target).find(opt.elem_prov).find("option[value='"+opt.init_prov+"']").prop("selected", true);
				loadCitySel();
			});
		};
		var loadCitySel = function() {
			var provid = $(opt.target).find(opt.elem_prov).find("option:selected").attr("_value");
			$(opt.target).find(opt.elem_city).empty();
			if (provid && provid != '') {
				mtypes.city(function(json) {
					var html = '<option>请选择</option>';
					$.each(json, function(kp, vp) {
						html = html + '<option _value="' + vp.id + '" value="' + vp.name + '" >' + vp.name + '</option>';
					});
					$(opt.target).find(opt.elem_city).empty().append(html);
					$(opt.target).find(opt.elem_city).find("option[value='"+opt.init_city+"']").prop("selected", true);
					loadAreaSel();
				}, provid);
			}
		};
		var loadAreaSel = function() {
			var cityid = $(opt.target).find(opt.elem_city).find("option:selected").attr("_value");
			$(opt.target).find(opt.elem_area).empty();
			if (cityid && cityid != '') {
				mtypes.area(function(json) {
					var html = '<option>请选择</option>';
					$.each(json, function(kp, vp) {
						html = html + '<option _value="' + vp.id + '" value="' + vp.name + '" >' + vp.name + '</option>';
					});
					$(opt.target).find(opt.elem_area).empty().append(html);
					$(opt.target).find(opt.elem_area).find("option[value='"+opt.init_area+"']").prop("selected", true);
				}, cityid);
			}
		};
		$(opt.target).on("click", opt.elem_prov + "", function() {
			loadCitySel();
			
		}).on("change", opt.elem_prov + "", function() {
			loadCitySel();
			
		}).on("click", opt.elem_city + "", function() {
			loadAreaSel();
			
		}).on("change", opt.elem_city + "", function() {
			loadAreaSel();
			
		}).on("click", function() {
			opt.init_prov = "";
			opt.init_city = "";
			opt.init_area = "";

		});
		loadProvSel();
	};
	
	
	/**
	 * 获得Api接口
	 */ 
	var getMtypesApi = function() {
		return mtypes;
	};
	
	
	module.exports = {
		init : init,
		getMtypesApi : getMtypesApi
	};
	
	
});







