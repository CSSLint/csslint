/*
 * Rule: Total number of rules should not exceed x.
 */
CSSLint.addRule({

    //rule information
    name: "rules-count",
    desc: "Track how many rules there are.",
    
    //initialization
    init: function(parser, reporter){
    
        var count = 0;
    
        //count each rule
        parser.addListener("startrule", function(event){
            count++;
        });
        
        parser.addListener("endstylesheet", function(event){
            reporter.stat("rule-count", count);
        });        
    }

});