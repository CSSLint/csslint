/*
 * Rule: You shouldn't use more than 10 floats. If you do, there's probably
 * room for some abstraction.
 */
CSSLint.addRule({

    //rule information
    id: "floats",
    name: "Floats",
    desc: "This rule tests if the float property is used too many times",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this;
        var count = 0;

        //count how many times "float" is used
        parser.addListener("property", function(event){
            if (event.property.text.toLowerCase() == "float" &&
                    event.value.text.toLowerCase() != "none"){
                count++;
            }
        });

        //report the results
        parser.addListener("endstylesheet", function(){
            reporter.stat("floats", count);
            if (count >= 10){
                reporter.rollupWarn("Too many floats (" + count + "), abstraction needed.", rule);
            }
        });
    }

});