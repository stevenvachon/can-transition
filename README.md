#can.transition
> *Seamlessly* integrate CSS transitions into your [CanJS](https://github.com/bitovi/canjs/) projects.

## Getting Started
This plugin requires CanJS `~2.0.0`

It is no longer necessary to litter your data-driven code with DOM APIs to achieve an animated interface. Continue using CanJS the way you have been and animate with [**only your stylesheet(s)**](#css) and [**one *simple* template attribute**](#templates).

- - -
*Note*: While this plugin does use abstraction, its dependent library, [jquery.transitionsend](https://github.com/stevenvachon/jquery.transitionsend/) currently only works with jQuery and Zepto. MooTools, Dojo and YUI versions may be written in the future.

## Usage

### JavaScript
You will not have to do anything more than include the plugin in your project. The transition logic is automatic and seamless.

### Template(s)
This plugin provides the `can-transition` attribute.
```html
{{#if message}}
    <div class="example" can-transition="true">
        {{message}}
    </div>
{{/if}}


{{#if items.length}}
    <!-- div container will wait for children to finish transitioning -->
    <div>
        {{#each items}}
            <div class="example {{#if flag}}some-flag{{/if}}" can-transition="true">
                {{message}}
            </div>
        {{/each}}
    </div>
{{/if}}
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

### Conditions
When necessary, you can use the CSS class names to check the transition state of an element. There is currently no way to check if the intro state has completed its transition.
```javascript
if ( element.className.indexOf("transition-extro") < 0 )
{
    // do something here when extro transition is not playing
}


// or with jQuery:

if ( !$(selector).hasClass("transition-extro") )
{
    // ditto
}
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
