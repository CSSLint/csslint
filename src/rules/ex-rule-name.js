CSSLint.addRule({

    // rule information
    id: "rule-name",
    name: "Rule name must concat with -",
    desc: "Rule name must concat with -",
    url: "",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        parser.addListener("startrule", function(event) {
            var selectors = event.selectors;
            
            for (var i = 0; i < selectors.length; i++) {
                var text = selectors[i].text;
                if(/[_]/.test(text)){
                    reporter.report("Rule name must concat with -.", selectors[i].line, selectors[i].col, rule);
                    return;
                }
            }
        });
    }

});