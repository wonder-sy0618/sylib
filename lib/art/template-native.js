
define(function(require, exports, module) {
	
	var template = require("art/template-native/template-native");
	
	
	/**
	* 基于moment的日期格式化
	*/
	template.helper('dateFormat', function (date, format) {
		date = new Date(date);
		return require("moment/moment")(date).format(format);
	});
	
	module.exports = template;
	
});