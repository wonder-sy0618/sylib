

define(function(require, exports, module) {
	
	var $ = require("jquery/jquery");
	

	/**
	 * 默认配置
	 */
	var defaults = {
		
		// api 基础路径
		apibaseurl : 'http://192.168.0.99/mtypes/',
		
		// api 接口地址配置
		apis : {
			"language"	: "api/open/language",
			"industry"	: "api/open/industry",
			"company"	: "api/open/company",
			"province"	: "api/open/province",
			"city"	: "api/open/city/{0}",
			"area"	: "api/open/area/{0}",
			"position"	: "api/open/position/{0}",
			"positionfirst"	: "api/open/positionfirst",
			"positionsecond"	: "api/open/positionsecond/{0}",
			"positionthird"	: "api/open/positionthird/{0}",
			"nation"	: "api/open/nation"
		},
		
		// 请求参数
		// 省份ID
		provinceid : '',
		// 城市ID
		cityid : '',
		// 职位类别ID
		positionfirstid : '',
		// 职位行业ID
		positionsecondid : '',
		
		// 回调方法
		success : function(json) {}
		
	};
	
	
	/**
	 * 全局设置
	 */
	var setup = function(opt) {
		var setup = $.extend(defaults, opt);
		defaults = setup;
	};
	
	
	/**
	 * API 统一调用方法
	 */
	var apiCaller = function(opts, apiname, urltreat) {
		var opt = $.extend(defaults, opts);
		var url = opt.apis[apiname].startWith("http") 
					? opt.apis[apiname]
					: opt.apibaseurl + opt.apis[apiname];
		console.log(apiname, opt.apis[apiname], url);
		if (urltreat && typeof(urltreat) == 'function') {
			url = urltreat(url);
		}
		(function(callback) {
			$.ajax({
				url : url,
				type : 'get',
				dataType : 'json',
				success : function(json) {
					callback(json[apiname]);
				},
				error : function(t,s) {
					console.warn("error", t, s);
				}
			});
		})(opt.success);
	};
	
	
	/**
	 * 语言类型
	 */ 
	var language = function(callback) {
		apiCaller({
			success : callback
		}, 'language');
	};
	
	
	/**
	 * 行业类型
	 */ 
	var industry = function(callback) {
		apiCaller({
			success : callback
		}, 'industry');
	};
	
	
	/**
	 * 公司类型
	 */ 
	var company = function(callback) {
		apiCaller({
			success : callback
		}, 'company');
	};
	
	
	/**
	 * 省份
	 */ 
	var province = function(callback) {
		apiCaller({
			success : callback
		}, 'province');
	};
	
	
	/**
	 * 城市
	 */ 
	var city = function(callback, provinceid) {
		apiCaller({
			success : callback
		}, 'city', function(url) {
			return url.format(provinceid);
		});
	};
	
	
	/**
	 * 地区
	 */ 
	var area = function(callback, cityid) {
		apiCaller({
			success : callback
		}, 'area', function(url) {
			return url.format(cityid);
		});
	};
	
	
	/**
	 * 职位类别
	 */ 
	var position = function(callback, depth) {
		apiCaller({
			success : callback
		}, 'position', function(url) {
			return url.format(depth);
		});
	};
	
	
	/**
	 * 职位类别
	 */ 
	var positionfirst = function(callback) {
		apiCaller({
			success : callback
		}, 'positionfirst');
	};
	
	
	/**
	 * 职位行业类别
	 */ 
	var positionsecond = function(callback, positionfirstid) {
		apiCaller({
			success : callback
		}, 'positionsecond', function(url) {
			return url.format(positionfirstid);
		});
	};
	
	
	/**
	 * 三级职位类别
	 */ 
	var positionthird = function(callback, positionsecondid) {
		apiCaller({
			success : callback
		}, 'positionthird', function(url) {
			return url.format(positionsecondid);
		});
	};
	
	
	/**
	 * 民族类型
	 */ 
	var nation = function(callback) {
		apiCaller({
			success : callback
		}, 'nation');
	};
	
	
	
	
	/**
	 * 暴露方法
	 */
	module.exports = {
		setup : setup,
		language : language,
		industry : industry,
		company : company,
		province : province,
		city : city,
		area : area,
		positionfirst : positionfirst,
		positionsecond : positionsecond,
		positionthird : positionthird,
		nation : nation,
		position : position
	};
	
});