/*
 * Rule: Warn people past the IE 4095 limit 
 */
/*global CSSLint*/
CSSLint.addRule({

    //rule information
    id: "selector-max",
    name: "Error when past the 4095 selector limit for IE",
    desc: "Will error when selector count is > 4095.",
    browsers: "IE",

    //initialization
    init: function(parser, reporter){
        var rule = this, count = 0;

        parser.addListener('startrule',function(event) {
            count += event.selectors.length;
        });

        parser.addListener("endstylesheet", function() {
            if (count > 4095) {
                reporter.report("You have " + count + " selectors. Internet Explorer supports a maximum of 4095 selectors per stylesheet. Consider refactoring.",0,0,rule); 
            }
        });
    }

});