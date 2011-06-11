/*
 * Rule: Headings (h1-h6) should be defined only once.
 */
CSSLint.addRule({

    //rule information
    id: "unique-headings",
    name: "Unique Headings",
    desc: "Headings should be defined only once.",
    browsers: "All",
    
    //initialization
    init: function(parser, reporter){
        var rule = this;
    
        var headings =  {
                h1: 0,
                h2: 0,
                h3: 0,
                h4: 0,
                h5: 0,
                h6: 0
            };
    
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
                        if (part.elementName && /(h[1-6])/.test(part.elementName.toString())){                       
                            headings[RegExp.$1]++;
                            if (headings[RegExp.$1] > 1) {
                                reporter.warn("Heading (" + part.elementName + ") has already been defined.", part.line, part.col, rule);
                            }
                        }
                    }                    
                }
            }
        });     
    }

});