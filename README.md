#can.transition
> Seamlessly integrate CSS transitions into your [CanJS](https://github.com/bitovi/canjs/) workflow.

## Getting Started
This plugin requires CanJS `~2.0.0`

There is no longer a need to litter your data-driven code with DOM stuff. You can achieve animated interfaces with [**only your stylesheet(s)**](#css), and [**two *simple* template variables**](#templates). Continue using CanJS the way you have been, only now everything can be animated.

- - -
*Note*: While this plugin does use abstraction, it will only work with jQuery at this time. Zepto, MooTools and YUI versions of [jquery.transitionsend](https://github.com/stevenvachon/jquery.transitionsend/) may be written in the future.

## Usage
In situations where you used `can.List`, you would now use `can.Transition.List`. Similarly, in situations where you used `can.Map`, you would would now use `can.Transition.Map`. The syntaxes are the same, otherwise.

### In a `can.Component`
```javascript
can.Component.extend(
{
    scope:
    {
        item:  new can.Transition.Map(),
        items: new can.Transition.List()
    },
    
    init:
    {
        this.scope.item.attr("message", "asdf1");
        
        this.scope.items.push( {message:"asdf2"} );
    }
});
```

### Template(s)
This plugin provides the `@transition.id` and `@transition.state` variables.
```html
{{#with item}}
    <div class="example some-flag {{@transition.state}}" data-transition-id="{{@transition.id}}">
        {{message}}
    </div>
{{/with}}

{{#each items}}
    <div class="example {{@transition.state}}" data-transition-id="{{@transition.id}}">
        {{message}}
    </div>
{{/each}}
```

### CSS
This plugin relies on three classes. `transition-initial` represents the initial state of the element before `transition-intro`, which represents the introduction of the element. `transition-extro` represents the removal of the element. Each are cascaded; meaning that all three will be applied to the element during the extro state; so, be conscious of any properties that must be overridden.
```css
.example {border:1px solid black}
.example.some-flag {border-color:red}
.example.transition-initial {opacity:0}
.example.transition-intro   {opacity:1; transition:1s opacity}
.example.transition-extro   {opacity:0; transition:.5s opacity}
```

## FAQ
1. **What happens if I do not define the `transition-*` CSS classes?**  
Everything will occur immediately, just as if you weren't using the plugin at all.

2. **What happens if I do not define transitions in the `transition-*` CSS classes or the browser does not support CSS transitions?**  
See #1.

3. **Why are my animations reset every time I add new data to the list?**  
You are probably using [`{{#key}}`](http://canjs.com/docs/can.Mustache.helpers.section.html) when you should be using [`{{#each key}}`](http://canjs.com/docs/can.Mustache.helpers.each.html). They are treated differently in CanJS.

## Release History
* *(Nothing yet)*
