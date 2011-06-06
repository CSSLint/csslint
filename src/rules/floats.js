/*
 * Rule: You shouldn't use more than 10 floats. If you do, there's probably
 * room for some abstraction.
 */
CSSLint.addRule({

    //rule information
    name: "float",
    desc: "This rule tests if the float property is used too many times",
    
    //initialization
    init: function(parser, reporter){
    
        var count = 0;
    
        //count how many times "float" is used
        parser.addListener("property", function(event){
            if (event.property == "float"){
                count++;
            }
        });
        
        //report the results
        parser.addListener("endstylesheet", function(event){
            reporter.stat("floats", count);
            if (count >= 10){
                reporter.rollupWarn("Too many floats (" + count + "), abstraction needed.");
            }
        }); 
    }

});