/*
 * Rule: Don't use classes or IDs with elements (a.foo or a#foo).
 */

CSSLint.addRule({

    //rule information
    id: "overqualified-elements",
    name: "Disallow overqualified elements",
    desc: "Don't use classes or IDs with elements (a.foo or a#foo).",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        "use strict";
        var rule = this,
            classes = {};

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
                    if (part.type === parser.SELECTOR_PART_TYPE){
                        for (k=0; k < part.modifiers.length; k++){
                            modifier = part.modifiers[k];
                            if (part.elementName && modifier.type === "id"){
                                reporter.report("Element (" + part + ") is overqualified, just use " + modifier + " without element name.", part.line, part.col, rule);
                            } else if (modifier.type === "class"){

                                if (!classes[modifier]){
                                    classes[modifier] = [];
                                }
                                classes[modifier].push({ modifier: modifier, part: part });
                            }
                        }
                    }
                }
            }
        });

        parser.addListener("endstylesheet", function(){

            var equalParts,
                lines,
                prop;
            for (prop in classes){
                if (classes.hasOwnProperty(prop)){
					equalParts = true;
					lines = [];
					for (var i = 0; i < classes[prop].length; i++) {
						lines.push(classes[prop][i].part.line);
						equalParts = equalParts && (classes[prop][i].part.text === classes[prop][0].part.text);
					}
                    //one use or multiple equal uses means that this is overqualified
                    if (classes[prop][0].part.elementName && equalParts) {
                        reporter.report("Element (" + classes[prop][0].part + ") is overqualified, just use " + classes[prop][0].modifier + " without element name" + ((lines.length > 1) ? " (found " + lines.length + "x)" : "") + ".", classes[prop][0].part.line, classes[prop][0].part.col, rule);
                    }
                }
            }
        });
    }

});
