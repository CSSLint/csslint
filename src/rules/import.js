/*
 * Rule: Don't use @import, use <link> instead.
 */
/*global CSSLint*/
CSSLint.addRule({

    //rule information
    id: "import",
    name: "Disallow @import",
    desc: "Don't use @import, use <link> instead.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this;
        
        parser.addListener("import", function(event){        
            reporter.report("@import prevents parallel downloads, use <link> instead.", event.line, event.col, rule);
        });

    }

});