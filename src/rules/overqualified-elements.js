/*
 * Rule: Don't use classes or IDs with elements (a.foo or a#foo).
 */
CSSLint.addRule({

    //rule information
    id: "overqualified-elements",
    name: "Overqualified Elements",
    desc: "Don't use classes or IDs with elements (a.foo or a#foo).",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this;
        parser.addListener("startrule", function(event){
            var selectors = event.selectors,
                selector,
                part,
                modifier,
                i, j, k;

            for (i=0; i < selectors.length; i++){
                selector = selectors[i];

                for (j=0; j < selector.parts.length; j++){
                    part = selector.parts[j];
                    if (part instanceof parserlib.css.SelectorPart){
                        if (part.elementName){
                            for (k=0; k < part.modifiers.length; k++){
                                modifier = part.modifiers[k];
                                if (modifier.type == "class" || modifier.type == "id"){
                                    reporter.warn("Element (" + part + ") is overqualified, just use " + modifier + " without element name.", part.line, part.col, rule);
                                }
                            }

                        }
                    }
                }
            }
        });
    }

});