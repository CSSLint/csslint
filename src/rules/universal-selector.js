/*
 * Rule: Don't use universal selector because it's slow.
 */
/*global CSSLint*/
CSSLint.addRule({

    //rule information
    id: "universal-selector",
    name: "Disallow universal selector",
    desc: "The universal selector (*) is known to be slow.",
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
                
                part = selector.parts[selector.parts.length-1];
                if (part.elementName == "*"){
                    reporter.report(rule.desc, part.line, part.col, rule);
                }
            }
        });
    }

});