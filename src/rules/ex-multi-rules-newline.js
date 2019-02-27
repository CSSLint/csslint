CSSLint.addRule({

    // rule information
    id: "multi-rules-newline",
    name: "Multi rules must declear in multi lines",
    desc: "Multi rules must declear in multi lines",
    url: "",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        parser.addListener("startrule", function(event) {
            var selectors = event.selectors;
            // console.log(selectors);
            // console.log('*********************************************');
            // console.log(selectors[0].line);
            // console.log(selectors[0].text);
            // console.log(selectors[1].line);
            // console.log(selectors[1].text);
            //如果有多个rules
            if (selectors.length > 1) {
                var lines = [];
                for (var i = 0; i < selectors.length; i++) {
                    var line = selectors[i].line;
                    if(lines.indexOf(line) !== -1){
                        reporter.report("Multi rules must declear in multi lines.", selectors[i].line, selectors[i].col, rule);
                        return;
                    }
                    lines.push(line);
                }
            }
        });
    }

});