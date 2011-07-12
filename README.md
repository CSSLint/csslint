# CSSLint

## Introduction

CSSLint is a tool to help point out problems with your CSS code. It does basic syntax checking as well as applying a set of rules to the code that look for problematic patterns or signs of inefficiency. The rules are all pluggable, so you can easily write your own or omit ones you don't want.

## The CSSLint Rules


### Parsing errors should be fixed

By default, CSSLint shows any parsing errors. Parsing errors usually mean you mistyped a character and may cause the browser to drop your rule or a property. Parsing errors are presented as errors by CSSLint, the most important issues to fix.

### Don't use adjoining classes

Adjoining classes look like `.foo.bar`. While technically allowed in CSS, these aren't handled properly by Internet Explorer 6 and earlier.

### Don't use text indent to hide text if you need to support RTL

Negative text indent doesn't play nicely with right to left oriented languages like Arabic. If your sight needs to support RTL, you should choose a different text hiding method. 

### Remove empty rules

Any rule that doesn't contain any properties, such as:

```css
.foo {
}
```
    
A lot of times, empty rules appear as a result of refactoring without further cleanup. Eliminating empty rules results in smaller file sizes and less style information for the browser to deal with.

### Use correct properties for a display

Even though you can define any group of properties together in a CSS rule, some of them will be ignored due to the `display` of the element. This leads to extra cruft in the CSS file. The list of properties that CSSLint checks for are:

* `display: inline` should not use `width`, `height`, `margin` (and all variants), `padding` (and all variants), or `float`.
* `display: inline-block` should not use `float`.
* `display: block` should not use `vertical-align`.
* `display: table-*` should not use `margin` (and all variants) or `float`.

Removed the ignored or problematic properties decreases file size and improves performance.

### Avoid using too many !important declarations

Using `!important` overides any cascaded rule and may lead to specificity war. CSSLint checks if you've used `!important`, and if so, displays a warning. If there's at least 10 `!important` declaration in your code CSSLint displays an error.

### Don't use too many floats

Using `float` for layout isn't a great idea, but sometimes you have to. CSSLint simply checks to see if you've used `float` more than 10 times, and if so, displays a warning. Using this many floats usually means you need some sort of abstraction to achieve the layout.

### Don't use too many web fonts

Web fonts are growing in popularity and use of `@font-face` is on the rise. However, using web fonts comes with performance implications as font files can be quite large and some browsers block rendering while downloading them. For this reason, CSSLint will warn you when there are more than five web fonts in a style sheet.

### Don't use too many font-size declarations

A site is typically made up of a finite number of font treatments, including font size. If you have 10 or more font sizes specified, you probably want to refactor into a standard set of font size classes that can be used in markup.

### Don't use IDs in selectors

IDs shouldn't be used in selectors because these rules are too tightly coupled with the HTML and have no possibility of reuse. It's much preferred to use classes in selectors and then apply a class to an element in the page.

### Don't qualify headings

Heading elements (`h1`-`h6`) should be defined as top-level styles and not scoped to particular areas of the page. For example, this is an example of an overqualified heading:

```css
.foo h1 {
    font-size: 110%;
}
```

Heading elements should have a consistent appearance across a site.

### Heading styles should only be defined once

Heading elements (`h1`-`h6`) should have exactly one rule on a site. CSSLint warns if it finds more than one.

### Be careful using width: 100%

Using `width: 100%` on an element whose parent element has padding will result in the child stretching outside of the parent's bounding box. It's generally not a good idea to use `width: 100%`. Instead, use `width: auto` or `display: block`.

### Zero values don't need units

An easy way to save bytes in CSS is not include units when a value is 0. For instance, `0px` and `0` are the exact same measurement, so leave off the units and save!

### Vendor prefixed properties should also have the standard

When using vendor-prefixed properties such as `-moz-border-radius`, make sure to also include the standard property. The standard property should preferably come after the vendor-prefixed one, such as:

```css
.foo {
    -moz-border-radius: 5px;
    border-radius: 5px;
}
```

### CSS gradients require all browser prefixes

Right now, there is no standard CSS gradient implementation, which means using CSS gradients in a cross-browser way requires using many different vendor-prefixed versions. CSSLint warns when a rule with a CSS gradient doesn't have gradients for all supporting browsers. 

### Include all compatible vendor prefixes to reach a wider range of users

Most CSS3 properties have vendor-prefixed equivalents for multiple vendors, including Firefox (-moz), Safari/Chrome (-webkit), Opera (-o), and Internet Explorer (-ms). Including all compatible vendor prefixes will give a consistent appearance for a wider range of users.

### Avoid selectors that look like regular expressions

CSS3 adds complex attribute selectors such as `~=` that are slow. When using attribute selectors, don't use the complex equality operators to avoid performance penalties.

### Beware of broken box models

Borders and padding add space outside of an element's content. Setting `width` or `height` along with borders and padding is usually a mistake because you won't get the visual result you're looking for. CSSLint warns when a rule uses `width` or `height` in addition to padding and/or border.

### Avoid @import

The `@import` command shouldn't be used because it prevent parallel downloads in some browsers (see http://www.stevesouders.com/blog/2009/04/09/dont-use-import/).

### Duplicate Properties

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

### Universal Selector

The universal selector (*) selects all elements and can create performance issues when used as the far-right part of a selector. For example, this type of rule is not preferable:

    .foo * {
        background: #fff;
        color: #000;
        background: rgba(255, 255, 255, 0.5);
    }
    
This requires the browser to match all elements first, and then go up the DOM tree to find an element with a class of `.foo`. Generally, it's best to avoid using the universal selector.

## Contributors

### Creators

1. Nicole Sullivan, http://www.stubbornella.org
1. Nicholas C. Zakas, http://www.nczonline.net

### Contributors

1. Samori Gorse, https://twitter.com/shinuza (Rules, Non-zero Exit Code for CLI)
1. Eitan Konigsburg, https://twitter.com/eitanmk (Rhino CLI)
1. Ben Barber (Compatible Vendor Prefix Rule)
1. Eric Wendelin, http://eriwen.com (Output formatters)
