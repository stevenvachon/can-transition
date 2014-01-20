define(["can", "moment"], function(can, moment)
{
	return can.Component.extend(
	{
		tag: "table-example",
		template: can.view("components/table-example/table-example"),
		init: function()
		{
			this.scope.add();
			this.scope.add();
			this.scope.add();
		},
		scope:
		{
			items: [],
			
			
			
			add: function()
			{
				can.batch.start();
				for (var i=1; i<=2; i++)
				{
					this.items.push({
						title: "This Is A Title",
						description: "This is a description that describes stuff. Usually, it'd be interesting, but this is not.",
						date: new Date().getTime(),
						selected: false
					});
				}
				can.batch.stop();
			},
			
			
			
			allSelected: can.compute( function(newVal, oldVal)
			{
				if (newVal !== undefined)
				{
					can.batch.start();
					this.items.forEach( function(element, index, list)
					{
						element.attr("selected", newVal);
					});
					can.batch.stop();
				}
				else
				{
					return (this.numSelected() == this.items.length && this.items.length>0);
				}
			}),
			
			
			
			numSelected: can.compute( function()
			{
				var count = 0;
				
				this.items.forEach( function(element, index, list)
				{
					if (element.attr("selected")) count++;
				});
				
				return count;
			}),
			
			
			
			remove: function()
			{
				can.batch.start();
				for (var i=this.items.length-1; i>=0; i--)
				{
					if (this.items[i].attr("selected"))
					{
						this.items.splice(i, 1);
					}
				}
				can.batch.stop();
			}
		},
		helpers:
		{
			// {{date-format 'unix offset, date string or timestamp' 'mm-dd-yy'}}
			"date-format": function(time, format)
			{
				if (can.isFunction(time)) time = time();
				
				time = moment(time);
				
				return (format == "iso") ? time.toISOString() : time.format(format);
			}
		},
		events:
		{
			
		}
	});
});