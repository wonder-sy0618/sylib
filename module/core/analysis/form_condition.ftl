
				
<#macro form_condition domid accuracy unit starttime endtime> 

	
	<style>
		.btn_submit {margin-left: 20px;}
	</style>
	 
	<form class="form-inline" role="form" id="${domid }" >
	    <#nested> 
		<input type="hidden" name="accuracy" value="${accuracy?c }" />
		<input type="hidden" name="unit" value="${unit }" />
	  <div class="form-group">
	    <label class="sr-only" for="form_starttime">开始时间</label>
	    <input type="text" class="form-control" id="${domid }_form_starttime" name="starttime" value="${starttime?string('yyyy-MM-dd HH:mm:ss') }"
			onclick="WdatePicker({maxDate:'#F{$dp.$D(\\\'form_endtime\\\')}', dateFmt:'yyyy-MM-dd HH:mm:ss'})" >
	  </div>
	  <div class="form-group">
	    <label class="sr-only" for="form_endtime">结束时间</label>
	    <input type="text" class="form-control"  id="${domid }_form_endtime" name="endtime" value="${endtime?string('yyyy-MM-dd HH:mm:ss') }"
			onclick="WdatePicker({minDate:'#F{$dp.$D(\\\'form_starttime\\\')}', dateFmt:'yyyy-MM-dd HH:mm:ss'})" >
	  </div>
	  <div class="form-group"  >
	    <label class="sr-only" for="form_accuracy">精度（秒）</label>
	    <select class="form-control" id="${domid }_form_accuracy" >
	    	<option value="10" unit="minute" >10分钟</option>
	    	<option value="30" unit="minute" >30分钟</option>
	    	<option value="1" unit="hour" >1小时</option>
	    	<option value="6" unit="hour" >6小时</option>
	    	<option value="12" unit="hour" >12小时</option>
	    	<option value="1" unit="date" >1天</option>
	    	<option value="3" unit="date" >3天</option>
	    	<option value="7" unit="date" >7天</option>
	    </select>
	    <script type="text/javascript" >
	    	$("#${domid }_form_accuracy option").removeAttr("selected");
			$("#${domid }_form_accuracy option[value='"+$("input[type='hidden'][name='accuracy']").val()+"'][unit='"+$("input[type='hidden'][name='unit']").val()+"']").attr("selected", "selected");
	    </script>
	  </div>
	  <button type="submit" class="btn btn-default btn_submit">刷新</button>
	</form>
	  <script type="text/javascript" >
	  	$(document).ready(function() {
			$("#${domid }").submit(function(e){
				$("input[type='hidden'][name='accuracy']").val($("#${domid }_form_accuracy option:checked").val());
				$("input[type='hidden'][name='unit']").val($("#${domid }_form_accuracy option:checked").attr("unit"));
			});
		});
	  </script>

 </#macro>