

define(function(require, exports, module) {

	var $ = require("jquery/jquery");
	var validate = require("jquery/validate/jquery.validate.js");
	
	var jQuery = $;
	
	jQuery.extend(jQuery.validator.messages, {
		  required: "必须填写",
		  remote: "请修正该字段",
		  email: "请输入正确格式的电子邮箱",
		  url: "请输入合法的网址",
		  date: "请输入合法的日期",
		  dateISO: "请输入合法的日期 (ISO).",
		  number: "请输入合法的数字",
		  digits: "只能输入整数",
		  creditcard: "请输入合法的信用卡号",
		  equalTo: "两次密码输入不一致，请重新输入",
		  accept: "请输入拥有合法后缀名的字符串",
		  maxlength: jQuery.validator.format("请输入一个 长度最多是 {0} 的字符串"),
		  minlength: jQuery.validator.format("请输入一个 长度最少是 {0} 的字符串"),
		  rangelength: jQuery.validator.format("请输入 一个长度介于 {0} 和 {1} 之间的字符串"),
		  range: jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
		  max: jQuery.validator.format("请输入一个最大为{0} 的值"),
		  min: jQuery.validator.format("请输入一个最小为{0} 的值")
	});
	// 用户名验证   
	jQuery.validator.addMethod("isNameCode", function(value, element) {   
		var tel = /^[a-zA-z][a-zA-Z0-9_]{3,16}$/;
		return this.optional(element) || (tel.test(value));
	}, "必须以字母或数字开头至少四位");
	
	//密码验证   
	jQuery.validator.addMethod("isPassWCode", function(value, element) {   
		var tel = /^[a-zA-Z0-9_]{4,16}/;
		return this.optional(element) || (tel.test(value));
	}, "必须以字母或数字开头至少四位");
	
	// 手机号码验证       
	jQuery.validator.addMethod("isMobile", function(value, element) {       
		 var length = value.length;   
		// var mobile =/^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/;   
		//	mobile = /1\d{10}/;
		 return this.optional(element) || (value.length == 11 && value.indexOf(0) == '1');   
	}, "请正确填写您的手机号码"); 
	// 姓名验证       
	jQuery.validator.addMethod("isName", function(value, element) {       
		 var length = value.length;   
		 var name =/^\s*[\u4e00-\u9fa5]{1,15}\s*$/;   
		 return this.optional(element) || (name.test(value));       
	}, "请正确填写您的姓名，只能为汉字"); 
	// 身份证验证     
	jQuery.validator.addMethod("iscardv", function(value, element) {       
		 var length = value.length;   
		 var card =/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;   
		 return this.optional(element) || (card.test(value));       
	}, "请正确填写您的身份证号"); 
	// 电话号码座机号判断     
	jQuery.validator.addMethod("istelephone", function(value, element) {       
		 var length = value.length;   
		 var telephone =/^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;   
		 return this.optional(element) || (telephone.test(value));       
	}, "请正确填写您电话号码"); 
	
	//年龄判断     
	jQuery.validator.addMethod("isage", function(value, element) {       
		 var length = value.length;   
		 var isage =/^(1[89])|([2-7][0-9])|(50)$/;   
		 return this.optional(element) || (isage.test(value));       
	}, "请正确填些年龄"); 
	
	//招聘人数  
	jQuery.validator.addMethod("iszprs", function(value, element) {       
		 var length = value.length;   
		 var iszprs =/^\+?(0|[1-9][0-9]*)$/;   
		 return this.optional(element) || (iszprs.test(value));       
	}, "请正确填些年龄"); 
	
	jQuery.validator.addMethod("isTitles", function(value, element) {       
		 var length = value.length;   
		 var isTitles =/^[a-zA-Z0-9_\u4e00-\u9fa5]/;   
		 return this.optional(element) || (isTitles.test(value));       
	}, "只能输入数字、字母、汉字"); 
	
	module.exports = {
	};
	
});//pageready