<!-- Static navbar -->
      <div class="navbar navbar-default" role="navigation">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="index.do">微信服务框架-控制中心</a>
        </div>
        <div class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
            <li <#if "index" == menu_active >class="active"</#if> ><a href="index.do">首页</a></li>
            <li <#if "userchange" == menu_active >class="active"</#if> ><a href="userchange.do" >用户变化趋势</a></li>
           </ul>
           
		      <ul class="nav navbar-nav navbar-right">
            <li <#if "setting" == menu_active >class="active"</#if> ><a href="setting.do" >设置</a></li>
		      </ul>
        </div><!--/.nav-collapse -->
      </div>