/*
 * Rule: Headings (h1-h6) should not be qualified (namespaced).
 */
CSSLint.addRule({

    //rule information
    id: "qualified-headings",
    name: "Qualified Headings",
    desc: "Headings should not be qualified (namespaced).",
    
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
                        if (part.elementName && /h[1-6]/.test(part.elementName.toString()) && j > 0){
                            reporter.warn("Heading (" + part.elementName + ") should not be qualified.", part.line, part.col, this);
                        }
                    }                    
                }
            }
        });     
    }

});