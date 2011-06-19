/*
 * Rule: Don't use adjoining classes (.foo.bar).
 */
CSSLint.addRule({

    //rule information
    id: "adjoining-classes",
    name: "Adjoining Classes",
    desc: "Don't use adjoining classes.",
    browsers: "IE6",

    //initialization
    init: function(parser, reporter){
        var rule = this;
        parser.addListener("startrule", function(event){
            var selectors = event.selectors,
                selector,
                part,
                modifier,
                classCount,
                i, j, k;

            for (i=0; i < selectors.length; i++){
                selector = selectors[i];
                for (j=0; j < selector.parts.length; j++){
                    part = selector.parts[j];
                    if (part instanceof parserlib.css.SelectorPart){
                        classCount = 0;
                        for (k=0; k < part.modifiers.length; k++){
                            modifier = part.modifiers[k];
                            if (modifier.type == "class"){
                                classCount++;
                            }
                            if (classCount > 1){
                                reporter.warn("Don't use adjoining classes.", part.line, part.col, rule);
                            }
                        }
                    }
                }
            }
        });
    }

});