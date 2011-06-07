/*
 * Rule: Don't use IDs for selectors.
 */
CSSLint.addRule({

    //rule information
    name: "ids",
    desc: "Selectors should not contain IDs.",
    
    //initialization
    init: function(parser, reporter){
    
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
                        for (k=0; k < part.modifiers.length; k++){
                            modifier = part.modifiers[k];
                            if (modifier.type == "id"){
                                reporter.warn("Don't use IDs in selectors (" + part + ")", modifier.line, modifier.col);
                            }
                        }
                    }                    
                }
            }
        });     
    }

});