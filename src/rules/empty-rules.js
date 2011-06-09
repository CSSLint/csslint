/*
 * Rule: Style rules without any properties defined should be removed.
 */
CSSLint.addRule({

    //rule information
    id: "empty-rules",
    name: "Empty Rules",
    desc: "Rules without any properties specified should be removed.",
    
    //initialization
    init: function(parser, reporter){
    
        var count = 0;    
        
        parser.addListener("startrule", function(event){
            count=0;
        });
        
        parser.addListener("property", function(event){
            count++;
        });
        
        parser.addListener("endrule", function(event){
            var selectors = event.selectors;
            if (count == 0){
                reporter.warn("Rule is empty.", selectors[0].line, selectors[0].col, this);
            }
        });        
    }

});