
/**
  *  设备工具
  *
  *  应用帆布指纹识别技术
  *
  */
define(function(require, exports, module) {
	
	var dactylogram = function() {
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		var txt = 'https://github.com/wonder-sy0618/sylib';
		ctx.textBaseline = "top" ;
		ctx.font = "14px 'Arial'" ;
		ctx.textBaseline = "sy" ;
		ctx.fillStyle = "#f60" ;
		ctx.fillRect( 125,1 ,62,20 );
		ctx.fillStyle = "#069" ;
		ctx.fillText( txt, 2, 15);
		ctx.fillStyle = "rgba(102, 204, 0, 0.7)" ;
		ctx.fillText( txt, 4, 17);

		var b64 = canvas.toDataURL().replace( "data:image/png;base64," ,"");
		var code = require('gwjjeff/cryptojs').MD5(b64);
		
		if (!window.syl) window.syl = {};
		if (!window.syl.device) window.syl.device = {};
		window.syl.device.dactylogram = code;
		
		return code;
	};
	
	module.exports = {
		dactylogram : dactylogram
	};
	
});