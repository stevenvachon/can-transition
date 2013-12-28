define(["can/util/library", "can/view/scanner"], function(can)
{
	// Add "initial" and "intro" CSS classes
	can.view.Scanner.attribute("can-transition", function(data, element)
	{
		if (element.getAttribute(data.attr) == "true")
		{
			element = can.$(element);
			
			can.on.call(element, "inserted", function()
			{
				can.addClass(element, "transition-initial");
				
				can.reflow(element);
				
				can.addClass(element, "transition-intro");
			});
		}
	});
	
	
	
	can.reflow = function(nodeList)
	{
		if (jQuery)
		{
			nodeList.reflow();
		}
		else
		{
			// "transitionsend" plugin is currently jQuery-only
		}
	}
	
	
	
	can.remove_super = can.remove;
	
	
	
	// Add "extro" CSS class and transition event
	can.remove = function(nodeList)
	{
		var useSuper = true;
		
		nodeList.each(function(i)
		{
			var node = $(this);
			
			if (node.attr("can-transition") == "true")
			{
				if ( !node.hasClass("transition-extro") )
				{
					node.addClass("transition-extro");
					
					// Remove all events to prevent any errors during transition
					node.off();
					
					node.on("transitionsend", function(event)
					{
						//node.off("transitionsend");
						
						can.remove_super(nodeList);
					});
				}
				
				useSuper = false;
			}
		});
		
		if (useSuper)
		{
			return can.remove_super.apply(this, arguments);
		}
		else
		{
			return nodeList;
		}
	}
	
	
	
	return can;
});