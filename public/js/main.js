requirejs.config({baseUrl : 'js/'});
requirejs(['config'], function(c) { 
	require(['app/app'], function(app){
		app.init();
	});
});
