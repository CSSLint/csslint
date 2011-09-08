# The CSSLint Rules

## Parsing errors should be fixed

CSSLint shows any parsing errors. Parsing errors usually mean you mistyped a character and may cause the browser to drop your rule or a property. Parsing errors are presented as errors by CSSLint, the most important issues to fix.

## Possible Errors

### Beware of broken box model

Borders and padding add space outside of an element's content. Setting `width` or `height` along with borders and padding is usually a mistake because you won't get the visual result you're looking for. CSSLint warns when a rule uses `width` or `height` in addition to padding and/or border.

Rule ID: `box-model`

### Require properties appropriate for display

Even though you can define any group of properties together in a CSS rule, some of them will be ignored due to the `display` of the element. This leads to extra cruft in the CSS file. The list of properties that CSSLint checks for are:

* `display: inline` should not use `width`, `height`, `margin` (and all variants), or `float`.
* `display: inline-block` should not use `float`.
* `display: block` should not use `vertical-align`.
* `display: table-*` should not use `margin` (and all variants) or `float`.

Removed the ignored or problematic properties decreases file size and improves performance.

Rule ID: `display-property-grouping`

### Disallow duplicate properties

When you include the same property twice, it may be intentional (to provide a fallback) or unintentional (copy-paste error). If duplicate properties are found one after the other with different values, this is okay. For example:

    .foo {
        background: #fff;
        background: rgba(255, 255, 255, 0.5);
    }
    
However, if the properties either have the same value or are located at different spots in the rule, this results in a warning. For example:

    .foo {
        background: #fff;
        color: #000;
        background: rgba(255, 255, 255, 0.5);
    }   
    
Rule ID: `duplicate-properties`

### Disallow empty rules

Any rule that doesn't contain any properties, such as:

```css
.foo {
}
```
    
A lot of times, empty rules appear as a result of refactoring without further cleanup. Eliminating empty rules results in smaller file sizes and less style information for the browser to deal with.

Rule ID: `empty-rules`

### Require use of known properties

It's very easy to miss a typo in your CSS. This rule checks each property name to make sure that it is a known CSS property. Vendor-prefixed properties are ignored, since they are technically not part of any specification.

Rule ID: `known-properties`

## Compatibility

The following rules are for compatibility across browsers.

### Disallow adjoining classes

Adjoining classes look like `.foo.bar`. While technically allowed in CSS, these aren't handled properly by Internet Explorer 6 and earlier. IE6 will match the selector as if it were simply '.bar' which means your selector will match more frequently than you intend it to and create cross browser bugs.

Rule ID: `adjoining-classes`

### Require compatible vendor prefixes

Most CSS3 properties have vendor-prefixed equivalents for multiple vendors, including Firefox (-moz), Safari/Chrome (-webkit), Opera (-o), and Internet Explorer (-ms). Including all compatible vendor prefixes will give a consistent appearance for a wider range of users.

Rule ID: `compatible-vendor-prefixes`

### Require all gradient definitions

Right now, there is no standard CSS gradient implementation, which means using CSS gradients in a cross-browser way requires using many different vendor-prefixed versions. CSSLint warns when a rule with a CSS gradient doesn't have gradients for all supporting browsers. 

Rule ID: `gradients`

### Disallow negative text-indent

Negative text indent doesn't play nicely with right to left oriented languages like Arabic. If your sight needs to support RTL, you should choose a different text hiding method. 

Rule ID: `text-indent`

### Require standard property with vendor prefix

When using vendor-prefixed properties such as `-moz-border-radius`, make sure to also include the standard property. The standard property should preferably come after the vendor-prefixed one, such as:

```css
.foo {
    -moz-border-radius: 5px;
    border-radius: 5px;
}
```

Rule ID: `vendor-prefix`

## Performance

The following rules are aimed at improving CSS performance, including runtime performance and overall code size.

### Don't use too many web fonts

Web fonts are growing in popularity and use of `@font-face` is on the rise. However, using web fonts comes with performance implications as font files can be quite large and some browsers block rendering while downloading them. For this reason, CSSLint will warn you when there are more than five web fonts in a style sheet.

Rule ID: `font-faces`

### Disallow @import

The `@import` command shouldn't be used because it prevents parallel downloads in some browsers (see http://www.stevesouders.com/blog/2009/04/09/dont-use-import/).

Rule ID: `import`

### Disallow selectors that look like regular expressions

CSS3 adds complex attribute selectors such as `~=` that are slow. When using attribute selectors, don't use the complex equality operators to avoid performance penalties.

Rule ID: `regex-selectors`

### Disallow universal selector

The universal selector (*) selects all elements and can create performance issues when used as the far-right part of a selector. For example, this type of rule is not preferable:

    .foo * {
        background: #fff;
        color: #000;
        background: rgba(255, 255, 255, 0.5);
    }
    
This requires the browser to match all elements first, and then go up the DOM tree to find an element with a class of `.foo`. Generally, it's best to avoid using the universal selector.

Rule ID: `universal-selector`

### Disallow units for zero values

An easy way to save bytes in CSS is not include units when a value is 0. For instance, `0px` and `0` are the exact same measurement, so leave off the units and save!

Rule ID: `zero-units`

### Disallow overqualified elements

Writing selectors such as `li.active` are unnecessary unless the element name causes the class to behave differently. In most cases, it's safe to remove the element name from the selector, both reducing the size of the CSS as well as improving the selector performance (doesn't have to match the element anymore).

Rule ID: `overqualified-elements`

### Require shorthand properties

Sometimes when editing a rule you may end up defining multiple properties that can better be represented using shorthand. This rule checks to see if you're using `margin-left`, `margin-right`, `margin-top`, and `margin-bottom` together and suggests to use just `margin` instead. The same is done for the variants of `padding`.

Rule ID: `shorthand`

## Maintainability & Duplication

These rules help to ensure your code is readable and maintainable by others.

### Disallow too many floats

The `float` property is currently the best way to achieve complex layouts, however it is possible to use too many. CSS Lint simply checks to see if you've used `float` more than 10 times, and if so, displays a warning. Using this many floats usually means you need some sort of abstraction to achieve the layout. Consider a grids system like OOCSS, 960gs, blueprint, or YUI3. Read more about grids at: http://www.stubbornella.org/content/2011/01/22/grids-improve-site-performance/

Rule ID: `floats`

### Don't use too many font-size declarations

A site is typically made up of a finite number of font treatments, including font size. If you have 10 or more font sizes specified, you probably want to refactor into a standard set of font size classes that can be used in markup.

Rule ID: `font-sizes`

### Disallow IDs in selectors

IDs shouldn't be used in selectors because these rules are too tightly coupled with the HTML and have no possibility of reuse. It's much preferred to use classes in selectors and then apply a class to an element in the page. Additionally, IDs impact your specificity and can lead to specificity wars. Read more about using IDs for styles here: http://oli.jp/2011/ids/

Rule ID: `ids`

### Disallow !important

Using `!important` overides any cascaded rule and may lead to specificity war. CSSLint checks if you've used `!important`, and if so, displays a warning. 

Rule ID: `important`

## OOCSS

These rules are based on the principles of OOCSS.

### Disallow qualified headings

Heading elements (`h1`-`h6`) should be defined as top-level styles and not scoped to particular areas of the page. This allows those styles to be reused across your site for better visual consistency and performance and easier maintenance. For example, this is an example of an overqualified heading:

```css
.foo h1 {
    font-size: 110%;
}
```

Heading elements should have a consistent appearance across a site.

Rule ID: `qualified-headings`

### Heading should only be defined once

Heading elements (`h1`-`h6`) should have exactly one rule on a site. CSSLint warns if it finds more than one.

Rule ID: `unique-headings`
