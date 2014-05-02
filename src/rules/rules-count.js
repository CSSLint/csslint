/*
 * Rule: Total number of rules should not exceed x.
 */

CSSLint.addRule({

    //rule information
    id: "rules-count",
    name: "Rules Count",
    desc: "Track how many rules there are.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        "use strict";
        var count = 0;

        //count each rule
        parser.addListener("startrule", function(){
            count++;
        });

        parser.addListener("endstylesheet", function(){
            reporter.stat("rule-count", count);
        });
    }

});
