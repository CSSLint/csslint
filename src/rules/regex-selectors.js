/*
 * Rule: Selectors that look like regular expressions are slow and should be avoided.
 */
CSSLint.addRule({

    //rule information
    id: "regex-selectors",
    name: "Regex Selectors",
    desc: "Selectors that look like regular expressions are slow and should be avoided.",
    browsers: "All",
    
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
                            if (modifier.type == "attribute"){
                                if (/([\~\|\^\$\*]=)/.test(modifier)){
                                    reporter.warn("Attribute selectors with " + RegExp.$1 + " are slow!", modifier.line, modifier.col, rule);
                                }                               
                            }
                            if (classCount > 1){
                                reporter.warn("Don't use adjoining selectors.", part.line, part.col, rule);
                            }
                        }
                    }                    
                }
            }
        });     
    }

});