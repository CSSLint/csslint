/*
 * Rule: You don't need to specify units when a value is 0.
 */
CSSLint.addRule({

    //rule information
    id: "zero-units",
    name: "Zero Units",
    desc: "You don't need to specify units when a value is 0.",
    browsers: "All",
    
    //initialization
    init: function(parser, reporter){
        var rule = this;
    
        //count how many times "float" is used
        parser.addListener("property", function(event){
            var parts = event.value.parts,
                i = 0, 
                len = parts.length,
                j;
                
            while(i < len){
                if ((parts[i].units || parts[i].type == "percentage") && parts[i].value === 0){
                    reporter.warn("Values of 0 shouldn't have units specified.", parts[i].line, parts[i].col, rule);
                }
                i++;
            }
            
        });

    }

});