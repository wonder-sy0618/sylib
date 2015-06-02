

	<style>
		#table_list {margin-top: 50px;}
	</style>

	<div class="panel panel-default">
		<div class="panel-heading">
			用户变化趋势
		</div>
		<div class="panel-body">
			
			<!-- 统计头信息 -->
			<div class="well well-lg">
			
				<#include "../../core/analysis/form_condition.ftl" >
				<@form_condition domid="search_form" accuracy=accuracy unit=unit starttime=starttime endtime=endtime > 
					<input type="hidden" name="querytype" value="${querytype }" />
				</@form_condition>
				
			</div>	<!-- 统计头信息 -->
			
			<ul class="nav nav-tabs" id="querytype_nav_bar" action="${querytype }" >
			</ul>
			
			<div id="highcharts" style="min-width: 310px; height: 400px; margin: 0 auto" ></div>
			
			<!-- Table -->
			<table class="table" id="table_list" >
			    <tr>
			    	<td>时间段</td>
			    	<td>新关注人数</td>
			    	<td>取消关注人数</td>
			    	<td>净增关注人数</td>
			    	<td>累计关注人数</td>
			    </tr>
			</table>
		</div>
	</div>
    
    <@res resid="module-analysisService" />
	<script src="wxService/resources/userchange.js" ></script>
    



