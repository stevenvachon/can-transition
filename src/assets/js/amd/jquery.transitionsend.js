/**
 * jquery.transitionsend v0.1.3
 * https://github.com/stevenvachon/jquery.transitionsend/
 *
 * Licensed under the MIT license.
 * Copyright 2013 Steven Vachon
 */

var self = function($)
{
	var off_super = $.fn.off;
	var on_super  = $.fn.on;
	
	var transitionEndEvent = function()
	{
		var event = false;
		var vendors = {
			// Opera must preceed WebKit as it tries to simulate WebKit
			"transition":       "transitionend",
			"OTransition":      "oTransitionEnd",
			"WebkitTransition": "webkitTransitionEnd",
			"MozTransition":    "transitionend"
		};
		
		for (var vendor in vendors)
		{
			if ( typeof(document.body.style[vendor]) != "undefined" )
			{
				event = vendors[vendor];
				break;
			}
		}
		
		return event;
	}();
	
	var browserSupportsTransitions = (transitionEndEvent);
	//var nativeTransitionEnd = (transitionEndEvent === "transitionend");
	
	
	
	function customEvent(elements, event, one)
	{
		if (browserSupportsTransitions)
		{
			switch (event)
			{
				/*case "transitionend":
				{
					if (!nativeTransitionEnd)
					{
						elements.on(transitionEndEvent, function()
						{
							$(this).trigger("transitionend");
						}, null,null, one);
					}
					
					break;
				}*/
				case "transitionsend":
				{
					elements.each(function(i)
					{
						var $this = $(this);
						var properties = $this.css("transition-property").split(/,\s*/);	// TODO add .css() check for jquery-lite's
						var durations  = parseTimes( $this.css("transition-duration") );
						var delays     = parseTimes( $this.css("transition-delay") );
						
						var oneDelay    =    (delays.length == 1);
						var oneDuration = (durations.length == 1);
						var timer = 0;
						
						for (var j=0, numProperties=properties.length; j<numProperties; j++)
						{
							var delay    =    delays[oneDelay    ? 0 : j];
							var duration = durations[oneDuration ? 0 : j];
							
							timer = Math.max(timer, delay+duration);
						}
						
						// If element removed by the time this runs, it'll just get GC'ed
						$this.data("transitionsend-timeout", setTimeout( $.proxy(function()	// TODO add check for .data() for jquery-lite's
						{
							$(this).trigger("transitionsend");
						},
						this), timer));
					});
					
					break;
				}
			}
		}
		else
		{
			elements.trigger(event);
		}
	}
	
	
	
	/*
		© https://github.com/ai/transition-events
	*/
	parseTimes = function(string)
	{
		var array = string.split(/,\s*/);
		
		for (var i=0, numTimes=array.length; i<numTimes; i++)
		{
			var value = array[i];
			
			array[i] = parseFloat(value);
			
			if ( value.match(/\ds/) )
			{
				array[i] = array[i] * 1000;
			}
		}
		
		return array;
	}
	
	
	
	$.fn.off = function(types, selector, fn)
	{
		// jQuery.Event -- copied from jQuery 2.0.3 -- slightly modified
		if (types && types.preventDefault && types.handleObj)
		{
			var handleObj = types.handleObj;
			
			$(types.delegateTarget).off
			(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			
			return this;
		}
		
		// http://api.jquery.com/off/#off-events-selector-handlereventObject
		if (typeof types === "string")
		{
			/*if (types.indexOf("transitionend") >= 0)
			{
				if (!nativeTransitionEnd)
				{
					arguments[0] += " "+transitionEndEvent;
				}
			}*/
			
			if (types.indexOf("transitionsend") >= 0)
			{
				this.each(function(i)
				{
					var $this = $(this);
					
					clearTimeout( $this.data("transitionsend-timeout") );
					
					$this.removeData("transitionsend-timeout");
				});
			}
		}
		// http://api.jquery.com/off/#off-events-selector
		else
		{
			// copied from jQuery 2.0.3
			for (var type in types)
			{
				this.off(type, selector, types[type]);
			}
			
			return this;
		}
		
		return off_super.apply(this, arguments);
	}
	
	
	
	$.fn.on = function(types, selector, data, fn, /*INTERNAL*/ one)
	{
		// http://api.jquery.com/on/#on-events-selector-data-handlereventObject
		if (typeof types === "string")
		{
			/*if (types.indexOf("transitionend") >= 0)
			{
				customEvent(this, "transitionend", one);
			}*/
			
			if (types.indexOf("transitionsend") >= 0)
			{
				customEvent(this, "transitionsend");
				arguments[4] = 1;
			}
		}
		// http://api.jquery.com/on/#on-events-selector-data
		else
		{
			for (var type in types)
			{
				/*if (type==="transitionend")
				{
					customEvent(this, type, one);
				}
				else*/ if (type==="transitionsend")
				{
					customEvent(this, type, 1);
					arguments[4] = 1;
				}
			}
		}
		
		return on_super.apply(this, arguments);
	}
	
	
	
	$.fn.reflow = function()
	{
		$(this).each(function()
		{
			this.offsetHeight;
		});
	}
}



if (typeof define === "function" && define.amd)
{
	define(["jquery"], self);
}
else
{
	self(window.jQuery || window.Zepto);
}
