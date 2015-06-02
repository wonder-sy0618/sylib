/**
 * jQuery analysisService plugin
 * 
 * @author shiying
 * @2014
 * 
 */
(function ($) {
	var format = "YYYY-MM-DD HH:mm:ss";
	var units = ["year", "month", "date", "hour", "minute", "second", "millisecond"];
	var units_map = {
			year : 'years',
			month : 'months',
			date : 'days',
			hour : 'hours',
			minute : 'minutes',
			second : 'seconds',
			millisecond : 'milliseconds'
	};
	
	Array.prototype.indexOf = function(e){
		for(var i=0,j; j=this[i]; i++){
			if(j==e){return i;}
		}
		return -1;
	};
	Array.prototype.lastIndexOf = function(e){
		for(var i=this.length-1,j; j=this[i]; i--){
			if(j==e){return i;}
		}
		return -1;
	};
	
	$.analysisService = {
			
			/**
			 * 生成时间段列表
			 * 
			 * @param starttime
			 *            起始时间
			 * @param endtime
			 *            结束时间
			 * @param accuracy
			 *            精度
			 * @param unit
			 *            计算单位（years/months/weeks/days/hours/minutes/seconds/milliseconds）
			 * @param strict
			 *            严格模式，设置为false，则开始时间与结束时间取就近整数
			 * @returns {Array}, 包含字段start and end
			 */
			generateTimePart : function(options) {
				var defaultOptions = {
						starttime : moment().subtract("date", 7).format(format),
						endtime : moment().format(format),
						accuracy : 1, 
						unit : "date",
						strict : false
				};
				options = $.extend({}, defaultOptions, options);
				// 转换时间格式
				var date_starttime = moment(options.starttime, format);
				var date_endtime = moment(options.endtime, format);
				// 非严格模式，时间取整
				if (!options.strict && units.indexOf(options.unit) != -1) {
					for (var i=units.indexOf(options.unit)+1; i<units.length; i++) {
						date_starttime.set(units[i], 0);
						date_endtime.set(units[i], 0);
					}
				}
				// 计算时间节点
				var date_curent = date_starttime.clone();
				var array = [];
				while (!date_curent.isAfter(date_endtime)) {
					array.push(date_curent.format(format));
					date_curent.add(units_map[options.unit], options.accuracy);
				}
				return array;
			}
			
			
	};
	
	
}(jQuery));
