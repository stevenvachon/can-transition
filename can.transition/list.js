define(["can/util/library", "can/list", "./map"], function(can)
{
	return can.Transition.List = can.List.extend(
	{
		Map: can.Transition.Map,
		
		// Maximum extro transitions. When exceeding this value, action
		// will be taken immediately and transitions will be skipped
		maxExtroLength: 50
	},
	{
		// Future-proof name
		_cantransition_remove: function(i)
		{
			if (i >= 0)
			{
				var map = this.attr(i);
				var transition = map.attr("@transition");
				
				// Avoid creating two events
				if ( !transition.attr("extro") )
				{
					transition.attr("extro", true);
					
					can.on.call( can.$(transition.selector()), "transitionsend", this.proxy(function(event)
					{
						can.List.prototype.splice.apply( this, [this.indexOf(map), 1] );
					}) );
					
					// Return element that's [getting] removed
					return map;
				}
			}
		},
		
		
		
		pop: function()
		{
			return this._cantransition_remove( this.attr("length")-1 );
		},
		
		
		
		shift: function()
		{
			return this._cantransition_remove(0);
		},
		
		
		
		splice: function(i, howMany)
		{
			if (i >= 0)
			{
				if (howMany===undefined) howMany = this.attr("length")-i;
				
				var lastRemoveIndex = i + howMany-1;
				
				// Avoid lag for large removals
				if (howMany <= this.constructor.maxExtroLength)
				{
					var removed = new Array();
					
					can.batch.start();
					
					// Remove individually so that each has a transition event
					for (var j=i; j<=lastRemoveIndex; j++)
					{
						var element = this.attr(j);
						
						if (this._cantransition_remove(j) === element)
						{
							removed.push(element);
						}
					}
					
					// Add any new indexes
					if (arguments.length > 2)
					{
						var args = new Array(lastRemoveIndex+1, 0);
						
						for (j=2, numArguments=arguments.length; j<numArguments; j++)
						{
							args.push( arguments[j] );
						}
						
						can.List.prototype.splice.apply(this, args);
					}
					
					can.batch.stop();
					
					// Return elements that have been removed
					return removed;
				}
				else
				{
					// Cancel transition events
					for (var j=i; j<=lastRemoveIndex; j++)
					{
						var transition = this.attr(j).attr("@transition");
						
						can.off.call( can.$(transition.selector()), "transitionsend");
					}
					
					// Remove without transitions
					return can.List.prototype.splice.apply(this, arguments);
				}
			}
		}
	});
});