

define(function(require, exports, module) {
	
	var $ = require("jquery/jquery");
	var utils = require("syl/utils");
	var base64 = require("syl/base64");

	var play = function(url) {
		if (!url) {
			url = utils.getCdnBasePath() + 'lib/syl/audionotify/notice.mp3';
		}
		var audio = $('audio.audiojs_play[src=\''+url+'\']');
		if (audio.length <= 0) {
			$('<audio src="'+url+'" class="audiojs_play" />').appendTo("body");
		}
		audio = $('audio.audiojs_play[src=\''+url+'\']');
		audio[0].play();
	};



	module.exports={
		play : play
		
	};



});