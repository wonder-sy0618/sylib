
activeMQ comet÷ß≥÷ø‚

∑˛ŒÒ∂À≈‰÷√



1. “¿¿µø‚
	compile 'org.slf4j:slf4j-api:1.6.4'
	compile 'cglib:cglib:2.2.2'
    runtime 'org.slf4j:slf4j-log4j12:1.5.11'
    runtime 'org.apache.xbean:xbean-spring:3.9'
    compile 'org.apache.activemq:activemq-all:5.5.1'
    compile 'javax.jms:jms:1.1'
    compile 'org.springframework:spring-jms:3.1.1.RELEASE'
    compile 'org.apache.activemq:activemq-web:5.5.1'
	compile 'org.eclipse.jetty.aggregate:jetty-all-server:8.1.0.RC5'
	

2. web.xml
	
	<filter>
		<filter-name>session</filter-name>
		<filter-class>org.eclipse.jetty.continuation.ContinuationFilter</filter-class>
	</filter>
	<filter-mapping>
		<filter-name>session</filter-name>
		<url-pattern>/*</url-pattern>
	</filter-mapping>

	<context-param>
		<param-name>org.apache.activemq.brokerURL</param-name>
		<param-value>tcp://127.0.0.1:61616</param-value>
		<!--
		<param-value>vm://localhost:0</param-value>
		-->
	</context-param>
	<servlet>
		<servlet-name>AjaxServlet</servlet-name>
		<servlet-class>org.apache.activemq.web.AjaxServlet</servlet-class>
	</servlet>
	<servlet-mapping>
		<servlet-name>AjaxServlet</servlet-name>
		<url-pattern>/amq/*</url-pattern>
	</servlet-mapping>

	
	
	
	
	