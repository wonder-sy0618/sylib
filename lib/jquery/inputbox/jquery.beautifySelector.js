
/**

				
					<select name="xingzhi" >
						<option value="0" >不限</option>
						<option value="1" selected="selected" >3-5年</option>
						<option value="2" >5-7年</option>
					</select>
					 
					 <script src="http://192.168.0.220:8780/sylib/sylib.js" type="text/javascript" charset="utf-8"></script>
					 <script type="text/javascript" >
						seajs.use(['jquery/jquery', 'jquery/beautifySelector'], function($, beautifySelector) {
							$("select[name=xingzhi]").beautifySelector({
								height:23,
								width:230
							});
						});
					 </script>
					 
					 



*/
define(function(require, exports, module) {
	
	var $ = require("jquery/jquery");
	var jQuery = $;
	
	var inputbox = require("jquery/inputbox");
	
	;(function($){
		var opts = {};
			   
		var beautifySelector = {
			//初始化自定义selectbox
			init: function(o, opts) {
				var $sel = $(o);
				var name = $sel.attr("name")?$sel.attr("name"):'';
				if ($sel.parents("div[type=selectbox][name="+name+"]").length > 0) {
					var _wrap = $sel.parents("div[type=selectbox][name="+name+"]");
					_wrap.after($sel);
					$sel.show();
					_wrap.remove();
				}
				var wrap = $('<div name="'+name+'" type="selectbox" style="" ><div class="opts"></div></div>');
				$.each($sel.children(), function(k, v) {
					var val = $(v).attr("value")?$(v).attr("value"):"";
					var text = $(v).text();
					var isselected = $(v).is(":selected");
					var opt = $('<a href="javascript:;" val="'+val+'" class="'+(isselected?'selected':'')+'" >'+text+'</a>');
					wrap.find(".opts").append(opt);
				});
				$sel.before(wrap).hide();
				wrap.append($sel);
				wrap.inputbox(opts);
				wrap.find("a").click(function() {
					window.setTimeout(function() {
						var index = wrap.find(".opts a").index(wrap.find("a.selected"));
						wrap.find("select option").attr("selected", false).eq(index).attr("selected", true);
					});
				});
			}
		};
		
		_init = function(o, opts){
			beautifySelector.init(o, opts);
		};
		
		$.fn.beautifySelector = function(options){
			opts = $.extend({}, $.fn.beautifySelector.defaults, options);
			return this.each(function(){
				_init(this, opts);
			});
		};

		$.fn.beautifySelector.defaults = {
			width : 'auto',
			height : 24
		};
	})(jQuery);

});