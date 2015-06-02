$(function() {
	
	/**
	 * 查询的类型
	 */
	var querytype = {
			'subscribe' : {
				display : '新增关注人数',
				data : function(json) {
					return json.subscribe_count;
				}
			},
			'unsubscribe' : {
				display : '取消关注人数',
				data : function(json) {
					return json.unsubscribe_count;
				}
			},
			'net' : {
				display : '净增关注人数',
				data : function(json) {
					json.net_count = [];
					for (var i=0; i<json.subscribe_count.length; i++) {
						json.net_count[i] = (Number(json.subscribe_count[i]) - Number(json.unsubscribe_count[i]));
					}
					return json.net_count;
				}
			},
			'accumulative' : {
				display : '累计关注人数',
				data : function(json) {
					json.net_count = [];
					for (var i=0; i<json.subscribe_count.length; i++) {
						if (i <= 0) {
							json.net_count[i] = (Number(json.history_subscribe_count)-Number(json.history_unsubscribe_count)+Number(json.accumulative_amendments)) 
													+ (Number(json.subscribe_count[i]) - Number(json.unsubscribe_count[i]));
						} else {
							json.net_count[i] = json.net_count[i-1] + (Number(json.subscribe_count[i]) - Number(json.unsubscribe_count[i]));
						}
					}
					return json.net_count;
				}
			}
	};
	
	/**
	 * 初始化查询类型的导航Bar
	 */
	var initQueryTypeNavBar = function() {
		var querytype_nav_bar = $("#querytype_nav_bar");
		querytype_nav_bar.empty();
		var action = querytype_nav_bar.attr("action");
		// 循环生成按钮
		$.each(querytype, function(k, v) {
			if (k == action) {
				querytype_nav_bar.append('<li class="active" value="'+k+'" ><a href="#">'+v.display+'</a></li>');
			} else {
				querytype_nav_bar.append('<li value="'+k+'" ><a href="#">'+v.display+'</a></li>');
			}
		});
		// 绑定点击事件
		querytype_nav_bar.find("a").bind("click", function(e) {
			$("#search_form input[name='querytype']").val($(this).parents("li").attr("value"));
			$("#search_form")[0].submit();
			return false;
		});
	};

	/**
	 * 加载数据的方法
	 */
	var loaddata = function(callback) {
		$.ajax({
			url : 'wxService/controlCenter/userchangedata.do',
			type : 'post',
			data : {
				times : $.toJSON(
							$.analysisService.generateTimePart({
									starttime : $("#search_form_form_starttime").val(), 
									endtime : $("#search_form_form_endtime").val(), 
									accuracy : Number($("#search_form_form_accuracy option:checked").val()), 
									unit : $("#search_form_form_accuracy option:checked").attr("unit"),
									strict : false
							})
					)
			},
			dataType : 'json',
			cache : false,
			success : function(json) {
				if (callback) {
					callback(json);
				}
			}
		});
	};

	/**
	 * 重新初始化表格数据
	 */
	var reInitTable = function(json) {
		$("#table_list tr").not($("#table_list tr:first")).remove();
		$
				.each(
						json.columns_format,
						function(k, v) {
							if (k >= json.columns_format.length - 1) {
								return;
							}
							$("#table_list")
									.append(
											"<tr>"
													+ "<td>"
													+ json.columns_format[k]
													+ " 至 "
													+ json.columns_format[k + 1]
													+ "</td>"
													+ "<td>"
													+ json.subscribe_count[k]
													+ "</td>"
													+ "<td>"
													+ json.unsubscribe_count[k]
													+ "</td>"
													+ "<td>"
													+ querytype['net'].data(json)[k]
													+ "</td>"
													+ "<td>"
													+ querytype['accumulative'].data(json)[k]
													+ "</td>" + "</tr>");
						});
		// 	逆序
		$("#table_list").append($("#table_list tr").not($("#table_list tr:first")).get().reverse());
	};

	/**
	 * 重新初始化表格数据
	 */
	var reInitCharts = function(json) {
		$("#highcharts").empty();

		$('#highcharts')
				.highcharts(
						{
							title : {
								text : '微信用户数量变化趋势',
								x : -20
							// center
							},
							subtitle : {
								text : '数据来源: https://github.com/wonder-sy0618/sy-module-wx-service',
								x : -20
							},
							credits : {
								href : 'https://github.com/wonder-sy0618/sy-module-wx-service',
								text : 'sy-module-wx-service@github'
							},
							xAxis : {
								categories : json.columns_format
							},
							yAxis : {
								title : {
									text : '用户数量'
								},
								plotLines : [ {
									value : 0,
									width : 1,
									color : '#808080'
								} ]
							},
							legend : {
								layout : 'vertical',
								align : 'right',
								verticalAlign : 'middle',
								borderWidth : 0
							},
							series : [
									{
										name : querytype[$("#querytype_nav_bar li.active").attr("value")].display,
										data : querytype[$("#querytype_nav_bar li.active").attr("value")].data(json)
									} ]
						});
	};

	/**
	 * 加载数据后初始化
	 */
	loaddata(function(json) {
		initQueryTypeNavBar();
		reInitTable(json);
		reInitCharts(json);
	});

});
