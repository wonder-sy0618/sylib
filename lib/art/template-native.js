
define(function(require, exports, module) {
	
	var template = require("art/template-native/template-native");
	
	
	/**
	* 基于moment的日期格式化
	*/
	template.helper('dateFormat', function (date, format) {
		date = new Date(date);
		return require("moment/moment")(date).format(format);
	});
	
	
	/**
	* 正则匹配验证
	*/
	template.helper('regexMatch', function (string, regex) {
		return new RegExp(regex).test(string);
	});
	
	module.exports = template;
	
});