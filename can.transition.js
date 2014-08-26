define(["can/util/library", "can/view/scanner", "jquerypp/event/pause", "jquery.transitionsend"], function(can)
{
	var appendChild_super = can.appendChild;
	var insertBefore_super = can.insertBefore;
	var remove_super = can.remove;
	
	
	
	/*
		Add "extro" CSS class and event to transitionable elements.
		Add bubbled event listeners to parents.
	*/
	function transitionalRemove(nodeList, filteredNodeList, keyNode, _arguments, bubbled)
	{
		var _this = this;
		
		if (!bubbled)
		{
			can.bind.call(keyNode, "removing", function(removing_event)
			{
				// Pause bubbling to ancestors
				removing_event.pause();
				
				var transitioningElements = new Array();
				
				can.each(filteredNodeList, function(node, index)
				{
					// Avoid length, and other non-array-like indexes
					if ( isNaN(parseInt(index)) ) return;
					
					node = can.$(node);
					
					transitioningElements.push(node);
					
					can.addClass(node, "transition-extro");
					
					// Remove all events to prevent any errors during transition
					// BUG :: need to disable filtered events on parent elements -- on("event", "filter", funct)
					can.unbind.call(node);
					
					can.bind.call(node, "transitionsend", function(transitionsend_event)
					{
						transitioningElements.splice( can.inArray(node,transitioningElements), 1);
						
						// All elements completed their transitions
						if (transitioningElements.length <= 0)
						{
							//deleteScheduleReference(keyNode);
							
							// Resume bubbling to ancestors
							removing_event.resume();
							
							// Remove elements [for real]
							remove_super.apply(_this, _arguments);
						}
					});
				});
			});
			
			can.trigger(keyNode, "removing");
		}
		else
		{
			can.data(keyNode, "hasBubbledListener", true);
			
			// Non-transitioned event, bubbled from descendants
			can.bind.call(keyNode, "removing", function(removing_event)
			{
				// When listening on parent elements that don't get removed
				// (like <body>), we need to remove from memory
				can.unbind.call(keyNode, "removing", arguments.callee);
				
				// Remove elements [for real]
				remove_super.apply(_this, _arguments);
			});
		}
	}
	
	
	
	/*function unbindBubbledListener(element)
	{
		element = $(element);
		
		if ( element.data("hasBubbledListener") )
		{
			element.removeData("hasBubbledListener");
			
			element.unbind("removing");
			
			console.log("yeah");
		}
	}*/
	
	
	
	/*
		Remove bubbled event listeners if descendants added.
	*/
	/*can.appendChild = function(element, child)
	{
		unbindBubbledListener(element);
		
		appendChild_super.apply(this, arguments);
	}*/
	
	
	
	/*
		Remove bubbled event listeners if descendants added.
	*/
	/*can.insertBefore = function(element, child, ref)
	{
		unbindBubbledListener(element);
		
		insertBefore_super.apply(this, arguments);
	}*/
	
	
	
	can.reflow = function(nodeList)
	{
		if (window.jQuery || window.Zepto)
		{
			nodeList.reflow();
		}
		else
		{
			// "transitionsend" plugin is currently jQuery/Zepto-only
		}
	}
	
	
	
	/*
		Check if elements can be transitioned.
	*/
	can.remove = function(nodeList)
	{
		var checkingDescendants = false;
		var filteredNodeList = nodeList.filter("[can-transition=true]");	// TODO switch to can.* code
		
		// If current cannot be transitioned, check descendants
		// Otherwise, who cares about descendants
		if (filteredNodeList.length <= 0)
		{
			filteredNodeList = nodeList.find("[can-transition=true]");	// TODO switch to can.* code
			
			checkingDescendants = true;
		}
		
		// If current or descendants can be transitioned
		if (filteredNodeList.length > 0)
		{
			var untransitionedNodeList = filteredNodeList.filter(":not(.transition-extro)");	// TODO switch to can.* code
			
			// If any current or descendants are not currently transitioning
			if (untransitionedNodeList.length > 0)
			{
				// Can only target one, might as well be the first
				var keyNode = untransitionedNodeList.eq(0);	// TODO switch to can.* code
				
				// Add transitions
				transitionalRemove.apply(this, [nodeList, untransitionedNodeList, keyNode, arguments, false]);
			}
			// If transitions are already running on all transitionable descendants
			else if (checkingDescendants)
			{
				// Same strategy as when adding transition listeners, only we need the parent for bubbling
				var keyNode = filteredNodeList.eq(0).parent();	// TODO switch to can.* code
				
				if ( !can.data(keyNode, "hasBubbledListener") )
				{
					// Add bubbled event listener to current
					transitionalRemove.apply(this, [nodeList, untransitionedNodeList, keyNode, arguments, true]);
				}
			}
			else
			{
				// Nothing. Wait for current (non-decendant) transitions to finish
			}
			
			return nodeList;
		}
		else
		{
			// No transitions anywhere
			return remove_super.apply(this, arguments);
		}
	}
	
	
	
	// CanJS v2.0.x support
	if (!can.view.attr && can.view.Scanner.attribute)
	{
		can.view.attr = can.view.Scanner.attribute;
	}
	
	
	
	// Add "initial" and "intro" CSS classes
	can.view.attr("can-transition", function(data, element)
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
	
	
	
	return can;
});