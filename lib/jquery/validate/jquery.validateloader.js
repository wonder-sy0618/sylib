

define(function(require, exports, module) {

	var $ = require("jquery/jquery");
	var validate = require("jquery/validate/jquery.validate.js");
	
	var jQuery = $;
	
	jQuery.extend(jQuery.validator.messages, {
		  required: "������д",
		  remote: "���������ֶ�",
		  email: "��������ȷ��ʽ�ĵ�������",
		  url: "������Ϸ�����ַ",
		  date: "������Ϸ�������",
		  dateISO: "������Ϸ������� (ISO).",
		  number: "������Ϸ�������",
		  digits: "ֻ����������",
		  creditcard: "������Ϸ������ÿ���",
		  equalTo: "�����������벻һ�£�����������",
		  accept: "������ӵ�кϷ���׺�����ַ���",
		  maxlength: jQuery.validator.format("������һ�� ��������� {0} ���ַ���"),
		  minlength: jQuery.validator.format("������һ�� ���������� {0} ���ַ���"),
		  rangelength: jQuery.validator.format("������ һ�����Ƚ��� {0} �� {1} ֮����ַ���"),
		  range: jQuery.validator.format("������һ������ {0} �� {1} ֮���ֵ"),
		  max: jQuery.validator.format("������һ�����Ϊ{0} ��ֵ"),
		  min: jQuery.validator.format("������һ����СΪ{0} ��ֵ")
	});
	// �û�����֤   
	jQuery.validator.addMethod("isNameCode", function(value, element) {   
		var tel = /^[a-zA-z][a-zA-Z0-9_]{3,16}$/;
		return this.optional(element) || (tel.test(value));
	}, "��������ĸ�����ֿ�ͷ������λ");
	
	//������֤   
	jQuery.validator.addMethod("isPassWCode", function(value, element) {   
		var tel = /^[a-zA-Z0-9_]{4,16}/;
		return this.optional(element) || (tel.test(value));
	}, "��������ĸ�����ֿ�ͷ������λ");
	
	// �ֻ�������֤       
	jQuery.validator.addMethod("isMobile", function(value, element) {       
		 var length = value.length;   
		// var mobile =/^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/;   
		//	mobile = /1\d{10}/;
		 return this.optional(element) || (value.length == 11 && value.indexOf(0) == '1');   
	}, "����ȷ��д�����ֻ�����"); 
	// ������֤       
	jQuery.validator.addMethod("isName", function(value, element) {       
		 var length = value.length;   
		 var name =/^\s*[\u4e00-\u9fa5]{1,15}\s*$/;   
		 return this.optional(element) || (name.test(value));       
	}, "����ȷ��д����������ֻ��Ϊ����"); 
	// ���֤��֤     
	jQuery.validator.addMethod("iscardv", function(value, element) {       
		 var length = value.length;   
		 var card =/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;   
		 return this.optional(element) || (card.test(value));       
	}, "����ȷ��д�������֤��"); 
	// �绰�����������ж�     
	jQuery.validator.addMethod("istelephone", function(value, element) {       
		 var length = value.length;   
		 var telephone =/^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;   
		 return this.optional(element) || (telephone.test(value));       
	}, "����ȷ��д���绰����"); 
	
	//�����ж�     
	jQuery.validator.addMethod("isage", function(value, element) {       
		 var length = value.length;   
		 var isage =/^(1[89])|([2-7][0-9])|(50)$/;   
		 return this.optional(element) || (isage.test(value));       
	}, "����ȷ��Щ����"); 
	
	//��Ƹ����  
	jQuery.validator.addMethod("iszprs", function(value, element) {       
		 var length = value.length;   
		 var iszprs =/^\+?(0|[1-9][0-9]*)$/;   
		 return this.optional(element) || (iszprs.test(value));       
	}, "����ȷ��Щ����"); 
	
	jQuery.validator.addMethod("isTitles", function(value, element) {       
		 var length = value.length;   
		 var isTitles =/^[a-zA-Z0-9_\u4e00-\u9fa5]/;   
		 return this.optional(element) || (isTitles.test(value));       
	}, "ֻ���������֡���ĸ������"); 
	
	module.exports = {
	};
	
});//pageready