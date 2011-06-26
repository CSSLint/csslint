/*
 * Rule: Don't use @import, use <link> instead.
 */
CSSLint.addRule({

    //rule information
    id: "import",
    name: "@import",
    desc: "Don't use @import, use <link> instead.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this;
        
        parser.addListener("import", function(event){        
            reporter.warn("@import prevents parallel downloads, use <link> instead.", event.line, event.col, rule);
        });

    }

});