/*
 * Rule: Warn people with approaching the IE 4095 limit 
 */
/*global CSSLint*/
CSSLint.addRule({

    //rule information
    id: "selector-max-approaching",
    name: "Warn when approaching the 4095 selector limit for IE",
    desc: "Will warn when selector count is >= 3800 selectors.",
    browsers: "IE",

    //initialization
    init: function(parser, reporter) {
        var rule = this, count = 0;

        parser.addListener('startrule', function(event) {
            count += event.selectors.length;
        });

        parser.addListener("endstylesheet", function() {
            if (count >= 3800) {
                reporter.report("You have " + count + " selectors. Internet Explorer supports a maximum of 4095 selectors per stylesheet. Consider refactoring.",0,0,rule); 
            }
        });
    }

});
