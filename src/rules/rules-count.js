/*
 * Rule: Total number of rules should not exceed x.
 */
/*global CSSLint*/
CSSLint.addRule({

    //rule information
    id: "rules-count",
    name: "Rules Count",
    desc: "Track how many rules there are.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this,
            count = 0;

        //count each rule
        parser.addListener("startrule", function(){
            count++;
        });

        parser.addListener("endstylesheet", function(){
            reporter.stat("rule-count", count);
        });
    }

});