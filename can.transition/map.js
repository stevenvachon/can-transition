define(["can/util/library", "can/map"], function(can)
{
	can.Transition = new Object();
	
	
	
	return can.Transition.Map = can.Map.extend(
	{
		init: function()
		{
			// Simulates can.construct.proxy with a mess of nested functions
			can.batch.start( (function(){var scope=this;return function(){scope._startBatch.apply(scope)}}).apply(this) );
			
			this.attr("@transition",
			{
				id: this._cid,
				
				initial: true,
				intro: false,
				extro: false,
				
				state: function()
				{
					var state = "";
					
					if (this.attr("initial")) state += "transition-initial ";
					if (this.attr("intro"))   state += "transition-intro ";
					if (this.attr("extro"))   state += "transition-extro";
					
					return state;
				},
				
				selector: function()
				{
					return "[data-transition-id='"+ this.attr("id") +"']";
				}
			});
			
			can.batch.stop();
		},
		
		
		
		_startBatch: function()
		{
			// Only semi-abstracted, because of jQuery chain
			can.$( this.attr("@transition").selector() ).reflow();
			
			this.attr("@transition.intro", true);
		}
	});
});