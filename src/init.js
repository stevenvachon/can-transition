require.config(
{
	paths:
	{
		can:      "assets/js/amd/can",
		jquery:   "assets/js/amd/jquery-2.0.3",
		jquerypp: "assets/js/amd/jquerypp/",
		moment:   "assets/js/amd/moment",
		
		"jquery.transitionsend": "assets/js/amd/jquery.transitionsend"
	}
});



require(
[
	"can",
	"assets/js/amd/can.transition",
	"templates",
	"components/app/app"
],
function()
{
	clearTimeout(preloader);
	preloader = null;
	
	$(".preloader").replaceWith( can.view.mustache("<app-container/>")() );
});
