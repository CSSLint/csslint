/*
 * Rule: You shouldn't need more than 9 font-size declarations.
 */

CSSLint.addRule({

    //rule information
    id: "font-sizes",
    name: "Font Sizes",
    desc: "Checks the number of font-size declarations.",
    browsers: "All",
    
    //initialization
    init: function(parser, reporter){
        var rule = this,    
            count = 0;
    
        //check for use of "font-size"
        parser.addListener("property", function(event){
            var part = event.value.parts[0];
            if (event.property == "font-size"){
                count++; 
            }
        });
        
        //report the results
        parser.addListener("endstylesheet", function(event){
            reporter.stat("font-sizes", count);
            if (count >= 10){
                reporter.rollupWarn("Too many font-size declarations (" + count + "), abstraction needed.", rule);
            }
        }); 
    }

});